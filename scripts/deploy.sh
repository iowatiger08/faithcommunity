#!/usr/bin/env bash
#
# Deploy the built site to S3 + invalidate CloudFront.
#
# Defaults target the existing hopeandtruthministry.com bucket in us-west-2
# fronted by two CloudFront distributions (apex + www). Override BUCKET /
# DIST_IDS / AWS_PROFILE as needed.
#
# Usage:
#   ./scripts/deploy.sh                         # build + deploy with defaults
#   ./scripts/deploy.sh --with-lambda           # also deploy the Lambda stack (SAM)
#   SKIP_BUILD=1 ./scripts/deploy.sh            # deploy current dist/ without rebuild
#   DRY_RUN=1 ./scripts/deploy.sh               # show what would happen, do nothing
#   BUCKET=other-bucket DIST_IDS=ID1,ID2 ./scripts/deploy.sh
#
# Requirements: aws-cli v2 authenticated, npm, network.
# For --with-lambda: sam CLI also required (brew install aws-sam-cli).

set -euo pipefail

DEPLOY_LAMBDA=0
for arg in "$@"; do
  [[ "$arg" == "--with-lambda" ]] && DEPLOY_LAMBDA=1
done

BUCKET="${BUCKET:-hopeandtruthministry.com}"
# Two distributions front the same bucket: apex (E293YSKYXW91AL) and www
# (E3H69QTPS1KHB). Both must be invalidated for changes to be visible
# immediately on both hostnames.
DIST_IDS="${DIST_IDS:-E293YSKYXW91AL,E3H69QTPS1KHB}"
AWS_REGION="${AWS_REGION:-us-west-2}"
DIST_DIR="dist"
DRY_RUN="${DRY_RUN:-0}"
SKIP_BUILD="${SKIP_BUILD:-0}"

aws_cmd=(aws)
if [[ -n "${AWS_PROFILE:-}" ]]; then aws_cmd+=(--profile "$AWS_PROFILE"); fi

run() {
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "DRY_RUN: $*"
  else
    "$@"
  fi
}

echo "=== deploy target ==="
echo "  bucket:      s3://$BUCKET (region $AWS_REGION)"
echo "  CloudFront:  $DIST_IDS"
echo "  source dir:  $DIST_DIR"
echo "  dry run:     $DRY_RUN"
echo

if [[ "$SKIP_BUILD" != "1" ]]; then
  echo "=== building ==="
  npm run build
  echo
fi

if [[ ! -d "$DIST_DIR" ]]; then
  echo "ERROR: $DIST_DIR does not exist. Run 'npm run build' first or unset SKIP_BUILD." >&2
  exit 2
fi

echo "=== syncing static assets to S3 (long cache, no HTML) ==="
# Hashed bundles + images + CSS get the immutable long cache.
run "${aws_cmd[@]}" s3 sync "$DIST_DIR/" "s3://$BUCKET/" \
  --region "$AWS_REGION" \
  --delete \
  --exclude "*.html" \
  --exclude "*.html.gz" \
  --cache-control "public, max-age=31536000, immutable"
echo

echo "=== syncing HTML files (no cache, so updates show up immediately) ==="
# Every index.html (root + nested route directories) should be revalidated
# on every request so site updates aren't stuck behind a stale cache.
run "${aws_cmd[@]}" s3 sync "$DIST_DIR/" "s3://$BUCKET/" \
  --region "$AWS_REGION" \
  --exclude "*" \
  --include "*.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html; charset=utf-8"
echo

echo "=== invalidating CloudFront ==="
IFS=',' read -ra DIST_ARR <<< "$DIST_IDS"
for dist in "${DIST_ARR[@]}"; do
  echo "  invalidating $dist ..."
  run "${aws_cmd[@]}" cloudfront create-invalidation \
    --distribution-id "$dist" \
    --paths "/*" \
    --query 'Invalidation.{Id:Id,Status:Status}' \
    --output table
done
echo

if [[ "$DEPLOY_LAMBDA" == "1" ]]; then
  echo "=== deploying Lambda stack ==="
  "$(dirname "$0")/deploy-lambda.sh"
  echo
fi

echo "Deploy complete."
echo "  Live URL:  https://hopeandtruthministry.com/"
echo "  Live URL:  https://www.hopeandtruthministry.com/"
echo "  CloudFront invalidation typically propagates in 30-90 seconds."
