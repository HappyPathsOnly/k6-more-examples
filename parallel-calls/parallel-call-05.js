// This k6 script demonstrates how to send multiple HTTP requests in parallel using http.batch with named keys.
// It builds a mix of GET and POST requests, sends them together, and checks each response for status and duration.

import { check, sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart';

// call k6 run parallel-call-05.js
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

    // Build a requests object for http.batch, mixing GET and POST requests
    // Each key is a label for the request, which will be used to access the corresponding response
    const requests = {
        'first-request': `${BASE_URL}/api/basic/fast`,
        'second-request': `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-1`,
        'third-request': {
            method: 'POST',
            url: `${BASE_URL}/api/customer/fake`,
            body: JSON.stringify(customer),
            params: postParams,
        },
        'fourth-request': `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-2`,
        'fifth-request': `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-3`,
    }

    // Send all requests in parallel using http.batch and get a responses object
    const responses = http.batch(requests);

    // Add K6 checks for each response to ensure status is 2xx and duration is less than 3 seconds
    for (let key in responses) {
        check(responses[key], {
            [`${key} status is 2xx`]: (res) => res.status >= 200 && res.status < 300,
            [`${key} duration is less than 3 seconds`]: (res) => res.timings.duration < 3000,
        });
    }

    sleep(1); // Pause for 1 second
}