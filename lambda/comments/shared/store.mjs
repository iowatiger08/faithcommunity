// Thin DynamoDB data layer. Tables and indexes are defined in template.yaml;
// none has a TTL, so nothing here expires on its own.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const T = {
  profiles: () => process.env.PROFILES_TABLE,
  comments: () => process.env.COMMENTS_TABLE,
  reactions: () => process.env.REACTIONS_TABLE,
  reports: () => process.env.REPORTS_TABLE,
  audit: () => process.env.AUDIT_TABLE,
};

async function queryAll(params) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const res = await ddb.send(new QueryCommand({ ...params, ExclusiveStartKey }));
    items.push(...(res.Items ?? []));
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

// ── Profiles ────────────────────────────────────────────────────────────────
export async function getProfile(sub) {
  const { Item } = await ddb.send(new GetCommand({ TableName: T.profiles(), Key: { sub } }));
  return Item ?? null;
}

export async function putProfile(profile) {
  await ddb.send(new PutCommand({ TableName: T.profiles(), Item: profile }));
}

export async function deleteProfile(sub) {
  await ddb.send(new DeleteCommand({ TableName: T.profiles(), Key: { sub } }));
}

// ── Comments ────────────────────────────────────────────────────────────────
export async function getComment(commentId) {
  const { Item } = await ddb.send(
    new GetCommand({ TableName: T.comments(), Key: { commentId } }),
  );
  return Item ?? null;
}

export async function putComment(comment) {
  await ddb.send(new PutCommand({ TableName: T.comments(), Item: comment }));
}

export async function deleteComment(commentId) {
  await ddb.send(new DeleteCommand({ TableName: T.comments(), Key: { commentId } }));
}

/** SET the given fields; `null` values are REMOVEd. Returns the updated item. */
export async function updateComment(commentId, fields) {
  const sets = [];
  const removes = [];
  const names = {};
  const values = {};
  for (const [k, v] of Object.entries(fields)) {
    names[`#${k}`] = k;
    if (v === null) removes.push(`#${k}`);
    else {
      sets.push(`#${k} = :${k}`);
      values[`:${k}`] = v;
    }
  }
  const expr = [sets.length && `SET ${sets.join(", ")}`, removes.length && `REMOVE ${removes.join(", ")}`]
    .filter(Boolean)
    .join(" ");
  const { Attributes } = await ddb.send(
    new UpdateCommand({
      TableName: T.comments(),
      Key: { commentId },
      UpdateExpression: expr,
      ConditionExpression: "attribute_exists(commentId)",
      ExpressionAttributeNames: names,
      ...(sets.length ? { ExpressionAttributeValues: values } : {}),
      ReturnValues: "ALL_NEW",
    }),
  );
  return Attributes;
}

export async function addReport(commentId) {
  const { Attributes } = await ddb.send(
    new UpdateCommand({
      TableName: T.comments(),
      Key: { commentId },
      UpdateExpression: "ADD reportCount :one",
      ConditionExpression: "attribute_exists(commentId)",
      ExpressionAttributeValues: { ":one": 1 },
      ReturnValues: "ALL_NEW",
    }),
  );
  return Attributes;
}

export function listPostComments(postSlug) {
  return queryAll({
    TableName: T.comments(),
    IndexName: "byPost",
    KeyConditionExpression: "postSlug = :p",
    ExpressionAttributeValues: { ":p": postSlug },
  });
}

export function listAuthorComments(authorSub, sinceIso) {
  return queryAll({
    TableName: T.comments(),
    IndexName: "byAuthor",
    KeyConditionExpression: sinceIso
      ? "authorSub = :a AND createdAt >= :since"
      : "authorSub = :a",
    ExpressionAttributeValues: { ":a": authorSub, ...(sinceIso ? { ":since": sinceIso } : {}) },
  });
}

export function listHeld() {
  return queryAll({
    TableName: T.comments(),
    IndexName: "byStatus",
    KeyConditionExpression: "#s = :held",
    ExpressionAttributeNames: { "#s": "status" },
    ExpressionAttributeValues: { ":held": "held" },
  });
}

// ── Reports ─────────────────────────────────────────────────────────────────
/** Records one report per person per comment. Returns false on a repeat. */
export async function putReport(commentId, reporterSub) {
  try {
    await ddb.send(
      new PutCommand({
        TableName: T.reports(),
        Item: { commentId, reporterSub, createdAt: new Date().toISOString() },
        ConditionExpression: "attribute_not_exists(commentId)",
      }),
    );
    return true;
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") return false;
    throw err;
  }
}

export function listReportsBy(reporterSub) {
  return queryAll({
    TableName: T.reports(),
    IndexName: "byReporter",
    KeyConditionExpression: "reporterSub = :r",
    ExpressionAttributeValues: { ":r": reporterSub },
  });
}

export async function deleteReport(commentId, reporterSub) {
  await ddb.send(new DeleteCommand({ TableName: T.reports(), Key: { commentId, reporterSub } }));
}

// ── Reactions ───────────────────────────────────────────────────────────────
export function listPostReactions(postSlug) {
  return queryAll({
    TableName: T.reactions(),
    KeyConditionExpression: "postSlug = :p",
    ExpressionAttributeValues: { ":p": postSlug },
  });
}

export function listUserReactions(sub) {
  return queryAll({
    TableName: T.reactions(),
    IndexName: "bySub",
    KeyConditionExpression: "#u = :s",
    ExpressionAttributeNames: { "#u": "sub" },
    ExpressionAttributeValues: { ":s": sub },
  });
}

export async function putReaction(postSlug, sub, kind) {
  await ddb.send(
    new PutCommand({
      TableName: T.reactions(),
      Item: { postSlug, reactionKey: `${sub}#${kind}`, sub, kind, createdAt: new Date().toISOString() },
    }),
  );
}

export async function deleteReaction(postSlug, sub, kind) {
  await ddb.send(
    new DeleteCommand({ TableName: T.reactions(), Key: { postSlug, reactionKey: `${sub}#${kind}` } }),
  );
}

// ── Audit ───────────────────────────────────────────────────────────────────
export async function audit({ action, actorSub, target }) {
  const at = new Date().toISOString();
  await ddb.send(
    new PutCommand({
      TableName: T.audit(),
      Item: { day: at.slice(0, 10), entryKey: `${at}#${randomUUID()}`, action, actorSub, target, at },
    }),
  );
}
