import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';

const BASE_URL = 'http://localhost:8888/alphamart';

// Create a map of credentials for authentication
const credentials = new Map();
credentials.set('guest', 'GuestPassword');

export default function () {
    // Get a random credential from the credentials map
    const username = [...credentials.keys()][Math.floor(Math.random() * credentials.size)];
    const password = credentials.get(username);
    const plainCredential = `${username}:${password}`;

    // Encode the credentials in base64 for HTTP Basic Auth
    const base64Credential = encoding.b64encode(plainCredential);

    // Set the Authorization header for the request
    const params = {
        headers: {
            'Authorization': `Basic ${base64Credential}`
        }
    };

    // Send a POST request to the login endpoint with the Authorization header
    let response = http.post(`${BASE_URL}/api/auth/login`, null, params);

    // Add a k6 check to ensure the response status code is 2xx and tag this check case
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