import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';

// Use environment variables for configuration
const BASE_URL = __ENV.SERVER_ADDRESS;

export function setup() {
    // Get username and password from environment variables
    const username = __ENV.USERNAME;
    const password = __ENV.PASSWORD;
    const plainCredential = `${username}:${password}`;

    // Encode credentials for HTTP Basic Auth
    const base64Credential = encoding.b64encode(plainCredential);

    // Set the Authorization header for the login request
    const params = {
        headers: {
            'Authorization': `Basic ${base64Credential}`
        }
    };

    // Send a POST request to the login endpoint to obtain an access token
    let response = http.post(`${BASE_URL}/api/auth/login`, null, params);

    // Return the access token for use in the default function
    let data = {
        accessToken: response.json('access-token'),
    }

    return data;
}

// call with k6 run .\environment-variable-01.js -e SERVER_ADDRESS=http://localhost:8888/alphamart -e USERNAME=guest -e PASSWORD=GuestPassword
export default function (data) {
    // Set headers for the product search request
    let headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${data.accessToken}`
    };

    // Send a GET request to search for products with the name 'chocolate'
    let response = http.get(`${BASE_URL}/api/product/search?name=chocolate`, { headers });

    // Check that the response status is 2xx and the data array is not empty
    check(response, {
        'Status is 2xx': (r) => r.status >= 200 && r.status < 300,
        'Data is not empty': (r) => r.json('data').length > 0,
    });

    sleep(1); // Pause for 1 second
}