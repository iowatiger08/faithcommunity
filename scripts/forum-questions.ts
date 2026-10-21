#!/usr/bin/env node
/**
 * Read and delete the forum Q&A submissions, locally.
 *
 * This is the preferred way to read submissions: it goes straight to DynamoDB
 * with your own aws-cli credentials and exposes no public endpoint to the
 * data. The /forum-admin page exists for reading from a phone at church; this
 * is for everything else — and it is the only way to delete.
 *
 * Retention is deliberately manual: the table has no TTL, so nothing expires
 * on its own. Once the forum is done and you have what you need, run
 * --delete-all. These are people's disclosures about their sexuality and their
 * faith; keeping them indefinitely is a choice, so make it on purpose.
 *
 * Usage:
 *   npx tsx scripts/forum-questions.ts              # list received questions
 *   npx tsx scripts/forum-questions.ts --held       # list items held for review
 *   npx tsx scripts/forum-questions.ts --all        # both
 *   npx tsx scripts/forum-questions.ts --json       # raw JSON, for piping
 *   npx tsx scripts/forum-questions.ts --delete-all # delete every submission
 *
 * Requires aws-cli v2 authenticated for the account that owns the stack.
 */

import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

const REGION = "us-west-2";
const TABLE = "blogger-proxy-stack-forum-questions";
const FORUM_ID = process.env.FORUM_ID || "windsor-heights-2026-10";

interface Question {
  questionId: string;
  submittedAt: string;
  anonymous: boolean;
  question: string;
  name?: string;
  email?: string;
  status: string;
  flagReason?: string;
}

function aws(args: string[]): unknown {
  try {
    const out = execFileSync("aws", [...args, "--region", REGION, "--output", "json"], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
    return out.trim() ? JSON.parse(out) : {};
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\naws-cli failed. Are you authenticated for ${REGION}?\n${message}`);
    process.exit(1);
  }
}

function fetchAll(): Question[] {
  const result = aws([
    "dynamodb",
    "query",
    "--table-name",
    TABLE,
    "--key-condition-expression",
    "forumId = :f",
    "--expression-attribute-values",
    JSON.stringify({ ":f": { S: FORUM_ID } }),
    "--no-scan-index-forward",
  ]) as { Items?: Record<string, Record<string, unknown>>[] };

  // Unwrap DynamoDB's attribute-value envelope. Only the handful of types this
  // table actually uses, so a surprise shows up as undefined rather than being
  // silently coerced.
  const unwrap = (av: Record<string, unknown>): unknown =>
    "S" in av ? av.S : "BOOL" in av ? av.BOOL : "N" in av ? Number(av.N) : undefined;

  return (result.Items || []).map((item) => {
    const out: Record<string, unknown> = {};
    for (const [key, av] of Object.entries(item)) out[key] = unwrap(av);
    return out as unknown as Question;
  });
}

function print(questions: Question[], heading: string) {
  console.log(`\n\x1b[1m${heading}\x1b[0m (${questions.length})`);
  if (questions.length === 0) {
    console.log("  — none —");
    return;
  }
  for (const q of questions) {
    const who = q.anonymous
      ? "Anonymous"
      : `${q.name ?? "(no name)"}${q.email ? ` <${q.email}>` : ""}`;
    console.log(`\n  \x1b[2m${q.submittedAt}  #${q.questionId}\x1b[0m`);
    console.log(`  \x1b[1m${who}\x1b[0m`);
    if (q.flagReason) {
      console.log(`  \x1b[33mHELD: ${q.flagReason}\x1b[0m`);
      console.log(`  \x1b[2m(screening is narrow and often wrong here — read it and decide)\x1b[0m`);
    }
    for (const line of q.question.split("\n")) console.log(`    ${line}`);
  }
}

async function deleteAll(questions: Question[]) {
  if (questions.length === 0) {
    console.log("Nothing to delete.");
    return;
  }
  console.log(
    `\nThis permanently deletes \x1b[1m${questions.length}\x1b[0m submitted question(s) from ${TABLE}.`
  );
  console.log("There is no backup — the table has no point-in-time recovery, on purpose.");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`Type the forum id (${FORUM_ID}) to confirm: `);
  rl.close();
  if (answer.trim() !== FORUM_ID) {
    console.log("Not confirmed — nothing deleted.");
    return;
  }
  for (const q of questions) {
    aws([
      "dynamodb",
      "delete-item",
      "--table-name",
      TABLE,
      "--key",
      JSON.stringify({
        forumId: { S: FORUM_ID },
        sk: { S: `${q.submittedAt}#${q.questionId}` },
      }),
    ]);
    console.log(`  deleted #${q.questionId}`);
  }
  console.log(`\nDeleted ${questions.length} question(s).`);
}

async function main() {
  const args = process.argv.slice(2);
  const all = fetchAll();
  const received = all.filter((q) => q.status !== "held");
  const held = all.filter((q) => q.status === "held");

  if (args.includes("--json")) {
    console.log(JSON.stringify({ received, held }, null, 2));
    return;
  }
  if (args.includes("--delete-all")) {
    await deleteAll(all);
    return;
  }
  if (args.includes("--held")) {
    print(held, "Held for review");
    return;
  }
  print(received, "Questions");
  if (args.includes("--all")) print(held, "Held for review");
  else if (held.length > 0) {
    console.log(`\n\x1b[33m${held.length} item(s) held for review — see --held\x1b[0m`);
  }
}

main();
