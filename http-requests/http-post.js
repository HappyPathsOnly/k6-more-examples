// This k6 script demonstrates how to send an HTTP POST request with a JSON payload to a local API endpoint.
// It shows how to construct a JSON request body, set the appropriate content-type header, and log the response details for inspection.

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart' // Base URL for the API

export default function () {
  // Define the JSON payload to send in the POST request
  const requestBody = {
    'user': 'Superman',
    'real-name': 'Clark Kent',
    'abilities': ['flying', 'superhuman strength', 'heat vision'],
  }

  // Set the content-type header to indicate JSON
  const params = {
    headers: {
      'content-type': 'application/json',
    }
  }

  // Send an HTTP POST request with the JSON payload
  const response = http.post(`${BASE_URL}/api/basic/echo`, JSON.stringify(requestBody), params);

  // Log the response status code
  console.log('Response status code: ' + response.status);
  // Log the response headers as a JSON string
  console.log('Response headers: ' + JSON.stringify(response.headers));
  // Log the response body
  console.log('Response body: ' + response.body);

  sleep(1); // Pause for 1 second
}
