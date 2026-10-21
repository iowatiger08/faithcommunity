import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import PageHead from "~/components/PageHead";

const API_BASE = import.meta.env.VITE_FORUM_API_BASE;

// Repeated on every inline link; named so the JSX stays readable.
const linkClass = "text-accent underline underline-offset-2 hover:no-underline";


/**
 * Submissions close at noon CDT on the day of the forum. This is a courtesy
 * copy of the cutoff for the UI only &mdash; the Lambda enforces the same
 * instant, so a page left open in a tab cannot submit after it.
 */
const CLOSES_AT = Date.parse("2026-10-25T17:00:00Z");

const MAX_QUESTION_LENGTH = 5000;

interface VerifyResponse {
  ok?: boolean;
  token?: string;
  expiresAt?: number;
  error?: string;
}

interface SubmitResponse {
  ok?: boolean;
  id?: string;
  error?: string;
}

interface Stat {
  figure: string;
  detail: string;
  source: string;
}

// ── Statistics ───────────────────────────────────────────────────────────────────────
// Every figure is checked against a primary source, and every source is named
// inline with its year. In a church forum the numbers will be questioned, and
// an unsourced figure is worse than no figure. Years matter: where the newest
// available data is older, the year is stated rather than hidden.

const acceptance: Stat[] = [
  {
    figure: "40% lower",
    detail:
      "odds of a suicide attempt in the past year among LGBTQ+ young people who have " +
      "at least one accepting adult in their life — 17%, compared with more than 25% " +
      "for those who have none.",
    source: "The Trevor Project, 2019 national survey",
  },
  {
    figure: "35% lower",
    detail:
      "odds of a past-year suicide attempt for young people with at least one " +
      "LGBTQ-affirming space in their life. For transgender and nonbinary youth, a " +
      "gender-affirming space is associated with 25% lower odds.",
    source: "The Trevor Project research brief, 2020 data",
  },
  {
    figure: "6% vs. 18%",
    detail:
      "attempted suicide in the past year: 6% of LGBTQ+ young people in very " +
      "accepting communities, compared with 18% in the least accepting. Less than a " +
      "third of the rate.",
    source:
      "The Trevor Project, 2025 national survey (16,000+ young people, ages 13–24)",
  },
  {
    figure: "7% vs. 18%",
    detail:
      "attempted suicide among transgender and nonbinary young people: 7% where " +
      "everyone at home respected their pronouns, compared with 18% where no one " +
      "did.",
    source: "The Trevor Project, 2025 national survey",
  },
];

const rejection: Stat[] = [
  {
    figure: "8.4×",
    detail:
      "more likely to have attempted suicide: lesbian, gay, and bisexual young " +
      "adults who experienced high levels of family rejection as adolescents. They " +
      "were also 5.9× as likely to report high levels of depression and 3.4× as " +
      "likely to use illegal drugs.",
    source: "Family Acceptance Project, San Francisco State University (Ryan et al.)",
  },
  {
    figure: "13%",
    detail:
      "of LGBTQ+ young people have been threatened with or subjected to conversion " +
      "therapy — a practice every major medical association rejects, and one " +
      "associated with more than double the likelihood of a past-year suicide " +
      "attempt.",
    source: "The Trevor Project, 2024 national survey",
  },
  {
    figure: "54%",
    detail:
      "of the more than 1,320 active conversion therapy practitioners identified " +
      "across 48 states operate in a ministerial or religious capacity. This is the " +
      "harm a church is most likely to be caught up in, and the reason this forum is " +
      "worth holding.",
    source: "The Trevor Project practitioner report",
  },
  {
    figure: "65.5% → 49.6%",
    detail:
      "screened positive for depression among transgender and gender-expansive youth " +
      "whose families never use their correct pronouns. Where families always use " +
      "them, the figure falls to 49.6%. Using a young person’s correct name moves " +
      "anxiety from 72.1% to 61.9%. Small courtesies are doing real work.",
    source: "HRC Foundation, 2023 LGBTQ+ Youth Report (12,615 youth ages 13–18)",
  },
];

const scale: Stat[] = [
  {
    figure: "36%",
    detail:
      "of LGBTQ+ young people seriously considered suicide in the past year, " +
      "including 40% of transgender and nonbinary young people. One in ten attempted.",
    source: "The Trevor Project, 2025 national survey",
  },
  {
    figure: "59%",
    detail:
      "of LGBTQ+ young people ages 13–17 were bullied in the past year. Those who " +
      "were bullied attempted suicide at more than three times the rate of those who " +
      "were not.",
    source: "The Trevor Project, 2025 national survey",
  },
  {
    figure: "34% in Iowa",
    detail:
      "of LGBTQ+ young people in this state seriously considered suicide in the past " +
      "year, including 42% of transgender and nonbinary young people. Nine percent " +
      "attempted — 13% among transgender and nonbinary youth.",
    source: "The Trevor Project, 2024 50-state report (Iowa)",
  },
  {
    figure: "51% and 67%",
    detail:
      "of LGBTQ+ youth reported for depression and for anxiety " +
      "respectively, and 30% for severe psychological distress. Transgender and " +
      "gender-expansive youth were higher on every measure.",
    source: "HRC Foundation, 2023 LGBTQ+ Youth Report",
  },
];

const comingOut: Stat[] = [
  {
    figure: "96%",
    detail:
      "of LGBTQ adults have told someone that they are or might be LGBTQ. Even so, " +
      "23% have still not told their parents or the people who raised them.",
    source: "Pew Research Center, January 2025 survey",
  },
  {
    figure: "46%",
    detail:
      "say all of their parents are accepting — 52% of gay and lesbian adults, 44% " +
      "of bisexual adults, and 31% of transgender adults.",
    source: "Pew Research Center, 2025",
  },
  {
    figure: "56% and 39%",
    detail:
      "had told their mother and their father respectively. One-third of religiously " +
      "affiliated LGBT adults reported a conflict between their religious beliefs " +
      "and their identity.",
    source: "Pew Research Center, 2013 survey — the most recent with this breakdown",
  },
  {
    figure: "82.7%, but 26.4%",
    detail:
      "of LGBTQ+ youth are out to at least one person in their immediate family — " +
      "but only a quarter are out to all of them, and 40.9% to all of their parents " +
      "or guardians. Coming out is rarely one conversation. It is a long series of " +
      "them, and it is seldom finished.",
    source: "HRC Foundation, 2023 LGBTQ+ Youth Report (12,615 youth ages 13–18)",
  },
  {
    figure: "63% and 57%",
    detail:
      "Both at once: 63.1% of LGBTQ+ youth reported at least one supportive response " +
      "from a parent, and 57.4% reported at least one rejecting one. Those " +
      "majorities overlap, so most young people get both from the same family — " +
      "often from the same person. Families are seldom all one thing.",
    source: "HRC Foundation, 2023 LGBTQ+ Youth Report",
  },
  {
    figure: "85%",
    detail:
      "of LGBTQ+ adults are at least somewhat open about who they are. A third have " +
      "grown more open over the past two years, while 22% have grown less — and 78% " +
      "believe social acceptance of transgender and nonbinary people has fallen in " +
      "that time. Coming out runs both ways: people step back when it stops feeling " +
      "safe.",
    source:
      "HRC Community Insights, survey of 9,328 LGBTQ+ adults, August–September 2026",
  },
];

const faith: Stat[] = [
  {
    figure: "21%",
    detail:
      "of LGBTQ young people say religion or spirituality is important or very " +
      "important to them — 26% of those aged 18–24. Nearly a quarter pray, meditate, " +
      "or reflect at least weekly.",
    source: "The Trevor Project research brief, December 2022",
  },
  {
    figure: "No significant effect",
    detail:
      "was found between valuing religion and suicide risk, in either direction. " +
      "Faith on its own does not settle the question. What the research keeps " +
      "pointing to is whether the community around a person is affirming — and that " +
      "is something a congregation chooses.",
    source: "The Trevor Project research brief, December 2022",
  },
];

// The most directly relevant data on this page for a congregation: church is
// the place LGBTQ+ young people are least likely to be out. HRC asked these
// questions in its reports on Black and Latine LGBTQ+ youth, so the figures
// describe those populations rather than all young people.
const church: Stat[] = [
  {
    figure: "63.1%",
    detail:
      "of Black LGBTQ+ youth raised in a religion said that religion was unfriendly " +
      "to LGBTQ+ people. Among Latine LGBTQ+ youth the figure is 60.3%.",
    source:
      "HRC Foundation, 2024 Black LGBTQ+ Youth Report (~1,200 youth, with the " +
      "University of Connecticut) and 2024 Latine LGBTQ+ Youth Report (~2,200 youth)",
  },
  {
    figure: "54.5%",
    detail:
      "said their religious beliefs triggered feelings of guilt and shame when they " +
      "came out — 52.1% among Latine LGBTQ+ youth. This is the part that belongs to " +
      "the church. The family’s reaction belongs to the family and the school’s to " +
      "the school. This one is ours.",
    source: "HRC Foundation, 2024 Black and Latine LGBTQ+ Youth Reports",
  },
  {
    figure: "1 in 5",
    detail:
      "Black LGBTQ+ youth are out to even some members of their faith community " +
      "(20.1%). That makes the congregation the place they are least likely to be " +
      "known — behind family, friends, and school.",
    source: "HRC Foundation, 2024 Black LGBTQ+ Youth Report",
  },
  {
    figure: "25.9%",
    detail:
      "said the leaders of their faith community support and include them as an " +
      "LGBTQ+ person. Among Latine LGBTQ+ youth it is 20%. Which leaves roughly " +
      "three in four sitting in a pew on Sunday without that.",
    source: "HRC Foundation, 2024 Black and Latine LGBTQ+ Youth Reports",
  },
];

// Employment. Worth having on the page because the forum is not only about
// teenagers: most of the congregation is of working age, and these figures
// describe a decision adults make every week about whether to be known.
const work: Stat[] = [
  {
    figure: "47%",
    detail:
      "of LGBTQ workers have experienced discrimination or harassment at work at " +
      "some point. A third — 34% — have been fired, not hired, or passed over for " +
      "promotion because of who they are. 17% experienced something in the past year " +
      "alone.",
    source:
      "Williams Institute, UCLA School of Law — survey of 1,902 LGBTQ workers, 2023",
  },
  {
    figure: "46%",
    detail:
      "are not out to their current supervisor, and 21% are not out to a single " +
      "coworker. A great many people spend their working lives managing what their " +
      "colleagues know.",
    source: "Williams Institute, UCLA School of Law, 2023",
  },
  {
    figure: "39% vs. 12%",
    detail:
      "reported discrimination among those who are out at work, against those who " +
      "are out to no one — more than three times the rate. Being known carries a " +
      "cost, and people price that cost accurately. It is worth remembering before " +
      "telling anyone that they ought to be braver.",
    source: "Williams Institute, UCLA School of Law, 2023",
  },
  {
    figure: "33%",
    detail:
      "have left a job because of how an employer treated them over their sexual " +
      "orientation or gender identity. Discrimination does not only cost people a " +
      "promotion. It costs them careers.",
    source: "Williams Institute, UCLA School of Law, 2023",
  },
];

// Aging. Nearly all of the research on this subject is about young people,
// which can leave the impression that this is a young person's question. The
// people in a pew on a given Sunday are, on average, not young.
const older: Stat[] = [
  {
    figure: "3 million → 7 million",
    detail:
      "LGBT adults over the age of 50 in the United States today, a figure expected " +
      "to reach around seven million by 2030. These are people who came of age when " +
      "being openly gay could cost you your job, your housing, or your liberty.",
    source: "SAGE and the National Resource Center on LGBT Aging, Facts on LGBT Aging",
  },
  {
    figure: "2× and 4×",
    detail:
      "as likely to live alone, and four times less likely to have children. The " +
      "care network that most people assume will be there — a spouse, grown kids " +
      "nearby — is far less likely to exist. What stands in its place is friends and " +
      "community.",
    source: "SAGE and the National Resource Center on LGBT Aging",
  },
  {
    figure: "59% and 53%",
    detail:
      "report a lack of companionship and feeling isolated from others. Among SAGE’s " +
      "care-management clients in New York City, one in four said they had no one at " +
      "all to call in an emergency.",
    source: "SAGE and the National Resource Center on LGBT Aging",
  },
  {
    figure: "34%",
    detail:
      "worry about having to hide who they are in order to get into senior housing. " +
      "And 88% say they would feel more comfortable in long-term care if they knew " +
      "staff had been trained in the needs of LGBT patients. Some people go back " +
      "into the closet in order to be cared for.",
    source: "SAGE, drawing on AARP’s Maintaining Dignity survey of LGBT adults 45+",
  },
  {
    figure: "82%",
    detail:
      "report at least one instance of victimization — threats, harassment, or " +
      "physical assault — and about two-thirds have experienced it three or more " +
      "times. More than half report discrimination in employment, housing, or both.",
    source: "SAGE and the National Resource Center on LGBT Aging",
  },
];

// Marriage. This is the question the ELCA has been formally reconsidering, so
// the national numbers are the backdrop to the section that follows.
const marriage: Stat[] = [
  {
    figure: "65%",
    detail:
      "of Americans favor legal same-sex marriage. That is down from a peak of 71% " +
      "in 2022 and 2023 — and up from 27% when Gallup first asked the question in " +
      "1996. The long trend is steeply upward; the last three years are not.",
    source:
      "Gallup, Values and Beliefs survey, May 1–17 2026 (1,001 adults, ±4 points)",
  },
  {
    figure: "87% / 67% / 37%",
    detail:
      "support among Democrats, independents, and Republicans respectively. " +
      "Republican support stood at 55% in 2021 and 2022. Nearly all of the recent " +
      "national decline sits in one of those three columns.",
    source: "Gallup, May 2026",
  },
  {
    figure: "62%",
    detail:
      "say gay or lesbian relations are morally acceptable — the lowest reading " +
      "since 2016. Acceptance is not a ratchet that only turns one way, which is " +
      "worth knowing before assuming this conversation has already been settled by " +
      "time.",
    source: "Gallup, May 2026",
  },
  {
    figure: "76%",
    detail:
      "of white mainline Protestants support same-sex marriage — higher than the " +
      "country as a whole. Across all Americans, 72% support nondiscrimination " +
      "protections for LGBTQ people. In this tradition, welcome is the majority " +
      "position, not the brave one.",
    source: "PRRI 2025 American Values Atlas (22,000+ adults)",
  },
];

function StatList({ items }: { items: Stat[] }) {
  return (
    <ul className="space-y-6 mt-6">
      {items.map((s) => (
        <li key={s.figure + s.source} className="border border-ink/10 rounded-lg p-6">
          <p className="font-serif text-2xl text-accent leading-tight">{s.figure}</p>
          <p className="text-ink/80 mt-2 leading-relaxed">{s.detail}</p>
          <p className="text-xs text-ink/50 mt-3">{s.source}</p>
        </li>
      ))}
    </ul>
  );
}

interface Resource {
  name: string;
  href: string;
  detail: string;
}

const local: Resource[] = [
  {
    name: "One Iowa",
    href: "https://oneiowa.org/resources/hotlines-support/",
    detail:
      "Statewide LGBTQ advocacy, health care referrals, and a directory of hotlines " +
      "and support groups.",
  },
  {
    name: "Iowa Safe Schools",
    href: "https://iowasafeschools.org/",
    detail: "Safe and affirming spaces for LGBTQ youth in Iowa schools since 2002.",
  },
  {
    name: "Capital City Pride",
    href: "https://capitalcitypride.org/resources/lgbtq-organizations/",
    detail: "A directory of LGBTQ+ organizations around Des Moines.",
  },
  {
    name: "PFLAG",
    href: "https://pflag.org/",
    detail:
      "Chapters for parents, families, and allies — the first place many parents " +
      "find other parents.",
  },
  {
    name: "Human Rights Campaign — coming out resources",
    href: "https://www.hrc.org/resources/coming-out",
    detail:
      "Guides written for the person coming out and for the people they are coming " +
      "out to, including workplaces, families, and faith communities. HRC also " +
      "publishes the youth research cited on this page.",
  },
  {
    name: "ReconcilingWorks",
    href: "https://www.reconcilingworks.org/",
    detail:
      "The Lutheran body behind the Reconciling in Christ (RIC) program, which since " +
      "1983 has been how a congregation publicly declares itself welcoming.",
  },
];

function ResourceList({ items }: { items: Resource[] }) {
  return (
    <ul className="space-y-4 mt-6">
      {items.map((r) => (
        <li key={r.name}>
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium ${linkClass}`}
          >
            {r.name}
          </a>
          <p className="text-sm text-ink/70 mt-0.5">{r.detail}</p>
        </li>
      ))}
    </ul>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────────────
export default function Forum() {
  const [token, setToken] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [gateError, setGateError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  // Unchecked means withhold. Phrased as permission rather than refusal so
  // that the safe answer is also the default answer.
  const [allowName, setAllowName] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);
  const [sentWithName, setSentWithName] = useState(false);

  // Evaluated once, in a state initialiser rather than on every render, so
  // the view cannot flip mid-interaction. The Lambda is what actually
  // enforces the cutoff; this only decides which UI to show.
  const [closed] = useState(() => Date.now() >= CLOSES_AT);

  async function verify(e: FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setGateError("");
    try {
      // The code is checked on the server, never here — it must not ship in
      // the JavaScript bundle.
      const res = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, confirm_url: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as VerifyResponse;
      if (res.ok && typeof data.token === "string") {
        setToken(data.token);
        setCode("");
      } else {
        setGateError(data.error ??
          "That code didn't match. Check with the facilitator.");
      }
    } catch {
      setGateError("Something went wrong reaching the server. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  function toggleAnonymous(next: boolean) {
    setAnonymous(next);
    if (next) {
      // Cleared here as a courtesy; the server is what actually guarantees
      // these never get stored.
      setName("");
      setEmail("");
      setAllowName(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setFormError("");
    try {
      const payload: Record<string, unknown> = {
        token,
        anonymous,
        question,
        confirm_url: honeypot,
      };
      if (!anonymous) {
        payload.name = name;
        payload.email = email;
        payload.allowName = allowName;
      }
      const res = await fetch(`${API_BASE}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as SubmitResponse;
      if (res.status === 401) {
        // Back to the gate — but keep what they typed. Losing a long, hard
        // message here would be its own small cruelty.
        setToken(null);
        setGateError(
          "Your session expired. Please enter the code again — your question is " +
          "saved below.");
        return;
      }
      if (res.ok && data.ok === true) {
        setSent(true);
        setSentWithName(allowName);
        setQuestion("");
        setName("");
        setEmail("");
        setAllowName(false);
        return;
      }
      setFormError(data.error ?? "We couldn't send your question. Please try again.");
    } catch {
      setFormError("Something went wrong reaching the server. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHead
        title="Forum Questions"
        description={
          "Submit a question ahead of the Windsor Heights Lutheran Church forum on " +
          "coming out, and read the research on " +
          "acceptance, faith, and LGBTQ+ youth."
        }
        path="/forum/"
        noindex
      />

      <p className="text-sm uppercase tracking-widest text-accent mb-4">
        Windsor Heights Lutheran Church
      </p>
      <h1 className="font-serif text-4xl mb-6 leading-tight">
        Coming out, and being queer as a Christian
      </h1>

      <div className="space-y-5 text-lg text-ink/80 max-w-prose leading-relaxed">
        <p>
          On Sunday, October 25, we are setting aside time to talk together about
          coming out &mdash; what it asks of a person, what it asks of a family,
          and what it asks of a church. This page is where you can send a
          question ahead of time.
        </p>
        <p>
          There is no question too small, too blunt, or too late. The ones that
          are hardest to say out loud are usually the ones worth the hour. If you
          would rather not put your name to it, you don&apos;t have to.
        </p>
      </div>

      {/* ── Ask a question ──────────────────────────────────────────────────────── */}
      <section className="mt-12 rounded-lg border-2 border-accent/40 bg-accent/5 p-6">
        <h2 className="font-serif text-2xl mb-2">Ask a question</h2>

        {closed ? (
          <p className="text-ink/80 leading-relaxed">
            Submissions for this forum are now closed. Thank you to everyone who
            sent something in. The research below stays here, and you are always
            welcome to{" "}
            <Link to="/contact" className={linkClass}>
              get in touch directly
            </Link>
            .
          </p>
        ) : sent ? (
          <div className="space-y-3 text-ink/80 leading-relaxed">
            <p className="font-serif text-xl">Thank you. Your question is in.</p>
            <p>
              It will be read before Sunday and considered in the forum
              {sentWithName
                ? ", and you have said your name may be used."
                : " without your name attached."}
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className={linkClass}
            >
              Ask another question
            </button>
          </div>
        ) : token === null ? (
          <form onSubmit={(e) => { void verify(e); }} className="space-y-4">
            <p className="text-ink/80 leading-relaxed">
              This page is for the Windsor Heights Lutheran congregation. Enter
              the access code from the bulletin or the announcement.
            </p>
            <div>
              <label htmlFor="forum-code" className="block text-sm text-ink/70 mb-1">
                Access code
              </label>
              <input
                id="forum-code"
                type="text"
                required
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded border border-ink/20 bg-paper px-3 py-2"
              />
            </div>
            {gateError !== "" && <p className="text-sm text-accent">{gateError}</p>}
            <button
              type="submit"
              disabled={verifying}
              className="rounded bg-accent px-5 py-2 text-paper disabled:opacity-60"
            >
              {verifying ? "Checking…" : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { void submit(e); }} className="space-y-4">
            <div className="text-sm text-ink/70 leading-relaxed space-y-2">
              <p>
                <span className="font-semibold text-ink/80">Who sees this:</span>{" "}
                only Tony Hansen, who is running the forum. Questions are
                raised without your name unless you give permission below, and
                nothing is posted publicly.
              </p>
              <p>
                Submissions are kept only until they are deleted after the
                forum, and you can ask for yours to be removed sooner at any
                time. If you are not out, or not out to everyone, use the
                anonymous option below &mdash; it is there for exactly this,
                and ticking it means your name and email are never sent.
              </p>
              <p>
                Please don&apos;t use this form for anything urgent &mdash;
                questions are read before Sunday, not continuously. If you need
                someone now, the{" "}
                <Link to="/care#crisis" className={linkClass}>
                  crisis resources
                </Link>{" "}
                are there any hour. Full details of what happens to what you
                send are on the{" "}
                <Link to="/privacy" className={linkClass}>
                  privacy page
                </Link>
                .
              </p>
            </div>

            <label className="flex items-start gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => toggleAnonymous(e.target.checked)}
                className="mt-1"
              />
              <span>Ask this anonymously &mdash; don&apos;t send my name or email</span>
            </label>

            {!anonymous && (
              <>
                <label className="flex items-start gap-2 text-sm text-ink/80">
                  <input
                    type="checkbox"
                    checked={allowName}
                    onChange={(e) => setAllowName(e.target.checked)}
                    className="mt-1"
                  />
                  <span>
                    You may use my name if you raise this. Leave it unticked
                    to stay unattributed.
                  </span>
                </label>

                <div>
                  <label
                    htmlFor="forum-name"
                    className="block text-sm text-ink/70 mb-1"
                  >
                    Your name
                  </label>
                  <input
                    id="forum-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded border border-ink/20 bg-paper px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="forum-email"
                    className="block text-sm text-ink/70 mb-1"
                  >
                    Your email
                  </label>
                  <input
                    id="forum-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border border-ink/20 bg-paper px-3 py-2"
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="forum-question"
                className="block text-sm text-ink/70 mb-1"
              >
                Your question
              </label>
              <textarea
                id="forum-question"
                required
                rows={6}
                maxLength={MAX_QUESTION_LENGTH}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full rounded border border-ink/20 bg-paper px-3 py-2"
              />
            </div>

            {/* Honeypot — bots fill this in, people never see it. Named so that
                browser and password-manager autofill leave it alone. */}
            <div aria-hidden="true" className="hidden">
              <label htmlFor="confirm_url">Leave this field empty</label>
              <input
                id="confirm_url"
                name="confirm_url"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {formError !== "" && <p className="text-sm text-accent">{formError}</p>}
            <button
              type="submit"
              disabled={sending}
              className="rounded bg-accent px-5 py-2 text-paper disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send my question"}
            </button>
          </form>
        )}
      </section>

      {/* ── Statistics ──────────────────────────────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">What the research says</h2>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
          <p>
            One thing to hold onto before any of these numbers: LGBTQ+ young
            people are not at higher risk because of who they are. They are at
            higher risk because of how they are treated. That is the framing the
            researchers themselves use, and it matters, because it means the risk can
            change. It answers to what the people around someone do.
          </p>
          <p>
            Which is the uncomfortable and hopeful thing about a forum like this
            one. The variable in most of this research is us.
          </p>
          <p>
            What follows runs the length of a life, not just the start of one:
            a teenager deciding whether to tell their parents, an adult deciding
            whether to tell a manager, someone in their eighties deciding
            whether it is safe to be known in a care home.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h3 className="font-serif text-xl">What acceptance does</h3>
        <StatList items={acceptance} />
      </section>

      <section className="mt-14">
        <h3 className="font-serif text-xl">What rejection does</h3>
        <StatList items={rejection} />
      </section>

      <section className="mt-14">
        <h3 className="font-serif text-xl">The scale of it</h3>
        <StatList items={scale} />
      </section>

      {/* Crisis resources sit in the same part of the page as the risk figures,
          deliberately — not buried at the bottom. */}
      <section className="mt-12 rounded-lg border-2 border-accent/40 bg-accent/5 p-6">
        <h3 className="font-serif text-xl mb-2">
          If you or someone you love is in crisis
        </h3>
        <ul className="space-y-2 text-ink/80">
          <li>
            <span className="font-semibold">Call or text 988</span> &mdash; Suicide
            &amp; Crisis Lifeline, 24/7, free and confidential.
          </li>
          <li>
            <span className="font-semibold">The Trevor Project</span> &mdash; for LGBTQ+
            young people. Call 1-866-488-7386 or text START to 678-678.
          </li>
          <li>
            <span className="font-semibold">LGBT National Youth Talkline</span> &mdash;
            1-800-246-7743.
          </li>
        </ul>
        <p className="text-sm text-ink/70 mt-4">
          More, including recovery and family support, on the{" "}
          <Link to="/care#crisis" className={linkClass}>
            care &amp; support page
          </Link>
          .
        </p>
      </section>

      <section className="mt-14">
        <h3 className="font-serif text-xl">Coming out</h3>
        <StatList items={comingOut} />
      </section>

      <section className="mt-14">
        <h3 className="font-serif text-xl">At work</h3>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed mt-4">
          <p>
            Since 2020 this has been settled federal law. In{" "}
            <em>Bostock v. Clayton County</em> the Supreme Court held that Title
            VII&apos;s ban on sex discrimination covers sexual orientation and
            gender identity, which means firing someone for being gay or
            transgender is illegal employment discrimination nationwide. Every
            figure below was gathered after that ruling.
          </p>
          <p>
            In Iowa the ground moved the other way more recently. In February
            2025 the state removed gender identity from the Iowa Civil Rights
            Act, effective that July &mdash; the first state in the country to
            repeal a protection of that kind rather than simply never having had
            one. Sexual orientation remains protected under Iowa law, and the
            federal employment protection still stands. But for transgender
            Iowans, the state-level protections covering housing, wages, and
            public accommodations are gone.
          </p>
        </div>
        <StatList items={work} />
      </section>

      <section className="mt-14">
        <h3 className="font-serif text-xl">Growing older</h3>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed mt-4">
          <p>
            Almost all of the research on this subject is about young people,
            which can leave the impression that it is a young person&apos;s
            question. The people in a pew on a given Sunday are, on average, not
            young. And the oldest LGBTQ+ people in any congregation are the ones
            who paid the highest price for being known.
          </p>
        </div>
        <StatList items={older} />
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed mt-8">
          <p>
            Read those first two figures together and something specific comes
            into view. The thing many older LGBTQ+ people are short of is not
            money or medicine. It is the ordinary web of people who notice when
            you don&apos;t turn up &mdash; and that is close to a definition of
            what a congregation is for.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h3 className="font-serif text-xl">What young people say about church</h3>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed mt-4">
          <p>
            These are the numbers that belong to us. The questions behind them
            were asked of Black and Latine LGBTQ+ young people, so they describe
            those groups rather than all young people &mdash; but they are the
            clearest picture anyone has of what it is like to be queer and in a
            pew.
          </p>
        </div>
        <StatList items={church} />
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed mt-8">
          <p>
            Set that last figure against the one at the top of this page. One
            affirming space in a young person&apos;s life is associated with 35%
            lower odds of a suicide attempt. And of all the places in their
            lives, church is where they are least likely to be known.
          </p>
          <p>
            That gap is an opening. It is the most straightforward thing on this entire
            page: there is a protective
            factor with good evidence behind it, and a congregation can simply
            decide to be one.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h3 className="font-serif text-xl">Faith, and the people who hold both</h3>
        <StatList items={faith} />
      </section>

      <section className="mt-14">
        <h3 className="font-serif text-xl">Marriage</h3>
        <StatList items={marriage} />
      </section>

      {/* ── Lutheran context ────────────────────────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">Where the ELCA stands</h2>
        <div className="space-y-4 text-ink/80 max-w-prose leading-relaxed">
          <p>
            The wider church has been having this conversation for years, and it remains
            open. In 2009 the Churchwide Assembly voted to
            let congregations call partnered gay pastors and to recognize
            same-sex relationships.
          </p>
          <p>
            The 2022 Assembly reopened the 2009 social statement{" "}
            <em>Human Sexuality: Gift and Trust</em>. The first revision &mdash;
            the language on marriage and family &mdash; was adopted at the 2025
            Churchwide Assembly by a vote of 724 to 46, and is now the official
            text. A second reconsideration, on &ldquo;bound conscience,&rdquo; is
            still underway and will come to a future assembly. So this forum is
            happening inside a live question, not after one.
          </p>
          <p>
            Since 1983, the way a Lutheran congregation has said this out loud is
            the Reconciling in Christ program. Whether that is something this
            congregation wants to take up is exactly the kind of question worth
            bringing on Sunday.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-3">Where to find more</h2>
        <ResourceList items={local} />
        <p className="text-sm text-ink/70 mt-6">
          Affirming organizations, books, and further reading are gathered on the{" "}
          <Link to="/queer-resources" className={linkClass}>
            queer resources page
          </Link>
          .
        </p>
      </section>

      <div className="mt-16 pt-8 border-t border-ink/10">
        <p className="font-serif text-2xl text-ink/80 mb-4">
          You are welcome here. All of you.
        </p>
        <p className="text-ink/70 max-w-prose leading-relaxed text-sm">
          Figures on this page are drawn from The Trevor Project&apos;s national
          and state surveys and research briefs, the Human Rights Campaign
          Foundation&apos;s LGBTQ+ Youth Reports and Community Insights surveys,
          the Family Acceptance Project at San Francisco State University, Pew
          Research Center, and PRRI&apos;s American Values Atlas. Each is named
          with its year and sample above, because where a number comes from is
          part of the number.
        </p>
      </div>
    </div>
  );
}
