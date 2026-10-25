export interface Stat {
  figure: string;
  detail: string;
  source: string;
}

// ── Statistics ───────────────────────────────────────────────────────────────────────
// Every figure is checked against a primary source, and every source is named
// inline with its year. Readers will question the numbers, and an unsourced
// figure is worse than no figure. Years matter: where the newest available
// data is older, the year is stated rather than hidden.

export const acceptance: Stat[] = [
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
      "accepting communities, compared with 18% in the least accepting.",
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

export const rejection: Stat[] = [
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
      "therapy, a practice every major medical association rejects. Exposure is " +
      "associated with more than double the likelihood of a past-year suicide " +
      "attempt.",
    source: "The Trevor Project, 2024 national survey",
  },
  {
    figure: "54%",
    detail:
      "of the more than 1,320 active conversion therapy practitioners identified " +
      "across 48 states operate in a ministerial or religious capacity.",
    source: "The Trevor Project practitioner report",
  },
  {
    figure: "65.5% → 49.6%",
    detail:
      "screened positive for depression among transgender and gender-expansive youth " +
      "whose families never use their correct pronouns. Where families always use " +
      "them, the figure falls to 49.6%. Using a young person’s correct name moves " +
      "anxiety from 72.1% to 61.9%.",
    source: "HRC Foundation, 2023 LGBTQ+ Youth Report (12,615 youth ages 13–18)",
  },
];

export const scale: Stat[] = [
  {
    figure: "36%",
    detail:
      "of LGBTQ+ young people seriously considered suicide in the past year, " +
      "including 40% of transgender and nonbinary young people. One in ten " +
      "attempted.",
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
      "of LGBTQ+ youth screened positive for depression and for anxiety " +
      "respectively, and 30% for severe psychological distress. Transgender and " +
      "gender-expansive youth were higher on every measure.",
    source: "HRC Foundation, 2023 LGBTQ+ Youth Report",
  },
];

export const comingOut: Stat[] = [
  {
    figure: "96%",
    detail:
      "of LGBTQ adults have told someone that they are or might be LGBTQ. 23% have " +
      "not told their parents or the people who raised them.",
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
    figure: "82.7%",
    detail:
      "of LGBTQ+ youth are out to at least one person in their immediate family. A " +
      "quarter (26.4%) are out to all of them, and 40.9% to all of their parents or " +
      "guardians.",
    source: "HRC Foundation, 2023 LGBTQ+ Youth Report (12,615 youth ages 13–18)",
  },
  {
    figure: "63% and 57%",
    detail:
      "63.1% of LGBTQ+ youth reported at least one supportive response from a " +
      "parent, and 57.4% reported at least one rejecting one. Those majorities " +
      "overlap, so many young people reported both.",
    source: "HRC Foundation, 2023 LGBTQ+ Youth Report",
  },
  {
    figure: "85%",
    detail:
      "of LGBTQ+ adults are at least somewhat open about who they are. A third have " +
      "grown more open over the past two years, 22% have grown less, and 78% believe " +
      "social acceptance of transgender and nonbinary people has fallen in that " +
      "time.",
    source:
      "HRC Community Insights, survey of 9,328 LGBTQ+ adults, August–September 2026",
  },
];

export const faith: Stat[] = [
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
      "was found between valuing religion and suicide risk, in either direction. The " +
      "research points instead to whether the community around a person is " +
      "affirming.",
    source: "The Trevor Project research brief, December 2022",
  },
];

// Church is the place these LGBTQ+ young people are least likely to be out.
// HRC asked these questions in its reports on Black and Latine LGBTQ+ youth,
// so the figures describe those populations rather than all young people.
export const church: Stat[] = [
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
      "came out; 52.1% among Latine LGBTQ+ youth.",
    source: "HRC Foundation, 2024 Black and Latine LGBTQ+ Youth Reports",
  },
  {
    figure: "20.1%",
    detail:
      "are out to at least some members of their faith community — lower than the " +
      "shares who are out to family, friends, or people at school.",
    source: "HRC Foundation, 2024 Black LGBTQ+ Youth Report",
  },
  {
    figure: "25.9%",
    detail:
      "said the leaders of their faith community support and include them as an " +
      "LGBTQ+ person; 20% among Latine LGBTQ+ youth.",
    source: "HRC Foundation, 2024 Black and Latine LGBTQ+ Youth Reports",
  },
];

// Employment. Coming out is not only a question for teenagers: these figures
// describe a decision working adults make every week about whether to be known.
export const work: Stat[] = [
  {
    figure: "47%",
    detail:
      "of LGBTQ workers have experienced discrimination or harassment at work at " +
      "some point. 34% have been fired, not hired, or passed over for promotion. 17% " +
      "experienced something in the past year.",
    source:
      "Williams Institute, UCLA School of Law — survey of 1,902 LGBTQ workers, 2023",
  },
  {
    figure: "46%",
    detail:
      "are not out to their current supervisor, and 21% are not out to any coworker.",
    source: "Williams Institute, UCLA School of Law, 2023",
  },
  {
    figure: "39% vs. 12%",
    detail:
      "reported discrimination among those who are out at work, compared with those " +
      "who are out to no one.",
    source: "Williams Institute, UCLA School of Law, 2023",
  },
  {
    figure: "33%",
    detail:
      "have left a job because of how an employer treated them over their sexual " +
      "orientation or gender identity.",
    source: "Williams Institute, UCLA School of Law, 2023",
  },
];

// Aging. Nearly all of the research on this subject is about young people,
// which can leave the impression that this is a young person's question.
export const older: Stat[] = [
  {
    figure: "3 million → 7 million",
    detail:
      "LGBT adults over the age of 50 in the United States, expected to reach around " +
      "seven million by 2030. Many came of age when being openly gay was grounds for " +
      "arrest or dismissal.",
    source: "SAGE and the National Resource Center on LGBT Aging, Facts on LGBT Aging",
  },
  {
    figure: "2× and 4×",
    detail: "as likely to live alone, and four times less likely to have children.",
    source: "SAGE and the National Resource Center on LGBT Aging",
  },
  {
    figure: "59% and 53%",
    detail:
      "report a lack of companionship and feeling isolated from others. Among SAGE’s " +
      "care-management clients in New York City, one in four said they had no one to " +
      "call in an emergency.",
    source: "SAGE and the National Resource Center on LGBT Aging",
  },
  {
    figure: "34%",
    detail:
      "worry about having to hide who they are in order to get into senior housing. " +
      "88% say they would feel more comfortable in long-term care if they knew staff " +
      "had been trained in the needs of LGBT patients.",
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

// Marriage. National opinion, including where it has fallen since its peak.
export const marriage: Stat[] = [
  {
    figure: "65%",
    detail:
      "of Americans favor legal same-sex marriage, down from a peak of 71% in 2022 " +
      "and 2023, and up from 27% when Gallup first asked the question in 1996.",
    source:
      "Gallup, Values and Beliefs survey, May 1–17 2026 (1,001 adults, ±4 points)",
  },
  {
    figure: "87% / 67% / 37%",
    detail:
      "support among Democrats, independents, and Republicans respectively. " +
      "Republican support stood at 55% in 2021 and 2022.",
    source: "Gallup, May 2026",
  },
  {
    figure: "62%",
    detail:
      "say gay or lesbian relations are morally acceptable — the lowest reading " +
      "since 2016.",
    source: "Gallup, May 2026",
  },
  {
    figure: "76%",
    detail:
      "of white mainline Protestants support same-sex marriage. Across all " +
      "Americans, 72% support nondiscrimination protections for LGBTQ people.",
    source: "PRRI 2025 American Values Atlas (22,000+ adults)",
  },
];
