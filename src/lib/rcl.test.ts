import { describe, it, expect } from "vitest";
import { makePost } from "~/test/post";
import { rclDayLabel, rclReadings, rclReadingsForDate, VANDERBILT_RCL_DAILY } from "./rcl";
import { parseDate } from "./liturgical";

const TEXTS = "https://lectionary.library.vanderbilt.edu/texts/";

describe("rclDayLabel", () => {
  it.each([
    ["Proper 27 (32)", "Proper 27"],
    ["Reign of Christ - Proper 29 (34)", "Reign of Christ"],
    ["Nativity of the Lord - Proper III", "Christmas Day"],
    ["Nativity of the Lord - Proper I", "Christmas Eve"],
    ["Liturgy of the Palms", "Palm Sunday"],
    ["Resurrection of the Lord", "Easter Day"],
    ["Third Sunday in Lent", "Third Sunday in Lent"],
  ])("%s reads as %s", (name, label) => {
    expect(rclDayLabel(name)).toBe(label);
  });
});

describe("rclReadings", () => {
  it("links a post to the Vanderbilt readings for its Sunday", () => {
    const r = rclReadings(makePost({ published_date: "2026-11-07" }));
    expect(r).toEqual({
      url: `${TEXTS}?y=17134&z=p&d=84`,
      label: "Proper 27, Year A",
    });
  });

  it("uses the year id for Year B and C", () => {
    expect(rclReadings(makePost({ published_date: "2024-06-02" }))?.url).toBe(
      `${TEXTS}?y=18921&z=p&d=58`,
    );
    expect(rclReadings(makePost({ published_date: "2019-01-06" }))?.url).toBe(
      `${TEXTS}?y=19342&z=e&d=12`,
    );
  });

  it("prefers a hand-set rcl_day over the date", () => {
    const r = rclReadings(makePost({ published_date: "2026-04-03", rcl_day: "Good Friday" }));
    expect(r).toEqual({ url: `${TEXTS}?y=17134&z=h&d=39`, label: "Good Friday, Year A" });
  });

  it("returns null when rcl_day is none, unknown, or there is no date", () => {
    expect(rclReadings(makePost({ rcl_day: "none" }))).toBeNull();
    expect(rclReadings(makePost({ rcl_day: "Not a day" }))).toBeNull();
    expect(rclReadings(makePost({ published_date: null }))).toBeNull();
  });
});

describe("rclReadingsForDate", () => {
  it("links the upcoming Sunday", () => {
    expect(rclReadingsForDate(parseDate("2026-11-10"))?.label).toBe("Proper 28, Year A");
  });
});

it("points the daily readings link at Vanderbilt", () => {
  expect(VANDERBILT_RCL_DAILY).toBe("https://lectionary.library.vanderbilt.edu/daily-readings/");
});
