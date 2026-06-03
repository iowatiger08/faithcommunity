#!/usr/bin/env python3
"""
Build the slim publishable content file the React app reads at build time.

Joins extract.py's posts.json (full post bodies) with classify.py's
classified.jsonl (category + themes + summary + publish decision) and
emits data/published-content.json — only posts marked publish_decision="yes",
with just the fields the site renders.

Default source paths assume the tigersndragons sibling project at
../tigersndragons. Override with --posts and --classified.

Usage:
  python3 scripts/sync-content.py
  python3 scripts/sync-content.py --posts /path/to/posts.json --classified /path/to/classified.jsonl
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

DEFAULT_POSTS = "../tigersndragons/.scratch/blogger/posts.json"
DEFAULT_CLASSIFIED = "../tigersndragons/.scratch/blogger/classified.jsonl"
DEFAULT_OUT = "data/published-content.json"


def load_classifications(path: Path) -> dict[str, dict]:
    by_slug: dict[str, dict] = {}
    with path.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            rec = json.loads(line)
            if "classification" not in rec:
                continue
            by_slug[rec["slug"]] = rec
    return by_slug


def load_posts(path: Path) -> dict[str, dict]:
    with path.open() as f:
        return {p["slug"]: p for p in json.load(f)["posts"]}


def build_published(posts: dict[str, dict], classifications: dict[str, dict]) -> list[dict]:
    out = []
    for slug, c in classifications.items():
        cls = c["classification"]
        if cls["publish_decision"] != "yes":
            continue
        post = posts.get(slug)
        if post is None:
            print(f"WARN: classified post {slug!r} not in posts.json", file=sys.stderr)
            continue
        out.append({
            "slug": slug,
            "title": post["title"],
            "published_date": post.get("published_date"),
            "author": post.get("author"),
            "category": cls["category"],
            "section": cls["publish_section"],
            "themes": cls["themes"],
            "summary": cls["summary"],
            "confidence": cls["confidence"],
            "notes": cls.get("notes", []),
            "scripture_refs": post.get("scripture_refs", []),
            "scripture_in_title": post.get("scripture_in_title", []),
            "liturgical_season": post.get("liturgical_season"),
            "lectionary_year": post.get("lectionary_year_computed"),
            "lectionary_code": post.get("lectionary_code_title"),
            "series": post.get("series"),
            "blogger_labels": post.get("blogger_labels", []),
            "html_content": post.get("html_content", ""),
            "text_length": post.get("text_length", 0),
        })
    out.sort(key=lambda p: p["published_date"] or "", reverse=True)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--posts", default=DEFAULT_POSTS)
    parser.add_argument("--classified", default=DEFAULT_CLASSIFIED)
    parser.add_argument("--out", default=DEFAULT_OUT)
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    posts_path = (repo_root / args.posts).resolve()
    cls_path = (repo_root / args.classified).resolve()
    out_path = (repo_root / args.out).resolve()

    if not posts_path.exists():
        print(f"ERROR: posts file not found: {posts_path}", file=sys.stderr)
        return 2
    if not cls_path.exists():
        print(f"ERROR: classified file not found: {cls_path}", file=sys.stderr)
        return 2

    posts = load_posts(posts_path)
    classifications = load_classifications(cls_path)
    published = build_published(posts, classifications)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w") as f:
        json.dump({
            "count": len(published),
            "source_posts": str(posts_path),
            "source_classified": str(cls_path),
            "posts": published,
        }, f)

    size_mb = os.path.getsize(out_path) / 1024 / 1024
    by_section: dict[str, int] = {}
    for p in published:
        by_section[p["section"] or "(none)"] = by_section.get(p["section"] or "(none)", 0) + 1
    print(f"Wrote {len(published)} published posts → {out_path.relative_to(repo_root)} ({size_mb:.2f} MB)")
    for s, n in sorted(by_section.items()):
        print(f"  {n:3d}  /{s}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
