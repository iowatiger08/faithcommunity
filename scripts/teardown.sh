#!/usr/bin/env bash
#
# Tear down the full AWS infrastructure stack.
#
# Deletes via CloudFormation (SAM):
#   - SES email identity + DKIM Route 53 records
#   - Contact form Lambda + HTTP API Gateway
#   - Blogger proxy Lambda + REST API Gateway
#   - IAM roles created by the stack
#
# Does NOT delete:
#   - The S3 bucket (hopeandtruthministry.com) — managed separately
#   - CloudFront distributions — managed separately
#   - The _amazonses TXT record in Route 53 (created manually, not in stack)
#   - The Route 53 hosted zones themselves
#
# Usage:
#   ./scripts/teardown.sh

set -euo pipefail

STACK_NAME="blogger-proxy-stack"
REGION="us-west-2"

echo "=== teardown: $STACK_NAME ==="
echo
echo "This will permanently delete the Lambda stack and all resources it owns."
echo "S3, CloudFront, and Route 53 hosted zones are NOT affected."
echo
read -rp "Type the stack name to confirm deletion: " confirm

if [[ "$confirm" != "$STACK_NAME" ]]; then
  echo "Aborted — name did not match."
  exit 1
fi

echo
echo "Deleting stack $STACK_NAME in $REGION ..."
sam delete \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --no-prompts

echo
echo "Stack deleted."
echo
echo "Orphaned resources to clean up manually if desired:"
echo "  Route 53 TXT: _amazonses.hopeandtruthministry.com (in Z1W12OVIJHI59G)"
echo "  S3 SAM bucket: aws-sam-cli-managed-default-samclisourcebucket-bvlkd9dv8nnz"
