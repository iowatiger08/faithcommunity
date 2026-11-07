/**
 * Unit tests for the Blogger proxy Lambda handler.
 * Secrets Manager and fetch are mocked so tests run without credentials.
 * Focus: CORS, preflight, secret parsing, upstream errors.
 */
import { vi, describe, it, expect, beforeEach, afterAll } from "vitest";

const { secretsSend } = vi.hoisted(() => ({ secretsSend: vi.fn() }));
vi.mock("@aws-sdk/client-secrets-manager", () => ({
  SecretsManagerClient: class {
    send = secretsSend;
  },
  GetSecretValueCommand: class {},
}));

import { handler } from "./index.mjs";

const mockFetch = vi.fn();
const realFetch = global.fetch;
global.fetch = mockFetch;
afterAll(() => {
  global.fetch = realFetch;
});

vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});

function makeEvent({ origin = "https://hopeandtruthministry.com", method = "GET" } = {}) {
  return { httpMethod: method, headers: { origin } };
}

function okResponse(data) {
  return { ok: true, json: async () => data };
}

// Fake secret payloads; nothing here is a real credential.
const fakeSecret = (value) => ({ SecretString: value });

beforeEach(() => {
  secretsSend.mockReset();
  mockFetch.mockReset();
  secretsSend.mockResolvedValue(fakeSecret(JSON.stringify({ api_key: "k1" })));
  mockFetch.mockResolvedValue(okResponse({ items: [{ id: "1" }, { id: "2" }] }));
});

describe("CORS", () => {
  it("echoes an allowed origin", async () => {
    const res = await handler(makeEvent());
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("https://hopeandtruthministry.com");
  });

  it("reads a capitalised Origin header", async () => {
    const res = await handler({ httpMethod: "GET", headers: { Origin: "http://localhost:5173" } });
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("http://localhost:5173");
  });

  it("blanks a disallowed origin", async () => {
    const res = await handler(makeEvent({ origin: "https://evil.example" }));
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("");
  });

  it("handles an event with no headers", async () => {
    const res = await handler({ httpMethod: "GET" });
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("");
    expect(res.statusCode).toBe(200);
  });
});

describe("preflight", () => {
  it("answers a REST API OPTIONS without touching the secret", async () => {
    const res = await handler(makeEvent({ method: "OPTIONS" }));
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("");
    expect(secretsSend).not.toHaveBeenCalled();
  });

  it("answers an HTTP API (v2) OPTIONS", async () => {
    const res = await handler({ headers: {}, requestContext: { http: { method: "OPTIONS" } } });
    expect(res.statusCode).toBe(200);
    expect(secretsSend).not.toHaveBeenCalled();
  });
});

describe("secret parsing", () => {
  it.each([
    ["api_key", { api_key: "a" }, "a"],
    ["key", { key: "b" }, "b"],
    ["apiKey", { apiKey: "c" }, "c"],
  ])("reads the %s field from a JSON secret", async (_field, secret, expected) => {
    secretsSend.mockResolvedValue(fakeSecret(JSON.stringify(secret)));
    await handler(makeEvent());
    expect(mockFetch.mock.calls[0][0]).toContain(`key=${expected}&`);
  });

  it("uses a plain-text secret as the key", async () => {
    secretsSend.mockResolvedValue(fakeSecret("plain-key"));
    await handler(makeEvent());
    expect(mockFetch.mock.calls[0][0]).toContain("key=plain-key&");
  });

  it("returns 500 when the JSON secret has no key field", async () => {
    secretsSend.mockResolvedValue(fakeSecret(JSON.stringify({ other: "x" })));
    const res = await handler(makeEvent());
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).message).toBe("API key not found in secret");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns 500 when the secret has no string value", async () => {
    secretsSend.mockResolvedValue({});
    const res = await handler(makeEvent());
    expect(res.statusCode).toBe(500);
  });

  it("returns 500 when Secrets Manager fails", async () => {
    secretsSend.mockRejectedValue(new Error("AccessDenied"));
    const res = await handler(makeEvent());
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({
      error: "Failed to fetch blogger posts",
      message: "AccessDenied",
    });
  });
});

describe("Blogger fetch", () => {
  it("requests the five latest posts and returns them", async () => {
    const res = await handler(makeEvent());
    const url = mockFetch.mock.calls[0][0];
    expect(url).toMatch(/^https:\/\/www\.googleapis\.com\/blogger\/v3\/blogs\/\d+\/posts\?/);
    expect(url).toContain("maxResults=5");
    expect(url).toContain("orderBy=published");
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).items).toHaveLength(2);
  });

  it("returns a response with no items", async () => {
    mockFetch.mockResolvedValue(okResponse({}));
    const res = await handler(makeEvent());
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({});
  });

  it("returns 500 with the upstream status on a Blogger error", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 403, text: async () => "quota" });
    const res = await handler(makeEvent());
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).message).toBe("Blogger API returned 403: quota");
  });
});
