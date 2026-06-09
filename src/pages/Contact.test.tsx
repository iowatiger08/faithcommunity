import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Contact from "./Contact";

// PageHead uses react-helmet-async which needs a HelmetProvider in tests;
// simpler to just silence it
vi.mock("~/components/PageHead", () => ({ default: () => null }));

const mockFetch = vi.fn();
global.fetch = mockFetch;

function renderContact() {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );
}

function fillForm(
  email = "test@example.com",
  category = "Prayer Request",
  message = "Please hold my family in prayer."
) {
  fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: category },
  });
  fireEvent.change(screen.getByPlaceholderText("Your message…"), {
    target: { value: message },
  });
}

describe("Contact page", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders the required form fields", () => {
    renderContact();
    expect(screen.getByPlaceholderText("you@example.com")).toBeTruthy();
    expect(screen.getByRole("combobox")).toBeTruthy();
    expect(screen.getByPlaceholderText("Your message…")).toBeTruthy();
  });

  it("shows all four category options", () => {
    renderContact();
    const select = screen.getByRole("combobox");
    const options = Array.from((select as HTMLSelectElement).options).map(
      (o) => o.value
    );
    expect(options).toContain("Prayer Request");
    expect(options).toContain("General Question");
    expect(options).toContain("Feedback / Reflection");
    expect(options).toContain("Other");
  });

  it("renders the honeypot field hidden from assistive technology", () => {
    renderContact();
    const honeypot = document.querySelector('input[name="website"]');
    expect(honeypot).toBeTruthy();
    expect(honeypot?.closest('[aria-hidden="true"]')).toBeTruthy();
  });

  it("subscribe checkbox is disabled", () => {
    renderContact();
    const checkbox = document.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });

  it("shows success confirmation after a successful submission", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    renderContact();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Thank you.")).toBeTruthy();
      expect(screen.getByText(/held in care/)).toBeTruthy();
    });
  });

  it("shows error message when fetch rejects", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"));
    renderContact();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeTruthy();
    });
  });

  it("shows error message when the server returns a non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    renderContact();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeTruthy();
    });
  });

  it("sends email, category, message, and honeypot in the request body", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    renderContact();
    fillForm("me@example.com", "General Question", "Hello.");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(screen.getByText("Thank you.")).toBeTruthy());

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    interface ContactBody { email: string; category: string; message: string; website?: string }
    const body = JSON.parse(init.body as string) as ContactBody;
    expect(body.email).toBe("me@example.com");
    expect(body.category).toBe("General Question");
    expect(body.message).toBe("Hello.");
    expect("website" in body).toBe(true);
  });

  it("disables the submit button while sending", async () => {
    let resolveFetch!: (v: unknown) => void;
    mockFetch.mockReturnValueOnce(
      new Promise((r) => { resolveFetch = r; })
    );
    renderContact();
    fillForm();
    const btn = screen.getByRole("button", { name: /send message/i });
    fireEvent.click(btn);

    expect((btn as HTMLButtonElement).disabled).toBe(true);
    resolveFetch({ ok: true });

    await waitFor(() => expect(screen.getByText("Thank you.")).toBeTruthy());
  });
});
