import http from 'k6/http';
import { sleep } from 'k6';
import exec from 'k6/execution';

const BASE_URL = 'http://localhost:9999/alphamart';

// The setup() function runs once before the VU code starts.
// Here, it checks if the server is healthy before running the test.
export function setup() {
    const response = http.get(`${BASE_URL}/actuator/health`);
    // Abort the test if the health check fails
    if (response.status !== 200) {
        exec.test.abort('Failed to contact the server');
    }
}

// call k6 run .\lifecycle-04.js --duration 5s
export default function () {
    // Send a GET request to the fast endpoint in each VU iteration
    http.get(`${BASE_URL}/api/basic/fast`);
    sleep(1); // Pause for 1 second between requests
}
