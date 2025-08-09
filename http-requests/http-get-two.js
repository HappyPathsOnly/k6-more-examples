// This k6 script demonstrates how to send an HTTP GET request with query parameters to a local API endpoint.
// It logs the response status code, headers, and body for inspection after each request.

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart'; // Base URL for the API

export default function () {
  // Send an HTTP GET request to the /api/basic/echo endpoint with multiple query parameters
  const response = http.get(`${BASE_URL}/api/basic/echo?color=blue&month=january&month=february&amount=1000`);

  // Log the response status code
  console.log('Response status code: ' + response.status);

  // Log the response headers as a JSON string
  console.log('Response headers: ' + JSON.stringify(response.headers));

  // Log the response body
  console.log('Response body: ' + response.body);

  sleep(1); // Pause for 1 second between requests
}
