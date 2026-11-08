# .claude/skills/ship/SKILL.md
---
name: ship
description: Commit, push, deploy to S3/CloudFront and verify live
---
1. Run lint and tests; stop if they fail.
2. git add -A && git commit with a concise message describing the change.
3. git push (open a PR if on a feature branch).
4. Run the project deploy script (S3 sync + CloudFront invalidation).
5. curl the affected live page and confirm the changed text appears; report the URL.
