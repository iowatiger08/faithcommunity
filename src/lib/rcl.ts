/**
 * Links from a post to its Revised Common Lectionary readings (NRSVue text)
 * on the Vanderbilt Divinity Library site. The site asks for links only;
 * reading text is never copied onto our pages.
 */
import rclMap from "../../data/rcl-vanderbilt.json";
import { parseDate, rclSunday, type RclYear } from "./liturgical";
import type { PublishedPost } from "./content";

const SITE = "https://lectionary.library.vanderbilt.edu/";
export const VANDERBILT_RCL_DAILY = `${SITE}daily-readings/`;

const map = rclMap as {
  years: Record<RclYear, number>;
  days: Record<string, { z: string; d: number } | undefined>;
};

export interface RclReadings {
  url: string;
  /** e.g. "Proper 27, Year A" */
  label: string;
}

const LABELS: Record<string, string> = {
  "Nativity of the Lord - Proper I": "Christmas Eve",
  "Nativity of the Lord - Proper II": "Christmas Day (dawn)",
  "Nativity of the Lord - Proper III": "Christmas Day",
  "Liturgy of the Palms": "Palm Sunday",
  "Resurrection of the Lord": "Easter Day",
  "Reign of Christ - Proper 29 (34)": "Reign of Christ",
};

/** Short display name for a Vanderbilt day name. */
export function rclDayLabel(name: string): string {
  return LABELS[name] ?? name.replace(/^(Proper \d+) \(\d+\)$/, "$1");
}

function link(name: string, year: RclYear): RclReadings | null {
  const day = map.days[name];
  if (!day) return null;
  return {
    url: `${SITE}texts/?y=${map.years[year]}&z=${day.z}&d=${day.d}`,
    label: `${rclDayLabel(name)}, Year ${year}`,
  };
}

/** Readings for the Sunday on or after `date`. */
export function rclReadingsForDate(date: Date): RclReadings | null {
  const { name, year } = rclSunday(date);
  return link(name, year);
}

/**
 * Readings for a post: its hand-set `rcl_day` if any ("none" turns the link
 * off), otherwise the Sunday on or after its publish date.
 */
export function rclReadings(post: PublishedPost): RclReadings | null {
  if (post.published_date === null || post.rcl_day === "none") return null;
  const date = parseDate(post.published_date);
  if (post.rcl_day != null) return link(post.rcl_day, rclSunday(date).year);
  return rclReadingsForDate(date);
}
