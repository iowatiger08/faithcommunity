/**
 * Unit tests for the forum Q&A admin listing Lambda handler.
 * AWS SDK clients and the Cognito verifier are mocked so tests run without
 * credentials or network.
 *
 * This route reads every submission in the table, so the tests concentrate on
 * the gate: only a valid Cognito ID token for the one allowed identity gets
 * through, the retired shared code gets nowhere, an unset allow-list fails
 * closed, and a rejected request never reaches DynamoDB.
 */
import { vi, describe, it, expect, beforeEach } from "vitest";

const { ddbSend, queryInputs, deleteInputs, scanConstructed, verify, verifierOptions } = vi.hoisted(() => ({
  ddbSend: vi.fn(),
  queryInputs: [],
  deleteInputs: [],
  scanConstructed: { count: 0 },
  verify: vi.fn(),
  verifierOptions: [],
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
  DeleteCommand: class {
    constructor(input) {
      this.input = input;
      deleteInputs.push(input);
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
vi.mock("aws-jwt-verify", () => ({
  CognitoJwtVerifier: {
    create: (options) => {
      verifierOptions.push(options);
      return { verify };
    },
  },
}));

import { handler } from "./index.mjs";

const OWNER_SUB = "c831f380-7071-7082-6ecc-6110e068d744";
const OTHER_SUB = "e8319310-2001-70e0-897f-4d872634c576";
const OWNER_EMAIL = "iowatiger08@gmail.com";
const TOKEN = "header.payload.signature";
const RETIRED_CODE = "s7K2vQp9RtZx4LmW8bNcH3Yd";
const FORUM_ID = "windsor-heights-2026-10";

let ipCounter = 0;
const freshIp = () => `10.1.${Math.floor(++ipCounter / 256)}.${ipCounter % 256}`;

function makeEvent({
  token = TOKEN,
  body = {},
  ip = freshIp(),
  method = "POST",
  origin = "https://hopeandtruthministry.com",
  path = "/forum/admin/questions",
} = {}) {
  const headers = {};
  if (origin !== null) headers.origin = origin;
  if (token !== null) headers.authorization = `Bearer ${token}`;
  return {
    requestContext: { http: { method, path, sourceIp: ip } },
    rawPath: path,
    headers,
    body: JSON.stringify(body),
  };
}

const SK = "2026-10-21T08:00:00.000Z#cccccccc";

/** A request to the delete route. */
const deleteEvent = (body = { sk: SK }, opts = {}) =>
  makeEvent({ ...opts, body, path: "/forum/admin/delete" });

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
  process.env.FORUM_ADMIN_SUB = OWNER_SUB;
  process.env.COGNITO_USER_POOL_ID = "us-west-2_OMwj6Yfpn";
  process.env.COGNITO_CLIENT_ID = "5p01qepq8kh9qfuji1occiud19";
  process.env.FORUM_ID = FORUM_ID;
  process.env.FORUM_TABLE = "forum-questions-test";
  queryInputs.length = 0;
  deleteInputs.length = 0;
  scanConstructed.count = 0;
  ddbSend.mockReset().mockResolvedValue({ Items: items });
  verify.mockReset().mockResolvedValue({ sub: OWNER_SUB, email: OWNER_EMAIL, token_use: "id" });
});

describe("the gate", () => {
  it("returns the questions for the owner's Cognito ID token", async () => {
    const res = await handler(makeEvent());
    expect(res.statusCode).toBe(200);
    const body = parse(res);
    expect(body.ok).toBe(true);
    expect(body.count).toBe(2);
    expect(body.questions).toHaveLength(2);
  });

  it("verifies the token as an ID token for this pool and client", async () => {
    await handler(makeEvent());
    expect(verify).toHaveBeenCalledWith(TOKEN);
    expect(verifierOptions[0]).toMatchObject({
      userPoolId: "us-west-2_OMwj6Yfpn",
      clientId: "5p01qepq8kh9qfuji1occiud19",
      tokenUse: "id",
    });
  });

  it("rejects a request with no bearer token without touching DynamoDB", async () => {
    const res = await handler(makeEvent({ token: null }));
    expect(res.statusCode).toBe(401);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("rejects an invalid or expired token", async () => {
    verify.mockRejectedValue(new Error("Token expired"));
    const res = await handler(makeEvent());
    expect(res.statusCode).toBe(401);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("rejects another member of the same user pool", async () => {
    // The pool is shared with a neighborhood app; a valid token from one of
    // those users must not read a single disclosure here.
    verify.mockResolvedValue({ sub: OTHER_SUB, email: "neighbor@example.com", token_use: "id" });
    const res = await handler(makeEvent());
    expect(res.statusCode).toBe(403);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("no longer accepts the retired shared admin code", async () => {
    const res = await handler(makeEvent({ token: null, body: { code: RETIRED_CODE } }));
    expect(res.statusCode).toBe(401);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("fails CLOSED when no allowed identity is configured", async () => {
    process.env.FORUM_ADMIN_SUB = "";
    const res = await handler(makeEvent());
    expect(res.statusCode).toBe(403);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("throttles repeated rejected attempts from one IP", async () => {
    verify.mockRejectedValue(new Error("Invalid token"));
    const ip = freshIp();
    for (let i = 0; i < 20; i++) await handler(makeEvent({ ip }));
    expect((await handler(makeEvent({ ip }))).statusCode).toBe(429);
  });
});

describe("the query", () => {
  it("uses Query on the forum partition, never Scan", async () => {
    await handler(makeEvent());
    expect(queryInputs).toHaveLength(1);
    expect(queryInputs[0].ExpressionAttributeValues[":forumId"]).toBe(FORUM_ID);
    expect(scanConstructed.count).toBe(0);
  });

  it("asks DynamoDB for newest-first", async () => {
    await handler(makeEvent());
    expect(queryInputs[0].ScanIndexForward).toBe(false);
  });

  it("returns questions newest-first", async () => {
    const body = parse(await handler(makeEvent()));
    expect(body.questions.map((q) => q.questionId)).toEqual(["aaaaaaaa", "bbbbbbbb"]);
  });
});

describe("the response", () => {
  it("separates held items from the main list", async () => {
    const body = parse(await handler(makeEvent()));
    expect(body.questions.map((q) => q.status)).not.toContain("held");
    expect(body.held).toHaveLength(1);
  });

  it("includes the full text and reason for a held item", async () => {
    const body = parse(await handler(makeEvent()));
    expect(body.held[0].question).toBe("A threatening message.");
    expect(body.held[0].flagReason).toBe("VIOLENCE_OR_THREAT:0.97");
  });

  it("returns anonymous items with no name or email", async () => {
    const body = parse(await handler(makeEvent()));
    const anon = body.questions.find((q) => q.anonymous);
    expect("name" in anon).toBe(false);
    expect("email" in anon).toBe(false);
  });

  it("is not cacheable", async () => {
    const res = await handler(makeEvent());
    expect(res.headers["Cache-Control"]).toBe("no-store");
  });

  it("allows the Authorization header through CORS", async () => {
    const res = await handler(makeEvent({ method: "OPTIONS" }));
    expect(res.headers["Access-Control-Allow-Headers"]).toContain("Authorization");
  });

  it("handles an empty table", async () => {
    ddbSend.mockResolvedValue({});
    const body = parse(await handler(makeEvent()));
    expect(body.count).toBe(0);
    expect(body.questions).toEqual([]);
    expect(body.held).toEqual([]);
  });
});

describe("failure modes", () => {
  it("returns 500 with no partial data when the query fails", async () => {
    ddbSend.mockRejectedValue(new Error("DynamoDB down"));
    const res = await handler(makeEvent());
    expect(res.statusCode).toBe(500);
    expect(parse(res).questions).toBeUndefined();
  });

  it("answers OPTIONS preflight without a token", async () => {
    expect((await handler(makeEvent({ token: null, method: "OPTIONS" }))).statusCode).toBe(200);
  });

  it("rejects a cross-site POST", async () => {
    expect((await handler(makeEvent({ origin: "https://evil.example" }))).statusCode).toBe(403);
  });
});

describe("deleting a question", () => {
  it("deletes the one item the owner named", async () => {
    ddbSend.mockResolvedValue({});
    const res = await handler(deleteEvent());
    expect(res.statusCode).toBe(200);
    expect(parse(res)).toMatchObject({ ok: true, deleted: SK });
    expect(deleteInputs).toHaveLength(1);
    expect(deleteInputs[0].Key).toEqual({ forumId: FORUM_ID, sk: SK });
    // Deleting must not also read the table.
    expect(queryInputs).toHaveLength(0);
  });

  it("only deletes an item that is actually there, so a stale page cannot lie", async () => {
    ddbSend.mockResolvedValue({});
    await handler(deleteEvent());
    expect(deleteInputs[0].ConditionExpression).toMatch(/attribute_exists/);
  });

  it("reports a question that has already gone rather than claiming success", async () => {
    ddbSend.mockRejectedValue(
      Object.assign(new Error("The conditional request failed"), {
        name: "ConditionalCheckFailedException",
      })
    );
    const res = await handler(deleteEvent());
    expect(res.statusCode).toBe(404);
    expect(parse(res).ok).toBe(false);
  });

  it("refuses a delete with no bearer token", async () => {
    const res = await handler(deleteEvent({ sk: SK }, { token: null }));
    expect(res.statusCode).toBe(401);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("refuses another member of the same user pool", async () => {
    verify.mockResolvedValue({ sub: OTHER_SUB, email: "neighbor@example.com", token_use: "id" });
    const res = await handler(deleteEvent());
    expect(res.statusCode).toBe(403);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("fails CLOSED when no allowed identity is configured", async () => {
    process.env.FORUM_ADMIN_SUB = "";
    const res = await handler(deleteEvent());
    expect(res.statusCode).toBe(403);
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("rejects a key it did not issue, rather than passing it to DynamoDB", async () => {
    for (const sk of [undefined, "", 7, "not-a-key", "2026-10-21T08:00:00.000Z", `${SK} OR 1=1`]) {
      const res = await handler(deleteEvent({ sk }));
      expect(res.statusCode, `accepted: ${String(sk)}`).toBe(400);
    }
    expect(ddbSend).not.toHaveBeenCalled();
  });

  it("never deletes outside this forum's partition", async () => {
    ddbSend.mockResolvedValue({});
    await handler(deleteEvent({ sk: SK, forumId: "some-other-forum" }));
    // The partition comes from the function's own config, never the request.
    expect(deleteInputs[0].Key.forumId).toBe(FORUM_ID);
  });

  it("returns 500 when DynamoDB fails for any other reason", async () => {
    ddbSend.mockRejectedValue(new Error("DynamoDB down"));
    const res = await handler(deleteEvent());
    expect(res.statusCode).toBe(500);
    expect(parse(res).ok).toBe(false);
  });

  it("answers OPTIONS preflight on the delete route without a token", async () => {
    const res = await handler(deleteEvent({}, { token: null, method: "OPTIONS" }));
    expect(res.statusCode).toBe(200);
  });

  it("rejects a cross-site delete", async () => {
    const res = await handler(deleteEvent({ sk: SK }, { origin: "https://evil.example" }));
    expect(res.statusCode).toBe(403);
    expect(ddbSend).not.toHaveBeenCalled();
  });
});

describe("logging", () => {
  it("never writes question content or the token to the logs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await handler(makeEvent());
    verify.mockRejectedValueOnce(new Error("Invalid token"));
    await handler(makeEvent({ token: "SENTINEL.BAD.TOKEN" }));
    ddbSend.mockRejectedValueOnce(new Error("DDB down"));
    await handler(makeEvent());
    ddbSend.mockResolvedValueOnce({});
    await handler(deleteEvent());

    const logged = [logSpy, errSpy]
      .flatMap((spy) => spy.mock.calls)
      .flat()
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" | ");

    for (const value of [TOKEN, "SENTINEL.BAD.TOKEN", "How do I support my daughter?", "jane@example.com"]) {
      expect(logged, `leaked: ${value}`).not.toContain(value);
    }

    logSpy.mockRestore();
    errSpy.mockRestore();
  });
});
