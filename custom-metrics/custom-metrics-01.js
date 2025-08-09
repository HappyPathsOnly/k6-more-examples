// This k6 script demonstrates how to use a custom Counter metric to track the number of batch requests sent.
// It sends multiple HTTP requests in parallel using http.batch and validates the responses.

import { check, sleep } from 'k6';
import http from 'k6/http';
import { Counter } from 'k6/metrics'; // Import Counter from k6/metrics

const BASE_URL = 'http://localhost:8888/alphamart';

// Instantiate a new Counter to track batch requests
let batchCounter = new Counter('batch_requests');

// call k6 run --vus 5 --duration 5s .\custom-metrics-01.js
export default function () {
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

    // Set request headers for the POST request
    const postParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    // Send multiple requests in parallel using http.batch
    // The array contains GET and POST requests to different endpoints
    const responses = http.batch([
        ['GET', `${BASE_URL}/api/basic/fast`],
        ['GET', `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-1`],
        ['POST', `${BASE_URL}/api/customer/fake`, JSON.stringify(customer), postParams],
        ['GET', `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-2`],
        ['GET', `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-3`],
    ]);

    // Increment the custom batch request counter
    batchCounter.add(1);

    // Add K6 checks to ensure all responses have 2xx status codes and durations less than 3 seconds
    check(responses,
        {
            'all responses status is 2xx': (res) => res.every((r) => r.status >= 200 && r.status < 300),
            'all responses duration is less than 3 seconds': (res) => res.every((r) => r.timings.duration < 3000),
        }
    );

    sleep(1); // Pause for 1 second between iterations
}