import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

// ── Payment accounts ────────────────────────────────────────────────────────
// TODO: set these once the ministry's accounts are live, and the buttons
// below activate automatically.
//   VENMO_USERNAME — the handle after the @, e.g. "HopeAndTruthMinistry"
//                    (links to https://venmo.com/u/HopeAndTruthMinistry)
//   PAYPAL_URL     — a PayPal.me link or hosted Donate-button URL,
//                    e.g. "https://www.paypal.com/paypalme/HopeAndTruth"
const VENMO_USERNAME = "";
const PAYPAL_URL = "https://paypal.me/tonyehansen1";

const venmoUrl = VENMO_USERNAME ? `https://venmo.com/u/${VENMO_USERNAME}` : "";
const givingLive = Boolean(venmoUrl || PAYPAL_URL);

export default function Give() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Give &amp; Volunteer"
        description="Support a ministry without walls. Offer a gift to sustain this ministry's outreach, or lend your hands as a volunteer alongside neighbors in central Iowa."
        path="/give/"
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Give &amp; Volunteer
      </p>
      <h1 className="font-serif text-5xl mb-8 leading-tight">
        Help keep the lamp lit.
      </h1>

      <div className="space-y-6 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          This is a small ministry doing what it can &mdash; sermons and
          reflections offered freely, and care carried to neighbors close to
          home. Your generosity, of money or of time, helps keep that work
          going.
        </p>
      </div>

      {/* Financial gifts */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-3">Offer a gift</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-6">
          Every gift, of any size, helps sustain this ministry and its outreach.
          Thank you for your kindness.
        </p>

        {givingLive ? (
          <div className="flex flex-wrap gap-3">
            {venmoUrl && (
              <a
                href={venmoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-accent text-paper rounded font-medium hover:bg-accent/90"
              >
                Give with Venmo
              </a>
            )}
            {PAYPAL_URL && (
              <a
                href={PAYPAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-ink/20 rounded font-medium hover:border-ink/40"
              >
                Give with PayPal
              </a>
            )}
          </div>
        ) : (
          <div className="border border-accent/40 bg-accent/5 rounded p-6">
            <p className="font-serif text-xl mb-2">Online giving is coming soon.</p>
            <p className="text-ink/80">
              We&apos;re setting up Venmo and PayPal so you can give securely in a
              tap. Check back shortly &mdash; or, in the meantime,{" "}
              <Link to="/contact" className="text-accent underline">
                contact us
              </Link>{" "}
              and we&apos;ll let you know when it&apos;s ready.
            </p>
          </div>
        )}
      </section>

      {/* Volunteer */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">Lend a hand</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-4">
          Time and presence are gifts too. This ministry serves alongside
          neighbors in central Iowa &mdash; and there is always room for another
          pair of hands.
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://ubfmdesmoines.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline underline-offset-2 hover:no-underline"
            >
              Urban Bicycle Food Ministry &mdash; Des Moines (UBFM-DSM)
            </a>
            <p className="text-sm text-ink/70 mt-0.5">
              Help prepare and deliver meals to neighbors experiencing
              homelessness.
            </p>
          </li>
          <li>
            <span className="font-medium">Area food pantries</span>
            <p className="text-sm text-ink/70 mt-0.5">
              Sort, stock, and share. Find a pantry near you through{" "}
              <a
                href="https://www.211.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:no-underline"
              >
                2-1-1
              </a>
              .
            </p>
          </li>
        </ul>
      </section>

      {/* Stewardship Resources */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">Stewardship resources</h2>
        <p className="text-ink/80 max-w-prose leading-relaxed mb-6">
          Stewardship is more than a budget line &mdash; it is how a ministry
          sustains its mission and honors the trust of its community. Whether
          you lead a congregation, a small church, or an independent ministry,
          these resources can help you build a healthy financial foundation and
          cultivate a culture of generosity.
        </p>

        <ul className="space-y-5">
          <li className="border-l-2 border-accent/30 pl-4">
            <p className="font-medium text-ink/90">Stewardship guides &amp; campaign resources</p>
            <p className="text-sm text-ink/70 mt-1 leading-relaxed">
              Practical tools for annual pledge campaigns, capital initiatives,
              and year-round generosity programs &mdash; coming from Hope and
              Truth Ministry.
            </p>
            <p className="text-xs text-ink/40 mt-1">Coming soon</p>
          </li>

          <li className="border-l-2 border-accent/30 pl-4">
            <p className="font-medium text-ink/90">
              <a
                href="https://www.ecfa.org/Content/Resource-Library"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:no-underline"
              >
                ECFA Resource Library
              </a>
            </p>
            <p className="text-sm text-ink/70 mt-1 leading-relaxed">
              The Evangelical Council for Financial Accountability offers free
              guides on church financial management, accountability, and donor
              communication best practices.
            </p>
          </li>

          <li className="border-l-2 border-accent/30 pl-4">
            <p className="font-medium text-ink/90">
              <a
                href="https://www.generositypath.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:no-underline"
              >
                Generosity Path
              </a>
            </p>
            <p className="text-sm text-ink/70 mt-1 leading-relaxed">
              Resources rooted in the theology and practice of generosity &mdash;
              helping ministers and congregations move from transactions to
              transformation in their giving culture.
            </p>
          </li>

          <li className="border-l-2 border-accent/30 pl-4">
            <p className="font-medium text-ink/90">Ministry financial consultation</p>
            <p className="text-sm text-ink/70 mt-1 leading-relaxed">
              Hope and Truth Ministry is developing a stewardship consultation
              service for churches and independent ministries &mdash; covering
              budgeting, giving systems, donor communication, and long-term
              financial sustainability.
            </p>
            <p className="text-xs text-ink/40 mt-1">Coming soon &mdash;{" "}
              <Link to="/contact" className="text-accent underline">
                contact us to be notified
              </Link>
            </p>
          </li>
        </ul>
      </section>

      <div className="mt-16 pt-8 border-t border-ink/10">
        <p className="text-ink/70 max-w-prose leading-relaxed">
          Learn more{" "}
          <Link to="/about" className="text-accent underline">
            about this ministry
          </Link>
          , or explore where it already serves on the{" "}
          <Link to="/care" className="text-accent underline">
            care &amp; support
          </Link>{" "}
          page.
        </p>
      </div>
    </div>
  );
}
