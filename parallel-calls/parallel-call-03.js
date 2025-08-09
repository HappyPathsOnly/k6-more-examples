// This k6 script demonstrates how to send multiple HTTP GET requests in parallel using http.batch.
// It sends requests to several endpoints and checks that all responses have successful status codes and acceptable durations.

import { check, sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart';

// call  k6 run parallel-call-03.js 
export default function () {
    // Send multiple GET requests in parallel using http.batch
    // Each string in the array is a URL for a GET request
    const responses = http.batch([
        `${BASE_URL}/api/basic/fast`,
        `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-1`,
        `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-2`,
        `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-3`,
    ]);

    // Log the array of responses for inspection
    console.log(responses);

    // Add K6 checks to ensure all responses have 2xx status codes and durations less than 3 seconds
    check(responses,
        {
            'all responses status is 2xx': (res) => res.every((r) => r.status >= 200 && r.status < 300),
            'all responses duration is less than 3 seconds': (res) => res.every((r) => r.timings.duration < 3000),
        }
    );

    sleep(1); // Pause for 1 second
}