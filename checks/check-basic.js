// This k6 script demonstrates how to use checks to validate HTTP response properties.
// It sends a GET request to a local API endpoint and verifies the status code, response time, and presence of a specific field in the response body.

import { check, sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart' // Base URL for the API

export default function () {
    // Send an HTTP GET request to the /api/basic/fast endpoint
    const response = http.get(`${BASE_URL}/api/basic/fast`);

    // Perform checks on the response
    check(response, {
        // Check that the response status code is in the 2xx range
        'response status code is 2xx': (r) => r.status >= 200 && r.status < 300,
        // Check that the response duration is less than 500 milliseconds
        'response duration < 500 ms': (r) => r.timings.duration < 500,
        // Check that the response body contains a "message" field and it is not empty
        'response body contains field "message" and is not an empty string':
            (r) => r.json().message !== undefined && r.json().message !== '',
    });

    sleep(1); // Pause for 1 second between iterations
}