import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';

const BASE_URL = 'http://localhost:8888/alphamart';

// Create a map of credentials for authentication
const credentials = new Map();
credentials.set('guest', 'GuestPassword');

// The setup() function runs once before the VU code starts.
// It logs in using a random credential and returns the access token for use in the test.
export function setup() {
    // Get a random credential from the credentials map
    const username = [...credentials.keys()][Math.floor(Math.random() * credentials.size)];
    const password = credentials.get(username);
    const plainCredential = `${username}:${password}`;

    // Encode the credentials in base64 for HTTP Basic Auth
    const base64Credential = encoding.b64encode(plainCredential);

    // Set the Authorization header for the login request
    const params = {
        headers: {
            'Authorization': `Basic ${base64Credential}`
        }
    };

    // Send a POST request to the login endpoint to obtain an access token
    let response = http.post(`${BASE_URL}/api/auth/login`, null, params);

    let data = {
        accessToken: response.json('access-token'),
    }

    return data;
}

// call k6 run .\lifecycle-05.js --vus 30
export default function (data) {
    let headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${data.accessToken}`
    };

    let response = http.get(`${BASE_URL}/api/product/search?name=chocolate`, { headers });

    check(response, {
        'Status is 2xx': (r) => r.status >= 200 && r.status < 300,
        'Data is not empty': (r) => r.json('data').length > 0,
    });

    sleep(1);
}