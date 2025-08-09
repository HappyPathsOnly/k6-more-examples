// This k6 script demonstrates how to send a GET request and perform checks on the response.
// It validates the response status code, a custom response header, and the presence of a non-empty "message" field in the response body.

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart';

export default function () {
    // Send a GET request to the /api/basic/slow-if-error endpoint
    // Fails with k6 run .\tags-04.js --config configuration-checks.json
    // Checks broken down by check name
    const response = http.get(`${BASE_URL}/api/basic/slow-if-error`);

    // Perform checks on the response
    check(response, {
        // Check that the response status code is in the 2xx range
        'response status code is 2xx': (r) => r.status >= 200 && r.status < 300,
        // Check that the response header 'X-Boolean' is set to 'true'
        'response header X-Boolean is true': (r) => r.headers['X-Boolean'] === 'true',
        // Check that the response body contains a non-empty "message" field
        'response body contains field "message" and is not an empty string': (r) => {
            const body = JSON.parse(r.body);
            return body.hasOwnProperty('message') && body.message !== '';
        },
    });

    sleep(1); // Pause for 1 second between iterations
}