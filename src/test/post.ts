import type { PublishedPost } from "~/lib/content";

/** A complete published post for tests; override only the fields a test cares about. */
export function makePost(overrides: Partial<PublishedPost> = {}): PublishedPost {
  return {
    slug: "love-of-neighbor",
    title: "Love of Neighbor",
    published_date: "2024-03-10",
    author: "Tony E Hansen",
    category: "sermon",
    section: "sermons",
    themes: ["love", "justice"],
    summary: "A sermon on loving the neighbor.",
    confidence: "high",
    notes: [],
    scripture_refs: [{ book: "Matthew", chapter: 22, verses: "37-39", ref: "Matthew 22:37-39" }],
    scripture_in_title: ["Matthew 22:37-39"],
    liturgical_season: { season: "Lent", days_into_season: 24, approx_week: 4 },
    lectionary_year: "B",
    lectionary_code: { day_name: "Lent", week: 4, year: "B", raw: "Lent 4B" },
    series: null,
    blogger_labels: [],
    html_content: "<p>Body of the sermon.</p>",
    text_length: 20,
    ...overrides,
  };
}
