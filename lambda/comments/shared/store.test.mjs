import { vi, describe, it, expect, beforeEach } from "vitest";

const send = vi.hoisted(() => vi.fn());

const command = vi.hoisted(
  () => (name) =>
    class {
      constructor(input) {
        this.name = name;
        this.input = input;
      }
    },
);

vi.mock("@aws-sdk/client-dynamodb", () => ({ DynamoDBClient: class {} }));
vi.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: { from: () => ({ send }) },
  GetCommand: command("Get"),
  PutCommand: command("Put"),
  UpdateCommand: command("Update"),
  DeleteCommand: command("Delete"),
  QueryCommand: command("Query"),
}));

import * as store from "./store.mjs";

const last = () => send.mock.calls.at(-1)[0];

beforeEach(() => {
  send.mockReset().mockResolvedValue({});
  Object.assign(process.env, {
    PROFILES_TABLE: "profiles",
    COMMENTS_TABLE: "comments",
    REACTIONS_TABLE: "reactions",
    REPORTS_TABLE: "reports",
    AUDIT_TABLE: "audit",
  });
});

describe("profiles", () => {
  it("gets, puts and deletes by sub", async () => {
    expect(await store.getProfile("s")).toBeNull();
    send.mockResolvedValueOnce({ Item: { sub: "s" } });
    expect(await store.getProfile("s")).toEqual({ sub: "s" });
    expect(last().input).toEqual({ TableName: "profiles", Key: { sub: "s" } });
    await store.putProfile({ sub: "s" });
    expect(last()).toMatchObject({ name: "Put", input: { TableName: "profiles" } });
    await store.deleteProfile("s");
    expect(last()).toMatchObject({ name: "Delete", input: { Key: { sub: "s" } } });
  });
});

describe("comments", () => {
  it("gets, puts and deletes by id", async () => {
    expect(await store.getComment("c")).toBeNull();
    send.mockResolvedValueOnce({ Item: { commentId: "c" } });
    expect(await store.getComment("c")).toEqual({ commentId: "c" });
    await store.putComment({ commentId: "c" });
    expect(last().name).toBe("Put");
    await store.deleteComment("c");
    expect(last().input.Key).toEqual({ commentId: "c" });
  });

  it("builds SET and REMOVE clauses from the fields given", async () => {
    send.mockResolvedValueOnce({ Attributes: { commentId: "c", status: "visible" } });
    const out = await store.updateComment("c", { status: "visible", heldReason: null });
    expect(out).toEqual({ commentId: "c", status: "visible" });
    expect(last().input).toMatchObject({
      UpdateExpression: "SET #status = :status REMOVE #heldReason",
      ExpressionAttributeValues: { ":status": "visible" },
      ConditionExpression: "attribute_exists(commentId)",
    });

    await store.updateComment("c", { heldReason: null });
    expect(last().input.UpdateExpression).toBe("REMOVE #heldReason");
    expect(last().input.ExpressionAttributeValues).toBeUndefined();
  });

  it("adds one to the report count", async () => {
    send.mockResolvedValueOnce({ Attributes: { reportCount: 2 } });
    expect(await store.addReport("c")).toEqual({ reportCount: 2 });
    expect(last().input.UpdateExpression).toBe("ADD reportCount :one");
  });

  it("pages through every query result", async () => {
    send
      .mockResolvedValueOnce({ Items: [{ commentId: "a" }], LastEvaluatedKey: { k: 1 } })
      .mockResolvedValueOnce({});
    expect(await store.listPostComments("p")).toEqual([{ commentId: "a" }]);
    expect(send.mock.calls[1][0].input.ExclusiveStartKey).toEqual({ k: 1 });
    expect(last().input.IndexName).toBe("byPost");
  });

  it("queries by author, optionally since a time", async () => {
    await store.listAuthorComments("s");
    expect(last().input.KeyConditionExpression).toBe("authorSub = :a");
    await store.listAuthorComments("s", "2026-11-14T00:00:00Z");
    expect(last().input).toMatchObject({
      IndexName: "byAuthor",
      KeyConditionExpression: "authorSub = :a AND createdAt >= :since",
      ExpressionAttributeValues: { ":a": "s", ":since": "2026-11-14T00:00:00Z" },
    });
  });

  it("lists held comments from the status index", async () => {
    await store.listHeld();
    expect(last().input).toMatchObject({ IndexName: "byStatus", ExpressionAttributeValues: { ":held": "held" } });
  });
});

describe("reports", () => {
  it("records a first report and refuses a repeat", async () => {
    expect(await store.putReport("c", "s")).toBe(true);
    expect(last().input.ConditionExpression).toBe("attribute_not_exists(commentId)");
    send.mockRejectedValueOnce(Object.assign(new Error("x"), { name: "ConditionalCheckFailedException" }));
    expect(await store.putReport("c", "s")).toBe(false);
  });

  it("rethrows other errors", async () => {
    send.mockRejectedValueOnce(new Error("throttled"));
    await expect(store.putReport("c", "s")).rejects.toThrow("throttled");
  });

  it("lists and deletes a reporter's reports", async () => {
    await store.listReportsBy("s");
    expect(last().input.IndexName).toBe("byReporter");
    await store.deleteReport("c", "s");
    expect(last().input.Key).toEqual({ commentId: "c", reporterSub: "s" });
  });
});

describe("reactions", () => {
  it("keys reactions by person and kind within a post", async () => {
    await store.putReaction("p", "s", "pray");
    expect(last().input.Item).toMatchObject({ postSlug: "p", reactionKey: "s#pray", sub: "s", kind: "pray" });
    await store.deleteReaction("p", "s", "pray");
    expect(last().input.Key).toEqual({ postSlug: "p", reactionKey: "s#pray" });
    await store.listPostReactions("p");
    expect(last().input.TableName).toBe("reactions");
    await store.listUserReactions("s");
    expect(last().input.IndexName).toBe("bySub");
  });
});

describe("audit", () => {
  it("writes a dated entry", async () => {
    await store.audit({ action: "a", actorSub: "s", target: "t" });
    expect(last().input.Item).toMatchObject({ action: "a", actorSub: "s", target: "t" });
    expect(last().input.Item.day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
