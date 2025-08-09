import { check, sleep } from 'k6';
import http from 'k6/http';
import { Rate } from 'k6/metrics';

const BASE_URL = 'http://localhost:8888/alphamart';

// Create a Rate metric to track the proportion of 5xx errors in responses
let error_rate_5xx = new Rate('error_rate_5xx');

// call k6 run --vus 5 --duration 5s .\custom-metrics-03.js
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
        ['GET', `${BASE_URL}/api/basic/fast-random`],
        ['POST', `${BASE_URL}/api/customer/fake`, JSON.stringify(customer), postParams],
        ['GET', `${BASE_URL}/api/basic/fast-random`],
        ['GET', `${BASE_URL}/api/basic/fast-random`],
    ]);

    // Iterate over the responses
    responses.forEach(response => {
        // If the status code is in the 500 range, add "true" to the "error_rate_5xx" metric
        // Otherwise, add "false"
        error_rate_5xx.add(response.status >= 500 && response.status < 600);
    });

    // Add K6 checks to ensure all responses have 2xx status codes and durations less than 3 seconds
    check(responses,
        {
            'all responses status is 2xx': (res) => res.every((r) => r.status >= 200 && r.status < 300),
            'all responses duration is less than 3 seconds': (res) => res.every((r) => r.timings.duration < 3000),
        }
    );

    sleep(1); // Pause for 1 second between iterations
}