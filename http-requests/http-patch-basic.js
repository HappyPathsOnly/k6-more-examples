// This k6 script demonstrates how to send an HTTP PATCH request with a plain text payload to a local API endpoint.
// It shows how to use a multiline string as the request body, set the appropriate content-type header, and log the response details for inspection.

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart' // Base URL for the API

export default function () {
  // Define a multiline string as the request body
  const requestBody = `
  This is a multiline string
  This is the second line
  This is the third line
  `

  // Set the content-type header to indicate plain text
  const params = {
    headers: {
      'content-type': 'text/plain',
    }
  }

  // Send an HTTP PATCH request with the plain text body
  const response = http.patch(`${BASE_URL}/api/basic/echo`, requestBody, params);

  // Log the response status code
  console.log('Response status code: ' + response.status);
  // Log the response headers as a JSON string
  console.log('Response headers: ' + JSON.stringify(response.headers));
  // Log the response body
  console.log('Response body: ' + response.body);

  sleep(1); // Pause for 1 second
}
