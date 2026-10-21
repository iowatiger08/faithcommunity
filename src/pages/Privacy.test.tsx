/**
 * Tests for the privacy notice.
 *
 * These assert the specific promises the page makes, because each one is a
 * claim about what the code does. If a promise here stops being true, this
 * suite should fail rather than the page quietly becoming a lie.
 */
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, afterEach } from "vitest";
import Privacy from "./Privacy";

vi.mock("~/components/PageHead", () => ({ default: () => null }));

function renderPrivacy() {
  return render(
    <MemoryRouter>
      <Privacy />
    </MemoryRouter>
  );
}

afterEach(cleanup);

describe("the promises the page makes", () => {
  it("states that anonymous submissions never carry a name or email", () => {
    renderPrivacy();
    expect(screen.getByText(/Anonymous means anonymous/i)).toBeTruthy();
    expect(screen.getByText(/ignore those fields entirely/i)).toBeTruthy();
  });

  it("states that no IP address is stored with a submission", () => {
    renderPrivacy();
    expect(screen.getByText(/No IP address is stored with any submission/i)).toBeTruthy();
  });

  it("states that forum notification emails carry no question text", () => {
    renderPrivacy();
    expect(screen.getByText(/contains no question text at all/i)).toBeTruthy();
  });

  it("states that nothing expires automatically and deletion is on request", () => {
    renderPrivacy();
    expect(screen.getByText(/Nothing expires automatically/i)).toBeTruthy();
    expect(screen.getByText(/You can ask for yours to be deleted at any time/i)).toBeTruthy();
  });

  it("states that submissions are not used to train AI models", () => {
    renderPrivacy();
    expect(screen.getByText(/used to train AI models/i)).toBeTruthy();
  });

  it("states that forum questions are raised without a name attached", () => {
    renderPrivacy();
    expect(screen.getByText(/without any name attached/i)).toBeTruthy();
  });

  it("discloses that page visits are counted", () => {
    renderPrivacy();
    // The site does run a visit beacon. Claiming "no analytics" would be false.
    expect(screen.getByText(/counts page visits/i)).toBeTruthy();
    expect(screen.getByText(/no third-party analytics scripts/i)).toBeTruthy();
  });
});

describe("the honest limits", () => {
  it("says a web form is not privileged pastoral conversation", () => {
    renderPrivacy();
    expect(screen.getByText(/not confidential pastoral conversation/i)).toBeTruthy();
  });

  it("directs urgent situations to crisis resources rather than the form", () => {
    renderPrivacy();
    expect(screen.getByText(/do not use these forms in an emergency/i)).toBeTruthy();
    expect(screen.getByText(/988/)).toBeTruthy();
  });

  it("discloses the duty to act when someone is in danger", () => {
    renderPrivacy();
    // Stated plainly rather than buried, so nobody discovers it afterwards.
    expect(screen.getByText(/child is being harmed/i)).toBeTruthy();
  });
});

describe("terms for what is submitted", () => {
  it("covers ownership, third parties, harassment, and non-use", () => {
    renderPrivacy();
    expect(screen.getByText(/Terms for what you submit/i)).toBeTruthy();
    expect(screen.getByText(/What you write stays yours/i)).toBeTruthy();
    expect(screen.getByText(/Please write about yourself/i)).toBeTruthy();
    expect(screen.getByText(/Nothing harassing or threatening/i)).toBeTruthy();
    expect(screen.getByText(/Not every question can be used/i)).toBeTruthy();
  });

  it("distinguishes a hard question from a harassing one", () => {
    renderPrivacy();
    // A page about coming out must not leave someone thinking that quoting
    // what was said to them counts as abuse.
    expect(screen.getByText(/quote something cruel/i)).toBeTruthy();
  });

  it("carries a revision date and a no-retroactive-change promise", () => {
    renderPrivacy();
    expect(screen.getByText(/Last updated/i)).toBeTruthy();
    expect(screen.getByText(/apply only going forward/i)).toBeTruthy();
  });
});

describe("navigation", () => {
  it("links to contact, terms, and the crisis resources", () => {
    const { container } = renderPrivacy();
    const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/contact");
    expect(hrefs).toContain("/terms");
    expect(hrefs).toContain("/care#crisis");
  });
});
