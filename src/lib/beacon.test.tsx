/**
 * Tests for the engagement beacon: one ping per page view, after 10 seconds
 * or once the reader scrolls past 20% of the page, whichever comes first.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useEngagementBeacon } from "./beacon";

const mockFetch = vi.fn();

function Probe() {
  useEngagementBeacon();
  return <Link to="/b">next page</Link>;
}

function renderAt(path = "/sermons/foo") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Probe />
    </MemoryRouter>
  );
}

function scrollTo(y: number, scrollHeight = 2000, innerHeight = 1000) {
  Object.defineProperty(document.body, "scrollHeight", { value: scrollHeight, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: innerHeight, configurable: true });
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  window.dispatchEvent(new Event("scroll"));
}

beforeEach(() => {
  vi.useFakeTimers();
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({});
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("useEngagementBeacon", () => {
  it("pings after 10 seconds with the encoded path", () => {
    renderAt("/sermons/a b");
    vi.advanceTimersByTime(9_999);
    expect(mockFetch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("/_beacon?p=%2Fsermons%2Fa%20b", { keepalive: true });
  });

  it("pings once the reader scrolls past 20%", () => {
    renderAt();
    scrollTo(200); // exactly 20% of 1000 scrollable
    expect(mockFetch).not.toHaveBeenCalled();
    scrollTo(201);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("does not ping twice when scroll fires first and the timer follows", () => {
    renderAt();
    scrollTo(900);
    scrollTo(950);
    vi.advanceTimersByTime(20_000);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("ignores scroll on a page too short to scroll", () => {
    renderAt();
    scrollTo(500, 800, 1000);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("swallows a failed ping", async () => {
    mockFetch.mockRejectedValue(new Error("offline"));
    renderAt();
    vi.advanceTimersByTime(10_000);
    await Promise.resolve();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("resets on navigation so the next page gets its own ping", () => {
    renderAt("/a");
    vi.advanceTimersByTime(5_000);
    fireEvent.click(screen.getByText("next page"));
    vi.advanceTimersByTime(5_000);
    expect(mockFetch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(5_000);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toBe("/_beacon?p=%2Fb");
  });

  it("stops listening after unmount", () => {
    const { unmount } = renderAt();
    unmount();
    vi.advanceTimersByTime(20_000);
    scrollTo(900);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
