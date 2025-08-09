// This k6 script demonstrates how to send an HTTP GET request with custom headers and query parameters to a local API endpoint.
// It shows how to include multiple header values and logs the response status, headers, and body for inspection.

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart'; // Base URL for the API

export default function () {
  // Define custom headers, including a header with multiple values
  const params = {
    headers: {
      'source': 'k6-course',
      'multiple-values': ['hello', 'this is', 'my header'],
    }
  };

  // Send an HTTP GET request with query parameters and custom headers
  const response = http.get(`${BASE_URL}/api/basic/echo?color=blue&month=january&month=february&amount=1000`, params);

  // Log the response status code
  console.log('Response status code: ' + response.status);

  // Log the response headers as a JSON string
  console.log('Response headers: ' + JSON.stringify(response.headers));

  // Log the response body
  console.log('Response body: ' + response.body);

  sleep(1); // Pause for 1 second between iterations
}
