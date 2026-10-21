/**
 * Forum Q&A admin listing — read-only.
 *
 *   POST /forum/admin/questions  { code }  ->  { ok, count, questions, held }
 *
 * This is the one route that reads every submission in the table, so it is a
 * separate function with a separate IAM role holding `dynamodb:Query` and
 * nothing else — no PutItem, and deliberately no Scan. A bug in the public
 * intake path therefore cannot read anyone's disclosure.
 *
 * POST rather than GET so the admin code travels in the request body: query
 * strings land in access logs, browser history, and referrer headers.
 *
 * Helpers below are intentionally duplicated from contact-form/index.mjs rather
 * than shared: SAM packages each CodeUri independently, and the contact form is
 * not to be modified before the 2026-10-25 forum. Extract lambda/shared/ as a
 * Lambda layer afterward.
 */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { createHash, timingSafeEqual } from 'node:crypto';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-west-2' }));

// Read lazily, not at module load, so the code can be rotated without a cold
// start and so tests can set process.env after importing the handler.
const adminCode = () => process.env.FORUM_ADMIN_CODE || '';
const forumId = () => process.env.FORUM_ID || 'forum';
const tableName = () => process.env.FORUM_TABLE || '';

const MAX_CODE_LENGTH = 200;
const MAX_ITEMS = 200;

const ALLOWED_ORIGINS = new Set([
  'https://hopeandtruthministry.com',
  'https://www.hopeandtruthministry.com',
  'http://localhost:5173',
  'http://localhost:4173',
]);

function corsHeaders(event) {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : '',
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json',
    // Every submission is in this response; it must not sit in a cache.
    'Cache-Control': 'no-store',
  };
}

const reply = (statusCode, headers, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

const sha256 = (value) => createHash('sha256').update(String(value), 'utf8').digest();

/** Constant-time compare that also hides length, and fails closed on no code. */
function codeMatches(supplied, expected) {
  if (typeof supplied !== 'string' || !expected) return false;
  return timingSafeEqual(sha256(supplied.trim()), sha256(expected));
}

const actorHint = (ip) => sha256(`${ip}:${forumId()}`).toString('hex').slice(0, 8);

// In memory per container, so leaky across concurrent containers — the real
// protection is that the admin code is long and random.
const attempts = new Map();
function allowAttempt(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const times = (attempts.get(ip) || []).filter((t) => now - t < windowMs);
  if (times.length >= 20) return false;
  times.push(now);
  attempts.set(ip, times);
  return true;
}

export const handler = async (event) => {
  const headers = corsHeaders(event);

  const method = event.requestContext?.http?.method || event.httpMethod || '';
  if (method === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  // Origin enforcement is a first filter against a cross-site browser POST,
  // not the gate — CORS protects browsers, not the API. The gate is the code.
  const origin = event.headers?.origin || event.headers?.Origin || '';
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return reply(403, headers, { ok: false, error: 'Forbidden' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return reply(400, headers, { ok: false, error: 'Invalid JSON' });
  }

  const ip = event.requestContext?.http?.sourceIp || event.requestContext?.identity?.sourceIp || 'unknown';

  if (typeof body.code !== 'string' || body.code.length > MAX_CODE_LENGTH) {
    return reply(400, headers, { ok: false, error: 'Invalid input' });
  }

  if (!allowAttempt(ip)) {
    console.log(`admin throttled actor=${actorHint(ip)}`);
    return reply(429, headers, { ok: false, error: 'Too many attempts. Wait a few minutes.' });
  }

  if (!codeMatches(body.code, adminCode())) {
    console.log(`admin rejected actor=${actorHint(ip)}`);
    return reply(401, headers, { ok: false, error: 'Invalid code' });
  }

  let items;
  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: tableName(),
        KeyConditionExpression: 'forumId = :forumId',
        ExpressionAttributeValues: { ':forumId': forumId() },
        // Newest-first straight from DynamoDB — no sorting in the handler.
        ScanIndexForward: false,
        Limit: MAX_ITEMS,
      })
    );
    items = result.Items || [];
  } catch (err) {
    console.error('DynamoDB query error:', err.message);
    return reply(500, headers, { ok: false, error: "Couldn't load the questions." });
  }

  // Held items go in their own list so a flagged submission can't be read aloud
  // by accident. They keep their full text — held means "read this carefully
  // first", not "hidden".
  const questions = items.filter((item) => item.status !== 'held');
  const held = items.filter((item) => item.status === 'held');

  console.log(`admin listed count=${questions.length} held=${held.length} actor=${actorHint(ip)}`);
  return reply(200, headers, { ok: true, count: questions.length, questions, held });
};
