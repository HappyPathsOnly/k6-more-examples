// This k6 script demonstrates how to send an HTTP PATCH request with a randomly generated JSON payload to a local API endpoint.
// It uses utility functions to generate random values for the payload fields, simulating varied input data for testing.
// The script logs the response body after each request for inspection.

import http from 'k6/http';
import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

const BASE_URL = 'http://localhost:8888/alphamart'; // Base URL for the API

export default function () {
    // Construct the API endpoint URL
    var url = `${BASE_URL}/api/basic/echo`;

    // Generate a random payload with various fields
    var payload = JSON.stringify({
        brand: randomItem(['Toyota', 'Honda', 'BMW']), // Randomly select a brand
        'manufacturing-year': randomIntBetween(2020, 2025), // Random year between 2020 and 2025
        color: randomItem(['black', 'grey', 'white']), // Randomly select a color
        model: generateRandomModel(), // Generate a random model string
        price: generateRandomPrice() // Generate a random price
    });

    // Set request headers
    var params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain',
        },
    };

    // Send the PATCH request with the random payload
    var response = http.patch(url, payload, params);

    // Log the response body for inspection
    console.log('Response body: ', response.body);
}

// Helper function to generate a random model string of 6-12 lowercase letters
function generateRandomModel() {
    var length = randomIntBetween(6, 12);
    var model = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz';

    for (var i = 0; i < length; i++) {
        model += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return model;
}

// Helper function to generate a random price between 40,000 and 60,000, rounded down to the nearest hundred
function generateRandomPrice() {
    var price = randomIntBetween(40000, 60000);
    price = Math.floor(price / 100) * 100; // Round down to nearest hundred
    return price;
}