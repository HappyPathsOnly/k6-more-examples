// This k6 script demonstrates how to set thresholds for HTTP request failures, request duration, and iteration count.
// Thresholds are used to define performance goals and pass/fail criteria for your test.

import { sleep } from 'k6';
import http from 'k6/http';

// Use k6 run .\threshold-01.js --vus 20 --iterations 150 to pass the test
const BASE_URL = 'http://localhost:8888/alphamart';

// Define test options and thresholds
export let options = {
    thresholds: {
        http_req_failed: ['rate < 0.01'],   // http errors should be less than 1%
        http_req_duration: ['p(95) < 200'], // 95% of requests should be below 200ms
        iterations: ['count >= 100', 'count <= 500'], // 100-500 iterations
    },
};

export default function () {
    // Send a GET request to the /api/basic/fast endpoint
    http.get(`${BASE_URL}/api/basic/fast`);
    sleep(1); // Pause for 1 second
}