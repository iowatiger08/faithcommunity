/**
 * Tests for the private forum-questions admin view.
 *
 * The important properties: nothing is fetched until Cognito has signed someone
 * in, the ID token travels in the Authorization header, held items are visibly
 * separated from the list that gets read aloud, and there is always a way to
 * sign out of a session that reads every disclosure in the table.
 */
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ForumAdmin from "./ForumAdmin";

vi.mock("~/components/PageHead", () => ({ default: () => null }));

const { authMock } = vi.hoisted(() => ({
  authMock: {
    signIn: vi.fn(),
    signOut: vi.fn(),
    getIdToken: vi.fn(),
    currentAllowedUser: vi.fn(),
  },
}));
vi.mock("~/lib/auth", () => authMock);

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

const TOKEN = "header.payload.signature";
const EMAIL = "iowatiger08@gmail.com";
const PASSWORD = "not-the-real-password";

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

const setField = (matcher: RegExp, value: string) =>
  fireEvent.change(screen.getByLabelText(matcher), { target: { value } });

/** Sign in through the form and let the listing request settle. */
async function signIn(body: unknown = { ok: true, count: 2, questions, held: [] }) {
  mockFetch.mockResolvedValueOnce(okJson(body));
  setField(/email/i, EMAIL);
  setField(/password/i, PASSWORD);
  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
  await waitFor(() => expect(mockFetch).toHaveBeenCalled());
}

beforeEach(() => {
  mockFetch.mockReset();
  authMock.signIn.mockReset().mockResolvedValue(undefined);
  authMock.signOut.mockReset();
  authMock.getIdToken.mockReset().mockResolvedValue(TOKEN);
  // Default: no session cached in the browser, so the form is shown.
  authMock.currentAllowedUser.mockReset().mockResolvedValue(false);
});

afterEach(cleanup);

describe("the gate", () => {
  it("asks for the Cognito email and password, and fetches nothing up front", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("signs in through Cognito rather than posting a shared code", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn();

    expect(authMock.signIn).toHaveBeenCalledWith(EMAIL, PASSWORD);
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/admin\/questions$/);
    expect(init.method).toBe("POST");
    expect(JSON.parse((init.body as string) || "{}")).not.toHaveProperty("code");
  });

  it("sends the ID token as a bearer header, never in the URL or body", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn();

    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe(`Bearer ${TOKEN}`);
    expect(url).not.toContain(TOKEN);
    expect(init.body ?? "").not.toContain(TOKEN);
  });

  it("never puts the password in the request", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn();

    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = typeof init.body === "string" ? init.body : "";
    expect(`${url} ${body} ${JSON.stringify(init.headers)}`).not.toContain(PASSWORD);
  });

  it("masks the password as it is typed", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/password/i)).toBeTruthy());
    expect(screen.getByLabelText(/password/i).getAttribute("type")).toBe("password");
  });

  it("shows what Cognito said when the sign-in fails, and fetches nothing", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    authMock.signIn.mockRejectedValueOnce(new Error("Incorrect username or password."));

    setField(/email/i, EMAIL);
    setField(/password/i, "wrong");
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(screen.getByText(/incorrect username or password/i)).toBeTruthy());
    expect(mockFetch).not.toHaveBeenCalled();
    expect(screen.queryByText(/How do I support my daughter/)).toBeNull();
  });

  it("surfaces a server refusal of an account that is not the owner", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    mockFetch.mockResolvedValueOnce(
      okJson({ ok: false, error: "That account cannot read the questions." }, 403)
    );
    setField(/email/i, "someone.else@example.com");
    setField(/password/i, PASSWORD);
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(screen.getByText(/cannot read the questions/i)).toBeTruthy());
    expect(screen.queryByText(/How do I support my daughter/)).toBeNull();
  });

  it("resumes a cached Cognito session without asking for the password again", async () => {
    authMock.currentAllowedUser.mockResolvedValue(true);
    mockFetch.mockResolvedValueOnce(okJson({ ok: true, count: 2, questions, held: [] }));
    renderAdmin();

    await waitFor(() => expect(screen.getByText(/How do I support my daughter/)).toBeTruthy());
    expect(screen.queryByLabelText(/password/i)).toBeNull();
    expect(authMock.signIn).not.toHaveBeenCalled();
  });

  it("drops back to the sign-in form when the token has expired", async () => {
    authMock.currentAllowedUser.mockResolvedValue(true);
    mockFetch.mockResolvedValueOnce(
      okJson({ ok: false, error: "Your session has expired. Sign in again." }, 401)
    );
    renderAdmin();

    await waitFor(() => expect(screen.getByText(/session has expired/i)).toBeTruthy());
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
  });
});

describe("the session", () => {
  it("offers a sign-out that clears it and hides the questions", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn();
    await waitFor(() => expect(screen.getByText(/How do I support my daughter/)).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => expect(screen.getByLabelText(/password/i)).toBeTruthy());
    expect(authMock.signOut).toHaveBeenCalled();
    expect(screen.queryByText(/How do I support my daughter/)).toBeNull();
  });

  it("says that the session is remembered on this device", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    expect(screen.getByText(/stays signed in on this device/i)).toBeTruthy();
  });
});

describe("the listing", () => {
  it("renders each question newest-first, as the server ordered them", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn();
    await waitFor(() => expect(screen.getByText(/How do I support my daughter/)).toBeTruthy());
    expect(screen.getByText(/Am I still loved by God/)).toBeTruthy();

    const rendered = screen.getAllByText(/#(aaaaaaaa|bbbbbbbb)/).map((el) => el.textContent);
    expect(rendered).toEqual(["#aaaaaaaa", "#bbbbbbbb"]);
  });

  it("shows the submitter for a named question", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn();
    await waitFor(() => expect(screen.getByText("Jane Doe", { exact: false })).toBeTruthy());
    expect(screen.getByText("jane@example.com")).toBeTruthy();
  });

  it("shows an anonymous question as Anonymous with no contact details", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn();
    await waitFor(() => expect(screen.getByText(/^Anonymous$/)).toBeTruthy());
  });

  it("says so plainly when nothing has been submitted", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn({ ok: true, count: 0, questions: [], held: [] });
    await waitFor(() => expect(screen.getByText(/no questions yet/i)).toBeTruthy());
  });
});

describe("held items", () => {
  it("separates them from the main list but keeps their full text", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn({ ok: true, count: 2, questions, held });
    await waitFor(() => expect(screen.getByText(/held for review/i)).toBeTruthy());

    expect(screen.getByText("A flagged message.")).toBeTruthy();
    expect(screen.getByText(/VIOLENCE_OR_THREAT:0.97/)).toBeTruthy();
  });

  it("warns that the screening is often wrong on this subject", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn({ ok: true, count: 2, questions, held });
    await waitFor(() => expect(screen.getByText(/often wrong/i)).toBeTruthy());
  });

  it("shows no held section when there is nothing held", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeTruthy());
    await signIn();
    await waitFor(() => expect(screen.getByText(/How do I support my daughter/)).toBeTruthy());
    expect(screen.queryByText(/held for review/i)).toBeNull();
  });
});
