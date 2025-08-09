// This k6 script demonstrates how to send an HTTP GET request and parse a JSON response from a local API endpoint.
// It shows how to extract a specific field from the JSON response and log it for inspection.

import { sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart'; // Base URL for the API

export default function () {
    // Send an HTTP GET request to the /api/basic/fast endpoint
    const response = http.get(`${BASE_URL}/api/basic/fast`);
    // Parse the response body as JSON
    const responseAsJson = response.json();

    // Log the 'message' field from the JSON response
    console.log('responseAsJson.message: ' + responseAsJson.message);

    sleep(1); // Pause for 1 second
}