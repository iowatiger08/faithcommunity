/**
 * Tests for the forum Q&A intake page.
 *
 * The anonymity and gate assertions here are the ones that matter: a
 * regression in either would either out someone who asked not to be, or ship
 * the access code to anyone who views source.
 */
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import Forum from "./Forum";

// PageHead uses react-helmet-async which needs a HelmetProvider in tests;
// simpler to just silence it
vi.mock("~/components/PageHead", () => ({ default: () => null }));

const mockFetch = vi.fn();
global.fetch = mockFetch;

function renderForum() {
  return render(
    <MemoryRouter>
      <Forum />
    </MemoryRouter>
  );
}

const okJson = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});

const getQuestionValue = () =>
  screen.getByLabelText<HTMLTextAreaElement>(/your question/i).value;

const isSendingDisabled = () =>
  screen.getByRole<HTMLButtonElement>("button", { name: /sending/i }).disabled;

const setField = (matcher: RegExp, value: string) =>
  fireEvent.change(screen.getByLabelText(matcher), { target: { value } });

const clickButton = (matcher: RegExp) =>
  fireEvent.click(screen.getByRole("button", { name: matcher }));

/** Walk through the access-code gate. */
async function enterGate(token = "tok-123") {
  mockFetch.mockResolvedValueOnce(okJson({ ok: true, token, expiresAt: 1 }));
  setField(/access code/i, "Belong2026");
  clickButton(/continue/i);
  await waitFor(() => expect(screen.getByLabelText(/your question/i)).toBeTruthy());
}

/** The parsed JSON body of the Nth fetch call. */
function requestBody(n = 0): Record<string, unknown> {
  const [, init] = mockFetch.mock.calls[n] as [string, RequestInit];
  return JSON.parse(init.body as string) as Record<string, unknown>;
}

function fillNamed(question = "How do I support my daughter?") {
  setField(/your name/i, "Jane Doe");
  setField(/your email/i, "jane@example.com");
  setField(/your question/i, question);
}

beforeEach(() => {
  mockFetch.mockReset();
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("the public part of the page", () => {
  it("shows the research without needing a code", () => {
    renderForum();
    expect(screen.getByText(/what the research says/i)).toBeTruthy();
    expect(screen.getByText("8.4×")).toBeTruthy();
    expect(screen.getByText(/34% in Iowa/)).toBeTruthy();
  });

  it("names a source and year for every statistic", () => {
    renderForum();
    expect(screen.getAllByText(/The Trevor Project/).length).toBeGreaterThan(5);
    expect(screen.getAllByText(/Family Acceptance Project/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/HRC Foundation/).length).toBeGreaterThan(4);
    expect(screen.getByText(/2013 survey/)).toBeTruthy();
    expect(screen.getAllByText(/PRRI/).length).toBeGreaterThan(0);
  });

  it("shows the HRC figures on faith communities, the ones aimed at a church", () => {
    renderForum();
    expect(screen.getByText(/what young people say about church/i)).toBeTruthy();
    // Religion reported as unfriendly, guilt and shame on coming out, how few
    // are out to their congregation, and how few have supportive faith leaders.
    expect(screen.getByText("63.1%")).toBeTruthy();
    expect(screen.getByText("54.5%")).toBeTruthy();
    expect(screen.getByText("1 in 5")).toBeTruthy();
    expect(screen.getByText("25.9%")).toBeTruthy();
    expect(screen.getAllByText(/least likely to be known/i).length).toBeGreaterThan(0);
  });

  it("is explicit that the HRC faith figures describe Black and Latine youth", () => {
    renderForum();
    // Reporting these as though they covered all young people would misstate
    // the research, so the scope has to be visible on the page.
    expect(screen.getByText(/describe those groups rather than all young people/i)).toBeTruthy();
    expect(screen.getAllByText(/Black and Latine LGBTQ\+ Youth Reports/).length).toBeGreaterThan(0);
  });

  it("shows the HRC coming-out and current-climate figures", () => {
    renderForum();
    expect(screen.getByText("82.7%, but 26.4%")).toBeTruthy();
    expect(screen.getByText("63% and 57%")).toBeTruthy();
    expect(screen.getByText("85%")).toBeTruthy();
    expect(screen.getByText(/August.September 2026/)).toBeTruthy();
  });

  it("puts crisis resources on the page alongside the risk figures", () => {
    renderForum();
    expect(screen.getByText(/Call or text 988/)).toBeTruthy();
  });

  it("shows the gate rather than the question fields initially", () => {
    renderForum();
    expect(screen.getByLabelText(/access code/i)).toBeTruthy();
    expect(screen.queryByLabelText(/your question/i)).toBeNull();
  });
});

describe("the access-code gate", () => {
  it("checks the code on the server instead of comparing it in the browser", async () => {
    renderForum();
    mockFetch.mockResolvedValueOnce(okJson({ ok: true, token: "t" }));
    setField(/access code/i, "Belong2026");
    clickButton(/continue/i);

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/verify$/);
    expect(init.method).toBe("POST");
    expect(requestBody(0).code).toBe("Belong2026");
  });

  it("reveals the question form once the server accepts the code", async () => {
    renderForum();
    await enterGate();
    expect(screen.getByLabelText(/your question/i)).toBeTruthy();
    expect(screen.queryByLabelText(/access code/i)).toBeNull();
  });

  it("keeps the form hidden and explains itself when the code is wrong", async () => {
    renderForum();
    mockFetch.mockResolvedValueOnce(okJson({ ok: false, error: "That code doesn't match." }, 401));
    setField(/access code/i, "nope");
    clickButton(/continue/i);

    await waitFor(() => expect(screen.getByText(/doesn't match/i)).toBeTruthy());
    expect(screen.queryByLabelText(/your question/i)).toBeNull();
  });
});

describe("anonymity", () => {
  it("hides the name and email fields when asked to stay anonymous", async () => {
    renderForum();
    await enterGate();
    expect(screen.getByLabelText(/your name/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("checkbox", { name: /anonymously/i }));
    expect(screen.queryByLabelText(/your name/i)).toBeNull();
    expect(screen.queryByLabelText(/your email/i)).toBeNull();
  });

  it("sends no name or email keys at all for an anonymous question", async () => {
    renderForum();
    await enterGate();

    // Type a name first, THEN go anonymous — the exact sequence that would
    // leak if the page relied on leftover state.
    setField(/your name/i, "Jane Doe");
    setField(/your email/i, "jane@example.com");
    fireEvent.click(screen.getByRole("checkbox", { name: /anonymously/i }));
    setField(/your question/i, "Am I still loved by God?");

    mockFetch.mockResolvedValueOnce(okJson({ ok: true, id: "abc" }));
    clickButton(/send my question/i);

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    const body = requestBody(1);
    expect(body.anonymous).toBe(true);
    expect("name" in body).toBe(false);
    expect("email" in body).toBe(false);
    expect(JSON.stringify(body)).not.toContain("Jane Doe");
    expect(JSON.stringify(body)).not.toContain("jane@example.com");
  });

  it("sends name and email for a named question", async () => {
    renderForum();
    await enterGate("tok-abc");
    fillNamed();

    mockFetch.mockResolvedValueOnce(okJson({ ok: true, id: "abc" }));
    clickButton(/send my question/i);

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    const body = requestBody(1);
    expect(body).toMatchObject({
      token: "tok-abc",
      anonymous: false,
      name: "Jane Doe",
      email: "jane@example.com",
      question: "How do I support my daughter?",
    });
    expect("confirm_url" in body).toBe(true);
  });
});

describe("submitting", () => {
  it("confirms, and offers to take another question", async () => {
    renderForum();
    await enterGate();
    fillNamed("A question.");

    mockFetch.mockResolvedValueOnce(okJson({ ok: true, id: "abc" }));
    clickButton(/send my question/i);

    await waitFor(() => expect(screen.getByText(/your question is in/i)).toBeTruthy());
    expect(screen.getByRole("button", { name: /ask another question/i })).toBeTruthy();
  });

  it("re-gates on an expired session but does NOT lose what was typed", async () => {
    renderForum();
    await enterGate();
    const text = "A long and difficult question I do not want to retype.";
    fillNamed(text);

    mockFetch.mockResolvedValueOnce(okJson({ ok: false, error: "Your session expired." }, 401));
    clickButton(/send my question/i);

    await waitFor(() => expect(screen.getByLabelText(/access code/i)).toBeTruthy());
    expect(screen.getByText(/expired/i)).toBeTruthy();

    mockFetch.mockResolvedValueOnce(okJson({ ok: true, token: "t2" }));
    setField(/access code/i, "Belong2026");
    clickButton(/continue/i);

    await waitFor(() => expect(screen.getByLabelText(/your question/i)).toBeTruthy());
    expect(getQuestionValue()).toBe(text);
  });

  it("surfaces a server error without clearing the question", async () => {
    renderForum();
    await enterGate();
    fillNamed("Keep me.");

    mockFetch.mockResolvedValueOnce(okJson({ ok: false, error: "Please remove any web links." }, 400));
    clickButton(/send my question/i);

    await waitFor(() => expect(screen.getByText(/remove any web links/i)).toBeTruthy());
    expect(getQuestionValue()).toBe("Keep me.");
  });

  it("disables the submit button while sending", async () => {
    renderForum();
    await enterGate();
    fillNamed("A question.");

    let release: (value: unknown) => void = () => {};
    mockFetch.mockReturnValueOnce(new Promise((r) => { release = r; }));
    clickButton(/send my question/i);

    await waitFor(() =>
      expect(isSendingDisabled()).toBe(true)
    );
    release(okJson({ ok: true, id: "abc" }));
  });
});

describe("bot defenses and privacy", () => {
  it("tells people what happens to a submission, before they write it", async () => {
    renderForum();
    await enterGate();
    // The privacy terms have to be visible at the moment of deciding whether
    // to write something hard, not linked from a footer.
    expect(screen.getByText(/only Pastor Tony/i)).toBeTruthy();
    expect(screen.getByText(/without any\s+name attached/i)).toBeTruthy();
    expect(screen.getByText(/ask for yours to be removed/i)).toBeTruthy();
    const hrefs = Array.from(document.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/privacy");
    expect(hrefs).toContain("/care#crisis");
  });

  it("keeps a honeypot field present but hidden from assistive tech", async () => {
    renderForum();
    await enterGate();
    const honeypot = document.querySelector('input[name="confirm_url"]');
    expect(honeypot).toBeTruthy();
    expect(honeypot?.closest('[aria-hidden="true"]')).toBeTruthy();
    expect(honeypot?.getAttribute("tabindex")).toBe("-1");
  });

  it("never persists the code or token to browser storage", async () => {
    renderForum();
    await enterGate("tok-secret");
    setField(/your question/i, "A question.");
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
});

describe("after the cutoff", () => {
  it("closes submissions but keeps the research readable", () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.parse("2026-10-25T17:00:01Z"));
    renderForum();

    expect(screen.getByText(/submissions for this forum are now closed/i)).toBeTruthy();
    expect(screen.queryByLabelText(/access code/i)).toBeNull();
    expect(screen.getByText("8.4×")).toBeTruthy();
  });

  it("is still open just before the cutoff", () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.parse("2026-10-25T16:59:59Z"));
    renderForum();
    expect(screen.getByLabelText(/access code/i)).toBeTruthy();
  });
});
