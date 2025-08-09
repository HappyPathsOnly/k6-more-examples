// This k6 script demonstrates how to make a simple HTTP GET request and log execution details.
// It shows how to access execution context information such as iteration number, VU ID, and script duration.

import http from 'k6/http';
import exec from 'k6/execution';

export default function () {
  const url = 'https://www.google.com'; // Target URL for the HTTP GET request
  let response = http.get(url); // Send the GET request

  // Calculate how long the script has been running in seconds
  const durationInSeconds = (exec.instance.currentTestRunDuration / 1000).toFixed(2);

  // Log the current iteration, VU ID, and script duration
  console.log(`Iteration: ${exec.scenario.iterationInTest}, ` +
              `VU: ${exec.vu.idInTest}, ` +
              `Script has been running for: ${durationInSeconds} seconds`);
}


