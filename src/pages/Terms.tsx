import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Terms of Use"
        description="How the content at Hope and Truth Ministry may be used, shared, and attributed — including original sermons, liturgy, meditations, and adapted scripture."
        path="/terms/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Terms of Use
      </p>
      <h1 className="font-serif text-4xl mb-4 leading-tight">
        Using this ministry&apos;s content
      </h1>
      <p className="text-ink/60 text-sm mb-12">
        Last updated: June 2026
      </p>

      <div className="space-y-12 text-ink/80 leading-relaxed">

        <section>
          <h2 className="font-serif text-2xl mb-4">Who this covers</h2>
          <p>
            The original content on this site &mdash; sermons, reflections,
            psalm adaptations, pastoral prayers, blessings, meditations, and
            other liturgical materials &mdash; is the work of{" "}
            <strong>Tony E Hansen</strong>, published through{" "}
            <strong>Hope and Truth Ministry</strong> at{" "}
            hopeandtruthministry.com.
          </p>
          <p className="mt-4">
            These terms apply to Tony E Hansen&apos;s original writings. Content
            quoted or adapted from other sources &mdash; scripture, classical
            texts, named authors &mdash; is governed by its own rights holders
            and is identified as such wherever it appears.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">What you may do freely</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-ink/90 mb-2">Personal and devotional use</h3>
              <p>
                You are welcome to read, print, save, and share any content
                from this site for personal study, prayer, and reflection.
                No permission is needed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-ink/90 mb-2">Online sharing with attribution</h3>
              <p>
                You may share excerpts, quotes, and links on blogs, social
                media, newsletters, and websites, provided you include a clear
                attribution (see the standard form below). Do not reproduce
                full pieces in full without permission.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-ink/90 mb-2">Congregational and worship use</h3>
              <p>
                Churches, congregations, and worship leaders are welcome to use
                the psalm adaptations, pastoral prayers, blessings, and
                liturgical materials in worship services. We ask two things:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  Include a credit line in your bulletin or order of service:{" "}
                  <em>
                    &ldquo;Tony E Hansen, Hope and Truth Ministry
                    (hopeandtruthministry.com)&rdquo;
                  </em>
                </li>
                <li>
                  Drop us a note to let us know where the work is being used.
                  You can reach us through the{" "}
                  <Link to="/subscribe" className="text-accent underline">
                    contact page
                  </Link>
                  . No formal approval is required &mdash; we&apos;d simply
                  love to know.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">What requires permission</h2>
          <p className="mb-4">
            The following uses require explicit written permission from Tony
            Hansen before proceeding. Contact us to discuss.
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Commercial republication</strong> &mdash; selling,
              licensing, or otherwise monetizing this content in books,
              courses, paid resources, or any commercial product.
            </li>
            <li>
              <strong>Derivative works</strong> &mdash; adapting, remixing,
              or significantly modifying the content for publication or
              distribution, without crediting the original and notifying
              this ministry.
            </li>
            <li>
              <strong>Removing attribution</strong> &mdash; reproducing or
              distributing content with the authorship stripped or obscured.
            </li>
            <li>
              <strong>AI and machine learning use</strong> &mdash; using
              this content as training data for artificial intelligence or
              machine learning models, in whole or in part, is not permitted
              without explicit written permission.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Standard attribution form</h2>
          <p className="mb-4">
            When sharing or citing content from this site, please use one of
            the following forms:
          </p>

          <div className="space-y-4">
            <div className="bg-ink/5 rounded p-4 text-sm font-mono leading-relaxed">
              <p className="text-ink/50 text-xs uppercase tracking-wide mb-2 font-sans">Online (with link)</p>
              Tony E Hansen, Hope and Truth Ministry<br />
              hopeandtruthministry.com/[page-url]
            </div>

            <div className="bg-ink/5 rounded p-4 text-sm font-mono leading-relaxed">
              <p className="text-ink/50 text-xs uppercase tracking-wide mb-2 font-sans">Print / bulletin</p>
              &copy; Tony E Hansen, Hope and Truth Ministry.<br />
              Used with attribution. hopeandtruthministry.com
            </div>

            <div className="bg-ink/5 rounded p-4 text-sm font-mono leading-relaxed">
              <p className="text-ink/50 text-xs uppercase tracking-wide mb-2 font-sans">Short form (social media, footnote)</p>
              &mdash; Tony E Hansen / hopeandtruthministry.com
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Copyright notices</h2>
          <p className="mb-4">
            Scripture quotations on this site are drawn primarily from the
            following translations:
          </p>
          <div className="space-y-4 text-sm text-ink/70 leading-relaxed">
            <p>
              <strong className="text-ink/90">NRSV</strong> &mdash; Scripture
              quotations are from the New Revised Standard Version Bible,
              copyright &copy; 1989 National Council of the Churches of Christ
              in the United States of America. Used by permission. All rights
              reserved worldwide.
            </p>
            <p>
              <strong className="text-ink/90">NRSVUE</strong> &mdash; Scripture
              quotations marked NRSVUE are taken from the New Revised Standard
              Version Updated Edition, copyright &copy; 2021 National Council
              of Churches of Christ in the United States of America. Used by
              permission. All rights reserved worldwide.
            </p>
            <p className="text-ink/60">
              Those wishing to quote scripture excerpts from these translations
              in their own publications should refer to the respective
              publishers&apos; permissions guidelines for applicable limits
              and attribution requirements.
            </p>
          </div>

          <p className="mt-6 mb-2 text-sm text-ink/70">Lectionary:</p>
          <div className="text-sm text-ink/70 leading-relaxed">
            <p>
              <strong className="text-ink/90">RCL</strong> &mdash; Revised
              Common Lectionary, Copyright &copy; 1992 Consultation on Common
              Texts. Used by permission.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Original vs. adapted content</h2>
          <p>
            Where content on this site adapts, quotes, or is inspired by
            other sources &mdash; classical Zen stories, Taoist texts, poetry,
            or other traditions &mdash; the source is identified in the text.
            Tony E Hansen asserts authorship only over his original writings.
            Quoted material remains under the rights of its respective
            authors or traditions.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Contact &amp; permissions</h2>
          <p>
            For permission requests, questions about attribution, or to let us
            know your congregation is using these materials, please reach out
            through the{" "}
            <Link to="/subscribe" className="text-accent underline">
              contact page
            </Link>
            . We aim to respond to all inquiries.
          </p>
        </section>

      </div>
    </div>
  );
}
