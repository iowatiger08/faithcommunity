/**
 * Tests for the private forum-questions admin view.
 *
 * The important properties: nothing is fetched until the code is accepted,
 * held items are visibly separated from the list that gets read aloud, and the
 * admin code — which reads every disclosure in the table — is never persisted.
 */
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ForumAdmin from "./ForumAdmin";

vi.mock("~/components/PageHead", () => ({ default: () => null }));

const mockFetch = vi.fn();
global.fetch = mockFetch;

function renderAdmin() {
  return render(
    <MemoryRouter>
      <ForumAdmin />
    </MemoryRouter>
  );
}

const okJson = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});

const ADMIN_CODE = "s7K2vQp9RtZx4LmW8bNcH3Yd";

const questions = [
  {
    questionId: "aaaaaaaa",
    submittedAt: "2026-10-23T10:00:00.000Z",
    anonymous: false,
    name: "Jane Doe",
    email: "jane@example.com",
    question: "How do I support my daughter?",
    status: "received",
  },
  {
    questionId: "bbbbbbbb",
    submittedAt: "2026-10-22T09:00:00.000Z",
    anonymous: true,
    question: "Am I still loved by God?",
    status: "received",
  },
];

const held = [
  {
    questionId: "cccccccc",
    submittedAt: "2026-10-21T08:00:00.000Z",
    anonymous: true,
    question: "A flagged message.",
    status: "held",
    flagReason: "VIOLENCE_OR_THREAT:0.97",
  },
];

async function signIn(body: unknown = { ok: true, count: 2, questions, held: [] }) {
  mockFetch.mockResolvedValueOnce(okJson(body));
  fireEvent.change(screen.getByLabelText(/admin code/i), { target: { value: ADMIN_CODE } });
  fireEvent.click(screen.getByRole("button", { name: /show questions/i }));
  await waitFor(() => expect(mockFetch).toHaveBeenCalled());
}

beforeEach(() => {
  mockFetch.mockReset();
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(cleanup);

describe("the gate", () => {
  it("asks for the admin code and fetches nothing up front", () => {
    renderAdmin();
    expect(screen.getByLabelText(/admin code/i)).toBeTruthy();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("posts the code in the request body, not the URL", async () => {
    renderAdmin();
    await signIn();
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/admin\/questions$/);
    expect(url).not.toContain(ADMIN_CODE);
    expect(init.method).toBe("POST");
    expect((JSON.parse(init.body as string) as { code: string }).code).toBe(ADMIN_CODE);
  });

  it("masks the code as it is typed", () => {
    renderAdmin();
    expect(screen.getByLabelText(/admin code/i).getAttribute("type")).toBe("password");
  });

  it("shows an error and no questions when the code is rejected", async () => {
    renderAdmin();
    mockFetch.mockResolvedValueOnce(okJson({ ok: false, error: "Invalid code" }, 401));
    fireEvent.change(screen.getByLabelText(/admin code/i), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /show questions/i }));

    await waitFor(() => expect(screen.getByText(/invalid code/i)).toBeTruthy());
    expect(screen.queryByText(/How do I support my daughter/)).toBeNull();
  });

  it("never persists the admin code to browser storage", async () => {
    renderAdmin();
    await signIn();
    await waitFor(() => expect(screen.getByText(/How do I support my daughter/)).toBeTruthy());
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
});

describe("the listing", () => {
  it("renders each question newest-first, as the server ordered them", async () => {
    renderAdmin();
    await signIn();
    await waitFor(() => expect(screen.getByText(/How do I support my daughter/)).toBeTruthy());
    expect(screen.getByText(/Am I still loved by God/)).toBeTruthy();

    const rendered = screen.getAllByText(/#(aaaaaaaa|bbbbbbbb)/).map((el) => el.textContent);
    expect(rendered).toEqual(["#aaaaaaaa", "#bbbbbbbb"]);
  });

  it("shows the submitter for a named question", async () => {
    renderAdmin();
    await signIn();
    await waitFor(() => expect(screen.getByText("Jane Doe", { exact: false })).toBeTruthy());
    expect(screen.getByText("jane@example.com")).toBeTruthy();
  });

  it("shows an anonymous question as Anonymous with no contact details", async () => {
    renderAdmin();
    await signIn();
    await waitFor(() => expect(screen.getByText(/^Anonymous$/)).toBeTruthy());
  });

  it("says so plainly when nothing has been submitted", async () => {
    renderAdmin();
    await signIn({ ok: true, count: 0, questions: [], held: [] });
    await waitFor(() => expect(screen.getByText(/no questions yet/i)).toBeTruthy());
  });
});

describe("held items", () => {
  it("separates them from the main list but keeps their full text", async () => {
    renderAdmin();
    await signIn({ ok: true, count: 2, questions, held });
    await waitFor(() => expect(screen.getByText(/held for review/i)).toBeTruthy());

    expect(screen.getByText("A flagged message.")).toBeTruthy();
    expect(screen.getByText(/VIOLENCE_OR_THREAT:0.97/)).toBeTruthy();
  });

  it("warns that the screening is often wrong on this subject", async () => {
    renderAdmin();
    await signIn({ ok: true, count: 2, questions, held });
    await waitFor(() => expect(screen.getByText(/often wrong/i)).toBeTruthy());
  });

  it("shows no held section when there is nothing held", async () => {
    renderAdmin();
    await signIn();
    await waitFor(() => expect(screen.getByText(/How do I support my daughter/)).toBeTruthy());
    expect(screen.queryByText(/held for review/i)).toBeNull();
  });
});
