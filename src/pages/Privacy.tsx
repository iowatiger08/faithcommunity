import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

// Repeated on every inline link; named so the JSX stays readable.
const linkClass = "text-accent underline underline-offset-2 hover:no-underline";


/**
 * Privacy notice for information people send through this site, plus the
 * terms that apply to what they submit.
 *
 * Every claim here has to stay true to what the code actually does. If you
 * change what is collected, stored, logged, or how long it is kept, change
 * this page in the same commit. The specifics it commits to today:
 *   - forum anonymity omits name/email server-side (lambda/forum-intake)
 *   - no IP address is stored with any submission
 *   - forum notification emails are content-free by default
 *   - no TTL: forum questions persist until deleted deliberately
 *   - page visits ARE counted via /_beacon in CloudFront access logs
 */
export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Privacy"
        description={
          "What happens to the information you send through this site — what is " +
          "collected, who can see it, how long it is kept, and how to have it " +
          "deleted."
        }
        path="/privacy/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">Privacy</p>
      <h1 className="font-serif text-4xl mb-4 leading-tight">
        What happens to what you send
      </h1>
      <p className="text-ink/60 text-sm mb-12">Last updated: October 2026</p>

      <div className="space-y-5 text-lg text-ink/80 max-w-prose leading-relaxed mb-12">
        <p>
          People write to this ministry about things that matter &mdash; grief,
          doubt, recovery, prayer, coming out. That deserves a plain account of
          where those words go, rather than a page of legal boilerplate nobody
          reads.
        </p>
        <p>
          So here is the short version: what you send goes to Tony. Nobody else
          reads it, it is never published, it is never sold or shared, and you
          can ask to have it deleted at any time.
        </p>
      </div>

      <div className="space-y-12 text-ink/80 leading-relaxed">

        <section>
          <h2 className="font-serif text-2xl mb-4">What is collected</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-ink/90 mb-2">The contact form</h3>
              <p>
                Your email address, the category you pick, and your message.
                The email address is used to reply to you, and for nothing
                else. Writing in signs you up for nothing. There is no mailing list.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-ink/90 mb-2">
                The forum question form
              </h3>
              <p>
                Your question, and &mdash; unless you choose to ask
                anonymously &mdash; your name and email address.
              </p>
              <p className="mt-4">
                <strong className="text-ink/90">Anonymous means anonymous.</strong>{" "}
                When that box is ticked, your name and email are not sent from
                your browser, and the server is written to ignore those fields entirely.
                There is no hidden copy. If
                you are not out, or not out to everyone, that option exists for
                exactly this reason and you should feel free to use it.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-ink/90 mb-2">Visits to pages</h3>
              <p>
                This site counts page visits so it is possible to know which
                writing is being read. That counting is anonymous and
                aggregate &mdash; which page, and when. There are no
                advertising trackers, no third-party analytics scripts, no
                social media pixels, and no accounts to create.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">
            What is deliberately not collected
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>No IP address is stored with any submission.</strong> An
              address kept next to an anonymous message would undo the
              anonymity, so it is not kept.
            </li>
            <li>
              <strong>No tracking cookies and no advertising.</strong> Nothing
              here follows you to other sites, and nothing about you is sold or given to
              advertisers, now or ever.
            </li>
            <li>
              <strong>Nothing you write is used to train AI models</strong>, either by
              this ministry or by any third party. The
              same restriction this site places on its own content, in the{" "}
              <Link to="/terms" className={linkClass}>
                terms of use
              </Link>
              , applies to yours.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Who can see it</h2>
          <p>
            Tony E Hansen, and no one else. Submissions are not posted publicly,
            not shown to other members of any congregation, and not shared with
            any church, organization, or third party.
          </p>
          <p className="mt-4">
            Messages are delivered and stored using Amazon Web Services in the
            United States, encrypted in transit and at rest. For forum
            questions, the notification email sent to Tony deliberately
            contains no question text at all &mdash; just a reference number
            &mdash; so that the only copy of what you wrote stays in one place
            rather than living indefinitely in an inbox.
          </p>
          <p className="mt-4">
            Forum questions are raised{" "}
            <strong className="text-ink/90">without your name attached</strong>{" "}
            unless you tick the box on the form giving permission to use it.
            Unticked is the default, so doing nothing keeps you unattributed.
            Submitting anonymously means there is no name to attach in the
            first place.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">How long it is kept</h2>
          <p>
            Nothing expires automatically. Forum questions are kept until they
            are deliberately deleted, which happens once the forum they were
            submitted for is over. Contact messages are kept as long as they
            are useful for replying and following up, and no longer.
          </p>
          <p className="mt-4">
            <strong className="text-ink/90">
              You can ask for yours to be deleted at any time
            </strong>,
            for any reason or none, through the{" "}
            <Link to="/contact" className={linkClass}>
              contact page
            </Link>
            . You never have to explain why, and asking is a perfectly ordinary thing to
            do. If you submitted a forum question anonymously there is
            nothing linking it to you, so say roughly what it was about and it
            will be found and removed.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Two honest limits</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-ink/90 mb-2">
                This is not confidential pastoral conversation
              </h3>
              <p>
                A message typed into a web form is not the same thing as a
                private conversation with a pastor, and it may lack the legal protection
                that such a conversation can carry. If you need to say something that
                must stay
                privileged, say it in person instead &mdash; ask, and that
                conversation can be arranged.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-ink/90 mb-2">
                Please do not use these forms in an emergency
              </h3>
              <p>
                Submissions are read periodically, not continuously, so a form
                is the wrong tool when something is urgent. If you or someone
                you love is in danger right now, call or text{" "}
                <strong className="text-ink/90">988</strong> for the Suicide
                &amp; Crisis Lifeline, or 911. More places to turn are on the{" "}
                <Link to="/care#crisis" className={linkClass}>
                  care &amp; support page
                </Link>
                .
              </p>
              <p className="mt-4">
                And one thing said plainly rather than buried: if something you
                write indicates that a child is being harmed, or that someone
                is in immediate danger, Tony may be obliged &mdash; morally and
                in some circumstances legally &mdash; to act on it, including
                by contacting someone who can help. That is the one exception to
                everything above, and it exists because silence in that situation would
                do more harm than good.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Terms for what you submit</h2>
          <p className="mb-4">
            By sending something through this site, you agree that:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>What you write stays yours.</strong> You are giving
              permission for it to be read, and for a forum question to be
              raised and discussed without your name attached &mdash; You keep ownership
              of your words.
            </li>
            <li>
              <strong>Please write about yourself.</strong> Leave out private details
              about other people unless they have agreed to have their
              situation discussed &mdash; especially anything about someone
              else&apos;s sexual orientation or gender identity, which is
              theirs to share rather than ours.
            </li>
            <li>
              <strong>Nothing harassing or threatening.</strong> Submissions
              that threaten or target someone are set aside and reviewed rather
              than used, and may be deleted or reported. Hard questions,
              sharply-put questions, and questions that quote something cruel
              said to you are all welcome &mdash; that is a different thing
              entirely, and the difference is understood.
            </li>
            <li>
              <strong>Not every question can be used.</strong> There is limited
              time in a forum and some questions are better answered privately.
              If yours is not raised, it has still been read and it still counts.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">If this notice changes</h2>
          <p>
            The date at the top says when this was last revised. If what
            happens to submitted information ever changes materially, this page
            changes with it &mdash; and a change would apply only going forward, never
            to something you already sent under these terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Questions about any of this</h2>
          <p>
            Ask. The{" "}
            <Link to="/contact" className={linkClass}>
              contact page
            </Link>{" "}
            reaches Tony directly, and a question about how your information is
            handled is a perfectly good reason to write.
          </p>
        </section>

      </div>

      <div className="mt-16 pt-8 border-t border-ink/10">
        <p className="text-sm text-ink/60">
          See also the{" "}
          <Link to="/terms" className={linkClass}>
            terms of use
          </Link>{" "}
          covering how this ministry&apos;s own writing may be shared.
        </p>
      </div>
    </div>
  );
}
