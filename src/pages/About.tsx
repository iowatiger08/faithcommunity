import {  getAllPosts, getThemeCounts } from "~/lib/content";

export default function About() {
  const all = getAllPosts();

  const themes = getThemeCounts();
  const earliest = all
    .map((p) => p.published_date)
    .filter((d): d is string => !!d)
    .sort()[0];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl mb-6">About</h1>
      <p className="text-ink/80 max-w-prose mb-4">
        Hope and Truth Ministry is a sermon and reflection archive rooted in
        progressive mainline theology. Posts here have been preached and
        published since {earliest?.slice(0, 4)}, drawing on the Revised Common
        Lectionary.
      </p>
      <p className="text-ink/80 max-w-prose mb-8">
        Many sermons are currently published, covering themes including{" "}
        {themes.slice(0, 5).map(([t]) => t).join(", ")}, and more.
      </p>

      <h2 className="font-serif text-2xl mt-12 mb-4">Archive</h2>
      <p className="text-ink/80 max-w-prose">
        The original Blogger archive lives at{" "}
        <a
          className="text-accent underline"
          href="https://lecturesandreflections.blogspot.com/"
          target="_blank"
          rel="noopener"
        >
          lecturesandreflections.blogspot.com
        </a>
        . This site is a focused republishing of the sermon and worship-resource
        content.
      </p>
    </div>
  );
}
