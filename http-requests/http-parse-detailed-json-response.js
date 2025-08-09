// This k6 script demonstrates how to send an HTTP GET request and extract specific fields from a JSON response using JSONPath expressions.
// It shows how to access nested fields, arrays, and filtered data from the response, and logs the extracted values for inspection.

import { sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart' // Base URL for the API

export default function () {
    // Send an HTTP GET request to the /api/customer/fake endpoint
    const response = http.get(`${BASE_URL}/api/customer/fake`);

    // Extract the 'full-name' field from the JSON response
    const fullName = response.json('full-name');
    // Extract all street addresses from the 'addresses' array
    const allStreetAddresses = response.json('addresses.#.street');
    // Extract the latitude of the first address
    const firstAddressLatitude = response.json('addresses.0.coordinate.latitude');
    // Extract the longitude of the first address
    const firstAddressLongitude = response.json('addresses.0.coordinate.longitude');
    // Extract all contacts as an array
    const allContacts = response.json('contacts');
    // Extract the contact detail for contacts of type "EMAIL"
    const emailOnly = response.json('contacts.#(type=="EMAIL").contact-detail');

    // Log the extracted values for inspection
    console.log('fullName: ', fullName);
    console.log('allStreetAddresses: ', allStreetAddresses);
    console.log('firstAddressLatitude: ', firstAddressLatitude);
    console.log('firstAddressLongitude: ', firstAddressLongitude);
    console.log('allContacts: ', JSON.stringify(allContacts));
    console.log('emailOnly: ', emailOnly);

    sleep(1); // Pause for 1 second
}