import { Link } from "react-router-dom";
import { getAllPosts, formatDate } from "~/lib/content";
import PageHead from "~/components/PageHead";
import { VANDERBILT_RCL } from "~/components/SeasonBadge";

export default function Home() {
  const recent = getAllPosts().slice(0, 3);

  return (
    <>
      <PageHead
        title="Hope and Truth Ministry — a ministry without walls"
        description="A welcoming, open-and-affirming ministry without walls — sermons, reflections, and worship resources rooted in the Revised Common Lectionary, for the wandering, the doubting, the hurting, and the hopeful."
        path="/"
        isHome
      />
      {/* Hero image */}
      <div className="w-full overflow-hidden" style={{ maxHeight: "420px" }}>
        <img
          src="/images/palm-springs-canyon.jpg"
          alt="Mountain canyon road in the Palm Springs area — light breaking through the hills"
          className="w-full object-cover object-center"
          style={{ maxHeight: "420px" }}
        />
      </div>

      {/* Welcome / invitation */}
      <section className="border-b border-ink/10">
        <div className="max-w-3xl mx-auto px-6 py-20 sm:py-28">
          <p className="text-sm uppercase tracking-widest text-accent mb-4">
            Hope &amp; Truth Ministry
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-8">
            A ministry without walls.
          </h1>

          <div className="flex justify-center mb-8">
            <img
              src="/images/interfaith-wheel.svg"
              alt="Interfaith mandala — symbols of Christianity, Judaism, Islam, Hinduism, Buddhism, Sikhism, Taoism, and Bahá'í arranged in a circle of unity"
              className="w-52 h-52 sm:w-64 sm:h-64"
            />
          </div>

          <p className="text-xl text-ink/80 max-w-prose leading-relaxed mb-8">
            For the wandering, the doubting, the hurting, and the hopeful.
            For people without a congregation, and for people who have found
            theirs but need another voice on the road. You are welcome here.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="px-5 py-3 bg-accent text-paper rounded font-medium hover:bg-accent/90"
            >
              Get in touch
            </Link>
            <Link
              to="/about"
              className="px-5 py-3 border border-ink/20 rounded font-medium hover:border-ink/40"
            >
              About this ministry
            </Link>
          </div>
        </div>
      </section>

      {/* Recent reflections — soft framing, not a list */}
      <section className="border-b border-ink/10">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-sm uppercase tracking-widest text-ink/60 mb-3">
            From the lectionary
          </p>
          <h2 className="font-serif text-3xl mb-3">
            Recent reflections
          </h2>
          <p className="text-ink/70 mb-10 max-w-prose">
            Sermons and reflections in keeping with the{" "}
            <a
              href={VANDERBILT_RCL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:no-underline"
            >
              Revised Common Lectionary
            </a>
            . New writing arrives most weeks.
          </p>
          <ul className="space-y-8">
            {recent.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/${p.section.replace("_", "-")}/${p.slug}`}
                  className="block group"
                >
                  <p className="text-xs text-ink/60 uppercase tracking-wide">
                    {formatDate(p.published_date)}
                    {p.lectionary_code && ` · ${p.lectionary_code.raw}`}
                  </p>
                  <h3 className="font-serif text-2xl mt-2 leading-snug group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="text-ink/70 mt-2 max-w-prose">{p.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 pt-6 border-t border-ink/10">
            <Link to="/sermons" className="text-accent hover:underline">
              Sit with the full archive &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Three doors */}
      <section className="border-b border-ink/10">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="font-serif text-3xl mb-8">Three ways in</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-xl mb-2">If you&apos;re doubting</h3>
              <p className="text-sm text-ink/70 mb-3">
                The questions you carry are welcome &mdash; even the hard ones.
              </p>
              <Link to="/care" className="text-sm text-accent hover:underline">
                Begin here &rarr;
              </Link>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-2">If you&apos;re hurting</h3>
              <p className="text-sm text-ink/70 mb-3">
                You don&apos;t have to be put together to come in.
              </p>
              <Link to="/care" className="text-sm text-accent hover:underline">
                Begin here &rarr;
              </Link>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-2">If you&apos;re seeking</h3>
              <p className="text-sm text-ink/70 mb-3">
                Wherever you are on the journey, there is space for you.
              </p>
              <Link to="/care" className="text-sm text-accent hover:underline">
                Begin here &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
