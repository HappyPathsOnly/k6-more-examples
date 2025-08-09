// This k6 script demonstrates how to use custom tags to categorize requests based on delay values.
// It sends GET requests to a local API endpoint with different delay parameters and assigns a custom tag to each request.

import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart';

// Run with  k6 run .\tags-05.js --config configuration-request.json --out json=output-custom-delay.json
// Output to file
// Run with k6 run .\tags-05.js --config configuration-request-custom.json
// Metrics using custom tags dependant on parameters

export default function () {
    // Generate random delay values for low and high delay requests
    const lowDelay = randomIntBetween(100, 500);
    const highDelay = randomIntBetween(600, 2000);

    // Send a GET request with no delay and tag it as 'customDelay: none'
    http.get(`${BASE_URL}/api/basic/custom-delay`,
        {
            tags: {
                customDelay: 'none',
            }
        }
    );

    // Send a GET request with a low delay and tag it as 'customDelay: low'
    http.get(`${BASE_URL}/api/basic/custom-delay?delay=${lowDelay}`,
        {
            tags: {
                customDelay: 'low',
            }
        }
    );

    // Send a GET request with a high delay and tag it as 'customDelay: high'
    http.get(`${BASE_URL}/api/basic/custom-delay?delay=${highDelay}`,
        {
            tags: {
                customDelay: 'high',
            }
        }
    );

    sleep(1); // Pause for 1 second between iterations
}