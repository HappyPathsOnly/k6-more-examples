// This k6 script demonstrates how to use tags and thresholds to measure performance for different HTTP response types.
// It sends GET requests to a local API endpoint and applies thresholds based on response tags and status codes.

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart';

// Define test options, including VUs, duration, and thresholds for various tags and status codes
export let options = {
    vus: 40, // Number of virtual users
    duration: '5s', // Total test duration
    thresholds: {
        // Thresholds for request duration based on tags and status codes
        'http_req_duration{expected_response: false}': ['p(95) < 3000'],
        'http_req_duration{expected_response: true}': ['p(95) < 200'],
        'http_req_duration{status: 200}': ['p(95) < 200'],
        'http_req_duration{status: 202}': ['p(95) < 200'],
        'http_req_duration{status: 400}': ['p(95) < 3000'],
        'http_req_duration{status: 403}': ['p(95) < 3000'],
        'http_req_duration{status: 415}': ['p(95) < 3000'],
        'http_req_duration{status: 500}': ['p(95) < 3000'],
        // Thresholds for minimum request counts by status code
        'http_reqs{status: 200}': ['count > 1'],
        'http_reqs{status: 202}': ['count > 1'],
        'http_reqs{status: 400}': ['count > 1'],
        'http_reqs{status: 403}': ['count > 1'],
        'http_reqs{status: 415}': ['count > 1'],
        'http_reqs{status: 500}': ['count > 1'],
    },
};

export default function () {
    // Send a GET request to the /api/basic/slow-if-error endpoint
    // Run with  k6 run tags-02.js  
    const response = http.get(`${BASE_URL}/api/basic/slow-if-error`);
    // Add your desired assertions or other logic here

    sleep(1); // Pause for 1 second between requests
}