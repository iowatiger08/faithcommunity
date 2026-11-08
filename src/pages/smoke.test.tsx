/**
 * Smoke test: every page renders inside the site layout without throwing and
 * shows exactly one top-level heading. Catches broken imports and crashes,
 * not behavior; pages with real logic have their own test files.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ComponentType } from "react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Layout from "~/components/Layout";
import About from "./About";
import Care from "./Care";
import CommunitySitting from "./CommunitySitting";
import Counseling from "./Counseling";
import FourNobleTruths from "./FourNobleTruths";
import Give from "./Give";
import Home from "./Home";
import Meditations from "./Meditations";
import NotFound from "./NotFound";
import Ordination from "./Ordination";
import Publications from "./Publications";
import SermonsIndex from "./SermonsIndex";
import Terms from "./Terms";
import WorshipResourcesIndex from "./WorshipResourcesIndex";

vi.mock("~/components/PageHead", () => ({ default: () => null }));

const pages: [string, ComponentType][] = [
  ["Home", Home],
  ["About", About],
  ["Care", Care],
  ["CommunitySitting", CommunitySitting],
  ["Counseling", Counseling],
  ["FourNobleTruths", FourNobleTruths],
  ["Give", Give],
  ["Meditations", Meditations],
  ["NotFound", NotFound],
  ["Ordination", Ordination],
  ["Publications", Publications],
  ["SermonsIndex", SermonsIndex],
  ["Terms", Terms],
  ["WorshipResourcesIndex", WorshipResourcesIndex],
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({}));
});

describe.each(pages)("%s", (_name, Page) => {
  it("renders inside the layout with one h1", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Page />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Hope & Truth Ministry" })).toBeTruthy();
  });
});
