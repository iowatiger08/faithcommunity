#!/usr/bin/env bash
#
# Deploy the full Lambda + infrastructure stack via AWS SAM.
#
# This script manages the complete AWS backend:
#   - SES email identity + DKIM records for hopeandtruthministry.com
#   - Route 53 CNAME records (hosted zone Z1W12OVIJHI59G)
#   - Contact form Lambda + HTTP API Gateway
#   - Blogger proxy Lambda + REST API Gateway
#   - Forum Q&A intake + admin Lambdas, and the DynamoDB table behind them
#
# ⚠️  SES SANDBOX MODE: Your account is currently in SES sandbox. Emails can
#     only be sent to verified addresses. To go live with real visitor emails,
#     request production access:
#     https://console.aws.amazon.com/ses/home#/account
#     (Request production access → fill in use-case → submit)
#
# After first deploy, set the API URLs in your build env:
#   echo "VITE_CONTACT_API_URL=<ContactApiUrl from outputs>" >> .env
#   echo "VITE_FORUM_API_BASE=<ForumApiBase from outputs>" >> .env
#
# ⚠️  FORUM SECRETS: the forum stack needs two values that must NOT be
#     committed. Both .env and lambda/samconfig.toml are tracked in git, so
#     they live in the untracked lambda/forum-params.env instead — copy
#     lambda/forum-params.env.example and fill it in. This script fails if it
#     is missing. See lambda/forum-params.env.example for how to generate them.
#
#     Reading submissions at /forum-admin is NOT one of them: that route takes
#     a Cognito ID token for iowatiger08@gmail.com in the shared
#     tigersndragons-users pool, the same sign-in as webtop and the Deutsch app.
#
# Usage:
#   ./scripts/deploy-lambda.sh             # deploy
#   DRY_RUN=1 ./scripts/deploy-lambda.sh   # show commands, do nothing
#
# To tear everything down:
#   ./scripts/teardown.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LAMBDA_DIR="$REPO_ROOT/lambda"
DRY_RUN="${DRY_RUN:-0}"

run() {
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "DRY_RUN: $*"
  else
    "$@"
  fi
}

echo "=== installing Lambda dependencies ==="
run npm install --prefix "$LAMBDA_DIR/contact-form" --omit=dev
run npm install --prefix "$LAMBDA_DIR/blogger-proxy" --omit=dev
run npm install --prefix "$LAMBDA_DIR/forum-intake" --omit=dev
run npm install --prefix "$LAMBDA_DIR/forum-admin" --omit=dev
echo

# A CLI --parameter-overrides REPLACES samconfig.toml's parameter_overrides
# rather than merging with it, and the SAM CLI has no UsePreviousValue, so
# every parameter without a Default must be passed on every deploy. Hence one
# array built from both sources.
PARAMS_FILE="$LAMBDA_DIR/forum-params.env"
if [[ ! -f "$PARAMS_FILE" ]]; then
  echo "ERROR: $PARAMS_FILE not found." >&2
  echo "       The forum stack needs ForumMemberCode and ForumTokenSecret." >&2
  echo "       Copy forum-params.env.example and fill it in; it is gitignored" >&2
  echo "       on purpose." >&2
  exit 1
fi

OVERRIDES=(
  "HopeAndTruthHostedZoneId=Z1W12OVIJHI59G"
  "SenderDomain=hopeandtruthministry.com"
)
# Lines whose key the template no longer declares are skipped rather than
# passed: sam deploy rejects an unknown parameter outright, and a retired key
# (ForumAdminCode, once the admin route moved to Cognito) should not be able to
# break a deploy just by still sitting in the untracked params file.
while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "$line" || "$line" == \#* ]] && continue
  key="${line%%=*}"
  if grep -qE "^  ${key}:\$" "$LAMBDA_DIR/template.yaml"; then
    OVERRIDES+=("$line")
  else
    echo "  skipping $key — not a parameter of template.yaml"
  fi
done < "$PARAMS_FILE"

echo "=== deploying stack via SAM ==="
echo "  Stack:   blogger-proxy-stack"
echo "  Region:  us-west-2"
echo "  Zones:   Z1W12OVIJHI59G (hopeandtruthministry.com)"
echo
run sam deploy \
  --template-file "$LAMBDA_DIR/template.yaml" \
  --config-file "$LAMBDA_DIR/samconfig.toml" \
  --parameter-overrides "${OVERRIDES[@]}" \
  --no-fail-on-empty-changeset
echo

echo "Lambda + infrastructure deploy complete."
echo
echo "  Next steps if first deploy:"
echo "    1. Copy ContactApiUrl and ForumApiBase from outputs above"
echo "    2. Add to .env:  VITE_CONTACT_API_URL=<url>"
echo "                     VITE_FORUM_API_BASE=<url>"
echo "    3. Request SES production access to enable real visitor emails"
echo "       https://console.aws.amazon.com/ses/home#/account"
