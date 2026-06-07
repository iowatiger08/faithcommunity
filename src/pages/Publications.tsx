import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

// ── Content model ─────────────────────────────────────────────────────────────

const INSPIRATION = [
  {
    title: "Sermons",
    desc: "Hundreds of sermons drawn from the Revised Common Lectionary — a year's worth of scripture, season by season.",
    href: "/sermons",
    live: true,
    cta: "Browse the archive",
  },
  {
    title: "Meditations & Contemplative Practice",
    desc: "Lectio Divina, centering prayer, Zen and Taoist wisdom, Sufi insight — practices for the inner journey.",
    href: "/meditations",
    live: true,
    cta: "Sit with the practices",
  },
  {
    title: "Worship Resources",
    desc: "Service orders, Lessons & Carols, pastoral prayers — materials that carry the season into the room.",
    href: "/worship-resources",
    live: true,
    cta: "Browse resources",
  },
  {
    title: "Newsletters",
    desc: "Seasonal letters from this community — reflections, invitations, and notes from the road.",
    href: null,
    live: false,
    cta: "Coming soon",
  },
];

const RESOURCES = [
  {
    title: "Congregation Study Guides",
    desc: "Devotional materials, liturgical planning tools, and small-group resources for congregations of any size.",
    href: null,
    live: false,
  },
  {
    title: "Funding & Stewardship",
    desc: "Guides for annual giving campaigns, capital initiatives, and building a healthy financial culture in your ministry — from transactions to transformation.",
    href: "/give",
    live: true,
    cta: "See stewardship resources",
  },
  {
    title: "Volunteer Development",
    desc: "Frameworks for recruiting, training, and sustaining volunteers across seasons and leadership transitions.",
    href: null,
    live: false,
  },
  {
    title: "Communications & Outreach",
    desc: "How to reach people where they are — community presence, storytelling, and building the message that matches your mission.",
    href: null,
    live: false,
  },
];

const IDEATION = [
  {
    title: "Seeding a Ministry or Nonprofit",
    desc: "Step-by-step guidance for starting something new — incorporation, governance, first-year operations, and sustaining momentum past the founding season.",
    href: null,
    live: false,
  },
  {
    title: "Organizational Development",
    desc: "Moving from founding vision to durable structure — for congregations, nonprofits, and faith-based organizations at any stage of growth.",
    href: null,
    live: false,
  },
  {
    title: "Purpose-Driven Strategy",
    desc: "Aligning people, programs, budget, and communications around a clear calling. For any organization where the mission is the point.",
    href: null,
    live: false,
  },
  {
    title: "Ordination & Ministry Formation",
    desc: "Resources for those called to lead — formation, credentials, and the questions that come before the title.",
    href: "/ordination",
    live: true,
    cta: "Explore ordination",
  },
];

// ── Shared ───────────────────────────────────────────────────────────────────

type Item = {
  title: string;
  desc: string;
  href: string | null;
  live: boolean;
  cta?: string;
};

function TrackItems({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-3">
          <div
            className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
              item.live ? "bg-accent" : "bg-ink/20"
            }`}
          />
          <div>
            {item.live ? (
              <Link
                to={item.href!}
                className="font-serif text-lg hover:text-accent transition-colors"
              >
                {item.title}
              </Link>
            ) : (
              <span className="font-serif text-lg text-ink/55">{item.title}</span>
            )}
            <p className="text-sm text-ink/65 mt-0.5 leading-relaxed max-w-prose">
              {item.desc}
            </p>
            {item.live ? (
              <p className="text-xs text-accent mt-1 font-medium">{item.cta} &rarr;</p>
            ) : (
              <p className="text-xs text-ink/40 mt-1 italic">Coming soon</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function TrackBanner({
  title,
  pull,
  items,
  flip = false,
}: {
  title: string;
  pull: string;
  items: Item[];
  flip?: boolean;
}) {
  return (
    <section className="border-b border-ink/10 last:border-0">
      <div
        className={`max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-12 items-start ${
          flip ? "lg:[&>*:first-child]:order-last" : ""
        }`}
      >
        <div>
          <h2 className="font-serif text-3xl mb-5">{title}</h2>
          <blockquote className="border-l-2 border-accent/40 pl-5 font-serif italic text-ink/70 leading-relaxed text-lg">
            {pull}
          </blockquote>
        </div>
        <TrackItems items={items} />
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Publications() {
  return (
    <>
      <PageHead
        title="Publications"
        description="Find inspiration, gather resources, and discover how to build your own ministry or nonprofit — sermons, liturgy, stewardship tools, and purpose-driven development guides from Hope and Truth Ministry."
        path="/publications/"
      />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 border-b border-ink/10">
        <p className="text-sm uppercase tracking-widest text-accent mb-4">
          Publications &amp; Resources
        </p>
        <h1 className="font-serif text-5xl mb-5 leading-tight">
          Find inspiration. Gather resources.<br className="hidden sm:block" /> Build something.
        </h1>
        <p className="text-lg text-ink/70 max-w-prose leading-relaxed">
          Hope &amp; Truth Ministry is a place to seek, to learn, and to discover how
          to build something of your own &mdash; a congregation, a nonprofit, an
          organization that is unmistakably yours.
        </p>
      </div>

      {/* Track 1 — Inspiration */}
      <TrackBanner
        title="Inspiration"
        pull="Before the sermon, before the service, before the words — there is silence. These materials help you find it."
        items={INSPIRATION}
      />

      {/* Track 2 — Resources */}
      <TrackBanner
        title="Resources"
        pull="Every ministry is built on what it gives away. These tools are here to be used, adapted, and passed forward."
        items={RESOURCES}
        flip
      />

      {/* Track 3 — Work Ideation */}
      <TrackBanner
        title="Work Ideation"
        pull='"The journey of a thousand miles begins with a single step." — Lao Tzu'
        items={IDEATION}
      />

      {/* Footer note */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs text-ink/50">
          Content on this site is &copy; Tony E Hansen / Hope and Truth Ministry.
          Free to share with attribution.{" "}
          <Link to="/terms" className="underline hover:text-ink/70">
            Terms of use &rarr;
          </Link>
        </p>
      </div>
    </>
  );
}
