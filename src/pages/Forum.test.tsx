/**
 * Tests for the retired forum page. The link went out to a congregation, so
 * it stays a real route that explains where the material went.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import Forum from "./Forum";

vi.mock("~/components/PageHead", () => ({ default: () => null }));

function renderForum() {
  return render(
    <MemoryRouter>
      <Forum />
    </MemoryRouter>
  );
}

describe("the retired forum page", () => {
  it("says the page no longer exists", () => {
    renderForum();
    expect(screen.getByRole("heading", { name: /doesn.t exist anymore/i })).toBeTruthy();
  });

  it("links to Queer Resources and home", () => {
    renderForum();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/queer-resources");
    expect(hrefs).toContain("/");
  });

  it("has no form or code field", () => {
    const { container } = renderForum();
    expect(container.querySelector("form")).toBeNull();
    expect(screen.queryByLabelText(/access code/i)).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});
