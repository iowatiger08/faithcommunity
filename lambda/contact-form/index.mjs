import { ComprehendClient, DetectToxicContentCommand } from '@aws-sdk/client-comprehend';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const comprehend = new ComprehendClient({ region: 'us-west-2' });
const ses = new SESClient({ region: 'us-west-2' });

const RECIPIENT = process.env.RECIPIENT_EMAIL || 'hopeandtruthministry@gmail.com';
const SENDER = process.env.SENDER_EMAIL || 'noreply@hopeandtruthministry.com';
const TOXICITY_THRESHOLD = parseFloat(process.env.TOXICITY_THRESHOLD || '0.75');
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_PER_HOUR || '2', 10);
// Link "score": strong signals (scheme/www/bbcode/anchor) weigh 2, bare domains 1.
// A single site mention (score 1) is allowed; any real link or 2+ domains is not.
const MAX_LINK_SCORE = parseInt(process.env.MAX_LINK_SCORE || '1', 10);
const MAX_MESSAGE_LENGTH = parseInt(process.env.MAX_MESSAGE_LENGTH || '5000', 10);
const MAX_EMAIL_LENGTH = 254; // RFC 5321 maximum

// Reject anything that isn't a single, whitespace-free address. The \s class
// excludes newlines/tabs, so this also blocks CRLF injection into SES fields.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory rate limit — per Lambda instance, sufficient for low-traffic ministry use
const ipRequests = new Map();

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

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const timestamps = (ipRequests.get(ip) || []).filter(t => now - t < windowMs);
  if (timestamps.length >= RATE_LIMIT) return false;
  timestamps.push(now);
  ipRequests.set(ip, timestamps);
  return true;
}

// Mentions of our own site and email addresses left as contact info are not
// promotional link spam, so strip them before scoring to avoid discarding
// genuine messages.
const OWN_DOMAIN_RE = /\b(?:www\.)?hopeandtruthministry\.com\b/gi;
const EMAIL_ADDR_RE = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;

// Most contact spam is promotional links. Genuine prayer requests almost never
// contain URLs, so a link-heavy message is a strong spam signal.
function linkScore(text) {
  const cleaned = text.replace(OWN_DOMAIN_RE, ' ').replace(EMAIL_ADDR_RE, ' ');
  const strong = (cleaned.match(/https?:\/\/|www\.|\[url|<a\s+href/gi) || []).length;
  const bare = (
    cleaned.match(
      /\b[a-z0-9-]+\.(?:com|net|org|io|co|ru|cn|xyz|top|info|online|biz|shop|club|site|link|live|store)\b/gi
    ) || []
  ).length;
  return strong * 2 + bare;
}

// Clearly commercial phrases that do not appear in genuine ministry messages.
// Kept deliberately narrow to avoid flagging real prayer topics (debt, addiction…).
const SPAM_PHRASES = [
  /back\s?links?/i,
  /seo\s+(?:services?|expert|ranking|company|agency)/i,
  /(?:buy|cheap)\s+(?:viagra|cialis)/i,
  /\bviagra\b/i,
  /\bcialis\b/i,
  /\bcasino\b/i,
  /crypto\s?(?:currency|wallet|investment)/i,
  /binary\s+options?/i,
  /\bescort(?:s|\s+service)\b/i,
];

function looksLikeSpam(message) {
  if (linkScore(message) > MAX_LINK_SCORE) return true;
  return SPAM_PHRASES.some((re) => re.test(message));
}

async function isToxic(text) {
  try {
    const result = await comprehend.send(new DetectToxicContentCommand({
      TextSegments: [{ Text: text.slice(0, 4096) }],
      LanguageCode: 'en',
    }));
    const labels = result.ResultList?.[0]?.Labels || [];
    return labels.some(l => (l.Score || 0) > TOXICITY_THRESHOLD);
  } catch (err) {
    // On Comprehend error, let the message through rather than block genuine requests
    console.error('Comprehend error:', err.message);
    return false;
  }
}

async function sendEmail(email, category, message) {
  await ses.send(new SendEmailCommand({
    Source: SENDER,
    Destination: { ToAddresses: [RECIPIENT] },
    ReplyToAddresses: [email],
    Message: {
      Subject: { Data: `Contact Form: ${category}` },
      Body: { Text: { Data: `Category: ${category}\nFrom: ${email}\n\n${message}` } },
    },
  }));
}

const VALID_CATEGORIES = new Set([
  'Prayer Request',
  'General Question',
  'Feedback / Reflection',
  'Other',
]);

export const handler = async (event) => {
  const headers = corsHeaders(event);

  const method = event.requestContext?.http?.method || event.httpMethod || '';
  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Origin enforcement — reject a cross-site browser POST (Origin present but not
  // in the allowlist). A *missing* Origin is allowed through: some privacy tools
  // strip it from same-site requests, and the header is trivially spoofable
  // anyway, so this is a first filter, not the last line of defense.
  const origin = event.headers?.origin || event.headers?.Origin || '';
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Forbidden' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { email, category, message, website } = body;

  // Honeypot — bots fill in this hidden field, humans don't
  if (website) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // Basic validation — length caps prevent oversized-payload amplification, and
  // EMAIL_RE rejects the newlines/whitespace that would otherwise reach SES.
  if (
    typeof email !== 'string' || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email) ||
    !VALID_CATEGORIES.has(category) ||
    typeof message !== 'string' || !message.trim() || message.length > MAX_MESSAGE_LENGTH
  ) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid input' }) };
  }

  // Rate limiting — silent discard
  const ip =
    event.requestContext?.http?.sourceIp ||
    event.requestContext?.identity?.sourceIp ||
    'unknown';
  if (!checkRateLimit(ip)) {
    console.log(`Rate limit exceeded for ${ip}`);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // Content spam heuristics (links + commercial phrases) — silent discard
  if (looksLikeSpam(message)) {
    console.log(`Spam content from ${ip}, discarding`);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // Toxicity check — silent discard
  if (await isToxic(message)) {
    console.log(`Toxic content from ${ip}, discarding`);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  try {
    await sendEmail(email, category, message.trim());
  } catch (err) {
    console.error('SES send error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to send' }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
