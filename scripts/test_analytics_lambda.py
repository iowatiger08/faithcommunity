import pytest
from analytics_lambda import build_html, handler, run_query

CHARTJS = "/* chart */"

PAGES = [["/sermons/grace", "42"], ["/about", "18"]]
REFS  = [["https://google.com", "10"], ["https://facebook.com", "5"]]
DAILY = [["2026-05-01", "30"], ["2026-05-02", "25"], ["2026-05-03", "50"]]


def html(**kwargs):
    return build_html(PAGES, REFS, DAILY, days=30, chartjs=CHARTJS, **kwargs)


# ── build_html ────────────────────────────────────────────────────────────────

def test_total_views_is_sum_of_daily_counts():
    result = html()
    assert "105" in result  # 30 + 25 + 50


def test_unique_pages_stat_equals_page_row_count():
    result = html()
    assert ">2<" in result  # 2 page rows


def test_page_labels_and_values_embedded_as_json():
    result = html()
    assert '["/sermons/grace", "/about"]' in result
    assert "[42, 18]" in result


def test_referrer_labels_and_values_embedded_as_json():
    result = html()
    assert '["https://google.com", "https://facebook.com"]' in result
    assert "[10, 5]" in result


def test_daily_labels_and_values_embedded_as_json():
    result = html()
    assert '["2026-05-01", "2026-05-02", "2026-05-03"]' in result
    assert "[30, 25, 50]" in result


def test_malformed_rows_are_skipped():
    pages_with_bad = [["/good", "5"], ["/bad"], ["/also-bad", "x", "extra"]]
    result = build_html(pages_with_bad, [], [], days=30, chartjs=CHARTJS)
    assert '["/good"]' in result
    assert "[5]" in result


def test_empty_inputs_produce_valid_html_with_zero_totals():
    result = build_html([], [], [], days=30, chartjs=CHARTJS)
    assert "<!DOCTYPE html>" in result
    assert ">0<" in result  # total views
    assert "[]" in result   # empty chart arrays


# ── run_query ─────────────────────────────────────────────────────────────────

def make_athena_response(rows):
    def to_row(values):
        return {"Data": [{"VarCharValue": v} for v in values]}
    return {
        "ResultSet": {
            "Rows": [to_row(["uri", "views"])] + [to_row(r) for r in rows]
        }
    }


def test_run_query_skips_header_and_returns_rows(mocker):
    mocker.patch("analytics_lambda.athena.start_query_execution",
                 return_value={"QueryExecutionId": "abc"})
    mocker.patch("analytics_lambda.athena.get_query_execution",
                 return_value={"QueryExecution": {"Status": {"State": "SUCCEEDED"}}})
    mocker.patch("analytics_lambda.athena.get_query_results",
                 return_value=make_athena_response([["/sermons", "10"], ["/about", "5"]]))
    mocker.patch("time.sleep")

    result = run_query("SELECT 1")

    assert result == [["/sermons", "10"], ["/about", "5"]]


def test_run_query_raises_on_failed_query(mocker):
    mocker.patch("analytics_lambda.athena.start_query_execution",
                 return_value={"QueryExecutionId": "abc"})
    mocker.patch("analytics_lambda.athena.get_query_execution",
                 return_value={"QueryExecution": {"Status": {
                     "State": "FAILED",
                     "StateChangeReason": "Table not found"
                 }}})
    mocker.patch("time.sleep")

    with pytest.raises(RuntimeError, match="Table not found"):
        run_query("SELECT 1")


# ── handler ───────────────────────────────────────────────────────────────────

def test_handler_uploads_html_and_returns_url(mocker):
    mocker.patch("analytics_lambda.run_query", side_effect=[PAGES, REFS, DAILY])
    put = mocker.patch("analytics_lambda.s3.put_object")

    result = handler({}, None)

    assert result == {
        "statusCode": 200,
        "url": "https://hopeandtruthministry.com/_analytics/index.html",
    }
    put.assert_called_once()
    call_kwargs = put.call_args.kwargs
    assert call_kwargs["Bucket"] == "hopeandtruthministry.com"
    assert call_kwargs["Key"] == "_analytics/index.html"
    assert call_kwargs["ContentType"] == "text/html"
    assert b"<!DOCTYPE html>" in call_kwargs["Body"]
    assert b"/sermons/grace" in call_kwargs["Body"]
