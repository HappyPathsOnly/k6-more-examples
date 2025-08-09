// This k6 script demonstrates how to use groups and custom thresholds for grouped API calls.
// It sends GET and POST requests to various endpoints, grouping them for better organization and reporting.
// Custom thresholds are set for group durations to ensure performance targets are met.

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { randomIntBetween, randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const BASE_URL = 'http://localhost:8888/alphamart';

// Define custom thresholds for group durations
export const options = {
    thresholds: {
        // Threshold for the 'basic calls' group
        'group_duration{group:::basic calls}': ['p(95) < 250'],
        // Threshold for the 'customer calls' group
        'group_duration{group:::customer calls}': ['p(95) < 250'],
        // Threshold for the nested 'basic fast calls' group
        'group_duration{group:::basic calls::basic fast calls}': ['p(95) < 250'],
    },
};

// call  k6 run .\groups-04.js
export default function () {
    // Generate random delay and identifier for the custom-delay endpoint
    const delay = randomIntBetween(10, 1000);
    const identifier = randomString(5);

    // Group for basic API calls
    group('basic calls', function () {
        // Send a GET request to the time endpoint
        const resBasicTime = http.get(`${BASE_URL}/api/basic/time`);
        // Send a GET request to the custom-delay endpoint with random delay and identifier
        const resBasicCustomDelay = http.get(`${BASE_URL}/api/basic/custom-delay?delay=${delay}&identifier=${identifier}`);

        // Validate the time endpoint response for status and speed
        check(resBasicTime, {
            'is-status-2xx': (r) => r.status >= 200 && r.status < 300,
            'is-fast': (r) => r.timings.duration < 250,
        });

        // Validate the custom-delay endpoint response for status and speed
        check(resBasicCustomDelay, {
            'is-status-2xx': (r) => r.status >= 200 && r.status < 300,
            'is-fast': (r) => r.timings.duration < 250,
        });

        // Nested group for fast endpoints
        group('basic fast calls', function () {
            // Send a GET request to the fast endpoint
            const resBasicFast = http.get(`${BASE_URL}/api/basic/fast`);
            check(resBasicFast, {
                'is-status-2xx': (r) => r.status >= 200 && r.status < 300,
                'is-fast': (r) => r.timings.duration < 250,
            });

            // Send a GET request to the fast-random endpoint
            const resBasicFastRandom = http.get(`${BASE_URL}/api/basic/fast-random`);
            check(resBasicFastRandom, {
                'is-status-2xx': (r) => r.status >= 200 && r.status < 300,
                'is-fast': (r) => r.timings.duration < 250,
            });
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

        // Validate each customer response for status and speed
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