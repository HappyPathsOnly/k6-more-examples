# k6 API Testing Course

This repository contains code samples and notes from a hands-on course on [k6](https://k6.io/), an open-source load testing tool for testing the performance of APIs and web applications. The course covers a wide range of k6 features, from basic scripting to advanced scenarios, custom metrics, and test lifecycle management.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Key Features Demonstrated](#key-features-demonstrated)
  - [1. Start Using k6](#1-start-using-k6)
  - [2. HTTP Requests](#2-http-requests)
  - [3. Test Data Management](#3-test-data-management)
  - [4. Parallel and Sequential Calls](#4-parallel-and-sequential-calls)
  - [5. Custom Metrics](#5-custom-metrics)
  - [6. Checks](#6-checks)
  - [7. Groups](#7-groups)
  - [8. Thresholds](#8-thresholds)
  - [9. Tags](#9-tags)
  - [10. Test Lifecycle (init, setup, teardown)](#10-test-lifecycle-init-setup-teardown)
  - [11. Environment Variables](#11-environment-variables)
  - [12. HTTP Redirects](#12-http-redirects)
- [How to Run the Scripts](#how-to-run-the-scripts)
- [References](#references)

---

## Getting Started

- Install [k6](https://k6.io/docs/getting-started/installation/) on your machine.
- Clone this repository.
- Run scripts using the command line, e.g.:
  ```
  k6 run script-name.js
  ```
- Some scripts require additional parameters or environment variables (see below).

---

## Key Features Demonstrated

### 1. Start Using k6

- **[See the start-using-k6 directory.](./start-using-k6/)**
- **Getting started**: This section provides introductory scripts and examples to help you quickly get up and running with k6. It covers basic installation, running your first script, understanding the k6 execution model, and essential command-line options. Ideal for beginners or as a quick refresher for experienced users.

### 2. HTTP Requests

- **[See the http-requests directory.](./http-requests/)**
- **GET and POST requests**: Simple scripts show how to send HTTP requests and validate responses.
- **Request headers and payloads**: Setting custom headers and sending JSON bodies.
- **Extracting and reusing data**: Scripts demonstrate logging in, extracting tokens, and using them in subsequent requests.
- **Dynamic payloads**: Creating and validating resources using data from previous responses.

### 3. Test Data Management

- **[See the reading-test-data directory.](./reading-test-data/)**
- **Random data generation**: Use of arrays and random selection for test data.
- **CSV data loading**: Using `papaparse` and `SharedArray` to load and share CSV data across VUs.

### 4. Parallel and Sequential Calls

- **[See the parallel-calls directory.](./parallel-calls/)**
- **http.batch**: Sending multiple requests in parallel (with both array and object syntax).
- **Sequential requests**: Sending requests one after another and validating each response.

### 5. Custom Metrics

- **[See the custom-metrics directory.](./custom-metrics/)**
- **Counter**: Track the number of batch requests.
- **Trend**: Record and analyze response times or other numeric values.
- **Rate**: Track the proportion of errors (e.g., 5xx responses).
- **Gauge**: Record the size of response bodies or other instantaneous values.

### 6. Checks

- **[See the checks directory.](./checks/)**
- **Checks**: k6 checks are used to assert that responses meet expectations (such as status codes, response times, or specific content in the response body). Checks help you validate API correctness and reliability during load testing. You can define multiple checks per request, and their results are included in the test summary and metrics.

### 7. Groups

- **[See the groups directory.](./groups/)**
- **group()**: Organize related requests for better reporting.
- **Nested groups**: Structure complex scenarios.

### 8. Thresholds

- **[See the thresholds directory.](./thresholds/)**
- **Custom thresholds**: Set performance targets for groups, requests, or metrics.
- **Abort on fail**: Automatically stop the test if a threshold is breached.
- **Granular control**: Apply thresholds to specific tags or request types.

### 9. Tags

- **[See the tags directory.](./tags/)**
- **Tags**: Tags in k6 are key-value pairs that you can attach to requests, checks, groups, and metrics. They allow you to categorize and filter results, set thresholds for specific request types, and generate more granular reports. Tags are especially useful for analyzing performance by endpoint, status code, or custom business logic.

### 10. Test Lifecycle (init, setup, teardown)

- **[See the lifecycle directory.](./lifecycle/)**
- **init**: Code outside functions runs once at script load.
- **setup()**: Runs once before VUs start; useful for preparing data or authentication.
- **default()**: Main VU code, executed per iteration.
- **teardown()**: Runs once after all VUs finish; useful for cleanup and validation.

### 11. Environment Variables

- **[See the environment-variables directory.](./environment-variables/)**
- **__ENV**: Use environment variables to configure server addresses, credentials, and other parameters at runtime.

### 12. HTTP Redirects

- **[See the http-redirect directory.](./http-redirect/)**
- **HTTP Redirect Handling**: Demonstrates how k6 handles HTTP redirects by default, how to configure the maximum number of redirects, and how to disable following redirects entirely. The scripts show how to test endpoints that return redirects, check redirect status codes, and validate the final destination or intermediate responses. This is useful for verifying redirect logic, authentication flows, and ensuring your API or web application behaves correctly when clients encounter redirects.

---

## How to Run the Scripts

- **Basic run**:
  ```
  k6 run script-name.js
  ```
- **With environment variables**:
  ```
  k6 run script-name.js -e SERVER_ADDRESS=http://localhost:8888/alphamart -e USERNAME=guest -e PASSWORD=GuestPassword
  ```
- **With custom thresholds/config**:
  ```
  k6 run script-name.js --config configuration-file.json
  ```
- **With options** (e.g., VUs, duration, iterations):
  ```
  k6 run --vus 10 --duration 30s script-name.js
  ```

---

## References

- [k6 Documentation](https://k6.io/docs/)
- [k6 JavaScript API](https://k6.io/docs/javascript-api/)
- [k6 Examples](https://k6.io/examples/)
- [k6 Metrics](https://k6.io/docs/using-k6/metrics/)
- [k6 Environment Variables](https://k6.io/docs/using-k6/environment-variables/)

---

## About

This repository is intended for educational purposes and as a reference for building robust API performance tests with k6. Each script is heavily commented to explain the purpose and usage of k6