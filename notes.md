# k6 API Testing Notes

This document summarizes key concepts, commands, and best practices for using [k6](https://k6.io/) for API and load testing. It is based on course notes and code samples, focusing on the main features of the k6 tool.

---

## Table of Contents

- [Command Line Options](#command-line-options)
- [Running and Configuring Tests](#running-and-configuring-tests)
- [Metrics and Percentiles](#metrics-and-percentiles)
- [Web Dashboard](#web-dashboard)
- [Thresholds](#thresholds)
- [Tags](#tags)
- [Modules and Utilities](#modules-and-utilities)
- [Debugging](#debugging)
- [SharedArray and Data Management](#sharedarray-and-data-management)
- [Data Correlation](#data-correlation)
- [Self-Signed Certificates](#self-signed-certificates)
- [Redirects](#redirects)
- [Parallel and Batch Requests](#parallel-and-batch-requests)
- [Custom Metrics](#custom-metrics)
- [Groups](#groups)
- [Lifecycle (init, setup, teardown)](#lifecycle-init-setup-teardown)
- [Environment Variables](#environment-variables)

---

## Command Line Options

- **Virtual Users (VUs):**  
  `--vus <number>` — Number of concurrent users.

- **Iterations:**  
  `--iterations <number>` — Total number of script iterations.

- **Duration:**  
  `--duration <time>` — Total test duration (e.g., `30s`, `5m`).

- **Stages:**  
  Example: `--stage 5s:3,10s:10,5s:0`  
  (Ramp up/down users over time.)

- **Default:**  
  If not specified, k6 runs 1 iteration with 1 user.

- **Random Sleep:**  
  Use `Math.random()` or `randomIntBetween()` for random sleep times.

- **Options Precedence:**  
  1. Command line flags  
  2. JSON config file (`--config config.json`)  
  3. In-script options

- **Create a New Script:**  
  `k6 new <filename>`

---

## Running and Configuring Tests

- **Run a Script:**  
  `k6 run script.js`

- **With Config File:**  
  `k6 run script.js --config config.json`

- **With Environment Variables:**  
  `k6 run script.js -e SERVER_ADDRESS=<server> -e USERNAME=guest -e PASSWORD=GuestPassword`

- **With HTTP Debugging:**  
  `k6 run script.js --http-debug`  
  `k6 run script.js --http-debug=full`

- **With Dashboard:**  
  ```
  set K6_WEB_DASHBOARD=true
  set K6_WEB_PERIOD=5s
  set K6_WEB_DASHBOARD_EXPORT=report.html
  k6 run script.js
  ```
  Dashboard: [http://localhost:5665](http://localhost:5665)

- **Create a File with Default Template:**  
  `k6 new <filename>`

---

## Metrics and Percentiles

**Metric Types:**

- **Counter:** Incremental count (e.g., number of requests).
- **Gauge:** Value at a point in time (e.g., memory usage).
- **Rate:** Percentage of an event (e.g., error rate).
- **Trend:** Value over time (min, max, median, average, percentiles).

**Percentiles:**

- `p(70)`: 70% of values are faster than X ms; 30% are slower.
- Change summary percentiles with `--summary-trend-stats` (e.g., `p(75),p(99)`).

**References:**
- [k6 Metrics](https://grafana.com/docs/k6/latest/using-k6/metrics/)
- [Metric Reference](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/)

---

## Web Dashboard

- Enable with `K6_WEB_DASHBOARD=true`
- Export with `K6_WEB_DASHBOARD_EXPORT=html-report.html`
- Access at [http://localhost:5665](http://localhost:5665)
- [Web Dashboard Docs](https://grafana.com/docs/k6/latest/results-output/web-dashboard/)

---

## Thresholds

- **Purpose:** Set pass/fail criteria for metrics.
- **Examples:**
  - `'http_req_duration': ['p(95)<500']` (95% of requests < 500ms)
- **Abort on Fail:**  
  `abortOnFail: true` — Stop test as soon as threshold fails.
- **Delay Abort:**  
  `delayAbortEval: [duration]` — Wait before evaluating threshold.
- **Run with Thresholds:**  
  `k6 run script.js --config configuration.json`

---

## Tags

- **Purpose:** Categorize requests, checks, and groups.
- **Usage:**  
  `k6 run script.js --config configuration.json`
- **Docs:**  
  [Tags and Groups](https://grafana.com/docs/k6/latest/using-k6/tags-and-groups/)

---

## Modules and Utilities

- **Base64 Encoding:**  
  `k6 run script.js --vus 20 --duration 5s`
- **Importing Modules:**  
  Use `import` statements for custom or utility modules.
- **k6 Utils Library:**  
  [k6-utils](https://grafana.com/docs/k6/latest/javascript-api/jslib/utils/)

- **Extensions:**  
  - [Create Extensions](https://grafana.com/docs/k6/latest/extensions/create/)
  - [Explore Extensions](https://grafana.com/docs/k6/latest/extensions/explore/)

---

## Debugging

- **HTTP Debug:**  
  `k6 run script.js --http-debug` or `--http-debug=full`
- **Console Logging:**  
  Use `console.log()` for debugging output.

---

## SharedArray and Data Management

- **SharedArray:**  
  Efficiently share data (e.g., CSV) across VUs.
- **CSV Parsing:**  
  Use `papaparse` for CSV files.
- **Example:**  
  ```
  k6 run --vus 3 --iterations 3 --http-debug=full test-data-01.js
  ```

---

## Extract and reuse HTTP data

- **Purpose:** Use data from one request in subsequent requests.
- **Examples:**
  - Extract access token from login, use in next request.
  - Use product UUID from creation in a GET or DELETE.
- **Example Command:**  
  `k6 run --http-debug=full data-correlation-01.js`

---

## Self-Signed Certificates

- **Bypass Verification:**  
  `k6 run script.js --insecure-skip-tls-verify`

---

## Redirects

- **Automatic:**  
  k6 follows up to 10 redirects by default.
- **Control:**  
  `--max-redirects=0` to disable.
- **Example:**  
  `k6 run http-redirect-01.js --http-debug --max-redirects=0`

---

## Parallel and Batch Requests

- **Parallel Calls:**  
  Use `http.batch()` to send multiple requests in parallel.
- **Faster Execution:**  
  Batch requests execute quicker than sequential.

---

## Custom Metrics

- **Batch Call Counting:**  
  Custom metrics can count batch calls.
- **Example:**  
  `k6 run --vus 5 --duration 5s custom-metrics-01.js`
- **Dashboard:**  
  Set `K6_WEB_DASHBOARD=true` to view metrics like `article_content_size`.

---

## Groups

- **Purpose:** Organize related requests for reporting.
- **CLI Output:**  
  Groups are not printed by default; use summary export or custom metrics.
- **Summary Export:**  
  `k6 run --summary-export=summary.json groups-02.js`
- **Trend Metric:**  
  Add a trend metric for group durations.

---

## Lifecycle (init, setup, teardown)

- **init:**  
  Runs once before setup, for each VU, and before/after teardown.
  - Use for variable declarations and options.

- **setup():**  
  Runs once after init, before VUs.
  - Use for environment checks, data prep, login.
  - Returned value is passed to default() and teardown().

- **default():**  
  Main VU code, runs per iteration.

- **teardown():**  
  Runs once after all VUs finish (if setup completes).
  - Use for cleanup and validation.

- **Options:**  
  `--no-setup`, `--no-teardown` to skip stages.

- **Example:**  
  `k6 run lifecycle-03.js --vus 3 --iterations 15`

---

## Environment Variables

- **Set on Command Line:**  
  `k6 run script.js -e SERVER_ADDRESS=<server> -e USERNAME=guest -e PASSWORD=GuestPassword`
- **Or:**  
  `set SERVER_ADDRESS=<server>`
- **Access in Script:**  
  `__ENV.SERVER_ADDRESS`, `__ENV.USERNAME`, etc.

---

## Additional Tips

- Use Postman to generate cURL, then convert to k6 script.
- Use `randomIntBetween` and `randomString` for dynamic test data.
- Use configuration files for thresholds and custom test settings.
- Use the dashboard and summary exports for reporting and analysis.
