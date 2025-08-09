// This k6 script demonstrates a simple load test that sends GET requests to a "slow" local API endpoint.
// Use this script to observe how your system handles slower responses and to apply thresholds for performance testing.

import { sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart'; // Base URL for the API

export default function () {
    // Send a GET request to the /api/basic/slow endpoint
    // k6 run .\threshold-03.js --config configuration-with-abort.json --vus 20 --duration 10m
    http.get(`${BASE_URL}/api/basic/slow`);
    sleep(1); // Pause for 1 second between iterations
}