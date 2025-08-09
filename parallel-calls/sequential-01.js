// This k6 script demonstrates how to send multiple HTTP requests sequentially and validate each response.
// It performs GET and POST requests to various endpoints, checking for successful status codes and acceptable response times.

import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart';

// run k6 run sequential-01.js
export default function () {
    // Send a GET request to the fast endpoint
    let res1 = http.get(`${BASE_URL}/api/basic/fast`);
    // Check that the response status is 2xx and duration is less than 3 seconds
    check(res1, {
        'status was 2xx': (r) => r.status >= 200 && r.status < 300,
        'transaction time was less than 3s': (r) => r.timings.duration < 3000,
    });

    // Send a GET request to the custom-delay endpoint with a delay and identifier
    let res2 = http.get(`${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-1`);
    check(res2, {
        'status was 2xx': (r) => r.status >= 200 && r.status < 300,
        'transaction time was less than 3s': (r) => r.timings.duration < 3000,
    });

    // Send a POST request to create a fake customer
    let res3 = http.post(`${BASE_URL}/api/customer/fake`, 
        JSON.stringify({
            "full-name": "Bruce Wayne",
            "birth-date": "2000-07-19",
            "contacts": [
                    {
                            "contact-detail": "bruce.wayne@dc.com",
                            "type": "EMAIL"
                    }
            ]
        }), 
        { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
    );
    check(res3, {
        'status was 2xx': (r) => r.status >= 200 && r.status < 300,
        'transaction time was less than 3s': (r) => r.timings.duration < 3000,
    });

    // Send additional GET requests to the custom-delay endpoint with different identifiers
    let res4 = http.get(`${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-2`);
    check(res4, {
        'status was 2xx': (r) => r.status >= 200 && r.status < 300,
        'transaction time was less than 3s': (r) => r.timings.duration < 3000,
    });

    let res5 = http.get(`${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-3`);
    check(res5, {
        'status was 2xx': (r) => r.status >= 200 && r.status < 300,
        'transaction time was less than 3s': (r) => r.timings.duration < 3000,
    });

    sleep(1); // Pause for 1 second
}