#!/usr/bin/env bash
#
# Query CloudFront page view analytics via AWS Athena.
#
# CloudFront logs land in s3://hopeandtruthministry-logs/cloudfront/ (90-day retention).
# Athena queries them without downloading anything — results print to the terminal
# or, with --html, open as a chart dashboard in the browser.
#
# Usage:
#   ./scripts/analytics.sh                  # top 25 pages, last 30 days
#   ./scripts/analytics.sh --days 7         # last 7 days
#   ./scripts/analytics.sh --days 90        # full retention window
#   ./scripts/analytics.sh --referrers      # top referrers instead of pages
#   ./scripts/analytics.sh --daily          # daily totals (trend view)
#   ./scripts/analytics.sh --html           # all views as a local HTML dashboard
#   ./scripts/analytics.sh --html --days 7  # shorter window
#   ./scripts/analytics.sh --publish        # regenerate + upload to S3 (same as Lambda)
#
# Requirements: aws-cli v2 authenticated, region us-west-2.

set -euo pipefail

WORKGROUP="hopeandtruth-analytics"
REGION="us-west-2"
DAYS=30
MODE="pages"
HTML=false
PUBLISH=false
S3_BUCKET="hopeandtruthministry.com"
S3_KEY="_analytics/index.html"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --days)      shift; DAYS="$1" ;;
    --referrers) MODE="referrers" ;;
    --daily)     MODE="daily" ;;
    --html)      HTML=true ;;
    --publish)   HTML=true; PUBLISH=true ;;
  esac
  shift
done

run_query() {
  local sql="$1"
  local exec_id
  exec_id=$(aws athena start-query-execution \
    --query-string "$sql" \
    --work-group "$WORKGROUP" \
    --region "$REGION" \
    --query 'QueryExecutionId' --output text)

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
    --output json \
    --query 'ResultSet.Rows[1:][*].Data[*].VarCharValue'
}

# ── CLI mode ──────────────────────────────────────────────────────────────────

if [[ "$HTML" == false ]]; then
  run_query_table() {
    local sql="$1"
    local exec_id
    exec_id=$(aws athena start-query-execution \
      --query-string "$sql" \
      --work-group "$WORKGROUP" \
      --region "$REGION" \
      --query 'QueryExecutionId' --output text)
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
      run_query_table "
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
      run_query_table "
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
      run_query_table "
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
  exit 0
fi

# ── HTML dashboard mode ───────────────────────────────────────────────────────

echo "Querying Athena (this takes ~10–20 seconds per query)..." >&2

echo "  [1/3] Top pages..." >&2
PAGES_JSON=$(run_query "
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
")

echo "  [2/3] Top referrers..." >&2
REF_JSON=$(run_query "
  SELECT referrer, COUNT(*) AS visits
  FROM cloudfront_logs.access_logs
  WHERE status = 200
    AND referrer != '-'
    AND referrer NOT LIKE '%hopeandtruthministry.com%'
    AND log_date >= DATE_ADD('day', -${DAYS}, CURRENT_DATE)
  GROUP BY referrer
  ORDER BY visits DESC
  LIMIT 20
")

echo "  [3/3] Daily trend..." >&2
DAILY_JSON=$(run_query "
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
  ORDER BY log_date ASC
")

OUT=$(mktemp /tmp/analytics-XXXXXX.html)

python3 - "$OUT" "$DAYS" "$PAGES_JSON" "$REF_JSON" "$DAILY_JSON" <<'PYEOF'
import sys, json, os

out_path = sys.argv[1]
days     = sys.argv[2]
pages_raw  = json.loads(sys.argv[3])
ref_raw    = json.loads(sys.argv[4])
daily_raw  = json.loads(sys.argv[5])

script_dir = os.path.dirname(os.path.realpath(__file__))
chartjs_path = os.path.join(script_dir, 'chart.min.js')
with open(chartjs_path, 'r') as f:
    chartjs_inline = f.read()

# Each row is a list of values: [[uri, count], ...]
pages  = [[r[0], int(r[1])] for r in pages_raw if len(r) == 2]
refs   = [[r[0], int(r[1])] for r in ref_raw   if len(r) == 2]
daily  = [[r[0], int(r[1])] for r in daily_raw  if len(r) == 2]

page_labels  = json.dumps([r[0] for r in pages])
page_values  = json.dumps([r[1] for r in pages])
ref_labels   = json.dumps([r[0] for r in refs])
ref_values   = json.dumps([r[1] for r in refs])
daily_labels = json.dumps([r[0] for r in daily])
daily_values = json.dumps([r[1] for r in daily])
total_views  = sum(r[1] for r in daily)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Hope &amp; Truth Analytics — last {days} days</title>
<script>{chartjs_inline}</script>
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: system-ui, sans-serif; background: #f5f4f0; color: #222; padding: 2rem; }}
  h1 {{ font-size: 1.5rem; margin-bottom: 0.25rem; }}
  .sub {{ color: #666; font-size: 0.9rem; margin-bottom: 2rem; }}
  .stat {{ display: inline-block; background: #fff; border-radius: 8px; padding: 1rem 1.5rem;
           margin-right: 1rem; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,.1); }}
  .stat-num {{ font-size: 2rem; font-weight: 700; color: #4a7c59; }}
  .stat-lbl {{ font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: .05em; }}
  .card {{ background: #fff; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;
           box-shadow: 0 1px 3px rgba(0,0,0,.1); }}
  .card h2 {{ font-size: 1rem; margin-bottom: 1rem; color: #444; }}
  canvas {{ max-height: 320px; }}
</style>
</head>
<body>
<h1>Hope &amp; Truth Ministry — Traffic</h1>
<p class="sub">Last {days} days &nbsp;·&nbsp; Source: CloudFront logs via Athena</p>

<div class="stat">
  <div class="stat-num">{total_views:,}</div>
  <div class="stat-lbl">Total page views</div>
</div>
<div class="stat">
  <div class="stat-num">{len(pages)}</div>
  <div class="stat-lbl">Unique pages</div>
</div>

<div class="card">
  <h2>Daily Page Views</h2>
  <canvas id="daily"></canvas>
</div>
<div class="card">
  <h2>Top Pages</h2>
  <canvas id="pages"></canvas>
</div>
<div class="card">
  <h2>Top Referrers</h2>
  <canvas id="refs"></canvas>
</div>

<script>
const accent = '#4a7c59';
const light  = 'rgba(74,124,89,.15)';

new Chart(document.getElementById('daily'), {{
  type: 'line',
  data: {{
    labels: {daily_labels},
    datasets: [{{ label: 'Views', data: {daily_values},
      borderColor: accent, backgroundColor: light, fill: true, tension: 0.3, pointRadius: 3 }}]
  }},
  options: {{ plugins: {{ legend: {{ display: false }} }}, scales: {{ y: {{ beginAtZero: true }} }} }}
}});

new Chart(document.getElementById('pages'), {{
  type: 'bar',
  data: {{
    labels: {page_labels},
    datasets: [{{ label: 'Views', data: {page_values}, backgroundColor: accent }}]
  }},
  options: {{ indexAxis: 'y', plugins: {{ legend: {{ display: false }} }},
    scales: {{ x: {{ beginAtZero: true }} }} }}
}});

new Chart(document.getElementById('refs'), {{
  type: 'bar',
  data: {{
    labels: {ref_labels},
    datasets: [{{ label: 'Visits', data: {ref_values}, backgroundColor: '#7c6a4a' }}]
  }},
  options: {{ indexAxis: 'y', plugins: {{ legend: {{ display: false }} }},
    scales: {{ x: {{ beginAtZero: true }} }} }}
}});
</script>
</body>
</html>"""

with open(out_path, 'w') as f:
    f.write(html)
PYEOF

if [[ "$PUBLISH" == true ]]; then
  echo "Uploading to s3://${S3_BUCKET}/${S3_KEY}..." >&2
  aws s3 cp "$OUT" "s3://${S3_BUCKET}/${S3_KEY}" \
    --content-type "text/html" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --region "$REGION"
  rm -f "$OUT"
  echo "Published: https://${S3_BUCKET}/${S3_KEY}" >&2
else
  echo "Dashboard written to $OUT" >&2
  open "$OUT" 2>/dev/null || xdg-open "$OUT" 2>/dev/null || echo "Open in browser: $OUT"
fi
