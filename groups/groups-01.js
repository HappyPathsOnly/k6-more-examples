import http from 'k6/http';
import { sleep, group } from 'k6';
import { randomIntBetween, randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { Trend } from 'k6/metrics';

// This script includes grouping of requests and custom metrics for tracking performance

const BASE_URL = 'http://localhost:8888/alphamart';

//to print out in summary use trend
let basicCallsDuration = new Trend('basic_calls_duration');


// call k6 run .\groups-01.js
export default function () {
    // Generate random delay and identifier for custom-delay endpoint
    const delay = randomIntBetween(10, 1000);
    const identifier = randomString(5);

    // Group for basic API calls
    group('basic calls', function () {

        let start  = Date.now();

        // Send a GET request to the fast endpoint
        const resBasicFast = http.get(`${BASE_URL}/api/basic/fast`);
        // Send a GET request to the time endpoint
        const resBasicTime = http.get(`${BASE_URL}/api/basic/time`);
        // Send a GET request to the custom-delay endpoint with random delay and identifier
        const resBasicCustomDelay = http.get(`${BASE_URL}/api/basic/custom-delay?delay=${delay}&identifier=${identifier}`);

        let end = Date.now();

        basicCallsDuration.add(end - start); // Track the duration of basic calls

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
    });

    sleep(1); // Sleep for 1 second
}