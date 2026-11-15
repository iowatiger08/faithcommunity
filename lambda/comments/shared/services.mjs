// Calls to services outside the database: content screening, the owner's
// review notice, account removal and the published-page check.
import { ComprehendClient, DetectToxicContentCommand } from "@aws-sdk/client-comprehend";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const comprehend = new ComprehendClient({});
const ses = new SESClient({});
const cognito = new CognitoIdentityProviderClient({});

const SCREENED_LABELS = new Set(["PROFANITY", "HATE_SPEECH", "SEXUAL", "VIOLENCE_OR_THREAT", "GRAPHIC", "INSULT", "HARASSMENT_OR_ABUSE"]);

/**
 * Screens text for abusive content. Returns { flagged, reason }. Fails open on
 * a service error: the caller holds flagged text for review, so a miss here
 * still leaves the report and moderator paths in place.
 */
export async function screen(text) {
  const threshold = parseFloat(process.env.TOXICITY_THRESHOLD ?? "0.7");
  try {
    const result = await comprehend.send(
      new DetectToxicContentCommand({
        // The service caps each segment at 1 KB (500 characters keeps multi-byte text under it); long comments are
        // split so the end of a long comment is screened too.
        TextSegments: chunk(text, 500).map((Text) => ({ Text })),
        LanguageCode: "en",
      }),
    );
    for (const item of result.ResultList ?? []) {
      for (const label of item.Labels ?? []) {
        if (SCREENED_LABELS.has(label.Name) && label.Score >= threshold) {
          return { flagged: true, reason: label.Name };
        }
      }
    }
  } catch (err) {
    console.error("screening failed, allowing content:", err.message);
  }
  return { flagged: false };
}

function chunk(text, size) {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}

/** Tells the owner something is waiting for review. Never includes the text. */
export async function notifyReview(reason) {
  try {
    await ses.send(
      new SendEmailCommand({
        Source: process.env.SENDER_EMAIL,
        Destination: { ToAddresses: [process.env.RECIPIENT_EMAIL] },
        Message: {
          Subject: { Data: "A comment is waiting for review" },
          Body: {
            Text: {
              Data: `A comment was held (${reason}).\n\nReview it at ${process.env.SITE_ORIGIN}/moderation/`,
            },
          },
        },
      }),
    );
  } catch (err) {
    // The comment is already held; a missed email only delays review.
    console.error("review notice failed:", err.message);
  }
}

export async function deleteAccount(username) {
  await cognito.send(
    new AdminDeleteUserCommand({ UserPoolId: process.env.USER_POOL_ID, Username: username }),
  );
}

const pageCache = new Map();

/** True when the post is published on the site, so comments can't pile up on made-up slugs. */
export async function postExists(section, slug) {
  const key = `${section}/${slug}`;
  if (pageCache.has(key)) return pageCache.get(key);
  try {
    const res = await fetch(`${process.env.SITE_ORIGIN}/${key}/`, { method: "HEAD" });
    // Only cache a definite answer; a server error is retried next time.
    if (res.status === 200 || res.status === 404) pageCache.set(key, res.status === 200);
    return res.status === 200;
  } catch (err) {
    console.error("post check failed:", err.message);
    return false;
  }
}
