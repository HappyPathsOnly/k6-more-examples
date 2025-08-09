// This k6 script demonstrates how to send an HTTP DELETE request with custom headers.
// It targets a local API endpoint and logs the response status, headers, and body for inspection.

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart'; // Base URL for the API

export default function () {
  // Define custom headers to include in the DELETE request
  const params = {
    headers: {
      'my-header-one': 'hello',
      'my-header-two': 'world',
    }
  };

  // Send an HTTP DELETE request to the /api/basic/echo endpoint with a user-id query parameter
  const response = http.del(`${BASE_URL}/api/basic/echo?user-id=9090`, null, params);

  // Log the response status code
  console.log('Response status code: ' + response.status);

  // Log the response headers as a JSON string
  console.log('Response headers: ' + JSON.stringify(response.headers));

  // Log the response body
  console.log('Response body: ' + response.body);

  sleep(1); // Pause for 1 second between iterations
}
