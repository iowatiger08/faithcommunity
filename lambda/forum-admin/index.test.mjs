/**
 * Unit tests for the forum Q&A admin listing Lambda handler.
 * AWS SDK clients are mocked so tests run without credentials.
 *
 * This route reads every submission in the table, so the tests concentrate on
 * the gate: the admin code is not the member code, an unset code fails closed,
 * and a rejected request never reaches DynamoDB.
 */
import { vi, describe, it, expect, beforeEach } from "vitest";

const { ddbSend, queryInputs, scanConstructed } = vi.hoisted(() => ({
  ddbSend: vi.fn(),
  queryInputs: [],
  scanConstructed: { count: 0 },
}));

vi.mock("@aws-sdk/client-dynamodb", () => ({ DynamoDBClient: class {} }));
vi.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: { from: () => ({ send: ddbSend }) },
  QueryCommand: class {
    constructor(input) {
      this.input = input;
      queryInputs.push(input);
    }
  },
  // Present so that importing it would work — if the handler ever constructs
  // one, the counter proves it and a test fails.
  ScanCommand: class {
    constructor(input) {
      this.input = input;
      scanConstructed.count += 1;
    }
  },
}));

import { handler } from "./index.mjs";

const ADMIN_CODE = "s7K2vQp9RtZx4LmW8bNcH3Yd";
const MEMBER_CODE = "Belong2026";
const FORUM_ID = "windsor-heights-2026-10";

let ipCounter = 0;
const freshIp = () => `10.1.${Math.floor(++ipCounter / 256)}.${ipCounter % 256}`;

function makeEvent(body = {}, { ip = freshIp(), method = "POST", origin = "https://hopeandtruthministry.com" } = {}) {
  const headers = {};
  if (origin !== null) headers.origin = origin;
  return {
    requestContext: { http: { method, path: "/forum/admin/questions", sourceIp: ip } },
    rawPath: "/forum/admin/questions",
    headers,
    body: JSON.stringify(body),
  };
}

const parse = (res) => JSON.parse(res.body || "{}");

const items = [
  {
    forumId: FORUM_ID,
    sk: "2026-10-23T10:00:00.000Z#aaaaaaaa",
    questionId: "aaaaaaaa",
    submittedAt: "2026-10-23T10:00:00.000Z",
    anonymous: false,
    name: "Jane Doe",
    email: "jane@example.com",
    question: "How do I support my daughter?",
    status: "received",
  },
  {
    forumId: FORUM_ID,
    sk: "2026-10-22T09:00:00.000Z#bbbbbbbb",
    questionId: "bbbbbbbb",
    submittedAt: "2026-10-22T09:00:00.000Z",
    anonymous: true,
    question: "Am I still loved by God?",
    status: "received",
  },
  {
    forumId: FORUM_ID,
    sk: "2026-10-21T08:00:00.000Z#cccccccc",
    questionId: "cccccccc",
    submittedAt: "2026-10-21T08:00:00.000Z",
    anonymous: true,
    question: "A threatening message.",
    status: "held",
    flagReason: "VIOLENCE_OR_THREAT:0.97",
  },
];

beforeEach(() => {
  process.env.FORUM_ADMIN_CODE = ADMIN_CODE;
  process.env.FORUM_ID = FORUM_ID;
  process.env.FORUM_TABLE = "forum-questions-test";
  queryInputs.length = 0;
  scanConstructed.count = 0;
  ddbSend.mockReset().mockResolvedValue({ Items: items });
});

describe("the gate", () => {
  it("returns the questions for the correct admin code", async () => {
    const res = await handler(makeEvent({ code: ADMIN_CODE }));
    expect(res.statusCode).toBe(200);
    const body = parse(res);
    expect(body.ok).toBe(true);
    expect(body.count).toBe(2);
    expect(body.questions).toHaveLength(2);
  });

  it("rejects a wrong code without touching DynamoDB", async () => {
    const res = await handler(makeEvent({ code: "wrong" }));
    expect(res.statusCode).toBe(401);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("rejects the MEMBER code — the two codes are not interchangeable", async () => {
    const res = await handler(makeEvent({ code: MEMBER_CODE }));
    expect(res.statusCode).toBe(401);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("rejects a missing or non-string code", async () => {
    expect((await handler(makeEvent({}))).statusCode).toBe(400);
    expect((await handler(makeEvent({ code: 7 }))).statusCode).toBe(400);
  });

  it("fails CLOSED when no admin code is configured", async () => {
    process.env.FORUM_ADMIN_CODE = "";
    expect((await handler(makeEvent({ code: "" }))).statusCode).toBe(401);
    expect((await handler(makeEvent({ code: ADMIN_CODE }))).statusCode).toBe(401);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("throttles repeated attempts from one IP", async () => {
    const ip = freshIp();
    for (let i = 0; i < 20; i++) await handler(makeEvent({ code: "wrong" }, { ip }));
    expect((await handler(makeEvent({ code: "wrong" }, { ip }))).statusCode).toBe(429);
  });
});

describe("the query", () => {
  it("uses Query on the forum partition, never Scan", async () => {
    await handler(makeEvent({ code: ADMIN_CODE }));
    expect(queryInputs).toHaveLength(1);
    expect(queryInputs[0].ExpressionAttributeValues[":forumId"]).toBe(FORUM_ID);
    expect(scanConstructed.count).toBe(0);
  });

  it("asks DynamoDB for newest-first", async () => {
    await handler(makeEvent({ code: ADMIN_CODE }));
    expect(queryInputs[0].ScanIndexForward).toBe(false);
  });

  it("returns questions newest-first", async () => {
    const body = parse(await handler(makeEvent({ code: ADMIN_CODE })));
    expect(body.questions.map((q) => q.questionId)).toEqual(["aaaaaaaa", "bbbbbbbb"]);
  });
});

describe("the response", () => {
  it("separates held items from the main list", async () => {
    const body = parse(await handler(makeEvent({ code: ADMIN_CODE })));
    expect(body.questions.map((q) => q.status)).not.toContain("held");
    expect(body.held).toHaveLength(1);
  });

  it("includes the full text and reason for a held item", async () => {
    const body = parse(await handler(makeEvent({ code: ADMIN_CODE })));
    expect(body.held[0].question).toBe("A threatening message.");
    expect(body.held[0].flagReason).toBe("VIOLENCE_OR_THREAT:0.97");
  });

  it("returns anonymous items with no name or email", async () => {
    const body = parse(await handler(makeEvent({ code: ADMIN_CODE })));
    const anon = body.questions.find((q) => q.anonymous);
    expect("name" in anon).toBe(false);
    expect("email" in anon).toBe(false);
  });

  it("is not cacheable", async () => {
    const res = await handler(makeEvent({ code: ADMIN_CODE }));
    expect(res.headers["Cache-Control"]).toBe("no-store");
  });

  it("handles an empty table", async () => {
    ddbSend.mockResolvedValue({});
    const body = parse(await handler(makeEvent({ code: ADMIN_CODE })));
    expect(body.count).toBe(0);
    expect(body.questions).toEqual([]);
    expect(body.held).toEqual([]);
  });
});

describe("failure modes", () => {
  it("returns 500 with no partial data when the query fails", async () => {
    ddbSend.mockRejectedValue(new Error("DynamoDB down"));
    const res = await handler(makeEvent({ code: ADMIN_CODE }));
    expect(res.statusCode).toBe(500);
    expect(parse(res).questions).toBeUndefined();
  });

  it("rejects an invalid JSON body", async () => {
    const event = makeEvent({});
    event.body = "{not json";
    expect((await handler(event)).statusCode).toBe(400);
  });

  it("answers OPTIONS preflight", async () => {
    expect((await handler(makeEvent({}, { method: "OPTIONS" }))).statusCode).toBe(200);
  });

  it("rejects a cross-site POST", async () => {
    expect((await handler(makeEvent({ code: ADMIN_CODE }, { origin: "https://evil.example" }))).statusCode).toBe(403);
  });
});

describe("logging", () => {
  it("never writes question content or the admin code to the logs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await handler(makeEvent({ code: ADMIN_CODE }));
    await handler(makeEvent({ code: "SENTINEL_WRONG_CODE_ZQX" }));
    ddbSend.mockRejectedValueOnce(new Error("DDB down"));
    await handler(makeEvent({ code: ADMIN_CODE }));

    const logged = [logSpy, errSpy]
      .flatMap((spy) => spy.mock.calls)
      .flat()
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" | ");

    for (const value of [ADMIN_CODE, "SENTINEL_WRONG_CODE_ZQX", "How do I support my daughter?", "jane@example.com"]) {
      expect(logged, `leaked: ${value}`).not.toContain(value);
    }

    logSpy.mockRestore();
    errSpy.mockRestore();
  });
});
