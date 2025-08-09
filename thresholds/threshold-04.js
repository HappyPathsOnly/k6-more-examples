// This k6 script demonstrates how to perform a search query using query parameters and validate the JSON response.
// It checks that all returned customers have a full name and that each full name contains the search string.

import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
import { check, sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart'; // Base URL for the API

export default function () {
    const nameToSearch = 'John'; // The name to search for in customer records

    // Construct the URL with the search query parameter
    // This call fails  k6 run .\threshold-04.js  --vus 20 --duration 5s
    // Illustate delayAbortEval  k6 run .\threshold-04.js  --vus 20 --duration 10m --config configuration-customers.json
    const url = new URL(`${BASE_URL}/api/customer/fake/search`);
    url.searchParams.append('name', nameToSearch);

    // Send a GET request to the search endpoint
    const response = http.get(url.toString());

    // Parse the response body as JSON (expected to be an array of customers)
    const customers = response.json();

    // Perform checks on the returned customers
    check(customers, {
        // Check that every customer object has a 'full-name' property
        'All customers have a full name': (c) => {
            return c.every((customer) => customer['full-name']);
        },
        // Check that every 'full-name' contains the search string (case-insensitive)
        'All full names contain the search string (case-insensitive)': (c) => {
            return c.every((customer) => customer['full-name'].toLowerCase().includes(nameToSearch.toLowerCase()));
        }
    });

    sleep(1); // Pause for 1 second between iterations
}