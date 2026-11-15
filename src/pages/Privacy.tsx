import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";
import { commentsEnabled } from "~/lib/auth";

// Repeated on every inline link; named so the JSX stays readable.
const linkClass = "text-accent underline underline-offset-2 hover:no-underline";


/**
 * Privacy notice for information people send through this site, plus the
 * terms that apply to what they submit.
 *
 * Every claim here has to stay true to what the code actually does. If you
 * change what is collected, stored, logged, or how long it is kept, change
 * this page in the same commit. The specifics it commits to today:
 *   - the forum question form is retired and every submission was deleted
 *   - no IP address is stored with any submission
 *   - page visits ARE counted via /_beacon in CloudFront access logs
 *   - with comments on (VITE_ENABLE_COMMENTS): accounts hold email, display
 *     name, comments and reactions; comments are public; screening holds,
 *     never rejects; nothing expires; self-serve deletion on /account/
 * The comment wording follows the same flag as the feature, so the page never
 * describes something the site isn't doing.
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
      <p className="text-ink/60 text-sm mb-12">
        Last updated: {commentsEnabled ? "November 2026" : "October 2026"}
      </p>

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
        {commentsEnabled && (
          <p>
            Comments on posts are the one exception: they are public, shown under
            the display name you choose. Your email address is never shown.
          </p>
        )}
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

            {commentsEnabled && (
              <div>
                <h3 className="font-semibold text-ink/90 mb-2">
                  Comments and reactions
                </h3>
                <p>
                  To comment or react to a post, you sign in with your email
                  address, which creates an account. The account holds your email
                  address, the display name you choose, and the comments and
                  reactions you post. The email address is used to sign you in and
                  for nothing else. It is never shown to anyone, and signing in
                  signs you up for nothing.
                </p>
                <p className="mt-4">
                  Comments are public: anyone who visits the page can read them,
                  with your display name and the date. Reaction totals are public;
                  the names of the people who reacted are not shown. Accounts are
                  for people 13 and older.
                </p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-ink/90 mb-2">
                Forum questions
              </h3>
              <p>
                In October 2026 this site collected questions for a forum on
                coming out. That form is closed and no longer collects anything,
                and every question submitted through it has been deleted.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-ink/90 mb-2">Visits to pages</h3>
              <p>
                This site counts page visits so it is possible to know which
                writing is being read. That counting is anonymous and
                aggregate &mdash; which page, and when. There are no
                advertising trackers, no third-party analytics scripts, no
                social media pixels{commentsEnabled ? "." : ", and no accounts to create."}
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
              {commentsEnabled &&
                " If you sign in to comment, your browser keeps a sign-in token so you stay signed in. It is used only by this site."}
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
          {commentsEnabled && (
            <p className="mt-4">
              Comments are the exception: they are public. Your email address is
              not shown to anyone, including other commenters. Each comment is
              checked automatically for abusive content when it is posted, using a
              screening service from Amazon Web Services. A comment that is
              flagged, or that several readers report, is held until Tony reviews
              it.
            </p>
          )}
          <p className="mt-4">
            Messages are delivered and stored using Amazon Web Services in the
            United States, encrypted in transit and at rest.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">How long it is kept</h2>
          <p>
            Nothing expires automatically. Contact messages are kept as long
            as they are useful for replying and following up, and no longer.
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
            do.
          </p>
          {commentsEnabled && (
            <p className="mt-4">
              Comments and reactions are kept until you delete them. You can delete
              any of your comments at any time, and you can delete your whole
              account, with every comment and reaction, from your{" "}
              <Link to="/account/" className={linkClass}>
                account page
              </Link>
              . A comment removed for breaking the guidelines is hidden from the
              site and deleted with your account. A record of moderation actions,
              without the comment text, is kept. Backups are kept for 35 days, so
              deleted information is fully gone 35 days after you delete it.
            </p>
          )}
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
              permission for it to be read, and you keep ownership of your
              words.
            </li>
            <li>
              <strong>Please write about yourself.</strong> Leave out private details
              about other people unless they have agreed to have their
              situation discussed &mdash; especially anything about someone
              else&apos;s sexual orientation or gender identity, which is
              theirs to share rather than ours.
            </li>
            {commentsEnabled && (
              <li>
                <strong>Comments are shown publicly.</strong> By posting one, you
                give permission for it to be shown on this site with your display
                name until you delete it. The{" "}
                <Link to="/terms" className={linkClass}>
                  terms of use
                </Link>{" "}
                set out the community guidelines for comments.
              </li>
            )}
            <li>
              <strong>Nothing harassing or threatening.</strong> Submissions
              that threaten or target someone are set aside and reviewed rather
              than used, and may be deleted or reported. Hard questions,
              sharply-put questions, and questions that quote something cruel
              said to you are all welcome &mdash; that is a different thing
              entirely, and the difference is understood.
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
