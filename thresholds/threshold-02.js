// This k6 script demonstrates a simple load test that sends GET requests to a local API endpoint.
// You can use this script to measure performance and apply thresholds in your test configuration.

import { sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart'; // Base URL for the API

export default function () {
    // Send a GET request to the /api/basic/fast-random endpoint
    // Fast reponse and produces random HTTP status codes
    // k6 run .\threshold-02.js --config configuration.json --vus 20 --iterations 150
    http.get(`${BASE_URL}/api/basic/fast-random`);
    sleep(1); // Pause for 1 second between iterations
}