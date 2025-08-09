// This k6 script demonstrates how to send multiple HTTP requests in parallel using http.batch.
// It builds several requests (GET and POST), sends them together, and checks the responses for status and duration.

import { check, sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart';

// run k6 run parallel-call-01.js
export default function () {
    // Define a GET request to the fast endpoint
    const request1 = {
        method: 'GET',
        url: `${BASE_URL}/api/basic/fast`,
    }

    // Define a GET request to the custom-delay endpoint with a delay and identifier
    const request2 = {
        method: 'GET',
        url: `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-1`,
    }

    // Define a customer object for the POST request
    const customer = {
        'full-name': 'Bruce Wayne',
        'birth-date': '2000-05-01',
        'contacts': [
            {
                'contact-detail': 'bruce.wayne@example.com',
                'type': 'EMAIL',
            }
        ],
    }

    // Define a POST request to create a fake customer
    const request3 = {
        method: 'POST',
        url: `${BASE_URL}/api/customer/fake`,
        params: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
        body: JSON.stringify(customer),
    }

    // Define additional GET requests to the custom-delay endpoint with different identifiers
    const request4 = {
        method: 'GET',
        url: `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-2`,
    }

    const request5 = {
        method: 'GET',
        url: `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-3`,
    }

    // Send all requests in parallel using http.batch
    const responses = http.batch([request1, request2, request3, request4, request5]);

    // Add K6 checks to ensure all responses have 2xx status codes and durations less than 3 seconds
    check(responses,
        {
            'all responses status is 2xx': (res) => res.every((r) => r.status >= 200 && r.status < 300),
            'all responses duration is less than 3 seconds': (res) => res.every((r) => r.timings.duration < 3000),
        }
    );

    sleep(1); // Pause for 1 second
}