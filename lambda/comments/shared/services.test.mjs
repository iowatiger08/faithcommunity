import { vi, describe, it, expect, beforeEach } from "vitest";

const sends = vi.hoisted(() => ({ comprehend: vi.fn(), ses: vi.fn(), cognito: vi.fn() }));

const command = vi.hoisted(
  () => (name) =>
    class {
      constructor(input) {
        this.name = name;
        this.input = input;
      }
    },
);

vi.mock("@aws-sdk/client-comprehend", () => ({
  ComprehendClient: class {
    send = sends.comprehend;
  },
  DetectToxicContentCommand: command("DetectToxicContent"),
}));
vi.mock("@aws-sdk/client-ses", () => ({
  SESClient: class {
    send = sends.ses;
  },
  SendEmailCommand: command("SendEmail"),
}));
vi.mock("@aws-sdk/client-cognito-identity-provider", () => ({
  CognitoIdentityProviderClient: class {
    send = sends.cognito;
  },
  AdminDeleteUserCommand: command("AdminDeleteUser"),
}));

import { screen, notifyReview, deleteAccount, postExists } from "./services.mjs";

beforeEach(() => {
  for (const s of Object.values(sends)) s.mockReset().mockResolvedValue({});
  process.env.SITE_ORIGIN = "https://hopeandtruthministry.com";
  process.env.RECIPIENT_EMAIL = "owner@example.com";
  process.env.SENDER_EMAIL = "noreply@example.com";
  process.env.USER_POOL_ID = "pool-1";
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("screen", () => {
  it("flags a screened label at or above the threshold", async () => {
    sends.comprehend.mockResolvedValue({
      ResultList: [{ Labels: [{ Name: "INSULT", Score: 0.9 }] }],
    });
    expect(await screen("text")).toEqual({ flagged: true, reason: "INSULT" });
  });

  it("passes low scores and labels it doesn't screen", async () => {
    sends.comprehend.mockResolvedValue({
      ResultList: [{ Labels: [{ Name: "INSULT", Score: 0.2 }, { Name: "OTHER", Score: 0.99 }] }, {}],
    });
    expect(await screen("text")).toEqual({ flagged: false });
    sends.comprehend.mockResolvedValue({});
    expect(await screen("text")).toEqual({ flagged: false });
  });

  it("splits long text so all of it is screened", async () => {
    sends.comprehend.mockResolvedValue({ ResultList: [] });
    await screen("a".repeat(1200));
    const segments = sends.comprehend.mock.calls[0][0].input.TextSegments;
    expect(segments.map((s) => s.Text.length)).toEqual([500, 500, 200]);
  });

  it("fails open when the service errors", async () => {
    sends.comprehend.mockRejectedValue(new Error("down"));
    expect(await screen("text")).toEqual({ flagged: false });
  });
});

describe("notifyReview", () => {
  it("emails a review link without the comment text", async () => {
    await notifyReview("reports");
    const { input } = sends.ses.mock.calls[0][0];
    expect(input.Destination.ToAddresses).toEqual(["owner@example.com"]);
    expect(input.Message.Body.Text.Data).toContain("https://hopeandtruthministry.com/moderation/");
    expect(input.Message.Body.Text.Data).toContain("reports");
  });

  it("swallows a send failure", async () => {
    sends.ses.mockRejectedValue(new Error("nope"));
    await expect(notifyReview("screening")).resolves.toBeUndefined();
  });
});

describe("deleteAccount", () => {
  it("deletes the user from the pool by username", async () => {
    await deleteAccount("ruth@example.com");
    expect(sends.cognito.mock.calls[0][0].input).toEqual({
      UserPoolId: "pool-1",
      Username: "ruth@example.com",
    });
  });
});

describe("postExists", () => {
  it("checks the published page once and caches the answer", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 200 });
    vi.stubGlobal("fetch", fetchMock);
    expect(await postExists("sermons", "cached-post")).toBe(true);
    expect(await postExists("sermons", "cached-post")).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("https://hopeandtruthministry.com/sermons/cached-post/", {
      method: "HEAD",
    });
  });

  it("caches a 404 but retries after a server error", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 404 });
    vi.stubGlobal("fetch", fetchMock);
    expect(await postExists("sermons", "missing-post")).toBe(false);
    expect(await postExists("sermons", "missing-post")).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fetchMock.mockResolvedValue({ status: 503 });
    expect(await postExists("sermons", "flaky-post")).toBe(false);
    expect(await postExists("sermons", "flaky-post")).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("treats a network failure as not found", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await postExists("sermons", "offline-post")).toBe(false);
  });
});
