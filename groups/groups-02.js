// This k6 script demonstrates how to group related API calls and validate their responses using checks.
// It sends GET and POST requests to various endpoints, grouping them for better organization and reporting.

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { randomIntBetween, randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const BASE_URL = 'http://localhost:8888/alphamart';

export default function () {
    // Generate random delay and identifier for the custom-delay endpoint
    const delay = randomIntBetween(10, 1000);
    const identifier = randomString(5);

    // Group for basic API calls
    group('basic calls', function () {
        // Send a GET request to the fast endpoint
        const resBasicFast = http.get(`${BASE_URL}/api/basic/fast`);
        // Send a GET request to the time endpoint
        const resBasicTime = http.get(`${BASE_URL}/api/basic/time`);
        // Send a GET request to the custom-delay endpoint with random delay and identifier
        const resBasicCustomDelay = http.get(`${BASE_URL}/api/basic/custom-delay?delay=${delay}&identifier=${identifier}`);

        // Validate each response for status and speed
        check(resBasicFast, {
            'is-status-2xx': (r) => r.status >= 200 && r.status < 300,
            'is-fast': (r) => r.timings.duration < 250,
        });

        check(resBasicTime, {
            'is-status-2xx': (r) => r.status >= 200 && r.status < 300,
            'is-fast': (r) => r.timings.duration < 250,
        });

        check(resBasicCustomDelay, {
            'is-status-2xx': (r) => r.status >= 200 && r.status < 300,
            'is-fast': (r) => r.timings.duration < 250,
        });
    });

    // Group for customer-related API calls
    group('customer calls', function () {
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

        // Send a POST request to create a fake customer
        const resCreateCustomer = http.post(`${BASE_URL}/api/customer/fake`, JSON.stringify(customer), postParams);
        // Send a GET request to retrieve the fake customer
        const resGetCustomer = http.get(`${BASE_URL}/api/customer/fake`);

        // Validate each response for status and speed
        check(resCreateCustomer, {
            'is-status-2xx': (r) => r.status >= 200 && r.status < 300,
            'is-fast': (r) => r.timings.duration < 250,
        });

        check(resGetCustomer, {
            'is-status-2xx': (r) => r.status >= 200 && r.status < 300,
            'is-fast': (r) => r.timings.duration < 250,
        });
    });

    sleep(1); // Sleep for 1 second
}