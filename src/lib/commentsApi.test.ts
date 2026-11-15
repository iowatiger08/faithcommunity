import { vi, describe, it, expect, beforeEach } from "vitest";
import { api, ApiError, errorMessage } from "./commentsApi";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubEnv("VITE_COMMENTS_API_URL", "https://api.example");
  fetchMock.mockReset().mockResolvedValue({ ok: true, json: () => Promise.resolve({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
});

const lastCall = () => fetchMock.mock.calls.at(-1) as [string, RequestInit];

describe("api", () => {
  it("reads the public thread without a token and the personal one with it", async () => {
    await api.thread("a post", null);
    expect(lastCall()[0]).toBe("https://api.example/posts/a%20post");
    expect(lastCall()[1].headers).toEqual({});
    await api.thread("p", "tok");
    expect(lastCall()[0]).toBe("https://api.example/posts/p/mine");
    expect(lastCall()[1].headers).toEqual({ Authorization: "Bearer tok" });
  });

  it("sends JSON bodies for writes", async () => {
    await api.post("tok", "p", "sermons", "hi");
    expect(lastCall()[1]).toMatchObject({
      method: "POST",
      body: JSON.stringify({ section: "sermons", body: "hi" }),
      headers: { Authorization: "Bearer tok", "Content-Type": "application/json" },
    });
    await api.post("tok", "p", "sermons", "hi", "c1");
    expect(JSON.parse(lastCall()[1].body as string)).toMatchObject({ parentId: "c1" });
  });

  it("maps every call to its route and method", async () => {
    const cases: [() => Promise<unknown>, string, string][] = [
      [() => api.edit("t", "c1", "x"), "/comments/c1", "PATCH"],
      [() => api.remove("t", "c1"), "/comments/c1", "DELETE"],
      [() => api.report("t", "c1"), "/comments/c1/report", "POST"],
      [() => api.react("t", "p", "sermons", "pray", true), "/posts/p/reactions/pray", "PUT"],
      [() => api.react("t", "p", "sermons", "pray", false), "/posts/p/reactions/pray", "DELETE"],
      [() => api.me("t"), "/me", "GET"],
      [() => api.setName("t", "Ruth"), "/me", "PUT"],
      [() => api.deleteAccount("t"), "/me", "DELETE"],
      [() => api.held("t"), "/admin/held", "GET"],
      [() => api.moderate("t", "c1", "remove"), "/admin/comments/c1", "PUT"],
      [() => api.suspend("t", "s1", true), "/admin/users/s1", "PUT"],
    ];
    for (const [fn, path, method] of cases) {
      await fn();
      expect(lastCall()[0]).toBe(`https://api.example${path}`);
      expect(lastCall()[1].method).toBe(method);
    }
  });

  it("throws an ApiError with the server's code", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 429, json: () => Promise.resolve({ error: "slow_down" }) });
    await expect(api.me("t")).rejects.toMatchObject({ status: 429, code: "slow_down" });
  });

  it("copes with an error response that isn't JSON", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 502, json: () => Promise.reject(new Error("html")) });
    await expect(api.me("t")).rejects.toMatchObject({ status: 502, code: "request_failed" });
  });
});

describe("errorMessage", () => {
  it("gives a plain message for each known code", () => {
    for (const code of ["slow_down", "suspended", "invalid_body", "invalid_name", "name_not_allowed"]) {
      expect(errorMessage(new ApiError(400, code))).not.toBe("Something went wrong. Please try again.");
    }
    expect(errorMessage(new Error("x"))).toBe("Something went wrong. Please try again.");
  });
});
