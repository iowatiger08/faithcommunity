#!/usr/bin/env bash
#
# Deploy the analytics Lambda + daily EventBridge schedule.
#
# Run once to set up. Re-run any time to update the Lambda code.
#
# Usage:
#   ./scripts/deploy-analytics-lambda.sh
#
# What it creates in your AWS account:
#   IAM role:          hopeandtruth-analytics-lambda
#   Lambda function:   hopeandtruth-analytics
#   EventBridge rule:  hopeandtruth-analytics-daily  (runs at 06:00 UTC)
#
# Requirements: aws-cli v2 authenticated, region us-west-2, python3 + zip.

set -euo pipefail

REGION="us-west-2"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
FUNCTION_NAME="hopeandtruth-analytics"
ROLE_NAME="hopeandtruth-analytics-lambda"
RULE_NAME="hopeandtruth-analytics-daily"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── IAM role ──────────────────────────────────────────────────────────────────

echo "==> Ensuring IAM role $ROLE_NAME..."

TRUST='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

if ! aws iam get-role --role-name "$ROLE_NAME" &>/dev/null; then
  aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document "$TRUST" \
    --region "$REGION" > /dev/null
  echo "    Created role."
else
  echo "    Role already exists."
fi

for policy in \
  "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" \
  "arn:aws:iam::aws:policy/AmazonAthenaFullAccess" \
  "arn:aws:iam::aws:policy/AmazonS3FullAccess"; do
  aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn "$policy" 2>/dev/null || true
done

ROLE_ARN="arn:aws:iam::${ACCOUNT}:role/${ROLE_NAME}"

# ── Lambda zip ────────────────────────────────────────────────────────────────

echo "==> Building Lambda package..."
TMP=$(mktemp -d)
cp "$SCRIPT_DIR/analytics_lambda.py" "$TMP/analytics_lambda.py"
cp "$SCRIPT_DIR/chart.min.js"        "$TMP/chart.min.js"
ZIP="$TMP/analytics.zip"
(cd "$TMP" && zip -q "$ZIP" analytics_lambda.py chart.min.js)
echo "    Package: $(du -sh "$ZIP" | cut -f1)"

# ── Lambda function ───────────────────────────────────────────────────────────

echo "==> Deploying Lambda $FUNCTION_NAME..."

# Wait for role to propagate (first-time creation)
sleep 5

if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" &>/dev/null; then
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file "fileb://$ZIP" \
    --region "$REGION" > /dev/null
  echo "    Updated function code."
else
  aws lambda create-function \
    --function-name "$FUNCTION_NAME" \
    --runtime python3.12 \
    --role "$ROLE_ARN" \
    --handler analytics_lambda.handler \
    --zip-file "fileb://$ZIP" \
    --timeout 300 \
    --memory-size 256 \
    --region "$REGION" > /dev/null
  echo "    Created function."
fi

LAMBDA_ARN="arn:aws:lambda:${REGION}:${ACCOUNT}:function:${FUNCTION_NAME}"

# ── EventBridge rule — daily at 06:00 UTC ─────────────────────────────────────

echo "==> Scheduling EventBridge rule $RULE_NAME (daily 06:00 UTC)..."

aws events put-rule \
  --name "$RULE_NAME" \
  --schedule-expression "cron(0 6 * * ? *)" \
  --state ENABLED \
  --region "$REGION" > /dev/null

aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id "${RULE_NAME}-invoke" \
  --action lambda:InvokeFunction \
  --principal events.amazonaws.com \
  --source-arn "arn:aws:events:${REGION}:${ACCOUNT}:rule/${RULE_NAME}" \
  --region "$REGION" > /dev/null 2>&1 || true  # ignore if permission already exists

aws events put-targets \
  --rule "$RULE_NAME" \
  --targets "[{\"Id\":\"1\",\"Arn\":\"${LAMBDA_ARN}\"}]" \
  --region "$REGION" > /dev/null

rm -rf "$TMP"

echo ""
echo "Done."
echo ""
echo "  Lambda:    $LAMBDA_ARN"
echo "  Schedule:  daily at 06:00 UTC"
echo "  Dashboard: https://hopeandtruthministry.com/_analytics/index.html"
echo ""
echo "To trigger a refresh now:"
echo "  aws lambda invoke --function-name $FUNCTION_NAME --region $REGION /dev/null"
