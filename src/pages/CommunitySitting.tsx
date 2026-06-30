import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

export default function CommunitySitting() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Community Sitting Practice"
        description="A community mindfulness meditation format using a bell or chime — two silent sittings with a mindful reading between them. Open to all; donations invited but not required."
        path="/community-sitting/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Community Practice
      </p>
      <h1 className="font-serif text-4xl mb-4 leading-tight">
        Community Sitting Practice
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

      {/* Posture */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-4">Posture</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-4">
          Posture matters in mindful meditation &mdash; not because perfection
          is required, but because the body and the mind support each other.
          A grounded, upright seat allows the breath to move freely and the
          attention to settle.
        </p>
        <div className="border-l-2 border-accent/30 pl-5 space-y-3 text-ink/70 text-sm leading-relaxed">
          <p>
            Sit either comfortably cross-legged on a folded blanket or
            meditation cushion, or in a chair with both feet flat on the
            floor. Allow the hips to be level or slightly elevated so the
            lower back is not strained.
          </p>
          <p>
            Sit fully upright &mdash; not rigid, but tall. Imagine the
            vertebrae gently stacking upon one another, each one resting
            on the one below, the spine rising naturally without forcing.
            The shoulders settle back and down. The chin drops very
            slightly so the back of the neck is long.
          </p>
          <p>
            Rest the hands on the knees or in the lap. Close the eyes
            gently, or soften the gaze toward the floor a few feet ahead.
          </p>
          <p>
            Once settled, bring the full attention to the breath &mdash;
            not to control it, but simply to feel it arrive and depart.
            The breath is the anchor. Return to it whenever the mind
            wanders.
          </p>
        </div>
      </section>

      {/* The Format */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-8">A Format</h2>

        <ol className="space-y-10">
          <li className="flex gap-5">
            <span className="font-serif text-3xl text-accent/50 leading-none mt-0.5 shrink-0">I</span>
            <div>
              <h3 className="font-serif text-xl mb-2">Opening Bell</h3>
              <p className="text-ink/75 leading-relaxed text-sm">
                A bell or chime is rung to open the session. All comes to
                quiet &mdash; phones silenced, conversation set aside. Participants
                settle into their seats, find their posture, and close their eyes.
              </p>
              <p className="text-ink/75 leading-relaxed text-sm mt-3">
                Sit together in stillness for <strong>20 minutes (ish)</strong>.
              </p>
            </div>
          </li>

          <li className="flex gap-5">
            <span className="font-serif text-3xl text-accent/50 leading-none mt-0.5 shrink-0">II</span>
            <div>
              <h3 className="font-serif text-xl mb-2">Mindful Reading and Short Discussion </h3>
              <p className="text-ink/75 leading-relaxed text-sm">
                After the first sitting, a brief reading is offered into the
                space &mdash; a poem, a passage from wisdom literature, or a short
                reflection. A brief, open discussion may follow &mdash; reflections
                on the reading or the sitting are welcome, though silence is
                equally so.
              </p>
              <p className="text-ink/75 leading-relaxed text-sm mt-3">
                This interlude takes a <strong>few minutes</strong>. Keep it
                unhurried; the second bell will gather everyone back.
              </p>
            </div>
          </li>

          <li className="flex gap-5">
            <span className="font-serif text-3xl text-accent/50 leading-none mt-0.5 shrink-0">III</span>
            <div>
              <h3 className="font-serif text-xl mb-2">Second Bell &mdash; Second Sitting</h3>
              <p className="text-ink/75 leading-relaxed text-sm">
                A second bell invites all to return to stillness. Settle
                back into posture and sit together for another{" "}
                <strong>20 minutes (ish)</strong>.
              </p>
            </div>
          </li>

          <li className="flex gap-5">
            <span className="font-serif text-3xl text-accent/50 leading-none mt-0.5 shrink-0">IV</span>
            <div>
              <h3 className="font-serif text-xl mb-2">Closing Bell</h3>
              <p className="text-ink/75 leading-relaxed text-sm">
                A final bell closes the practice. Participants may take their time
                returning to the room and exiting.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* Gifts */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-4">Gifts</h2>
        <p className="text-ink/75 leading-relaxed max-w-prose">
          Gifting (dana) may be mentioned gently &mdash; a word at the welcome or a
          note in the program &mdash; but it is not expected and should never
          feel like an obligation. A bowl or box placed quietly near the exit is
          enough. Those moved to give may do so; those who are not need
          should not feel compelled.
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
            psalms, short prose or wisdom passages from any tradition are
            appropriate. These ought to move people to contemplation -
            perhaps deeper meditation practice.
          </li>
          <li>
            The space need not be elaborate, but should be safe and
            comfortable. It is possible to arrange participants in a
            circle &mdash; or in organic rows as this supports a sense of shared practice and
            allows everyone to see the facilitator(s). Mats or cushions on the floor are
            ideal; chairs are equally welcome and should always be
            available for those who need them.
          </li>
          <li>
            Some instruction or explanation may be given (especially for the newcomers) at the start along with a
            brief welcome and a description of the format. The bell does
            the rest. People may stay for the entire session or only a part.
            When a sitting begins, however, people should plan to stay for the whole sitting.
            Then, the room is to be quiet and preferably dark.
            Late arrivals should be aware prior to entry that the room should be kept quiet
            and avoid disrupting people.
            It is appropriate that shoes are removed and placed in a joining room.
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
