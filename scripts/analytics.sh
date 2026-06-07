#!/usr/bin/env bash
#
# Query CloudFront page view analytics via AWS Athena.
#
# CloudFront logs land in s3://hopeandtruthministry-logs/cloudfront/ (90-day retention).
# Athena queries them without downloading anything — results print to the terminal.
#
# Usage:
#   ./scripts/analytics.sh                  # top 25 pages, last 30 days
#   ./scripts/analytics.sh --days 7         # last 7 days
#   ./scripts/analytics.sh --days 90        # full retention window
#   ./scripts/analytics.sh --referrers      # top referrers instead of pages
#   ./scripts/analytics.sh --daily          # daily totals (trend view)
#
# Requirements: aws-cli v2 authenticated, region us-west-2.

set -euo pipefail

WORKGROUP="hopeandtruth-analytics"
REGION="us-west-2"
DAYS=30
MODE="pages"

for arg in "$@"; do
  case "$arg" in
    --days)    shift; DAYS="$1" ;;
    --referrers) MODE="referrers" ;;
    --daily)   MODE="daily" ;;
  esac
done

run_query() {
  local sql="$1"
  local exec_id
  exec_id=$(aws athena start-query-execution \
    --query-string "$sql" \
    --work-group "$WORKGROUP" \
    --region "$REGION" \
    --query 'QueryExecutionId' --output text)

  # Wait for completion
  local state="RUNNING"
  while [[ "$state" == "RUNNING" || "$state" == "QUEUED" ]]; do
    sleep 2
    state=$(aws athena get-query-execution \
      --query-execution-id "$exec_id" \
      --region "$REGION" \
      --query 'QueryExecution.Status.State' --output text)
  done

  if [[ "$state" != "SUCCEEDED" ]]; then
    local reason
    reason=$(aws athena get-query-execution \
      --query-execution-id "$exec_id" \
      --region "$REGION" \
      --query 'QueryExecution.Status.StateChangeReason' --output text)
    echo "Query failed: $reason" >&2
    exit 1
  fi

  aws athena get-query-results \
    --query-execution-id "$exec_id" \
    --region "$REGION" \
    --query 'ResultSet.Rows[*].Data[*].VarCharValue' \
    --output table
}

case "$MODE" in
  pages)
    echo "=== Top pages — last ${DAYS} days ==="
    run_query "
      SELECT uri, COUNT(*) AS views
      FROM cloudfront_logs.access_logs
      WHERE status = 200
        AND method = 'GET'
        AND uri NOT LIKE '%.js'
        AND uri NOT LIKE '%.css'
        AND uri NOT LIKE '%.jpg'
        AND uri NOT LIKE '%.png'
        AND uri NOT LIKE '%.svg'
        AND uri NOT LIKE '%.ico'
        AND uri NOT LIKE '%.map'
        AND uri NOT LIKE '/.vite/%'
        AND log_date >= DATE_ADD('day', -${DAYS}, CURRENT_DATE)
      GROUP BY uri
      ORDER BY views DESC
      LIMIT 25
    "
    ;;

  referrers)
    echo "=== Top referrers — last ${DAYS} days ==="
    run_query "
      SELECT referrer, COUNT(*) AS visits
      FROM cloudfront_logs.access_logs
      WHERE status = 200
        AND referrer != '-'
        AND referrer NOT LIKE '%hopeandtruthministry.com%'
        AND log_date >= DATE_ADD('day', -${DAYS}, CURRENT_DATE)
      GROUP BY referrer
      ORDER BY visits DESC
      LIMIT 20
    "
    ;;

  daily)
    echo "=== Daily page views — last ${DAYS} days ==="
    run_query "
      SELECT log_date, COUNT(*) AS views
      FROM cloudfront_logs.access_logs
      WHERE status = 200
        AND method = 'GET'
        AND uri NOT LIKE '%.js'
        AND uri NOT LIKE '%.css'
        AND uri NOT LIKE '%.jpg'
        AND uri NOT LIKE '%.png'
        AND uri NOT LIKE '%.svg'
        AND log_date >= DATE_ADD('day', -${DAYS}, CURRENT_DATE)
      GROUP BY log_date
      ORDER BY log_date DESC
    "
    ;;
esac
