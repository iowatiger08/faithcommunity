import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

export default function CongregationalSitting() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Congregational Sitting Practice"
        description="A community mindfulness meditation format using a bell or chime — two silent sittings with a mindful reading between them. Open to all; donations invited but not required."
        path="/congregational-sitting/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Congregational Practice
      </p>
      <h1 className="font-serif text-4xl mb-4 leading-tight">
        Congregational Sitting Practice
      </h1>
      <p className="text-ink/60 text-sm mb-10">
        A community mindfulness meditation format &mdash; Hope &amp; Truth Ministry
      </p>

      <div className="space-y-5 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          This format is designed for a gathered community of any size &mdash;
          in a sanctuary, a studio, or any open space arranged with yoga mats,
          cushions, or chairs. It requires no prior meditation experience and
          asks only that participants come willing to be still.
        </p>
        <p>
          A bell or singing bowl serves as the voice of the practice: calling
          the group to silence, marking the readings, and closing each sitting.
        </p>
      </div>

      {/* The Format */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-8">The Format</h2>

        <ol className="space-y-10">
          <li className="flex gap-5">
            <span className="font-serif text-3xl text-accent/50 leading-none mt-0.5 shrink-0">I</span>
            <div>
              <h3 className="font-serif text-xl mb-2">Opening Bell</h3>
              <p className="text-ink/75 leading-relaxed text-sm">
                A bell or chime is rung to open the session. All comes to
                quiet &mdash; phones silenced, conversation set aside. Participants
                find a comfortable position on their mat, cushion, or chair.
                Eyes may be closed or gently lowered.
              </p>
              <p className="text-ink/75 leading-relaxed text-sm mt-3">
                Sit together in stillness for <strong>20 minutes</strong>.
              </p>
            </div>
          </li>

          <li className="flex gap-5">
            <span className="font-serif text-3xl text-accent/50 leading-none mt-0.5 shrink-0">II</span>
            <div>
              <h3 className="font-serif text-xl mb-2">Mindful Reading</h3>
              <p className="text-ink/75 leading-relaxed text-sm">
                After the first sitting, a brief reading is offered into the
                space &mdash; a poem, a passage from wisdom literature, or a short
                reflection. No commentary or discussion follows. The words are
                simply offered, then allowed to rest in the room.
              </p>
              <p className="text-ink/75 leading-relaxed text-sm mt-3">
                This takes a <strong>few minutes</strong>. The silence that
                follows the reading is itself part of the practice.
              </p>
            </div>
          </li>

          <li className="flex gap-5">
            <span className="font-serif text-3xl text-accent/50 leading-none mt-0.5 shrink-0">III</span>
            <div>
              <h3 className="font-serif text-xl mb-2">Second Bell &mdash; Second Sitting</h3>
              <p className="text-ink/75 leading-relaxed text-sm">
                A second bell invites all to return to stillness. Sit together
                for another <strong>20 minutes</strong>.
              </p>
            </div>
          </li>

          <li className="flex gap-5">
            <span className="font-serif text-3xl text-accent/50 leading-none mt-0.5 shrink-0">IV</span>
            <div>
              <h3 className="font-serif text-xl mb-2">Closing Bell</h3>
              <p className="text-ink/75 leading-relaxed text-sm">
                A final bell closes the practice. Allow a moment of stillness
                before movement returns. Participants may take their time
                returning to the room.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* Gifts */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-4">Gifts &amp; Sharing</h2>
        <p className="text-ink/75 leading-relaxed max-w-prose">
          Donations are invited and welcomed, but never required. A bowl is
          quietly set out near the entrance or exit. Those who feel moved to
          give may leave what they are able. Those who have need may take
          quietly from what is shared. No one is watched; no one is asked.
          The bowl is simply there.
        </p>
      </section>

      {/* Notes for facilitators */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-4">Notes for Facilitators</h2>
        <ul className="space-y-3 text-ink/75 text-sm leading-relaxed max-w-prose list-disc pl-5">
          <li>
            A singing bowl, a hand bell, or a simple chime all work well.
            The tone should be clear and allowed to fully fade before
            the sitting begins.
          </li>
          <li>
            Readings should be short &mdash; one to three minutes. Poetry,
            adapted psalms, or wisdom passages from any tradition are
            appropriate.
          </li>
          <li>
            The space need not be elaborate. Mats or cushions on the floor
            work well. Chairs are equally welcome and should always be
            available for those who need them.
          </li>
          <li>
            No instruction or explanation is required at the start beyond a
            brief welcome and a description of the format. The bell does
            the rest.
          </li>
        </ul>
      </section>

      <div className="mt-16 pt-8 border-t border-ink/10 space-y-3">
        <p className="text-ink/70 text-sm leading-relaxed max-w-prose">
          For more contemplative practices, visit the{" "}
          <Link to="/meditations" className="text-accent underline">
            Meditations
          </Link>{" "}
          page. For additional worship and resource materials, see{" "}
          <Link to="/publications" className="text-accent underline">
            Publications
          </Link>.
        </p>
        <p className="text-xs text-ink/50">
          &copy; Tony E Hansen / Hope and Truth Ministry. Free to use and adapt
          with attribution.{" "}
          <Link to="/terms" className="underline hover:text-ink/70">
            Terms of use &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
