// This k6 script demonstrates how to send an HTTP PUT request with a JSON payload to a local API endpoint.
// It shows how to use a multiline string as the JSON request body, set the appropriate content-type header, and log the response details for inspection.

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart' // Base URL for the API

export default function () {
  // Define the JSON payload as a multiline string
  const requestBody = `
  {
    "name": "Jakarta",
    "country": "Indonesia",
    "coordinate": {
      "latitude": -6.2088,
      "longitude": 106.8456
    }
  }
  `

  // Set the content-type header to indicate JSON
  const params = {
    headers: {
      'content-type': 'application/json',
    }
  }

  // Send an HTTP PUT request with the JSON payload
  const response = http.put(`${BASE_URL}/api/basic/echo`, requestBody, params);

  // Log the response status code
  console.log('Response status code: ' + response.status);
  // Log the response headers as a JSON string
  console.log('Response headers: ' + JSON.stringify(response.headers));
  // Log the response body
  console.log('Response body: ' + response.body);

  sleep(1); // Pause for 1 second
}
