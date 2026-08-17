-- CloudTrail audit queries (Amazon Athena)
-- =========================================
-- Table: cloudtrail_logs.events  — partition-projected over the CloudTrail S3 delivery
--   S3:        s3://aws-cloudtrail-logs-hopeandtruthlogtrail-f705d244/AWSLogs/166782860262/CloudTrail/
--   Workgroup: hopeandtruth-analytics  (results → s3://hopeandtruthministry-logs/athena-results/)
--
-- The trail delivers to S3 only (CloudWatch Logs delivery was removed to stop
-- ~285 MB/day of unread ingest). This is the mirror of the CloudFront analytics
-- pattern in scripts/analytics.sh — query S3 on demand, pay nothing at rest.
--
-- COST DISCIPLINE — Athena bills per byte scanned. ALWAYS constrain the two
-- projected partition columns so a query touches a few MB, not the whole bucket:
--     region     = 'us-west-2'                       (single region)
--     "timestamp" >= 'YYYY/MM/DD'                     (date lower bound, format yyyy/MM/dd)
-- Widen `region IN (...)` or the date range only when you actually need to.
--
-- Run one from the CLI:
--   aws athena start-query-execution --region us-west-2 \
--     --work-group hopeandtruth-analytics \
--     --query-string "$(sed -n '/^-- Q1/,/;/p' scripts/cloudtrail-queries.sql)"


-- Q1: Top API calls in a region over the last 3 days (traffic shape / noise finder)
SELECT eventsource, eventname, count(*) AS n
FROM cloudtrail_logs.events
WHERE region = 'us-west-2'
  AND "timestamp" >= date_format(current_date - interval '3' day, '%Y/%m/%d')
GROUP BY eventsource, eventname
ORDER BY n DESC
LIMIT 25;


-- Q2: Who deleted / terminated / removed anything in the last 7 days
SELECT eventtime, useridentity.arn AS who, eventsource, eventname,
       sourceipaddress, requestparameters
FROM cloudtrail_logs.events
WHERE region = 'us-west-2'
  AND "timestamp" >= date_format(current_date - interval '7' day, '%Y/%m/%d')
  AND (eventname LIKE 'Delete%' OR eventname LIKE 'Terminate%' OR eventname LIKE 'Remove%')
ORDER BY eventtime DESC;


-- Q3: AccessDenied / unauthorized spikes in the last 7 days (misconfig or probing)
SELECT eventtime, useridentity.arn AS who, eventsource, eventname,
       errorcode, errormessage, sourceipaddress
FROM cloudtrail_logs.events
WHERE region = 'us-west-2'
  AND "timestamp" >= date_format(current_date - interval '7' day, '%Y/%m/%d')
  AND errorcode IN ('AccessDenied', 'UnauthorizedOperation', 'Client.UnauthorizedOperation')
ORDER BY eventtime DESC;


-- Q4: Console / IAM sign-in activity in the last 14 days (auth audit)
--     Sign-in events are global → they land under us-east-1.
SELECT eventtime, useridentity.arn AS who, eventname,
       responseelements, sourceipaddress, useragent
FROM cloudtrail_logs.events
WHERE region = 'us-east-1'
  AND "timestamp" >= date_format(current_date - interval '14' day, '%Y/%m/%d')
  AND eventsource = 'signin.amazonaws.com'
ORDER BY eventtime DESC;


-- Q5: IAM / security-posture changes in the last 30 days (policies, keys, roles, trails)
--     IAM is global → us-east-1.
SELECT eventtime, useridentity.arn AS who, eventname, requestparameters
FROM cloudtrail_logs.events
WHERE region = 'us-east-1'
  AND "timestamp" >= date_format(current_date - interval '30' day, '%Y/%m/%d')
  AND eventsource IN ('iam.amazonaws.com', 'cloudtrail.amazonaws.com')
  AND (eventname LIKE 'Create%' OR eventname LIKE 'Delete%'
       OR eventname LIKE 'Put%' OR eventname LIKE 'Update%'
       OR eventname LIKE 'Attach%' OR eventname LIKE 'Detach%')
ORDER BY eventtime DESC;


-- Q6: Everything a single principal did in a window (incident drill-down)
--     Edit the arn filter and dates before running.
SELECT eventtime, awsregion, eventsource, eventname, errorcode, sourceipaddress
FROM cloudtrail_logs.events
WHERE region = 'us-west-2'
  AND "timestamp" BETWEEN '2026/08/01' AND '2026/08/17'
  AND useridentity.arn LIKE '%user/tehansen%'
ORDER BY eventtime DESC
LIMIT 200;
