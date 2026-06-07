/**
 * Unit tests for the contact form Lambda handler.
 * AWS SDK clients are mocked so tests run without credentials.
 * Focus: honeypot, rate limiting, category validation, CORS.
 */
import { vi, describe, it, expect } from "vitest";

vi.mock("@aws-sdk/client-comprehend", () => ({
  ComprehendClient: class {
    send = vi.fn().mockResolvedValue({
      ResultList: [{ Labels: [{ Score: 0.1, Name: "HATE_SPEECH" }] }],
    });
  },
  DetectToxicContentCommand: class {},
}));

vi.mock("@aws-sdk/client-ses", () => ({
  SESClient: class {
    send = vi.fn().mockResolvedValue({});
  },
  SendEmailCommand: class {},
}));

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
});
