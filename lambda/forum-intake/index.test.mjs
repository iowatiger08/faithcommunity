/**
 * Unit tests for the forum Q&A intake Lambda handler.
 * AWS SDK clients are mocked so tests run without credentials.
 *
 * Focus areas, in rough order of how much harm a regression would do:
 *   1. anonymity is enforced server-side (never trust the client)
 *   2. no submitted content ever reaches the logs
 *   3. nothing is silently discarded except honeypot/bot hits
 *   4. the access code gate fails closed
 */
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { createHmac } from "node:crypto";

const { comprehendSend } = vi.hoisted(() => ({ comprehendSend: vi.fn() }));
vi.mock("@aws-sdk/client-comprehend", () => ({
  ComprehendClient: class {
    send = comprehendSend;
  },
  DetectToxicContentCommand: class {
    constructor(input) {
      this.input = input;
    }
  },
}));

const { sesSend } = vi.hoisted(() => ({ sesSend: vi.fn() }));
vi.mock("@aws-sdk/client-ses", () => ({
  SESClient: class {
    send = sesSend;
  },
  SendEmailCommand: class {
    constructor(input) {
      this.input = input;
    }
  },
}));

const { ddbSend } = vi.hoisted(() => ({ ddbSend: vi.fn() }));
vi.mock("@aws-sdk/client-dynamodb", () => ({ DynamoDBClient: class {} }));
vi.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: { from: () => ({ send: ddbSend }) },
  PutCommand: class {
    constructor(input) {
      this.input = input;
    }
  },
}));

import { handler } from "./index.mjs";

// ── Fixtures ───────────────────────────────────────────────────────────────
const MEMBER_CODE = "Belong2026";
const SECRET = "test-hmac-secret";
const FORUM_ID = "windsor-heights-2026-10";
const CLOSES_AT = "2026-10-25T17:00:00Z";
// Comfortably inside the window, and far enough past a token mint that the
// minimum-compose-time check does not fire.
const NOW = Date.parse("2026-10-22T12:00:00Z");

let ipCounter = 0;
function freshIp() {
  return `10.0.${Math.floor(++ipCounter / 256)}.${ipCounter % 256}`;
}

function makeEvent(path, body = {}, { ip = freshIp(), method = "POST", origin = "https://hopeandtruthministry.com" } = {}) {
  const headers = {};
  if (origin !== null) headers.origin = origin;
  return {
    requestContext: { http: { method, path, sourceIp: ip } },
    rawPath: path,
    headers,
    body: JSON.stringify(body),
  };
}

const verifyEvent = (body, opts) => makeEvent("/forum/verify", body, opts);
const questionEvent = (body, opts) => makeEvent("/forum/question", body, opts);

function parse(res) {
  return JSON.parse(res.body || "{}");
}

/** Mint a token the way the handler does, so tests can forge/age one. */
function makeToken({ iatOffset = -600, ttl = 7200, secret = SECRET, forumId = FORUM_ID } = {}) {
  const iat = Math.floor(NOW / 1000) + iatOffset;
  const exp = iat + ttl;
  const sig = createHmac("sha256", secret).update(`forum:${forumId}:${exp}:${iat}`).digest("hex");
  return `${exp}.${iat}.${sig}`;
}

async function freshToken() {
  const res = await handler(verifyEvent({ code: MEMBER_CODE }));
  return parse(res).token;
}

const validQuestion = {
  anonymous: false,
  name: "Jane Doe",
  email: "jane@example.com",
  question: "How do I support my daughter after she came out to me?",
  confirm_url: "",
};

const noToxicity = { ResultList: [{ Labels: [{ Name: "HATE_SPEECH", Score: 0.02 }] }] };

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);

  process.env.FORUM_MEMBER_CODE = MEMBER_CODE;
  process.env.FORUM_TOKEN_SECRET = SECRET;
  process.env.FORUM_ID = FORUM_ID;
  process.env.FORUM_TABLE = "forum-questions-test";
  process.env.FORUM_CLOSES_AT = CLOSES_AT;
  process.env.RECIPIENT_EMAIL = "pastor@example.com";
  process.env.SENDER_EMAIL = "noreply@example.com";
  process.env.EMAIL_INCLUDE_CONTENT = "false";
  process.env.SITE_URL = "https://hopeandtruthministry.com";

  sesSend.mockReset().mockResolvedValue({});
  ddbSend.mockReset().mockResolvedValue({});
  comprehendSend.mockReset().mockResolvedValue(noToxicity);
});

afterEach(() => {
  vi.useRealTimers();
});

/** The single PutCommand item from this test's DynamoDB call. */
function storedItem() {
  expect(ddbSend).toHaveBeenCalledTimes(1);
  return ddbSend.mock.calls[0][0].input.Item;
}

// ── Routing ────────────────────────────────────────────────────────────────
describe("routing", () => {
  it("returns 404 for an unknown path", async () => {
    const res = await handler(makeEvent("/forum/nope", {}));
    expect(res.statusCode).toBe(404);
  });

  it("answers OPTIONS preflight with CORS headers", async () => {
    const res = await handler(verifyEvent({}, { method: "OPTIONS" }));
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Methods"]).toContain("POST");
  });
});

// ── /forum/verify ──────────────────────────────────────────────────────────
describe("POST /forum/verify", () => {
  it("mints a token for the correct code", async () => {
    const res = await handler(verifyEvent({ code: MEMBER_CODE }));
    expect(res.statusCode).toBe(200);
    const body = parse(res);
    expect(typeof body.token).toBe("string");
    expect(typeof body.expiresAt).toBe("number");
  });

  it("rejects a wrong code without leaking a token", async () => {
    const res = await handler(verifyEvent({ code: "wrong-code" }));
    expect(res.statusCode).toBe(401);
    expect("token" in parse(res)).toBe(false);
  });

  it("rejects a missing or non-string code", async () => {
    expect((await handler(verifyEvent({}))).statusCode).toBe(400);
    expect((await handler(verifyEvent({ code: 42 }))).statusCode).toBe(400);
  });

  it("rejects an absurdly long code without throwing", async () => {
    const res = await handler(verifyEvent({ code: "x".repeat(5000) }));
    expect(res.statusCode).toBe(400);
  });

  it("fails CLOSED when no code is configured", async () => {
    process.env.FORUM_MEMBER_CODE = "";
    expect((await handler(verifyEvent({ code: "" }))).statusCode).toBe(401);
    expect((await handler(verifyEvent({ code: "anything" }))).statusCode).toBe(401);
  });

  it("trims surrounding whitespace but stays case-sensitive", async () => {
    expect((await handler(verifyEvent({ code: `  ${MEMBER_CODE}  ` }))).statusCode).toBe(200);
    expect((await handler(verifyEvent({ code: MEMBER_CODE.toLowerCase() }))).statusCode).toBe(401);
  });

  it("throttles repeated failures from one IP", async () => {
    const ip = freshIp();
    for (let i = 0; i < 10; i++) {
      const res = await handler(verifyEvent({ code: "nope" }, { ip }));
      expect(res.statusCode).toBe(401);
    }
    expect((await handler(verifyEvent({ code: "nope" }, { ip }))).statusCode).toBe(429);
  });

  it("does not throttle a different IP, and does not count successes", async () => {
    const ip = freshIp();
    for (let i = 0; i < 9; i++) await handler(verifyEvent({ code: "nope" }, { ip }));
    // 30 successes from the same IP must not consume the failure budget —
    // a congregation behind one church-wifi NAT shares a source IP.
    for (let i = 0; i < 30; i++) {
      expect((await handler(verifyEvent({ code: MEMBER_CODE }, { ip }))).statusCode).toBe(200);
    }
    expect((await handler(verifyEvent({ code: MEMBER_CODE }, { ip: freshIp() }))).statusCode).toBe(200);
  });

  it("round-trips: a minted token is accepted by /forum/question", async () => {
    const token = await freshToken();
    vi.setSystemTime(NOW + 10_000);
    const res = await handler(questionEvent({ ...validQuestion, token }));
    expect(res.statusCode).toBe(200);
  });
});

// ── Token verification ─────────────────────────────────────────────────────
describe("token verification", () => {
  it("rejects a missing token", async () => {
    const res = await handler(questionEvent({ ...validQuestion }));
    expect(res.statusCode).toBe(401);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("rejects a garbage token", async () => {
    expect((await handler(questionEvent({ ...validQuestion, token: "garbage" }))).statusCode).toBe(401);
  });

  it("rejects a forged signature on a valid-looking token", async () => {
    const good = makeToken();
    const forged = good.replace(/\.[0-9a-f]+$/, `.${"a".repeat(64)}`);
    expect((await handler(questionEvent({ ...validQuestion, token: forged }))).statusCode).toBe(401);
  });

  it("rejects an expired but correctly signed token", async () => {
    const token = makeToken({ iatOffset: -10_000, ttl: 7200 });
    expect((await handler(questionEvent({ ...validQuestion, token }))).statusCode).toBe(401);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = makeToken({ secret: "other-secret" });
    expect((await handler(questionEvent({ ...validQuestion, token }))).statusCode).toBe(401);
  });

  it("rejects a token minted for a different forum", async () => {
    const token = makeToken({ forumId: "some-other-forum" });
    expect((await handler(questionEvent({ ...validQuestion, token }))).statusCode).toBe(401);
  });
});

// ── Submission window ──────────────────────────────────────────────────────
describe("submission window", () => {
  it("closes both routes once the cutoff has passed", async () => {
    vi.setSystemTime(Date.parse("2026-10-25T17:00:01Z"));
    const v = await handler(verifyEvent({ code: MEMBER_CODE }));
    expect(v.statusCode).toBe(403);
    expect(parse(v).error).toMatch(/closed/i);

    const q = await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    expect(q.statusCode).toBe(403);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("is still open one second before the cutoff", async () => {
    vi.setSystemTime(Date.parse("2026-10-25T16:59:59Z"));
    expect((await handler(verifyEvent({ code: MEMBER_CODE }))).statusCode).toBe(200);
  });
});

// ── Bot defenses ───────────────────────────────────────────────────────────
describe("bot defenses", () => {
  it("silently accepts but does not store a honeypot submission", async () => {
    const token = makeToken();
    const res = await handler(questionEvent({ ...validQuestion, token, confirm_url: "http://spam.example" }));
    expect(res.statusCode).toBe(200);
    expect(ddbSend).not.toHaveBeenCalled();
    expect(sesSend).not.toHaveBeenCalled();
  });

  it("silently accepts but does not store a submission typed impossibly fast", async () => {
    const token = makeToken({ iatOffset: 0 });
    vi.setSystemTime(NOW + 1000);
    const res = await handler(questionEvent({ ...validQuestion, token }));
    expect(res.statusCode).toBe(200);
    expect(ddbSend).not.toHaveBeenCalled();
  });
});

// ── Validation ─────────────────────────────────────────────────────────────
describe("validation", () => {
  let token;
  beforeEach(() => {
    token = makeToken();
  });

  it("stores a valid named submission", async () => {
    const res = await handler(questionEvent({ ...validQuestion, token }));
    expect(res.statusCode).toBe(200);
    expect(parse(res).ok).toBe(true);
    expect(ddbSend).toHaveBeenCalledTimes(1);
  });

  it("requires an email on a non-anonymous submission", async () => {
    const res = await handler(questionEvent({ ...validQuestion, token, email: undefined }));
    expect(res.statusCode).toBe(400);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("requires a name on a non-anonymous submission", async () => {
    const res = await handler(questionEvent({ ...validQuestion, token, name: "   " }));
    expect(res.statusCode).toBe(400);
  });

  it("rejects a malformed email", async () => {
    const res = await handler(questionEvent({ ...validQuestion, token, email: "not-an-email" }));
    expect(res.statusCode).toBe(400);
  });

  it("rejects CRLF injection in the email and sends nothing", async () => {
    const res = await handler(
      questionEvent({ ...validQuestion, token, email: "a@b.com\nBcc: victim@example.com" })
    );
    expect(res.statusCode).toBe(400);
    expect(sesSend).not.toHaveBeenCalled();
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("rejects a blank question", async () => {
    expect((await handler(questionEvent({ ...validQuestion, token, question: "   " }))).statusCode).toBe(400);
  });

  it("rejects an oversized question", async () => {
    const res = await handler(questionEvent({ ...validQuestion, token, question: "x".repeat(5001) }));
    expect(res.statusCode).toBe(400);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("rejects an oversized name", async () => {
    expect((await handler(questionEvent({ ...validQuestion, token, name: "x".repeat(101) }))).statusCode).toBe(400);
  });

  it("rejects a question containing a web link with an actionable message", async () => {
    const res = await handler(
      questionEvent({ ...validQuestion, token, question: "See https://spam.example/offer for details" })
    );
    expect(res.statusCode).toBe(400);
    expect(parse(res).error).toMatch(/link/i);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("allows a question that merely mentions the ministry's own site", async () => {
    const res = await handler(
      questionEvent({ ...validQuestion, token, question: "I read the page on hopeandtruthministry.com and wondered…" })
    );
    expect(res.statusCode).toBe(200);
  });
});

// ── Stored item shape ──────────────────────────────────────────────────────
describe("stored item", () => {
  it("has the expected keys and no TTL attribute", async () => {
    await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    const item = storedItem();
    expect(item.forumId).toBe(FORUM_ID);
    expect(item.sk).toMatch(/^\d{4}-\d{2}-\d{2}T.*#[0-9a-f]{8}$/);
    expect(item.questionId).toMatch(/^[0-9a-f]{8}$/);
    expect(item.status).toBe("received");
    expect(item.anonymous).toBe(false);
    expect(item.question).toBe(validQuestion.question);
    // Retention is deliberate and manual — no auto-expiry.
    expect("ttl" in item).toBe(false);
  });

  it("never stores an IP address", async () => {
    await handler(questionEvent({ ...validQuestion, token: makeToken() }, { ip: "203.0.113.7" }));
    expect(JSON.stringify(storedItem())).not.toContain("203.0.113.7");
  });
});

// ── Anonymity, enforced server-side ────────────────────────────────────────
describe("anonymity", () => {
  it("omits name and email entirely when anonymous, even if the client sends them", async () => {
    await handler(
      questionEvent({
        token: makeToken(),
        anonymous: true,
        name: "Should Not Persist",
        email: "shouldnot@persist.example",
        question: "Am I still loved by God?",
        confirm_url: "",
      })
    );
    const item = storedItem();
    expect(item.anonymous).toBe(true);
    expect("name" in item).toBe(false);
    expect("email" in item).toBe(false);
  });

  it("keeps an anonymous submitter's details out of the notification email", async () => {
    await handler(
      questionEvent({
        token: makeToken(),
        anonymous: true,
        name: "Should Not Persist",
        email: "shouldnot@persist.example",
        question: "Am I still loved by God?",
        confirm_url: "",
      })
    );
    const sent = JSON.stringify(sesSend.mock.calls[0][0].input);
    expect(sent).not.toContain("Should Not Persist");
    expect(sent).not.toContain("shouldnot@persist.example");
  });

  it("does not require name or email when anonymous", async () => {
    const res = await handler(
      questionEvent({ token: makeToken(), anonymous: true, question: "A question.", confirm_url: "" })
    );
    expect(res.statusCode).toBe(200);
  });
});

// ── Moderation: hold, never discard ────────────────────────────────────────
describe("moderation", () => {
  const flag = (name, score) => ({ ResultList: [{ Labels: [{ Name: name, Score: score }] }] });

  it("holds a threatening submission but still stores it and still succeeds", async () => {
    comprehendSend.mockResolvedValue(flag("VIOLENCE_OR_THREAT", 0.97));
    const res = await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    expect(res.statusCode).toBe(200);
    const item = storedItem();
    expect(item.status).toBe("held");
    expect(item.flagReason).toContain("VIOLENCE_OR_THREAT");
    expect(item.question).toBe(validQuestion.question);
  });

  it("holds a harassing submission", async () => {
    comprehendSend.mockResolvedValue(flag("HARASSMENT_OR_ABUSE", 0.95));
    await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    expect(storedItem().status).toBe("held");
  });

  it("does NOT hold on labels that false-positive on queer testimony", async () => {
    for (const name of ["SEXUAL", "PROFANITY", "HATE_SPEECH", "INSULT", "GRAPHIC"]) {
      ddbSend.mockClear();
      comprehendSend.mockResolvedValue(flag(name, 0.99));
      const res = await handler(
        questionEvent({
          token: makeToken(),
          anonymous: true,
          question: "My father called me a slur when I came out. Is being queer a sin?",
          confirm_url: "",
        })
      );
      expect(res.statusCode).toBe(200);
      expect(storedItem().status, `${name} must not hold`).toBe("received");
    }
  });

  it("does not hold a threat label scoring below the threshold", async () => {
    comprehendSend.mockResolvedValue(flag("VIOLENCE_OR_THREAT", 0.5));
    await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    expect(storedItem().status).toBe("received");
  });

  it("fails OPEN when Comprehend errors — an AWS blip must not quarantine a real question", async () => {
    comprehendSend.mockRejectedValue(new Error("Comprehend unavailable"));
    const res = await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    expect(res.statusCode).toBe(200);
    expect(storedItem().status).toBe("received");
  });
});

// ── Notification email ─────────────────────────────────────────────────────
describe("notification email", () => {
  it("is content-free by default", async () => {
    await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    const sent = JSON.stringify(sesSend.mock.calls[0][0].input);
    expect(sent).not.toContain(validQuestion.question);
  });

  it("never puts question text in the subject", async () => {
    await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    const subject = sesSend.mock.calls[0][0].input.Message.Subject.Data;
    expect(subject).not.toContain("daughter");
    expect(subject).toMatch(/^Forum question #[0-9a-f]{8}/);
  });

  it("flags a held submission in the subject", async () => {
    comprehendSend.mockResolvedValue({ ResultList: [{ Labels: [{ Name: "VIOLENCE_OR_THREAT", Score: 0.97 }] }] });
    await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    expect(sesSend.mock.calls[0][0].input.Message.Subject.Data).toMatch(/HELD/);
  });

  it("omits ReplyToAddresses entirely", async () => {
    await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    expect("ReplyToAddresses" in sesSend.mock.calls[0][0].input).toBe(false);
  });

  it("includes content when EMAIL_INCLUDE_CONTENT is enabled", async () => {
    process.env.EMAIL_INCLUDE_CONTENT = "true";
    await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    expect(JSON.stringify(sesSend.mock.calls[0][0].input)).toContain(validQuestion.question);
  });
});

// ── Failure modes ──────────────────────────────────────────────────────────
describe("failure modes", () => {
  it("still succeeds and still stores when SES fails", async () => {
    sesSend.mockRejectedValue(new Error("SES down"));
    const res = await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    expect(res.statusCode).toBe(200);
    expect(ddbSend).toHaveBeenCalledTimes(1);
  });

  it("returns 500 and does not claim success when storage fails", async () => {
    ddbSend.mockRejectedValue(new Error("DynamoDB down"));
    const res = await handler(questionEvent({ ...validQuestion, token: makeToken() }));
    expect(res.statusCode).toBe(500);
    expect(parse(res).ok).not.toBe(true);
  });

  it("rejects an invalid JSON body", async () => {
    const event = questionEvent({});
    event.body = "{not json";
    expect((await handler(event)).statusCode).toBe(400);
  });

  it("throttles excessive submissions from one IP", async () => {
    const ip = freshIp();
    for (let i = 0; i < 20; i++) {
      const res = await handler(questionEvent({ ...validQuestion, token: makeToken() }, { ip }));
      expect(res.statusCode).toBe(200);
    }
    expect((await handler(questionEvent({ ...validQuestion, token: makeToken() }, { ip }))).statusCode).toBe(429);
  });
});

// ── Origin / CORS ──────────────────────────────────────────────────────────
describe("origin handling", () => {
  it("reflects an allowed origin", async () => {
    const res = await handler(verifyEvent({ code: MEMBER_CODE }));
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("https://hopeandtruthministry.com");
  });

  it("does not reflect an unknown origin", async () => {
    const res = await handler(verifyEvent({ code: MEMBER_CODE }, { origin: "https://evil.example" }));
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("");
  });

  it("rejects a cross-site POST outright", async () => {
    const res = await handler(verifyEvent({ code: MEMBER_CODE }, { origin: "https://evil.example" }));
    expect(res.statusCode).toBe(403);
  });

  it("allows a request with no Origin header", async () => {
    const res = await handler(verifyEvent({ code: MEMBER_CODE }, { origin: null }));
    expect(res.statusCode).toBe(200);
  });
});

// ── Logging ────────────────────────────────────────────────────────────────
describe("logging", () => {
  it("never writes submitted content, codes, or tokens to the logs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const sentinels = {
      name: "SENTINEL_NAME_ZQX",
      email: "sentinel_email_zqx@example.com",
      question: "SENTINEL_QUESTION_ZQX about coming out",
    };
    const token = makeToken();

    // Exercise the paths that log: success, SES failure, storage failure,
    // honeypot, rate limit, and a bad code.
    await handler(questionEvent({ ...sentinels, anonymous: false, token, confirm_url: "" }));
    sesSend.mockRejectedValueOnce(new Error("SES down"));
    await handler(questionEvent({ ...sentinels, anonymous: false, token, confirm_url: "" }));
    ddbSend.mockRejectedValueOnce(new Error("DDB down"));
    await handler(questionEvent({ ...sentinels, anonymous: false, token, confirm_url: "" }));
    await handler(questionEvent({ ...sentinels, anonymous: false, token, confirm_url: "trap" }));
    await handler(verifyEvent({ code: "SENTINEL_CODE_ZQX" }));

    const logged = [logSpy, errSpy, warnSpy]
      .flatMap((spy) => spy.mock.calls)
      .flat()
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" | ");

    for (const value of [...Object.values(sentinels), MEMBER_CODE, SECRET, token, "SENTINEL_CODE_ZQX"]) {
      expect(logged, `leaked: ${value}`).not.toContain(value);
    }

    logSpy.mockRestore();
    errSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
