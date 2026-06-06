import { Link } from "react-router-dom";
import { getWorshipResources } from "~/lib/content";
import PageHead from "~/components/PageHead";

// These slugs live in worship_resources but belong here — they're
// excluded from the Worship Resources index and surfaced here instead.
export const MEDITATION_RESOURCE_SLUGS = new Set([
  "psalm-143-adapted",
  "psalm-27-adapted",
  "psalm-54-adapted",
  "pastoral-prayer-25-jun-2017",
  "blessing-pentecost-year-b",
]);

export default function Meditations() {
  const psalmPrayerBlessing = getWorshipResources().filter((p) =>
    MEDITATION_RESOURCE_SLUGS.has(p.slug)
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Contemplative Practice"
        description="Meditations, contemplative practices, and resources for prayer and stillness — drawing from Christian contemplative tradition, Zen and Taoist wisdom, Sufi insight, and interfaith teaching."
        path="/meditations/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Contemplative Practice
      </p>
      <h1 className="font-serif text-5xl mb-6 leading-tight">
        Be still, and know.
      </h1>

      <div className="space-y-5 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          Before the sermon, before the service, before the words &mdash; there
          is silence. Contemplative practice is the discipline of returning to
          that silence: not as an escape from life, but as the ground beneath
          it. Here you will find practices, reflections, and teachers for the
          inner journey.
        </p>
      </div>

      {/* Lectio Divina */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-4">Lectio Divina</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-6">
          <em>Sacred reading</em> &mdash; an ancient Christian practice of
          moving through a short scripture passage slowly, listening for what
          stirs rather than what instructs.
        </p>
        <ol className="space-y-5">
          {[
            ["I", "Lectio — Read", "Read a short passage slowly, aloud if possible. Let the words land. Notice which word or phrase catches you — not the one you think should, but the one that does."],
            ["II", "Meditatio — Reflect", "Read again. Sit with the word or phrase that caught you. Turn it over gently, the way you might hold a stone. What does it ask of you today?"],
            ["III", "Oratio — Respond", "Speak or write your response — honestly, even if what arises is resistance, grief, or gratitude. This is prayer as conversation, not performance."],
            ["IV", "Contemplatio — Rest", "Set the words aside. Sit in open-handed quiet for a few minutes — not trying to think or not think, simply remaining present with the One who is always already here."],
          ].map(([num, title, body]) => (
            <li key={num} className="flex gap-4">
              <span className="font-serif text-2xl text-accent/60 leading-none mt-0.5 shrink-0">{num}</span>
              <div>
                <p className="font-medium text-ink/90">{title}</p>
                <p className="text-sm text-ink/70 mt-1 leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Centering Prayer */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-4">Centering Prayer</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-4">
          Developed from the Desert Fathers and formalized by Thomas Keating
          and Basil Pennington, centering prayer is a consent &mdash; a
          wordless turning toward the presence of God rather than an attempt
          to reach it.
        </p>
        <div className="border-l-2 border-accent/30 pl-5 space-y-3 text-ink/70 text-sm leading-relaxed">
          <p>Choose a sacred word (one syllable works well &mdash; <em>love</em>, <em>peace</em>, <em>open</em>, <em>yes</em>) as a symbol of your consent to God&apos;s presence and action within you.</p>
          <p>Sit comfortably. Close your eyes. Introduce the sacred word gently.</p>
          <p>When thoughts, feelings, or sensations arise &mdash; and they will &mdash; return ever so gently to the sacred word. Not as a battle but as a soft returning.</p>
          <p>Sit for 20 minutes. At the end, remain in silence for two or three minutes before returning to ordinary awareness.</p>
        </div>
      </section>

      {/* Psalm adaptations, blessings & pastoral prayers */}
      {psalmPrayerBlessing.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif text-2xl mb-4">
            Psalm adaptations, blessings &amp; pastoral prayers
          </h2>
          <p className="text-ink/80 max-w-prose leading-relaxed mb-6">
            These adapted psalms, blessings, and pastoral prayers are written
            for spoken or sung use in worship and in private prayer.
          </p>
          <ul className="divide-y divide-ink/10">
            {psalmPrayerBlessing.map((p) => (
              <li key={p.slug} className="py-4">
                <Link to={`/worship-resources/${p.slug}`} className="block group">
                  <h3 className="font-serif text-lg group-hover:text-accent">{p.title}</h3>
                  {p.summary && (
                    <p className="text-sm text-ink/70 mt-1 max-w-prose">{p.summary}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Zen & Taoist wisdom */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-2">Zen &amp; Taoist wisdom</h2>
        <p className="text-ink/70 text-sm leading-relaxed mb-8 max-w-prose">
          These lessons and meditations are drawn from Zen, Taoist, and martial
          arts traditions. Open your heart to the lessons and push the limits of
          your mind to understand them not only at face value, but for the
          internal concepts &mdash; the relationships, the ideas, the
          suggestions within.
        </p>

        <div className="space-y-10">

          {/* Meditation on the Tao */}
          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50 mb-3">Tao Te Ching &mdash; trans. Brian Browne Walker</p>
            <blockquote className="border-l-2 border-accent/30 pl-5 space-y-2 font-serif text-lg text-ink/80 italic leading-relaxed">
              <p>The wise person embraces the One and sets an example for all.</p>
              <p>Not putting on a show, he shines;<br />
              not justifying himself, he is distinguished;<br />
              not boasting, he is acknowledged.<br />
              He does not quarrel, so no one quarrels with him.</p>
              <p className="not-italic text-base">If one does not begin with the right attitude,<br />
              there is little hope for the right ending.</p>
            </blockquote>
          </div>

          {/* Be Water */}
          <div>
            <h3 className="font-serif text-xl mb-3">To Flow with the River</h3>
            <blockquote className="border-l-2 border-accent/30 pl-5 font-serif text-lg text-ink/80 italic leading-relaxed">
              <p>Empty your mind. Be formless, shapeless, like water.<br />
              When you put water into a cup, it becomes the cup;<br />
              when you put water into a bottle, it becomes the bottle;<br />
              when you put water into a teapot, it becomes the teapot.<br />
              Now water can flow &mdash; or it can sink.<br />
              Be water, my friend.</p>
            </blockquote>
            <p className="text-sm text-ink/50 mt-2 pl-5">&mdash; Bruce Lee</p>
          </div>

          {/* The Cup */}
          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50 mb-1">Zen</p>
            <h3 className="font-serif text-xl mb-3">The Cup</h3>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose">
              It was obvious to the master from the start of the conversation that
              the professor was not so much interested in learning about Zen as he
              was in impressing the master with his own opinions and knowledge. As
              the Zen teacher explained, the learned man would frequently interrupt
              him with remarks like &ldquo;Oh, yes, we have that too.&rdquo;
            </p>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose mt-3">
              Finally the Zen teacher stopped talking and began to serve tea. He
              poured the cup full, then kept pouring until the cup overflowed.
              &ldquo;Enough!&rdquo; the learned man interrupted. &ldquo;The cup is
              overfull &mdash; no more will go in!&rdquo;
            </p>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose mt-3">
              &ldquo;Indeed,&rdquo; answered the Zen teacher. &ldquo;Like this cup,
              you are full of your own opinions and speculations. If you do not
              first empty your cup, how can you taste my cup of tea?&rdquo;
            </p>
            <p className="text-xs text-ink/40 mt-2 italic">As told in <em>Zen in the Martial Arts</em> by Joe Hyams</p>
          </div>

          {/* Dying Teacher */}
          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50 mb-1">Zen</p>
            <h3 className="font-serif text-xl mb-3">The Dying Teacher</h3>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose">
              When Yaoshan was dying, he suddenly shouted, &ldquo;Now the meditation
              hall is going to collapse!&rdquo;
            </p>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose mt-3">
              The monks began looking around for wooden poles to support the
              structure.
            </p>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose mt-3">
              Yaoshan raised his hand and said, &ldquo;No, no, you don&apos;t
              understand,&rdquo; and then he died.
            </p>
          </div>

          {/* The Outlaw */}
          <div>
            <h3 className="font-serif text-xl mb-3">The Outlaw</h3>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose">
              One day, an ostentatious and contemptuous outlaw was thrashing about
              a small village. He came upon the house of a master, having heard
              stories of the master&apos;s legendary skill, and wanted to test it.
            </p>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose mt-3">
              He came to the gate. The master was tending his garden. The outlaw
              called out to him, boasting that he could beat him with a single
              strike. He taunted the master and cried of his ignorance and bogus
              skill. &ldquo;Challenge me if you can, and show me your best
              technique.&rdquo;
            </p>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose mt-3">
              At this, the master turned to the outlaw, bowed to him, and walked
              back into the house.
            </p>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose mt-3">
              The outlaw became furious and ranted that the legends of the master
              were untrue and undeserving. A short moment later, the master
              reappeared &mdash; this time carrying a tray with a pot of tea and
              two cups. He sat near a table and poured. Then he gestured the
              outlaw to drink with him.
            </p>
            <p className="text-ink/80 text-sm leading-relaxed max-w-prose mt-3">
              The outlaw, caught off guard, bowed to the master and left him alone.
            </p>
            <p className="text-xs text-ink/40 mt-2 italic">— Tony E Hansen</p>
          </div>

          {/* Words of Fools */}
          <div>
            <h3 className="font-serif text-xl mb-3">Words of Fools</h3>
            <blockquote className="border-l-2 border-accent/30 pl-5 font-serif text-lg text-ink/80 italic leading-relaxed">
              <p>A word whispered in the ear<br />
              can be heard for miles.</p>
              <p>Mischief results from<br />
              too much opening of the mouth.</p>
              <p>When the blind lead the blind,<br />
              they both fall into the water.</p>
            </blockquote>
            <p className="text-xs text-ink/40 mt-2 italic">
              — Drawn from Zen wisdom; Proverbs 18; and Matthew 15:14
            </p>
          </div>

          {/* Enigma of Reality */}
          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50 mb-1">Meditation</p>
            <h3 className="font-serif text-xl mb-3">Enigma of Reality</h3>
            <blockquote className="border-l-2 border-accent/30 pl-5 font-serif text-lg text-ink/80 italic leading-relaxed space-y-1">
              <p>enigma? essence. equilibrium.<br />
              encircle &mdash;</p>
              <p>within or without?<br />
              to be or not to be?<br />
              to see or not to see?<br />
              to feel or not feel?</p>
              <p>to be but not to be?<br />
              to see but not to see?<br />
              to feel but not to feel?</p>
              <p>a symbol, a distraction of reality &mdash;<br />
              what is reality?<br />
              what is the focus?</p>
              <p>to breathe and to see with the mind&apos;s eye;<br />
              to hear and to feel with the essence of life.</p>
              <p>the focus is the essence of pure thought;<br />
              the focus is the essence of nature;<br />
              the focus is the essence of flowing rivers.</p>
              <p>the focus is not the rock, but it is the rock &mdash;<br />
              then the focus is not the reality, but it is reality.</p>
            </blockquote>
            <p className="text-xs text-ink/40 mt-2 italic pl-5">&mdash; Tony E Hansen</p>
          </div>

        </div>
      </section>

      {/* Wisdom across traditions */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-6">Wisdom across traditions</h2>
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-3">Sufi</p>
        <blockquote className="font-serif text-xl text-ink/80 italic leading-relaxed border-l-2 border-accent/30 pl-5">
          &ldquo;Out beyond ideas of wrongdoing and rightdoing, there is a
          field. I&apos;ll meet you there.&rdquo;
        </blockquote>
        <p className="text-sm text-ink/50 mt-2 pl-5">&mdash; Rumi</p>
      </section>

      {/* Teachers & resources */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-4">Further resources</h2>
        <ul className="space-y-5">
          <li className="border-l-2 border-accent/20 pl-4">
            <a href="https://cac.org" target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline underline-offset-2 hover:no-underline">
              Center for Action and Contemplation
            </a>
            <p className="text-sm text-ink/70 mt-1 leading-relaxed">
              Richard Rohr&apos;s center integrating Christian mysticism,
              non-dual thinking, and social action. Daily meditations
              available free by email.
            </p>
          </li>
          <li className="border-l-2 border-accent/20 pl-4">
            <a href="https://www.contemplativeoutreach.org" target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline underline-offset-2 hover:no-underline">
              Contemplative Outreach
            </a>
            <p className="text-sm text-ink/70 mt-1 leading-relaxed">
              Thomas Keating&apos;s organization for centering prayer.
              Includes instructional videos, local groups, and retreat
              resources.
            </p>
          </li>
        </ul>
      </section>

      {/* Subscribe */}
      <section className="mt-16 border border-accent/20 bg-accent/5 rounded-lg p-8">
        <h2 className="font-serif text-xl mb-3">Receive future meditations</h2>
        <p className="text-ink/80 text-sm leading-relaxed mb-5">
          New contemplative reflections and guided practices will be published
          here as the ministry grows. Subscribe to receive them in your inbox
          alongside the weekly sermons and reflections.
        </p>
        <Link to="/subscribe" className="inline-block px-5 py-3 bg-accent text-paper rounded font-medium hover:bg-accent/90">
          Subscribe
        </Link>
      </section>

      <div className="mt-12 pt-8 border-t border-ink/10 space-y-3">
        <p className="text-ink/70 text-sm leading-relaxed max-w-prose">
          Looking for sermon and worship materials? Visit{" "}
          <Link to="/publications" className="text-accent underline">Publications</Link>.{" "}
          For those exploring ministry, see the{" "}
          <Link to="/ordination" className="text-accent underline">Ordination</Link> page.
        </p>
        <p className="text-xs text-ink/50">
          Original content on this page is &copy; Tony E Hansen / Hope and Truth Ministry.
          Free to share with attribution.{" "}
          <Link to="/terms" className="underline hover:text-ink/70">Terms of use &rarr;</Link>
        </p>
      </div>
    </div>
  );
}
