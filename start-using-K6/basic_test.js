// This is a simple k6 script that sends an HTTP GET request to Google's homepage.
// It demonstrates how to make a request, log the response status, and handle success or failure.

import http from 'k6/http';

export default function () {
  const url = 'https://www.google.com'; // Target URL for the HTTP GET request

  let response = http.get(url); // Send the GET request

  // Log the response status
  console.log(`Response status: ${response.status}`);

  // Check if the response is successful
  if (response.status === 200) {
    console.log('Request was successful!');
  } else {
    console.error(`Request failed with status: ${response.status}`);
  }
}