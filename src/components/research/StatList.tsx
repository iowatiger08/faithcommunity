import { useState } from "react";
import type { ReactNode } from "react";
import type { Stat } from "./stats";

// Both faces stay in the DOM, so screen readers and search engines get the
// details without flipping. They share one grid cell, which sizes the card to
// the taller face rather than clipping a long detail on a small screen.
const face =
  "[grid-area:1/1] [backface-visibility:hidden] rounded-lg border border-ink/10 p-4";

function StatCard({ stat }: { stat: Stat }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <li className="[perspective:1000px] sm:aspect-square">
      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        className="h-full w-full text-left rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <div
          className={`grid h-full transition-transform duration-500 motion-reduce:transition-none [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div className={`${face} flex flex-col items-center justify-center text-center bg-accent/5`}>
            <p
              aria-hidden="true"
              className="font-serif text-2xl sm:text-3xl text-accent leading-tight"
            >
              {stat.figure}
            </p>
            <p aria-hidden="true" className="text-xs text-ink/50 mt-3">
              Tap for details
            </p>
          </div>
          <div className={`${face} [transform:rotateY(180deg)] bg-paper flex flex-col`}>
            <p className="text-[13px] text-ink/80 leading-snug">
              {/* Drawn from the data attribute so the figure is in the text
                  only once; this is the copy a screen reader announces. */}
              <span
                data-figure={stat.figure}
                className="mr-1 font-semibold text-accent before:content-[attr(data-figure)]"
              />
              {stat.detail}
            </p>
            <p className="text-[11px] text-ink/50 mt-auto pt-2">{stat.source}</p>
          </div>
        </div>
      </button>
    </li>
  );
}

/** A compact row for figures outside the 2×2 square: figure on the left,
 *  detail and source beside it. */
function StatRow({ stat }: { stat: Stat }) {
  return (
    <li data-stat-row className="flex gap-4 py-3">
      <p className="w-28 shrink-0 font-serif text-lg text-accent leading-tight">
        {stat.figure}
      </p>
      <div>
        <p className="text-sm text-ink/80 leading-snug">{stat.detail}</p>
        <p className="text-[11px] text-ink/50 mt-1">{stat.source}</p>
      </div>
    </li>
  );
}

/** Sections with four or more figures lead with a 2×2 square of flip cards;
 *  anything past four, or a section with fewer than four, is listed in rows. */
export function StatList({ items }: { items: Stat[] }) {
  const square = items.length >= 4 ? items.slice(0, 4) : [];
  const rest = items.length >= 4 ? items.slice(4) : items;
  return (
    <>
      {square.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 max-w-xl">
          {square.map((s) => (
            <StatCard key={s.figure + s.source} stat={s} />
          ))}
        </ul>
      )}
      {rest.length > 0 && (
        <ul className="mt-4 max-w-xl divide-y divide-ink/10 border-y border-ink/10">
          {rest.map((s) => (
            <StatRow key={s.figure + s.source} stat={s} />
          ))}
        </ul>
      )}
    </>
  );
}

/** One topic inside a group: a heading, the point in a single sentence, any
 *  caveats the figures need, then the figures themselves. */
export function StatSection({
  id,
  title,
  takeaway,
  items,
  children,
}: {
  id: string;
  title: string;
  takeaway: string;
  items: Stat[];
  children?: ReactNode;
}) {
  return (
    <section id={id} className="mt-10">
      <h4 className="font-serif text-lg">{title}</h4>
      <p className="mt-1 font-medium text-ink/90 max-w-prose">{takeaway}</p>
      {children !== undefined && (
        <div className="space-y-3 text-sm text-ink/70 max-w-prose leading-relaxed mt-3">
          {children}
        </div>
      )}
      <StatList items={items} />
    </section>
  );
}
