/**
 * Forum Q&A intake — access-code gate, token mint, question storage, notification.
 *
 * Routes (all POST, on the shared ContactHttpApi):
 *   /forum/verify    { code }                       -> { ok, token, expiresAt }
 *   /forum/question  { token, anonymous, name?, email?, question, confirm_url }
 *
 * Three rules this file exists to enforce, in order of how much harm a
 * regression would do:
 *
 *   1. ANONYMITY IS ENFORCED HERE, NOT IN THE BROWSER. A React bug that fails
 *      to clear the name field must not out someone who ticked "anonymous".
 *   2. NO SUBMITTED CONTENT IS EVER LOGGED. CloudWatch is a second copy of the
 *      data with different access controls and a different retention clock.
 *   3. NOTHING IS SILENTLY DISCARDED except honeypot/bot hits. A congregation
 *      member's question is never thrown away behind a fake success screen.
 *
 * Helpers below are intentionally duplicated from contact-form/index.mjs rather
 * than shared: SAM packages each CodeUri independently, and the contact form is
 * not to be modified before the 2026-10-25 forum. Extract lambda/shared/ as a
 * Lambda layer afterward.
 */
import { ComprehendClient, DetectToxicContentCommand } from '@aws-sdk/client-comprehend';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const comprehend = new ComprehendClient({ region: 'us-west-2' });
const ses = new SESClient({ region: 'us-west-2' });
// removeUndefinedValues is required: anonymous submissions pass `undefined`
// for name/email so the attributes are absent rather than empty strings.
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-west-2' }), {
  marshallOptions: { removeUndefinedValues: true },
});

// Config read lazily, not at module load, so tests can set process.env after
// importing the handler — and so a code can be rotated without a cold start.
const memberCode = () => process.env.FORUM_MEMBER_CODE || '';
const hmacSecret = () => process.env.FORUM_TOKEN_SECRET || '';
const forumId = () => process.env.FORUM_ID || 'forum';
const tableName = () => process.env.FORUM_TABLE || '';
const closesAt = () => Date.parse(process.env.FORUM_CLOSES_AT || '') || Infinity;
const recipient = () => process.env.RECIPIENT_EMAIL || 'hopeandtruthministry@gmail.com';
const sender = () => process.env.SENDER_EMAIL || 'noreply@hopeandtruthministry.com';
const siteUrl = () => process.env.SITE_URL || 'https://hopeandtruthministry.com';
const emailIncludesContent = () => process.env.EMAIL_INCLUDE_CONTENT === 'true';

const TOKEN_TTL_SECONDS = 2 * 60 * 60;
// A human cannot read the privacy notice and compose a question this fast.
const MIN_COMPOSE_SECONDS = 3;
const MAX_CODE_LENGTH = 200;
const MAX_TOKEN_LENGTH = 500;
const MAX_QUESTION_LENGTH = 5000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 maximum

// Only labels that indicate a submission aimed AT someone. Deliberately not
// SEXUAL / PROFANITY / HATE_SPEECH / INSULT: on this subject those fire on
// honest testimony — a question mentioning orientation, a reclaimed word, or a
// quote of what a parent said. The classifier scores the quoted abuse, not the
// author's intent, and holding those would silence the people this page is for.
const HOLD_LABELS = new Set(['VIOLENCE_OR_THREAT', 'HARASSMENT_OR_ABUSE']);
const HOLD_THRESHOLD = 0.9;

// Reject anything that isn't a single, whitespace-free address. The \s class
// excludes newlines/tabs, so this also blocks CRLF injection into SES fields.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  };
}

const reply = (statusCode, headers, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

/**
 * Per-IP sliding window, in memory per container. It resets on cold start and
 * is not shared across concurrent containers, so it is an abuse backstop — the
 * access control is the code, not this.
 */
function makeRateLimiter({ limit, windowMs }) {
  const hits = new Map();
  return (key) => {
    const now = Date.now();
    const times = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (times.length >= limit) return false;
    times.push(now);
    hits.set(key, times);
    return true;
  };
}

// Only FAILED verifies are counted: a congregation behind one church-wifi NAT
// shares a source IP, and forty people typing the correct code must not lock
// each other out.
const allowFailedVerify = makeRateLimiter({ limit: 10, windowMs: 10 * 60 * 1000 });
const allowSubmission = makeRateLimiter({ limit: 20, windowMs: 60 * 60 * 1000 });

const sha256 = (value) => createHash('sha256').update(String(value), 'utf8').digest();

/** Constant-time compare that also hides length, and fails closed on no secret. */
function codeMatches(supplied, expected) {
  if (typeof supplied !== 'string' || !expected) return false;
  return timingSafeEqual(sha256(supplied.trim()), sha256(expected));
}

/** An opaque, stable-per-forum actor hint, so rate limits stay debuggable
 *  without recording who visited a page about coming out. */
const actorHint = (ip) => sha256(`${ip}:${forumId()}`).toString('hex').slice(0, 8);

const signToken = (exp, iat) =>
  createHmac('sha256', hmacSecret()).update(`forum:${forumId()}:${exp}:${iat}`).digest('hex');

function mintToken() {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TOKEN_TTL_SECONDS;
  return { token: `${exp}.${iat}.${signToken(exp, iat)}`, expiresAt: exp };
}

/** @returns {{ok: true, iat: number} | {ok: false}} */
function verifyToken(token) {
  if (typeof token !== 'string' || token.length > MAX_TOKEN_LENGTH) return { ok: false };
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false };
  const [expRaw, iatRaw, sig] = parts;
  const exp = Number(expRaw);
  const iat = Number(iatRaw);
  if (!Number.isFinite(exp) || !Number.isFinite(iat)) return { ok: false };
  if (!hmacSecret()) return { ok: false };
  if (!timingSafeEqual(sha256(sig), sha256(signToken(exp, iat)))) return { ok: false };
  if (exp * 1000 < Date.now()) return { ok: false };
  return { ok: true, iat };
}

// Mentions of our own site and email addresses left as contact info are not
// promotional link spam, so strip them before scoring to avoid rejecting
// genuine questions.
const OWN_DOMAIN_RE = /\b(?:www\.)?hopeandtruthministry\.com\b/gi;
const EMAIL_ADDR_RE = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;

function hasLinks(text) {
  const cleaned = text.replace(OWN_DOMAIN_RE, ' ').replace(EMAIL_ADDR_RE, ' ');
  const strong = (cleaned.match(/https?:\/\/|www\.|\[url|<a\s+href/gi) || []).length;
  const bare = (
    cleaned.match(
      /\b[a-z0-9-]+\.(?:com|net|org|io|co|ru|cn|xyz|top|info|online|biz|shop|club|site|link|live|store)\b/gi
    ) || []
  ).length;
  return strong * 2 + bare > 1;
}

/**
 * Advisory only. A hit HOLDS the question for review — it is still stored in
 * full and the submitter still sees success. Comprehend failing must fail OPEN:
 * an AWS blip must never quarantine a legitimate question.
 * @returns {Promise<string|null>} flag reason, or null
 */
async function screenForHarm(text) {
  try {
    const result = await comprehend.send(
      new DetectToxicContentCommand({
        TextSegments: [{ Text: text.slice(0, 4096) }],
        LanguageCode: 'en',
      })
    );
    for (const label of result.ResultList?.[0]?.Labels || []) {
      if (HOLD_LABELS.has(label.Name) && (label.Score || 0) >= HOLD_THRESHOLD) {
        return `${label.Name}:${label.Score.toFixed(2)}`;
      }
    }
    return null;
  } catch (err) {
    console.error('Comprehend error:', err.message);
    return null;
  }
}

/** Content-free by default: the only copy of a disclosure stays in the table
 *  rather than living forever in an inbox, synced to a phone. */
async function notify({ questionId, submittedAt, anonymous, status, question }) {
  const held = status === 'held';
  const lines = [
    `Submitted: ${submittedAt}`,
    `Anonymous: ${anonymous ? 'yes' : 'no'}`,
    held ? 'Automated screening HELD this for review. It is stored in full and' : null,
    held ? 'may well be a legitimate account of harm — read it before deciding.' : null,
    '',
    `Read it at ${siteUrl()}/forum-admin`,
    emailIncludesContent() ? `\n---\n${question}` : null,
  ].filter((line) => line !== null);

  await ses.send(
    new SendEmailCommand({
      Source: sender(),
      Destination: { ToAddresses: [recipient()] },
      Message: {
        // Never any question text here: a lock-screen preview showing the first
        // line of someone's coming-out question is a real leak.
        Subject: { Data: `Forum question #${questionId}${held ? ' — HELD for review' : ''}` },
        Body: { Text: { Data: lines.join('\n') } },
      },
    })
  );
}

// ── Route: /forum/verify ───────────────────────────────────────────────────
async function handleVerify(body, headers, ip) {
  const { code } = body;
  if (typeof code !== 'string' || code.length > MAX_CODE_LENGTH) {
    return reply(400, headers, { ok: false, error: 'Invalid input' });
  }
  if (!codeMatches(code, memberCode())) {
    if (!allowFailedVerify(ip)) {
      console.log(`verify throttled actor=${actorHint(ip)}`);
      return reply(429, headers, {
        ok: false,
        error: 'Too many attempts. Wait a few minutes and try again.',
      });
    }
    return reply(401, headers, {
      ok: false,
      error: "That code doesn't match. Check with the facilitator.",
    });
  }
  const { token, expiresAt } = mintToken();
  return reply(200, headers, { ok: true, token, expiresAt });
}

// ── Route: /forum/question ─────────────────────────────────────────────────
async function handleQuestion(body, headers, ip) {
  // Honeypot — bots fill this hidden field, humans don't. Silent success is
  // correct here and ONLY here: a bot must not learn it was caught.
  if (body.confirm_url) return reply(200, headers, { ok: true });

  const token = verifyToken(body.token);
  if (!token.ok) {
    return reply(401, headers, {
      ok: false,
      error: 'Your session expired. Please re-enter the code.',
    });
  }

  // Nobody reads the privacy notice and writes a question in three seconds.
  if (Math.floor(Date.now() / 1000) - token.iat < MIN_COMPOSE_SECONDS) {
    return reply(200, headers, { ok: true });
  }

  if (!allowSubmission(ip)) {
    console.log(`submission throttled actor=${actorHint(ip)}`);
    return reply(429, headers, {
      ok: false,
      error: 'That is a lot of questions at once. Please try again shortly.',
    });
  }

  // Read the anonymity flag FIRST, and only look at name/email when it is
  // false. Never trust the client to have cleared the fields.
  const anonymous = body.anonymous === true;
  const name = anonymous ? undefined : body.name;
  const email = anonymous ? undefined : body.email;

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (!question || question.length > MAX_QUESTION_LENGTH) {
    return reply(400, headers, {
      ok: false,
      error: 'Please enter a question of 5000 characters or fewer.',
    });
  }

  if (!anonymous) {
    if (typeof name !== 'string' || !name.trim() || name.length > MAX_NAME_LENGTH) {
      return reply(400, headers, { ok: false, error: 'Please enter your name.' });
    }
    if (typeof email !== 'string' || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
      return reply(400, headers, { ok: false, error: 'Please enter a valid email address.' });
    }
  }

  // Visible and actionable, never a silent discard — the person can fix this
  // and their question survives.
  if (hasLinks(question)) {
    return reply(400, headers, {
      ok: false,
      error: 'Please remove any web links from your question.',
    });
  }

  const flagReason = await screenForHarm(question);
  const submittedAt = new Date().toISOString();
  const questionId = randomBytes(4).toString('hex');
  const status = flagReason ? 'held' : 'received';

  // No IP address is stored, ever: an IP beside an anonymous submission
  // re-identifies it.
  const item = {
    forumId: forumId(),
    sk: `${submittedAt}#${questionId}`,
    questionId,
    submittedAt,
    anonymous,
    question,
    status,
    // Spread rather than `name: undefined`, so an anonymous submission has no
    // such key at all. Not relying on the DocumentClient's
    // removeUndefinedValues here is deliberate: anonymity must not depend on a
    // marshalling option someone could change.
    ...(anonymous ? {} : { name: name.trim(), email }),
    ...(flagReason ? { flagReason } : {}),
  };

  try {
    await ddb.send(new PutCommand({ TableName: tableName(), Item: item }));
  } catch (err) {
    console.error('DynamoDB put error:', err.message);
    return reply(500, headers, {
      ok: false,
      error: "We couldn't save your question. Please try again.",
    });
  }

  // The table is the system of record. A failed notification must never lose
  // someone's question, so this is logged and swallowed.
  try {
    await notify({ questionId, submittedAt, anonymous, status, question });
  } catch (err) {
    console.error('SES send error:', err.message);
  }

  console.log(`question stored id=${questionId} status=${status}`);
  return reply(200, headers, { ok: true, id: questionId });
}

// ── Handler ────────────────────────────────────────────────────────────────
export const handler = async (event) => {
  const headers = corsHeaders(event);

  const method = event.requestContext?.http?.method || event.httpMethod || '';
  if (method === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  // Origin enforcement — reject a cross-site browser POST (Origin present but
  // not in the allowlist). A *missing* Origin is allowed through: some privacy
  // tools strip it from same-site requests, and the header is trivially
  // spoofable anyway, so this is a first filter, not the last line of defense.
  // CORS protects browsers, not the API — the gate is the code.
  const origin = event.headers?.origin || event.headers?.Origin || '';
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return reply(403, headers, { ok: false, error: 'Forbidden' });
  }

  // endsWith, not ===, so this does not depend on the API stage prefix.
  const path = event.requestContext?.http?.path || event.rawPath || '';
  const isVerify = path.endsWith('/forum/verify');
  const isQuestion = path.endsWith('/forum/question');
  if (!isVerify && !isQuestion) {
    return reply(404, headers, { ok: false, error: 'Not found' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return reply(400, headers, { ok: false, error: 'Invalid JSON' });
  }

  if (Date.now() >= closesAt()) {
    return reply(403, headers, { ok: false, error: 'Submissions for this forum are now closed.' });
  }

  const ip = event.requestContext?.http?.sourceIp || event.requestContext?.identity?.sourceIp || 'unknown';
  return isVerify ? handleVerify(body, headers, ip) : handleQuestion(body, headers, ip);
};
