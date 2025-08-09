import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';

const BASE_URL = 'http://localhost:8888/alphamart';

// Store user credentials in a Map for easy random selection
const credentials = new Map();
credentials.set('administrator', 'AdministratorPassword');
credentials.set('operator.one', 'OperatorOnePassword');
credentials.set('operator.two', 'OperatorTwoPassword');

// Define k6 options with a threshold for the custom check-case tag
export let options = {
    thresholds: {
        // Require that all checks tagged with 'check-case:status-is-2xx' must pass (rate == 1)
        'checks{check-case:status-is-2xx}': [
            {
                threshold: 'rate == 1',
                abortOnFail: true, // Abort the test if the threshold is not met
            }
        ]
    }
};

// run with k6 run --vus 20 --duration 5s .\modules-01.js
export default function () {
    // Select a random username from the credentials map
    const username = [...credentials.keys()][Math.floor(Math.random() * credentials.size)];
    // Get the corresponding password
    const password = credentials.get(username);
    // Combine username and password for HTTP Basic Auth
    const plainCredential = `${username}:${password}`;

    // Encode the credentials in base64 for the Authorization header
    const base64Credential = encoding.b64encode(plainCredential);

    // Set the Authorization header for the request
    const params = {
        headers: {
            'Authorization': `Basic ${base64Credential}`
        }
    };

    // Send a POST request to the login endpoint with the Authorization header
    let response = http.post(`${BASE_URL}/api/auth/login`, null, params);

    // Add a k6 check to ensure the response status code is 2xx, and tag this check case
    check(response,
        {
            'status is 2xx': (r) => r.status >= 200 && r.status < 300
        },
        {
            'check-case': 'status-is-2xx'
        }
    );

    sleep(1); // Pause for 1 second between iterations
}