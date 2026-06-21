---
description: Fetch new posts from the Blogger feed, write teasers, rebuild published-content.json, and commit the data files. Use when the user wants to pull in new blog posts and save them to git.
---

# Sync Posts

## Steps

1. Run `npm run import-posts` and capture the output.
2. Read the output to determine how many new posts were imported and their titles/slugs.
3. If **no new posts** were found, report that and stop — do not create a commit.
4. For each new post, **write a teaser summary**:
   - Read the post's `html_content` from `data/source/posts.json` (strip HTML tags to get plain text).
   - Write a 2–3 sentence summary in third person describing the sermon's content, scripture texts, and central argument. Match the style of existing summaries in `data/source/classified.jsonl`.
   - Update the `classification.summary` field for that slug in `data/source/classified.jsonl`.
5. Run `npm run sync-content` to rebuild `data/published-content.json` with the new summaries.
6. Stage only the three data files:
   ```
   git add data/source/posts.json data/source/classified.jsonl data/published-content.json
   ```
7. Commit with a message that names the new post(s):
   - One post: `content: add sermon "<title>" (<scripture ref>, <date>)`
   - Multiple posts: `content: add N new sermons (<date range>)` with a bullet list in the body

Do not deploy unless the user explicitly asks.
