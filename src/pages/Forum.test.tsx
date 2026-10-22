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
    expect(screen.getByRole("heading", { name: /what the research says/i })).toBeTruthy();
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
    expect(screen.getByRole("heading", { name: /what young people say about church/i })).toBeTruthy();
    // Religion reported as unfriendly, guilt and shame on coming out, how few
    // are out to their congregation, and how few have supportive faith leaders.
    expect(screen.getByText("63.1%")).toBeTruthy();
    expect(screen.getByText("54.5%")).toBeTruthy();
    expect(screen.getByText("20.1%")).toBeTruthy();
    expect(screen.getByText("25.9%")).toBeTruthy();
  });

  it("is explicit that the HRC faith figures describe Black and Latine youth", () => {
    renderForum();
    // Reporting these as though they covered all young people would misstate
    // the research, so the scope has to be visible on the page.
    expect(screen.getByText(/describe those groups rather than all young people/i)).toBeTruthy();
    expect(screen.getAllByText(/Black and Latine LGBTQ\+ Youth Reports/).length).toBeGreaterThan(0);
    // The surveys never recorded a denomination, so the page must say the
    // figures cannot be read as being about any particular church.
    expect(
      screen.getByText(/nothing about any particular church, denomination, or community/i)
    ).toBeTruthy();
  });

  it("shows the HRC coming-out and current-climate figures", () => {
    renderForum();
    expect(screen.getByText("82.7%")).toBeTruthy();
    expect(screen.getByText("63% and 57%")).toBeTruthy();
    expect(screen.getByText("85%")).toBeTruthy();
    expect(screen.getByText(/August.September 2026/)).toBeTruthy();
  });

  it("covers work, not just youth", () => {
    renderForum();
    expect(screen.getByRole("heading", { name: /^At work$/ })).toBeTruthy();
    expect(screen.getByText("47%")).toBeTruthy();
    expect(screen.getByText("39% vs. 12%")).toBeTruthy();
    expect(screen.getAllByText(/Williams Institute/).length).toBeGreaterThan(2);
    // Bostock made this federal law; the Iowa repeal is the local counterpoint.
    expect(screen.getByText(/Bostock v. Clayton County/)).toBeTruthy();
    expect(screen.getByText(/removed gender identity from the Iowa Civil Rights/i)).toBeTruthy();
  });

  it("is precise about what Iowa law still protects", () => {
    renderForum();
    // Sexual orientation was NOT repealed, and federal employment protection
    // survives. Overstating the repeal would be its own kind of misinformation.
    expect(screen.getByText(/Sexual orientation remains protected under Iowa law/i)).toBeTruthy();
  });

  it("covers growing older, where most of the congregation actually is", () => {
    renderForum();
    expect(screen.getByRole("heading", { name: /^Growing older$/ })).toBeTruthy();
    expect(screen.getByText(/3 million/)).toBeTruthy();
    expect(screen.getByText(/2× and 4×/)).toBeTruthy();
    expect(screen.getByText("82%")).toBeTruthy();
    expect(screen.getAllByText(/SAGE/).length).toBeGreaterThan(2);
  });

  it("covers marriage acceptance, including that it can move backwards", () => {
    renderForum();
    expect(screen.getByRole("heading", { name: /^Marriage$/ })).toBeTruthy();
    expect(screen.getByText("65%")).toBeTruthy();
    expect(screen.getByText("87% / 67% / 37%")).toBeTruthy();
    expect(screen.getAllByText(/Gallup/).length).toBeGreaterThan(2);
    // The mainline figure moved here from the faith group; it should appear once.
    expect(screen.getAllByText("76%")).toHaveLength(1);
  });

  it("frames the page as covering a whole life, not only adolescence", () => {
    renderForum();
    expect(screen.getByText(/happens over a lifetime/i)).toBeTruthy();
  });

  it("puts crisis resources on the page alongside the risk figures", () => {
    renderForum();
    expect(screen.getByText(/Call or text 988/)).toBeTruthy();
  });

  it("offers a jump list, and every section can be returned from", () => {
    const { container } = renderForum();
    const nav = container.querySelector('nav[aria-label="On this page"]');
    expect(nav).toBeTruthy();

    // Every anchor in the jump list must point at a section that exists.
    const targets = Array.from(nav!.querySelectorAll("a")).map((a) =>
      (a.getAttribute("href") ?? "").replace("#", "")
    );
    expect(targets.length).toBeGreaterThan(8);
    expect(targets.every((id) => id.length > 0)).toBe(true);
    for (const id of targets) {
      expect(container.querySelector(`section#${id}`), `no section #${id}`).toBeTruthy();
    }

    // ...and every one of those sections offers a way back.
    expect(container.querySelectorAll('a[href="#top"]').length).toBe(targets.length);
    expect(container.querySelector("#top")).toBeTruthy();
  });

  it("says plainly that the page is still a work in progress", () => {
    renderForum();
    expect(screen.getByText(/a work in progress/i)).toBeTruthy();
    // And reassures people the form itself is not provisional.
    expect(screen.getByText(/anything you send is already saved/i)).toBeTruthy();
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

  it("withholds the name by default, and says so in the payload", async () => {
    renderForum();
    await enterGate();
    fillNamed();

    // The box starts unticked: doing nothing is the safe choice.
    const box = screen.getByRole("checkbox", { name: /may use my name/i });
    expect((box as HTMLInputElement).checked).toBe(false);

    mockFetch.mockResolvedValueOnce(okJson({ ok: true, id: "abc" }));
    clickButton(/send my question/i);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    expect(requestBody(1).allowName).toBe(false);
    // They shared a name even though they withheld permission to use it, so
    // the confirmation thanks them for it rather than calling them anonymous.
    expect(screen.getByText(/thank you for sharing your name/i)).toBeTruthy();
    expect(screen.queryByText(/that will remain/i)).toBeNull();
  });

  it("sends permission when the box is ticked, and confirms it back", async () => {
    renderForum();
    await enterGate();
    fillNamed();
    fireEvent.click(screen.getByRole("checkbox", { name: /may use my name/i }));

    mockFetch.mockResolvedValueOnce(okJson({ ok: true, id: "abc" }));
    clickButton(/send my question/i);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    expect(requestBody(1).allowName).toBe(true);
    // Permission to use the name is not a promise to use it, so the
    // confirmation thanks them for sharing it rather than saying it will be
    // used.
    expect(screen.getByText(/thank you for sharing your name/i)).toBeTruthy();
  });

  it("hides the permission box, and revokes it, when going anonymous", async () => {
    renderForum();
    await enterGate();
    fireEvent.click(screen.getByRole("checkbox", { name: /may use my name/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /anonymously/i }));

    expect(screen.queryByRole("checkbox", { name: /may use my name/i })).toBeNull();
    setField(/your question/i, "Am I still loved by God?");
    mockFetch.mockResolvedValueOnce(okJson({ ok: true, id: "abc" }));
    clickButton(/send my question/i);

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    // An anonymous submission must not carry stale permission from before.
    expect(requestBody(1).allowName).toBeUndefined();
    // Anonymous is a guarantee the server enforces, so say so plainly.
    expect(screen.getByText(/that will remain/i)).toBeTruthy();
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
    expect(screen.getByText(/only Tony/i)).toBeTruthy();
    expect(screen.getByText(/without your name\s+unless you give permission/i)).toBeTruthy();
    expect(screen.getByText(/ask for yours to be\s+deleted/i)).toBeTruthy();
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

describe("the reflections", () => {
  it("credits Tony as the author of both pieces", () => {
    renderForum();
    expect(screen.getByRole("link", { name: /Coming Out Day Reflection/ })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Pride of the Bullied/ })).toBeTruthy();
    // Readers should not have to open a piece to find out who wrote it.
    expect(screen.getAllByText(/By Tony E Hansen/)).toHaveLength(2);
  });
});
