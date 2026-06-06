#!/usr/bin/env bash
#
# Deploy the full Lambda + infrastructure stack via AWS SAM.
#
# This script manages the complete AWS backend:
#   - SES email identity + DKIM records for hopeandtruthministry.com
#   - Route 53 CNAME records (hosted zone Z1W12OVIJHI59G)
#   - Contact form Lambda + HTTP API Gateway
#   - Blogger proxy Lambda + REST API Gateway
#
# ⚠️  SES SANDBOX MODE: Your account is currently in SES sandbox. Emails can
#     only be sent to verified addresses. To go live with real visitor emails,
#     request production access:
#     https://console.aws.amazon.com/ses/home#/account
#     (Request production access → fill in use-case → submit)
#
# After first deploy, set VITE_CONTACT_API_URL in your build env:
#   echo "VITE_CONTACT_API_URL=<ContactApiUrl from outputs>" >> .env
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
echo

echo "=== deploying stack via SAM ==="
echo "  Stack:   blogger-proxy-stack"
echo "  Region:  us-west-2"
echo "  Zones:   Z1W12OVIJHI59G (hopeandtruthministry.com)"
echo
run sam deploy \
  --template-file "$LAMBDA_DIR/template.yaml" \
  --config-file "$LAMBDA_DIR/samconfig.toml" \
  --no-fail-on-empty-changeset
echo

echo "Lambda + infrastructure deploy complete."
echo
echo "  Next steps if first deploy:"
echo "    1. Copy ContactApiUrl from outputs above"
echo "    2. Add to .env:  VITE_CONTACT_API_URL=<url>"
echo "    3. Request SES production access to enable real visitor emails"
echo "       https://console.aws.amazon.com/ses/home#/account"
