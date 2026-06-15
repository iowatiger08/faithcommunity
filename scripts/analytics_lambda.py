"""
Lambda handler — generates the Hope & Truth analytics dashboard HTML and
uploads it to s3://hopeandtruthministry.com/_analytics/index.html.

Triggered daily by EventBridge Scheduler. Can also be invoked manually
(AWS Console test, or aws lambda invoke).

Environment variables (all have defaults):
  WORKGROUP  Athena workgroup          (default: hopeandtruth-analytics)
  REGION     AWS region                (default: us-west-2)
  DAYS       Lookback window in days   (default: 30)
  S3_BUCKET  Destination bucket        (default: hopeandtruthministry.com)
  S3_KEY     Destination object key    (default: _analytics/index.html)
"""

import json
import os
import time

import boto3

WORKGROUP = os.environ.get("WORKGROUP", "hopeandtruth-analytics")
REGION    = os.environ.get("REGION", "us-west-2")
DAYS      = int(os.environ.get("DAYS", "30"))
S3_BUCKET = os.environ.get("S3_BUCKET", "hopeandtruthministry.com")
S3_KEY    = os.environ.get("S3_KEY", "_analytics/index.html")

# Regex applied to the useragent column to exclude known bots, crawlers, and
# monitoring tools. Most bots self-identify; this catches the vast majority.
BOT_FILTER = (
    "NOT regexp_like(useragent, '(?i)(bot|crawler|spider|slurp"
    "|python-requests|python/|curl/|wget/|java/"
    "|go-http-client|headlesschrome|facebookexternalhit"
    "|twitterbot|linkedinbot|whatsapp|slackbot|discordbot"
    "|telegrambot|gptbot|anthropic|claudebot|bytespider"
    "|petalbot|yandexbot|baiduspider|duckduckbot"
    "|pingdom|uptimerobot|ia_archiver|archive[.]org"
    "|datadogsynthetics|gtmetrix)')"
)

# chart.min.js is bundled alongside this file in the Lambda zip
_HERE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(_HERE, "chart.min.js")) as f:
    CHARTJS = f.read()

athena = boto3.client("athena", region_name=REGION)
s3     = boto3.client("s3",     region_name=REGION)


def run_query(sql):
    resp = athena.start_query_execution(
        QueryString=sql,
        WorkGroup=WORKGROUP,
    )
    exec_id = resp["QueryExecutionId"]

    while True:
        time.sleep(2)
        state = athena.get_query_execution(QueryExecutionId=exec_id)
        status = state["QueryExecution"]["Status"]["State"]
        if status == "SUCCEEDED":
            break
        if status in ("FAILED", "CANCELLED"):
            reason = state["QueryExecution"]["Status"].get("StateChangeReason", "unknown")
            raise RuntimeError(f"Athena query {status}: {reason}")

    results = athena.get_query_results(QueryExecutionId=exec_id)
    rows = results["ResultSet"]["Rows"][1:]  # skip header
    return [[col.get("VarCharValue", "") for col in row["Data"]] for row in rows]


def build_html(pages, refs, daily, days=None, chartjs=None,
               engaged_pages=None, engaged_daily=None):
    days    = days    if days    is not None else DAYS
    chartjs = chartjs if chartjs is not None else CHARTJS
    engaged_pages = engaged_pages or []
    engaged_daily = engaged_daily or []

    total_views   = sum(int(r[1]) for r in daily if len(r) == 2)
    unique_pages  = len(pages)
    total_engaged = sum(int(r[1]) for r in engaged_daily if len(r) == 2)

    page_labels  = json.dumps([r[0] for r in pages if len(r) == 2])
    page_values  = json.dumps([int(r[1]) for r in pages if len(r) == 2])
    ref_labels   = json.dumps([r[0] for r in refs  if len(r) == 2])
    ref_values   = json.dumps([int(r[1]) for r in refs  if len(r) == 2])
    daily_labels = json.dumps([r[0] for r in daily if len(r) == 2])
    daily_values = json.dumps([int(r[1]) for r in daily if len(r) == 2])
    eng_page_labels  = json.dumps([r[0] for r in engaged_pages if len(r) == 2])
    eng_page_values  = json.dumps([int(r[1]) for r in engaged_pages if len(r) == 2])
    eng_daily_labels = json.dumps([r[0] for r in engaged_daily if len(r) == 2])
    eng_daily_values = json.dumps([int(r[1]) for r in engaged_daily if len(r) == 2])

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Hope &amp; Truth Analytics — last {days} days</title>
<script>{chartjs}</script>
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: system-ui, sans-serif; background: #f5f4f0; color: #222; padding: 2rem; }}
  h1 {{ font-size: 1.5rem; margin-bottom: 0.25rem; }}
  .sub {{ color: #666; font-size: 0.9rem; margin-bottom: 2rem; }}
  .stat {{ display: inline-block; background: #fff; border-radius: 8px; padding: 1rem 1.5rem;
           margin-right: 1rem; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,.1); }}
  .stat-num {{ font-size: 2rem; font-weight: 700; color: #4a7c59; }}
  .stat-lbl {{ font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: .05em; }}
  .stat-note {{ font-size: 0.7rem; color: #aaa; margin-top: 0.25rem; }}
  .card {{ background: #fff; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;
           box-shadow: 0 1px 3px rgba(0,0,0,.1); }}
  .card h2 {{ font-size: 1rem; margin-bottom: 1rem; color: #444; }}
  canvas {{ max-height: 320px; }}
</style>
</head>
<body>
<h1>Hope &amp; Truth Ministry — Traffic</h1>
<p class="sub">Last {days} days &nbsp;·&nbsp; Source: CloudFront logs via Athena &nbsp;·&nbsp; Bots filtered</p>

<div class="stat">
  <div class="stat-num">{total_views:,}</div>
  <div class="stat-lbl">Page requests</div>
  <div class="stat-note">bots filtered by user-agent</div>
</div>
<div class="stat">
  <div class="stat-num">{total_engaged:,}</div>
  <div class="stat-lbl">Engaged views</div>
  <div class="stat-note">human-confirmed (10 s or 20% scroll)</div>
</div>
<div class="stat">
  <div class="stat-num">{unique_pages}</div>
  <div class="stat-lbl">Unique pages</div>
</div>

<div class="card">
  <h2>Daily Page Requests (bots filtered)</h2>
  <canvas id="daily"></canvas>
</div>
<div class="card">
  <h2>Daily Engaged Views</h2>
  <canvas id="eng-daily"></canvas>
</div>
<div class="card">
  <h2>Top Pages (by requests)</h2>
  <canvas id="pages"></canvas>
</div>
<div class="card">
  <h2>Top Engaged Pages</h2>
  <canvas id="eng-pages"></canvas>
</div>
<div class="card">
  <h2>Top Referrers</h2>
  <canvas id="refs"></canvas>
</div>

<script>
const accent  = '#4a7c59';
const light   = 'rgba(74,124,89,.15)';
const warm    = '#7c6a4a';
const warmLt  = 'rgba(124,106,74,.15)';

new Chart(document.getElementById('daily'), {{
  type: 'line',
  data: {{
    labels: {daily_labels},
    datasets: [{{ label: 'Requests', data: {daily_values},
      borderColor: accent, backgroundColor: light, fill: true, tension: 0.3, pointRadius: 3 }}]
  }},
  options: {{ plugins: {{ legend: {{ display: false }} }}, scales: {{ y: {{ beginAtZero: true }} }} }}
}});

new Chart(document.getElementById('eng-daily'), {{
  type: 'line',
  data: {{
    labels: {eng_daily_labels},
    datasets: [{{ label: 'Engaged', data: {eng_daily_values},
      borderColor: warm, backgroundColor: warmLt, fill: true, tension: 0.3, pointRadius: 3 }}]
  }},
  options: {{ plugins: {{ legend: {{ display: false }} }}, scales: {{ y: {{ beginAtZero: true }} }} }}
}});

new Chart(document.getElementById('pages'), {{
  type: 'bar',
  data: {{
    labels: {page_labels},
    datasets: [{{ label: 'Requests', data: {page_values}, backgroundColor: accent }}]
  }},
  options: {{ indexAxis: 'y', plugins: {{ legend: {{ display: false }} }},
    scales: {{ x: {{ beginAtZero: true }} }} }}
}});

new Chart(document.getElementById('eng-pages'), {{
  type: 'bar',
  data: {{
    labels: {eng_page_labels},
    datasets: [{{ label: 'Engaged', data: {eng_page_values}, backgroundColor: warm }}]
  }},
  options: {{ indexAxis: 'y', plugins: {{ legend: {{ display: false }} }},
    scales: {{ x: {{ beginAtZero: true }} }} }}
}});

new Chart(document.getElementById('refs'), {{
  type: 'bar',
  data: {{
    labels: {ref_labels},
    datasets: [{{ label: 'Visits', data: {ref_values}, backgroundColor: warm }}]
  }},
  options: {{ indexAxis: 'y', plugins: {{ legend: {{ display: false }} }},
    scales: {{ x: {{ beginAtZero: true }} }} }}
}});
</script>
</body>
</html>"""


PAGES_SQL = f"""
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
    AND uri != '/_beacon'
    AND {BOT_FILTER}
    AND log_date >= DATE_ADD('day', -{DAYS}, CURRENT_DATE)
  GROUP BY uri ORDER BY views DESC LIMIT 25
"""

REFS_SQL = f"""
  SELECT referrer, COUNT(*) AS visits
  FROM cloudfront_logs.access_logs
  WHERE status = 200
    AND referrer != '-'
    AND referrer NOT LIKE '%hopeandtruthministry.com%'
    AND {BOT_FILTER}
    AND log_date >= DATE_ADD('day', -{DAYS}, CURRENT_DATE)
  GROUP BY referrer ORDER BY visits DESC LIMIT 20
"""

DAILY_SQL = f"""
  SELECT log_date, COUNT(*) AS views
  FROM cloudfront_logs.access_logs
  WHERE status = 200
    AND method = 'GET'
    AND uri NOT LIKE '%.js'
    AND uri NOT LIKE '%.css'
    AND uri NOT LIKE '%.jpg'
    AND uri NOT LIKE '%.png'
    AND uri NOT LIKE '%.svg'
    AND uri != '/_beacon'
    AND {BOT_FILTER}
    AND log_date >= DATE_ADD('day', -{DAYS}, CURRENT_DATE)
  GROUP BY log_date ORDER BY log_date ASC
"""

# Beacon hits = confirmed human engagement (fired after 10 s dwell or 20% scroll).
# The page path is passed as the `p` query-string parameter.
ENGAGED_PAGES_SQL = f"""
  SELECT
    url_decode(regexp_extract(query_str, 'p=([^&]+)', 1)) AS page,
    COUNT(*) AS engaged_views
  FROM cloudfront_logs.access_logs
  WHERE status = 200
    AND method = 'GET'
    AND uri = '/_beacon'
    AND query_str LIKE 'p=%'
    AND log_date >= DATE_ADD('day', -{DAYS}, CURRENT_DATE)
  GROUP BY 1 ORDER BY 2 DESC LIMIT 25
"""

ENGAGED_DAILY_SQL = f"""
  SELECT log_date, COUNT(*) AS engaged_views
  FROM cloudfront_logs.access_logs
  WHERE status = 200
    AND method = 'GET'
    AND uri = '/_beacon'
    AND log_date >= DATE_ADD('day', -{DAYS}, CURRENT_DATE)
  GROUP BY log_date ORDER BY log_date ASC
"""


def handler(event, context):
    print("Querying Athena...")
    pages          = run_query(PAGES_SQL)
    refs           = run_query(REFS_SQL)
    daily          = run_query(DAILY_SQL)
    engaged_pages  = run_query(ENGAGED_PAGES_SQL)
    engaged_daily  = run_query(ENGAGED_DAILY_SQL)

    html = build_html(pages, refs, daily,
                      engaged_pages=engaged_pages,
                      engaged_daily=engaged_daily)

    s3.put_object(
        Bucket=S3_BUCKET,
        Key=S3_KEY,
        Body=html.encode("utf-8"),
        ContentType="text/html",
        CacheControl="no-cache, no-store, must-revalidate",
    )

    url = f"https://{S3_BUCKET}/{S3_KEY}"
    print(f"Published: {url}")
    return {"statusCode": 200, "url": url}
