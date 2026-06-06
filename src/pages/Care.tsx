import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

interface Resource {
  name: string;
  href: string;
  detail: string;
}

// Edit these lists freely — they're just data. Each links to the
// organization's official site so visitors always reach the authoritative,
// up-to-date source.
const recovery: Resource[] = [
  { name: "Alcoholics Anonymous (AA)", href: "https://www.aa.org/", detail: "Find a meeting near you, in person or online, any day." },
  { name: "Al-Anon", href: "https://al-anon.org/", detail: "Support for the families and friends of problem drinkers." },
  { name: "Narcotics Anonymous (NA)", href: "https://www.na.org/", detail: "Recovery from drug addiction, one day at a time." },
  { name: "SMART Recovery", href: "https://www.smartrecovery.org/", detail: "Science-based tools for changing addictive behavior." },
];

const everyday: Resource[] = [
  { name: "NAMI HelpLine", href: "https://www.nami.org/help", detail: "Mental-health information and support. Call 1-800-950-6264." },
  { name: "SAMHSA National Helpline", href: "https://www.samhsa.gov/find-help/national-helpline", detail: "Free, confidential, 24/7. Call 1-800-662-4357." },
  { name: "Dial 2-1-1 (United Way)", href: "https://www.211.org/", detail: "Local help with food, housing, utilities, and more." },
];

const affirming: Resource[] = [
  { name: "The Trevor Project", href: "https://www.thetrevorproject.org/", detail: "Crisis support for LGBTQ+ young people. Call 1-866-488-7386 or text START to 678-678." },
  { name: "Veterans Crisis Line", href: "https://www.veteranscrisisline.net/", detail: "Dial 988, then press 1. Or text 838255." },
  { name: "National Domestic Violence Hotline", href: "https://www.thehotline.org/", detail: "24/7 confidential support. Call 1-800-799-7233 or text START to 88788." },
];

function ResourceList({ items }: { items: Resource[] }) {
  return (
    <ul className="space-y-4">
      {items.map((r) => (
        <li key={r.name}>
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline underline-offset-2 hover:no-underline"
          >
            {r.name}
          </a>
          <p className="text-sm text-ink/70 mt-0.5">{r.detail}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Care() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="You are not alone"
        description="If you are doubting, hurting, or seeking, you are welcome here. Crisis lines, recovery groups, caregiving ministries, and local help — gathered for anyone who needs a hand to hold."
        path="/care/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Care &amp; Support
      </p>
      <h1 className="font-serif text-5xl mb-8 leading-tight">
        You are not alone.
      </h1>

      <div className="space-y-6 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          Whether you are doubting, hurting, or simply seeking &mdash; you are
          welcome here, exactly as you are. You don&apos;t have to be put
          together to come in. The questions you carry are welcome, including
          the hard ones.
        </p>
        <p>
          We are here, and there is help. Below are people and places ready to
          walk with you. Reaching out is not weakness; it is the first brave
          step on the road.
        </p>
      </div>

      {/* Immediate crisis — most prominent */}
      <section
        id="crisis"
        className="mt-12 rounded-lg border-2 border-accent/40 bg-accent/5 p-6"
      >
        <h2 className="font-serif text-2xl mb-2">If you are in crisis right now</h2>
        <p className="text-ink/80 mb-4">
          If you or someone you love is in immediate danger, please reach out
          this minute. Someone is ready to listen, free and confidential, any
          hour of the day or night.
        </p>
        <ul className="space-y-3">
          <li>
            <span className="font-semibold">Call or text 988</span> &mdash;{" "}
            <a
              href="https://988lifeline.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:no-underline"
            >
              Suicide &amp; Crisis Lifeline
            </a>{" "}
            (24/7, free, confidential).
          </li>
          <li>
            <span className="font-semibold">Text HOME to 741741</span> &mdash;{" "}
            <a
              href="https://www.crisistextline.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:no-underline"
            >
              Crisis Text Line
            </a>
            .
          </li>
          <li>
            <span className="font-semibold">Call 911</span> for a medical or
            safety emergency.
          </li>
        </ul>
      </section>

      {/* Stephen Ministry — someone to walk with you */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">Someone to walk with you</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-4">
          Sometimes what helps most is one caring person who will simply be
          present through a hard season &mdash; grief, illness, loss, loneliness,
          or change.
        </p>
        <ResourceList
          items={[
            {
              name: "Stephen Ministry",
              href: "https://www.stephenministries.org/",
              detail:
                "Trained Christian caregivers who offer confidential, one-to-one care. Find a congregation near you that offers it.",
            },
          ]}
        />
      </section>

      {/* Recovery */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">Recovery &amp; sobriety</h2>
        <ResourceList items={recovery} />
      </section>

      {/* Everyday mental health + practical help */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">Mental health &amp; everyday help</h2>
        <ResourceList items={everyday} />
      </section>

      {/* Affirming / specific */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">Support for particular journeys</h2>
        <ResourceList items={affirming} />
      </section>

      {/* Local */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">Here in central Iowa</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-4">
          This ministry serves alongside neighbors close to home. If you need a
          meal or a hand &mdash; or want to offer one &mdash; start here.
        </p>
        <ResourceList
          items={[
            {
              name: "Urban Bicycle Food Ministry — Des Moines (UBFM-DSM)",
              href: "https://ubfmdesmoines.org/",
              detail: "Meals and care delivered to neighbors experiencing homelessness.",
            },
          ]}
        />
      </section>

      <div className="mt-16 pt-8 border-t border-ink/10">
        <p className="font-serif text-2xl text-ink/80 mb-4">Peace be with you.</p>
        <p className="text-ink/70 max-w-prose leading-relaxed">
          When you&apos;re ready, the{" "}
          <Link to="/sermons" className="text-accent underline">sermons</Link>{" "}
          and{" "}
          <Link to="/worship-resources" className="text-accent underline">
            worship resources
          </Link>{" "}
          are here too &mdash; and you&apos;re always welcome to{" "}
          <Link to="/subscribe" className="text-accent underline">
            subscribe
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
