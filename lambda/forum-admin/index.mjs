/**
 * Forum Q&A admin — the owner's listing and deletion.
 *
 *   POST /forum/admin/questions   Authorization: Bearer <Cognito ID token>
 *     ->  { ok, count, questions, held }
 *   POST /forum/admin/delete      { sk }
 *     ->  { ok, deleted } / 404 if it has already gone
 *
 * This is the one function that touches every submission in the table, so it
 * has a separate IAM role holding `dynamodb:Query` and `dynamodb:DeleteItem`
 * and nothing else — no PutItem, so it cannot alter what someone wrote, and
 * deliberately no Scan. A bug in the public intake path therefore cannot read
 * or remove anyone's disclosure.
 *
 * Deletion is per-item and deliberate: hostile submissions, tests, and the
 * second of two near-identical questions should not have to sit in the stack
 * being read aloud. It is a hard delete, which is the promise made to
 * submitters — nothing is archived elsewhere.
 *
 * The gate is Cognito, matching webtop and the Deutsch app: sign-in happens in
 * the browser against the shared `tigersndragons-users` pool, and the ID token
 * travels in the Authorization header. API Gateway's JWT authorizer verifies
 * the signature before the request reaches here; this handler verifies it again
 * (cheap, and it keeps the function safe if it is ever invoked by another path)
 * and then checks the identity. That second check is the one that matters: the
 * pool is shared with a neighborhood app, so "a valid token from this pool" is
 * not the same as "the owner of this ministry site".
 *
 * Helpers below are intentionally duplicated from contact-form/index.mjs rather
 * than shared: SAM packages each CodeUri independently, and the contact form is
 * not to be modified before the 2026-10-25 forum. Extract lambda/shared/ as a
 * Lambda layer afterward.
 */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { createHash } from 'node:crypto';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-west-2' }));

// Read lazily, not at module load, so a value can be changed without a cold
// start and so tests can set process.env after importing the handler.
const allowedSub = () => process.env.FORUM_ADMIN_SUB || '';
const forumId = () => process.env.FORUM_ID || 'forum';
const tableName = () => process.env.FORUM_TABLE || '';

// Pool and client ids are not secrets — they ship in the browser bundle of
// every Cognito SPA. The allow-list above is what grants access.
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-west-2_OMwj6Yfpn';
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || '5p01qepq8kh9qfuji1occiud19';

const MAX_ITEMS = 200;

// The sort key the intake function writes: `<ISO submittedAt>#<8 hex chars>`.
// Checked rather than trusted so a malformed or hand-edited key never reaches
// DynamoDB as part of a delete.
const SK_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z#[0-9a-f]{8}$/;

// Verifies signature, expiry, audience (clientId) and token_use=id against the
// pool's JWKS (fetched and cached on first use).
const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  clientId: CLIENT_ID,
  tokenUse: 'id',
});

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
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
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

const actorHint = (ip) => sha256(`${ip}:${forumId()}`).toString('hex').slice(0, 8);

/** The bearer token from the Authorization header, or null. */
function bearer(event) {
  const raw = event.headers?.authorization || event.headers?.Authorization || '';
  const match = /^Bearer\s+(.+)$/i.exec(raw.trim());
  return match ? match[1].trim() : null;
}

// In memory per container, so leaky across concurrent containers — a brake on
// token guessing, not the gate. The gate is the Cognito signature.
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
  // not the gate — CORS protects browsers, not the API. The gate is the token.
  const origin = event.headers?.origin || event.headers?.Origin || '';
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return reply(403, headers, { ok: false, error: 'Forbidden' });
  }

  const ip = event.requestContext?.http?.sourceIp || event.requestContext?.identity?.sourceIp || 'unknown';

  if (!allowAttempt(ip)) {
    console.log(`admin throttled actor=${actorHint(ip)}`);
    return reply(429, headers, { ok: false, error: 'Too many attempts. Wait a few minutes.' });
  }

  const token = bearer(event);
  if (!token) {
    console.log(`admin no-token actor=${actorHint(ip)}`);
    return reply(401, headers, { ok: false, error: 'Sign in to read the questions.' });
  }

  let claims;
  try {
    claims = await verifier.verify(token);
  } catch {
    console.log(`admin bad-token actor=${actorHint(ip)}`);
    return reply(401, headers, { ok: false, error: 'Your session has expired. Sign in again.' });
  }

  // Fails closed: an unset allow-list authorizes nobody, even with a valid
  // token from the pool.
  if (!allowedSub() || claims.sub !== allowedSub()) {
    console.log(`admin not-owner sub=${String(claims.sub).slice(0, 8)} actor=${actorHint(ip)}`);
    return reply(403, headers, { ok: false, error: 'That account cannot read the questions.' });
  }

  const path = event.requestContext?.http?.path || event.rawPath || '';
  if (!path.endsWith('/delete')) return list(headers, ip);

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return reply(400, headers, { ok: false, error: 'Invalid JSON' });
  }
  return remove(body, headers, ip);
};

async function list(headers, ip) {
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
}

async function remove(body, headers, ip) {
  const sk = typeof body.sk === 'string' ? body.sk.trim() : '';
  if (!SK_PATTERN.test(sk)) {
    console.log(`admin delete bad-key actor=${actorHint(ip)}`);
    return reply(400, headers, { ok: false, error: 'Invalid input' });
  }

  try {
    await ddb.send(
      new DeleteCommand({
        TableName: tableName(),
        // The partition comes from this function's own config, never from the
        // request, so one forum's page cannot reach into another's.
        Key: { forumId: forumId(), sk },
        // Turns a delete of something already gone into a 404 instead of a
        // silent success, so a stale page cannot report a delete that did
        // nothing.
        ConditionExpression: 'attribute_exists(sk)',
      })
    );
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      console.log(`admin delete missing actor=${actorHint(ip)}`);
      return reply(404, headers, { ok: false, error: 'That question is no longer there.' });
    }
    console.error('DynamoDB delete error:', err.message);
    return reply(500, headers, { ok: false, error: "Couldn't delete that question." });
  }

  // The id is enough to reconcile against a notification email; the question
  // text never goes to the log.
  console.log(`admin deleted id=${sk.split('#')[1]} actor=${actorHint(ip)}`);
  return reply(200, headers, { ok: true, deleted: sk });
}
