import type { PublishedPost } from "~/lib/content";
import { rclReadings, VANDERBILT_RCL_DAILY } from "~/lib/rcl";

/**
 * The scripture box beside a post: a link to that Sunday's RCL readings
 * (NRSVue text at Vanderbilt) and the texts the post itself cites. Links
 * share one named target so the readings stay in a single tab.
 */
export default function Readings({ post }: { post: PublishedPost }) {
  const rcl = rclReadings(post);
  const refs = [...new Set(post.scripture_refs.map((s) => s.ref))];
  if (!rcl && refs.length === 0) return null;

  const list = (
    <ul className="mt-2 space-y-1 text-ink/80">
      {refs.map((ref) => (
        <li key={ref}>{ref}</li>
      ))}
    </ul>
  );

  return (
    <aside
      aria-labelledby="readings-heading"
      className="mb-8 p-4 border border-ink/10 rounded text-sm lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-6 lg:self-start lg:mb-0 print:hidden"
    >
      <h2 id="readings-heading" className="text-xs uppercase tracking-wide text-ink/60">
        Readings
      </h2>
      {rcl && (
        <>
          <p className="mt-2 text-ink/80">{rcl.label}</p>
          <a
            href={rcl.url}
            target="rcl-readings"
            rel="noopener"
            className="mt-2 inline-block font-medium text-accent underline underline-offset-2 hover:no-underline"
          >
            Read this Sunday&apos;s readings (NRSVue)
            <span className="sr-only"> (opens the Vanderbilt lectionary site)</span>
          </a>
        </>
      )}
      {refs.length > 0 && (
        <div className="mt-4">
          {refs.length > 4 ? (
            <details open>
              <summary className="cursor-pointer text-xs uppercase tracking-wide text-ink/60">
                Texts in this sermon
              </summary>
              {list}
            </details>
          ) : (
            <>
              <h3 className="text-xs uppercase tracking-wide text-ink/60">Texts in this sermon</h3>
              {list}
            </>
          )}
        </div>
      )}
      <a
        href={VANDERBILT_RCL_DAILY}
        target="rcl-readings"
        rel="noopener"
        className="mt-4 block text-xs text-ink/60 underline underline-offset-2 hover:no-underline"
      >
        Today&apos;s daily readings
        <span className="sr-only"> (opens the Vanderbilt lectionary site)</span>
      </a>
    </aside>
  );
}
