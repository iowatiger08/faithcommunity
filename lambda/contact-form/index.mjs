import { ComprehendClient, DetectToxicContentCommand } from '@aws-sdk/client-comprehend';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const comprehend = new ComprehendClient({ region: 'us-west-2' });
const ses = new SESClient({ region: 'us-west-2' });

const RECIPIENT = process.env.RECIPIENT_EMAIL || 'hopeandtruthministry@gmail.com';
const SENDER = process.env.SENDER_EMAIL || 'noreply@hopeandtruthministry.com';
const TOXICITY_THRESHOLD = parseFloat(process.env.TOXICITY_THRESHOLD || '0.75');
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_PER_HOUR || '2', 10);

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

  // Basic validation
  if (!email?.includes('@') || !VALID_CATEGORIES.has(category) || !message?.trim()) {
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
