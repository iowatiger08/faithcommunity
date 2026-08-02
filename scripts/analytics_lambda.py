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


def _xy(rows):
    """Split Athena rows into parallel label/value arrays, skipping malformed rows."""
    good = [r for r in rows if len(r) == 2]
    return {"labels": [r[0] for r in good], "values": [int(r[1]) for r in good]}


def _window_payload(label, pages, refs, daily, engaged_pages, engaged_daily):
    """Bundle one time window's metrics into a JSON-serialisable dict for the client."""
    engaged_pages = engaged_pages or []
    engaged_daily = engaged_daily or []
    return {
        "label":         label,
        "totalViews":    sum(int(r[1]) for r in daily if len(r) == 2),
        "totalEngaged":  sum(int(r[1]) for r in engaged_daily if len(r) == 2),
        "uniquePages":   len(pages),
        "daily":         _xy(daily),
        "engDaily":      _xy(engaged_daily),
        "pages":         _xy(pages),
        "engPages":      _xy(engaged_pages),
        "refs":          _xy(refs),
    }


def build_html(pages, refs, daily, days=None, chartjs=None,
               engaged_pages=None, engaged_daily=None, alltime=None):
    days    = days    if days    is not None else DAYS
    chartjs = chartjs if chartjs is not None else CHARTJS

    recent = _window_payload(f"Last {days} days", pages, refs, daily,
                             engaged_pages, engaged_daily)

    has_alltime = alltime is not None
    if has_alltime:
        allw = _window_payload("All time",
                               alltime.get("pages", []),
                               alltime.get("refs", []),
                               alltime.get("daily", []),
                               alltime.get("engaged_pages", []),
                               alltime.get("engaged_daily", []))
    else:
        allw = _window_payload("All time", [], [], [], [], [])

    periods_json = json.dumps({"recent": recent, "all": allw})

    # Toggle is only meaningful when an all-time window was supplied.
    toggle_html = (
        f"""<div class="toggle">
  <button data-period="recent" class="active">Last {days} days</button>
  <button data-period="all">All time</button>
</div>"""
        if has_alltime else ""
    )

    r = recent  # default (server-rendered) view is the recent window
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Hope &amp; Truth Analytics</title>
<script>{chartjs}</script>
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: system-ui, sans-serif; background: #f5f4f0; color: #222; padding: 2rem; }}
  h1 {{ font-size: 1.5rem; margin-bottom: 0.25rem; }}
  .sub {{ color: #666; font-size: 0.9rem; margin-bottom: 1.25rem; }}
  .toggle {{ display: inline-flex; margin-bottom: 2rem; border: 1px solid #d8d5cc;
             border-radius: 8px; overflow: hidden; }}
  .toggle button {{ font: inherit; font-size: 0.85rem; padding: 0.5rem 1.1rem; border: none;
                    background: #fff; color: #666; cursor: pointer; }}
  .toggle button + button {{ border-left: 1px solid #d8d5cc; }}
  .toggle button.active {{ background: #4a7c59; color: #fff; }}
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
<p class="sub"><span id="period-label">{r['label']}</span> &nbsp;·&nbsp; Source: CloudFront logs via Athena &nbsp;·&nbsp; Bots filtered</p>

{toggle_html}

<div class="stat">
  <div class="stat-num" id="stat-views">{r['totalViews']:,}</div>
  <div class="stat-lbl">Page requests</div>
  <div class="stat-note">bots filtered by user-agent</div>
</div>
<div class="stat">
  <div class="stat-num" id="stat-engaged">{r['totalEngaged']:,}</div>
  <div class="stat-lbl">Engaged views</div>
  <div class="stat-note">human-confirmed (10 s or 20% scroll)</div>
</div>
<div class="stat">
  <div class="stat-num" id="stat-pages">{r['uniquePages']}</div>
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
const PERIODS = {periods_json};
const accent  = '#4a7c59';
const light   = 'rgba(74,124,89,.15)';
const warm    = '#7c6a4a';
const warmLt  = 'rgba(124,106,74,.15)';

function lineCfg(d, color, bg, label) {{
  return {{ type: 'line',
    data: {{ labels: d.labels, datasets: [{{ label, data: d.values,
      borderColor: color, backgroundColor: bg, fill: true, tension: 0.3, pointRadius: 3 }}] }},
    options: {{ plugins: {{ legend: {{ display: false }} }}, scales: {{ y: {{ beginAtZero: true }} }} }} }};
}}
function barCfg(d, color, label) {{
  return {{ type: 'bar',
    data: {{ labels: d.labels, datasets: [{{ label, data: d.values, backgroundColor: color }}] }},
    options: {{ indexAxis: 'y', plugins: {{ legend: {{ display: false }} }},
      scales: {{ x: {{ beginAtZero: true }} }} }} }};
}}

const p0 = PERIODS.recent;
const charts = {{
  daily:    new Chart(document.getElementById('daily'),     lineCfg(p0.daily,    accent, light,  'Requests')),
  engDaily: new Chart(document.getElementById('eng-daily'), lineCfg(p0.engDaily, warm,   warmLt, 'Engaged')),
  pages:    new Chart(document.getElementById('pages'),     barCfg(p0.pages,     accent, 'Requests')),
  engPages: new Chart(document.getElementById('eng-pages'), barCfg(p0.engPages,  warm,   'Engaged')),
  refs:     new Chart(document.getElementById('refs'),      barCfg(p0.refs,      warm,   'Visits')),
}};

function apply(chart, d) {{
  chart.data.labels = d.labels;
  chart.data.datasets[0].data = d.values;
  chart.update();
}}

function showPeriod(key) {{
  const p = PERIODS[key];
  if (!p) return;
  document.getElementById('stat-views').textContent   = p.totalViews.toLocaleString();
  document.getElementById('stat-engaged').textContent = p.totalEngaged.toLocaleString();
  document.getElementById('stat-pages').textContent   = p.uniquePages;
  document.getElementById('period-label').textContent = p.label;
  apply(charts.daily,    p.daily);
  apply(charts.engDaily, p.engDaily);
  apply(charts.pages,    p.pages);
  apply(charts.engPages, p.engPages);
  apply(charts.refs,     p.refs);
  document.querySelectorAll('.toggle button').forEach(function(b) {{
    b.classList.toggle('active', b.dataset.period === key);
  }});
}}

document.querySelectorAll('.toggle button').forEach(function(b) {{
  b.addEventListener('click', function() {{ showPeriod(b.dataset.period); }});
}});
</script>
</body>
</html>"""


def _window_clause(days):
    """SQL fragment limiting rows to the last `days` days, or '' for all time."""
    if days is None:
        return ""
    return f"    AND log_date >= DATE_ADD('day', -{days}, CURRENT_DATE)\n"


def pages_sql(days):
    return f"""
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
{_window_clause(days)}  GROUP BY uri ORDER BY views DESC LIMIT 25
"""


def refs_sql(days):
    return f"""
  SELECT referrer, COUNT(*) AS visits
  FROM cloudfront_logs.access_logs
  WHERE status = 200
    AND referrer != '-'
    AND referrer NOT LIKE '%hopeandtruthministry.com%'
    AND {BOT_FILTER}
{_window_clause(days)}  GROUP BY referrer ORDER BY visits DESC LIMIT 20
"""


def daily_sql(days):
    return f"""
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
{_window_clause(days)}  GROUP BY log_date ORDER BY log_date ASC
"""


# Beacon hits = confirmed human engagement (fired after 10 s dwell or 20% scroll).
# The page path is passed as the `p` query-string parameter.
def engaged_pages_sql(days):
    return f"""
  SELECT
    url_decode(regexp_extract(query_str, 'p=([^&]+)', 1)) AS page,
    COUNT(*) AS engaged_views
  FROM cloudfront_logs.access_logs
  WHERE status = 200
    AND method = 'GET'
    AND uri = '/_beacon'
    AND query_str LIKE 'p=%'
{_window_clause(days)}  GROUP BY 1 ORDER BY 2 DESC LIMIT 25
"""


def engaged_daily_sql(days):
    return f"""
  SELECT log_date, COUNT(*) AS engaged_views
  FROM cloudfront_logs.access_logs
  WHERE status = 200
    AND method = 'GET'
    AND uri = '/_beacon'
{_window_clause(days)}  GROUP BY log_date ORDER BY log_date ASC
"""


def query_window(days):
    """Run all five metric queries for a single time window."""
    return {
        "pages":         run_query(pages_sql(days)),
        "refs":          run_query(refs_sql(days)),
        "daily":         run_query(daily_sql(days)),
        "engaged_pages": run_query(engaged_pages_sql(days)),
        "engaged_daily": run_query(engaged_daily_sql(days)),
        "days":          days,
    }


def handler(event, context):
    print("Querying Athena...")
    recent  = query_window(DAYS)   # last N days
    alltime = query_window(None)   # all time

    html = build_html(recent["pages"], recent["refs"], recent["daily"],
                      engaged_pages=recent["engaged_pages"],
                      engaged_daily=recent["engaged_daily"],
                      alltime=alltime)

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
