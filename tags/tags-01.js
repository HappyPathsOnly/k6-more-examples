// This k6 script demonstrates a simple GET request to a local API endpoint.
// You can use this script to test the /api/basic/slow-if-error endpoint and add tags or assertions as needed.

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart'; // Base URL for the API

export default function () {
    // Send a GET request to the /api/basic/slow-if-error endpoint
    // Passes with k6 run tags-01.js --config configuration.json
    const response = http.get(`${BASE_URL}/api/basic/slow-if-error`);
    // Add your desired assertions or other logic here

    sleep(1); // Pause for 1 second between requests
}