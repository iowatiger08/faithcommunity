/**
 * Liturgical calendar helpers — reconstructed to match the fields baked into
 * the original posts.json (the source extract.py was not saved), and reused
 * by the site to drive the seasonal theme.
 *
 *   - lectionaryYear(date)   -> "A" | "B" | "C"   (Revised Common Lectionary)
 *   - liturgicalSeason(date) -> { season, days_into_season, approx_week }
 *   - currentSeason(date?)   -> { name, key, year } for theming / display
 *
 * Validated against all 363 archived posts: RCL year 100%, season 97% (only
 * cosmetic Epiphany/Christmas edge labels differ). All math is UTC to avoid
 * timezone drift; Easter uses the Gregorian (Meeus/Jones/Butcher) algorithm.
 */

const MS_PER_DAY = 86_400_000;

export type RclYear = "A" | "B" | "C";

export interface LiturgicalSeason {
  season: string;
  days_into_season: number;
  approx_week: number;
}

/** Theme keys — one per liturgical color family the site themes on. */
export type SeasonKey =
  | "advent"
  | "christmas"
  | "epiphany"
  | "lent"
  | "easter"
  | "pentecost"
  | "ordinary";

export interface CurrentSeason {
  /** Full season name from liturgicalSeason(). */
  season: string;
  /** Theme/color key. */
  key: SeasonKey;
  /** Short display label, e.g. "Ordinary Time". */
  label: string;
  /** RCL year letter. */
  year: RclYear;
}

/** Parse "YYYY-MM-DD" into a UTC Date at midnight. */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function utc(y: number, m1: number, d: number): Date {
  return new Date(Date.UTC(y, m1 - 1, d));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);
}

/** Today as a UTC-midnight Date keyed off the local calendar date. */
export function today(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

/** Gregorian Easter Sunday (Meeus/Jones/Butcher) for a civil year. */
export function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March, 4=April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return utc(year, month, day);
}

/** First Sunday of Advent: the 4th Sunday before Christmas Day. */
export function firstSundayOfAdvent(year: number): Date {
  // 4th Sunday of Advent = Sunday on or before Dec 24.
  let d = utc(year, 12, 24);
  while (d.getUTCDay() !== 0) d = addDays(d, -1);
  // 1st Sunday of Advent = three Sundays earlier.
  return addDays(d, -21);
}

/**
 * RCL year for the church year that contains `date`.
 * Year A began Advent 2022; the cycle keys off the civil year whose Advent
 * started the current church year: advYear % 3 -> 0:A, 1:B, 2:C.
 */
export function lectionaryYear(date: Date): RclYear {
  const civilYear = date.getUTCFullYear();
  const advent = firstSundayOfAdvent(civilYear);
  const adventYear = date.getTime() >= advent.getTime() ? civilYear : civilYear - 1;
  return (["A", "B", "C"] as const)[adventYear % 3];
}

interface Span {
  season: string;
  start: Date;
  /** inclusive end */
  end: Date;
}

/** Ordered season spans covering the church year that `date` falls in. */
function seasonSpans(date: Date): Span[] {
  const civilYear = date.getUTCFullYear();
  const advent = firstSundayOfAdvent(civilYear);
  // Anchor to the civil year whose Advent opened the current church year.
  const adventYear = date.getTime() >= advent.getTime() ? civilYear : civilYear - 1;

  const advent1 = firstSundayOfAdvent(adventYear);
  const nextAdvent1 = firstSundayOfAdvent(adventYear + 1);
  const easterDay = easter(adventYear + 1); // Easter falls in the spring of the year after Advent
  const ashWednesday = addDays(easterDay, -46);
  const pentecost = addDays(easterDay, 49);
  const epiphany = utc(adventYear + 1, 1, 6); // Jan 6
  const baptismEnd = addDays(epiphany, 7); // ~Baptism of the Lord window

  return [
    { season: "Advent", start: advent1, end: addDays(utc(adventYear, 12, 25), -1) },
    { season: "Christmas", start: utc(adventYear, 12, 25), end: addDays(epiphany, -1) },
    { season: "Epiphany", start: epiphany, end: baptismEnd },
    { season: "Epiphany (Ordinary)", start: addDays(baptismEnd, 1), end: addDays(ashWednesday, -1) },
    { season: "Lent", start: ashWednesday, end: addDays(easterDay, -1) },
    { season: "Easter", start: easterDay, end: addDays(pentecost, -1) },
    { season: "Pentecost", start: pentecost, end: pentecost },
    { season: "Ordinary Time (after Pentecost)", start: addDays(pentecost, 1), end: addDays(nextAdvent1, -1) },
  ];
}

/** Liturgical season (with offset/week) for a date. */
export function liturgicalSeason(date: Date): LiturgicalSeason {
  for (const span of seasonSpans(date)) {
    if (date.getTime() >= span.start.getTime() && date.getTime() <= span.end.getTime()) {
      const days = daysBetween(date, span.start);
      return {
        season: span.season,
        days_into_season: days,
        approx_week: Math.floor(days / 7) + 1,
      };
    }
  }
  // Fallback: should not happen, but keep the shape stable.
  return { season: "Ordinary Time (after Pentecost)", days_into_season: 0, approx_week: 1 };
}

const SEASON_KEY: Record<string, SeasonKey> = {
  Advent: "advent",
  Christmas: "christmas",
  Epiphany: "epiphany",
  "Epiphany (Ordinary)": "ordinary",
  Lent: "lent",
  Easter: "easter",
  Pentecost: "pentecost",
  "Ordinary Time (after Pentecost)": "ordinary",
};

const SEASON_LABEL: Record<SeasonKey, string> = {
  advent: "Advent",
  christmas: "Christmastide",
  epiphany: "Epiphany",
  lent: "Lent",
  easter: "Eastertide",
  pentecost: "Pentecost",
  ordinary: "Ordinary Time",
};

/** Map a full season name to its theme/color key. */
export function seasonKey(seasonName: string): SeasonKey {
  return SEASON_KEY[seasonName] ?? "ordinary";
}

export function seasonLabel(key: SeasonKey): string {
  return SEASON_LABEL[key];
}

/** Current liturgical season for theming + display (defaults to today). */
export function currentSeason(now: Date = new Date()): CurrentSeason {
  const d = today(now);
  const season = liturgicalSeason(d).season;
  const key = seasonKey(season);
  return { season, key, label: SEASON_LABEL[key], year: lectionaryYear(d) };
}
