import { describe, it, expect } from "vitest";
import {
  easter,
  firstSundayOfAdvent,
  lectionaryYear,
  liturgicalSeason,
  seasonKey,
  currentSeason,
  parseDate,
  today,
} from "./liturgical";

describe("easter", () => {
  it("computes known Easter dates", () => {
    expect(easter(2024).toISOString().slice(0, 10)).toBe("2024-03-31");
    expect(easter(2025).toISOString().slice(0, 10)).toBe("2025-04-20");
    expect(easter(2026).toISOString().slice(0, 10)).toBe("2026-04-05");
  });
});

describe("firstSundayOfAdvent", () => {
  it("falls in late November or early December and is always a Sunday", () => {
    for (const year of [2023, 2024, 2025]) {
      const d = firstSundayOfAdvent(year);
      const month = d.getUTCMonth() + 1;
      expect([11, 12]).toContain(month); // late November or early December
      expect(d.getUTCDay()).toBe(0); // always a Sunday
    }
  });
});

describe("lectionaryYear", () => {
  it("returns the correct RCL year letter for known dates", () => {
    // Year anchored to Advent 2022 = A (2022 % 3 = 0)
    expect(lectionaryYear(parseDate("2023-04-09"))).toBe("A");
    // Advent 2023 (2023 % 3 = 1 -> B per this implementation)
    expect(lectionaryYear(parseDate("2024-03-31"))).toBe("B");
  });
});

describe("liturgicalSeason", () => {
  it("identifies Lent correctly", () => {
    const result = liturgicalSeason(parseDate("2025-03-05"));
    expect(result.season).toBe("Lent");
    expect(result.days_into_season).toBeGreaterThanOrEqual(0);
    expect(result.approx_week).toBeGreaterThanOrEqual(1);
  });

  it("identifies Easter season", () => {
    const result = liturgicalSeason(parseDate("2025-04-25"));
    expect(result.season).toBe("Easter");
  });

  it("identifies Advent", () => {
    const result = liturgicalSeason(parseDate("2025-12-07"));
    expect(result.season).toBe("Advent");
  });

  it("identifies Ordinary Time after Pentecost", () => {
    const result = liturgicalSeason(parseDate("2025-07-15"));
    expect(result.season).toBe("Ordinary Time (after Pentecost)");
  });

  it("identifies Christmas", () => {
    const result = liturgicalSeason(parseDate("2025-12-25"));
    expect(result.season).toBe("Christmas");
  });
});

describe("seasonKey", () => {
  it("maps season names to theme keys", () => {
    expect(seasonKey("Advent")).toBe("advent");
    expect(seasonKey("Lent")).toBe("lent");
    expect(seasonKey("Easter")).toBe("easter");
    expect(seasonKey("Ordinary Time (after Pentecost)")).toBe("ordinary");
    expect(seasonKey("Epiphany (Ordinary)")).toBe("ordinary");
    expect(seasonKey("unknown")).toBe("ordinary");
  });
});

describe("currentSeason", () => {
  it("returns a valid CurrentSeason shape", () => {
    const s = currentSeason(new Date("2025-06-15"));
    expect(s).toHaveProperty("season");
    expect(s).toHaveProperty("key");
    expect(s).toHaveProperty("label");
    expect(s).toHaveProperty("year");
    expect(["A", "B", "C"]).toContain(s.year);
    expect(["advent", "christmas", "epiphany", "lent", "easter", "pentecost", "ordinary"]).toContain(s.key);
  });

  it("returns ordinary time in summer", () => {
    const s = currentSeason(new Date("2025-08-10"));
    expect(s.key).toBe("ordinary");
  });

  it("returns advent in early December", () => {
    const s = currentSeason(new Date("2025-12-03"));
    expect(s.key).toBe("advent");
  });
});

describe("today", () => {
  it("returns a UTC-midnight date matching the local calendar date", () => {
    const now = new Date("2025-06-15T12:00:00");
    const d = today(now);
    expect(d.getUTCHours()).toBe(0);
    expect(d.getUTCMinutes()).toBe(0);
    expect(d.getUTCFullYear()).toBe(2025);
    expect(d.getUTCMonth() + 1).toBe(6);
    expect(d.getUTCDate()).toBe(15);
  });
});
