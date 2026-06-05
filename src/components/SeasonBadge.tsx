import { useEffect, useState } from "react";
import { currentSeason, type CurrentSeason } from "~/lib/liturgical";

/** Vanderbilt Divinity Library's RCL — the readings for the current season. */
export const VANDERBILT_RCL = "https://lectionary.library.vanderbilt.edu/";

/**
 * Small current-liturgical-season indicator. Computed on the client from
 * today's date (so it stays current between rebuilds) and rendered only after
 * mount to avoid an SSG/hydration mismatch. The dot uses the seasonal accent.
 */
export default function SeasonBadge() {
  const [season, setSeason] = useState<CurrentSeason | null>(null);
  useEffect(() => {
    setSeason(currentSeason());
  }, []);

  if (!season) return null;

  return (
    <a
      href={VANDERBILT_RCL}
      target="_blank"
      rel="noopener noreferrer"
      title={`Liturgical season: ${season.label}, Year ${season.year}. Read the lectionary texts at the Vanderbilt Divinity Library.`}
      className="inline-flex items-center gap-1.5 text-xs text-ink/60 hover:text-accent"
    >
      <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
      <span>
        {season.label} &middot; Year {season.year}
      </span>
    </a>
  );
}
