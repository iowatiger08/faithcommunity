/**
 * Unit tests for the contact form Lambda handler.
 * AWS SDK clients are mocked so tests run without credentials.
 * Focus: honeypot, rate limiting, category validation, CORS.
 */
import { vi, describe, it, expect, beforeEach } from "vitest";

// Shared send spies so tests can control toxicity results and assert whether
// an email was actually sent.
const { sesSend, comprehendSend } = vi.hoisted(() => ({
  sesSend: vi.fn(),
  comprehendSend: vi.fn(),
}));
vi.mock("@aws-sdk/client-comprehend", () => ({
  ComprehendClient: class {
    send = comprehendSend;
  },
  DetectToxicContentCommand: class {},
}));
vi.mock("@aws-sdk/client-ses", () => ({
  SESClient: class {
    send = sesSend;
  },
  SendEmailCommand: class {},
}));

const cleanToxicity = { ResultList: [{ Labels: [{ Score: 0.1, Name: "HATE_SPEECH" }] }] };

beforeEach(() => {
  sesSend.mockReset();
  sesSend.mockResolvedValue({});
  comprehendSend.mockReset();
  comprehendSend.mockResolvedValue(cleanToxicity);
});

import { handler } from "./index.mjs";

// ── Helpers ────────────────────────────────────────────────────────────────
let ipCounter = 0;
function freshIp() {
  return `10.0.${Math.floor(++ipCounter / 256)}.${ipCounter % 256}`;
}

function makeEvent(body = {}, ip = freshIp(), method = "POST") {
  return {
    httpMethod: method,
    requestContext: { http: { method, sourceIp: ip } },
    headers: { origin: "https://hopeandtruthministry.com" },
    body: JSON.stringify(body),
  };
}

const validBody = {
  email: "visitor@example.com",
  category: "Prayer Request",
  message: "Please hold my family in prayer.",
  website: "",
};

// ── Tests ──────────────────────────────────────────────────────────────────
describe("OPTIONS preflight", () => {
  it("returns 200 with CORS headers", async () => {
    const event = makeEvent({}, freshIp(), "OPTIONS");
    event.requestContext.http.method = "OPTIONS";
    event.httpMethod = "OPTIONS";
    const res = await handler(event);
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Methods"]).toContain("POST");
  });
});

describe("honeypot", () => {
  it("silently discards when website field is filled", async () => {
    const res = await handler(
      makeEvent({ ...validBody, website: "http://spam.example" })
    );
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).ok).toBe(true);
  });
});

describe("input validation", () => {
  it("rejects invalid email with 400", async () => {
    const res = await handler(
      makeEvent({ ...validBody, email: "notanemail" })
    );
    expect(res.statusCode).toBe(400);
  });

  it("rejects unknown category with 400", async () => {
    const res = await handler(
      makeEvent({ ...validBody, category: "Ordination Inquiry" })
    );
    expect(res.statusCode).toBe(400);
  });

  it("rejects blank message with 400", async () => {
    const res = await handler(
      makeEvent({ ...validBody, message: "   " })
    );
    expect(res.statusCode).toBe(400);
  });

  it("rejects an oversized message with 400 and does not send", async () => {
    const res = await handler(
      makeEvent({ ...validBody, message: "a".repeat(5001) })
    );
    expect(res.statusCode).toBe(400);
    expect(sesSend).not.toHaveBeenCalled();
  });

  it("rejects an email containing a newline (CRLF injection) with 400", async () => {
    const res = await handler(
      makeEvent({ ...validBody, email: "a@b.com\nBcc: victim@example.com" })
    );
    expect(res.statusCode).toBe(400);
    expect(sesSend).not.toHaveBeenCalled();
  });

  it("accepts all four valid categories", async () => {
    for (const category of [
      "Prayer Request",
      "General Question",
      "Feedback / Reflection",
      "Other",
    ]) {
      const res = await handler(makeEvent({ ...validBody, category }));
      expect(res.statusCode).toBe(200);
    }
  });
});

describe("rate limiting", () => {
  it("silently discards a third request from the same IP within an hour", async () => {
    const ip = `192.168.99.1`;
    await handler(makeEvent(validBody, ip));
    await handler(makeEvent(validBody, ip));
    const third = await handler(makeEvent(validBody, ip));
    expect(third.statusCode).toBe(200);
    expect(JSON.parse(third.body).ok).toBe(true);
  });

  it("allows requests from different IPs independently", async () => {
    const resA = await handler(makeEvent(validBody, "172.16.0.1"));
    const resB = await handler(makeEvent(validBody, "172.16.0.2"));
    expect(resA.statusCode).toBe(200);
    expect(resB.statusCode).toBe(200);
  });
});

describe("CORS headers", () => {
  it("reflects an allowed origin", async () => {
    const res = await handler(makeEvent(validBody));
    expect(res.headers["Access-Control-Allow-Origin"]).toBe(
      "https://hopeandtruthministry.com"
    );
  });

  it("does not reflect unknown origins", async () => {
    const event = { ...makeEvent(validBody), headers: { origin: "https://evil.com" } };
    const res = await handler(event);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("");
  });
});

describe("valid submission", () => {
  it("returns 200 ok for a clean, valid message", async () => {
    const res = await handler(makeEvent(validBody));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).ok).toBe(true);
  });

  it("actually sends the email for a clean message", async () => {
    await handler(makeEvent(validBody));
    expect(sesSend).toHaveBeenCalledTimes(1);
  });
});

describe("origin enforcement", () => {
  it("allows a POST with no Origin header (privacy tools strip it)", async () => {
    const event = makeEvent(validBody);
    delete event.headers.origin;
    const res = await handler(event);
    expect(res.statusCode).toBe(200);
    expect(sesSend).toHaveBeenCalledTimes(1);
  });

  it("rejects a POST from a disallowed origin", async () => {
    const event = { ...makeEvent(validBody), headers: { origin: "https://evil.com" } };
    const res = await handler(event);
    expect(res.statusCode).toBe(403);
    expect(sesSend).not.toHaveBeenCalled();
  });

  it("still allows OPTIONS preflight without a valid origin", async () => {
    const event = makeEvent({}, freshIp(), "OPTIONS");
    delete event.headers.origin;
    const res = await handler(event);
    expect(res.statusCode).toBe(200);
  });
});

describe("link/URL spam filtering", () => {
  it("silently discards a message containing an http URL", async () => {
    const res = await handler(
      makeEvent({ ...validBody, message: "Boost your ranking: https://cheap-seo.example" })
    );
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).ok).toBe(true);
    expect(sesSend).not.toHaveBeenCalled();
  });

  it("silently discards a message with a www. link", async () => {
    const res = await handler(
      makeEvent({ ...validBody, message: "visit www.spam.example now" })
    );
    expect(res.statusCode).toBe(200);
    expect(sesSend).not.toHaveBeenCalled();
  });

  it("silently discards a message with multiple bare domains", async () => {
    const res = await handler(
      makeEvent({ ...validBody, message: "deals at foo.com and bar.net today" })
    );
    expect(res.statusCode).toBe(200);
    expect(sesSend).not.toHaveBeenCalled();
  });

  it("allows a genuine message that mentions a single site by name", async () => {
    const res = await handler(
      makeEvent({
        ...validBody,
        message: "I loved the reflection I read on hopeandtruthministry.com — thank you.",
      })
    );
    expect(res.statusCode).toBe(200);
    expect(sesSend).toHaveBeenCalledTimes(1);
  });

  it("allows a normal prayer request with no links", async () => {
    const res = await handler(
      makeEvent({ ...validBody, message: "Please pray for my mother's health." })
    );
    expect(res.statusCode).toBe(200);
    expect(sesSend).toHaveBeenCalledTimes(1);
  });

  it("allows a message listing two contact email addresses", async () => {
    const res = await handler(
      makeEvent({ ...validBody, message: "You can reach me at jane@work.com or jane@home.net." })
    );
    expect(res.statusCode).toBe(200);
    expect(sesSend).toHaveBeenCalledTimes(1);
  });

  it("allows a mention of our own www site", async () => {
    const res = await handler(
      makeEvent({ ...validBody, message: "I read this on www.hopeandtruthministry.com — thank you." })
    );
    expect(res.statusCode).toBe(200);
    expect(sesSend).toHaveBeenCalledTimes(1);
  });
});

describe("spam phrase filtering", () => {
  it("silently discards messages with clearly commercial spam phrases", async () => {
    const res = await handler(
      makeEvent({ ...validBody, message: "We offer cheap backlinks and SEO services." })
    );
    expect(res.statusCode).toBe(200);
    expect(sesSend).not.toHaveBeenCalled();
  });
});

describe("toxicity check", () => {
  it("silently discards a toxic message", async () => {
    comprehendSend.mockResolvedValue({ ResultList: [{ Labels: [{ Score: 0.95, Name: "INSULT" }] }] });
    const res = await handler(makeEvent(validBody));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).ok).toBe(true);
    expect(sesSend).not.toHaveBeenCalled();
  });

  it("lets the message through when Comprehend fails", async () => {
    comprehendSend.mockRejectedValue(new Error("throttled"));
    await handler(makeEvent(validBody));
    expect(sesSend).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["no result list", {}],
    ["a label with no score", { ResultList: [{ Labels: [{ Name: "INSULT" }] }] }],
  ])("treats %s as clean", async (_label, result) => {
    comprehendSend.mockResolvedValue(result);
    await handler(makeEvent(validBody));
    expect(sesSend).toHaveBeenCalledTimes(1);
  });
});

describe("email delivery failure", () => {
  it("returns 500 when SES fails", async () => {
    sesSend.mockRejectedValue(new Error("SES down"));
    const res = await handler(makeEvent(validBody));
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).error).toBe("Failed to send");
  });
});

describe("event shapes", () => {
  it("reads the method from a REST API (v1) event", async () => {
    const res = await handler({
      httpMethod: "OPTIONS",
      headers: { origin: "https://hopeandtruthministry.com" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("");
  });

  it("handles an event with no method at all", async () => {
    const res = await handler({ headers: {}, body: JSON.stringify(validBody) });
    expect(res.statusCode).toBe(200);
  });

  it("rejects a disallowed capitalised Origin header", async () => {
    const event = makeEvent(validBody);
    event.headers = { Origin: "https://evil.example" };
    const res = await handler(event);
    expect(res.statusCode).toBe(403);
  });

  it("reads the source IP from a REST API (v1) identity", async () => {
    const event = {
      httpMethod: "POST",
      requestContext: { identity: { sourceIp: "10.9.9.9" } },
      headers: {},
      body: JSON.stringify(validBody),
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(200);
    expect(sesSend).toHaveBeenCalledTimes(1);
  });
});

describe("malformed body", () => {
  it("returns 400 for a body that is not JSON", async () => {
    const event = makeEvent(validBody);
    event.body = "not json";
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toBe("Invalid JSON");
  });
});

describe("missing body", () => {
  it("rejects a request with no body as invalid input", async () => {
    const event = makeEvent(validBody);
    delete event.body;
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toBe("Invalid input");
  });
});
