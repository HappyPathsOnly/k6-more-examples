import http from 'k6/http';
import { sleep } from 'k6';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';

const BASE_URL = 'http://localhost:8888/alphamart';

// Load CSV data from ./data-customer-fake.csv into a K6 SharedArray using papaparse
// SharedArray ensures the data is loaded only once and shared across all VUs
let customerFake = new SharedArray("Customer data", function () {
    // Parse the CSV file with headers and return the data array
    return papaparse.parse(open('./data-customer-fake.csv'), { header: true }).data;
});

// run with  k6 run --vus 3 --iterations 3 --http-debug=full .\test-data-02.js
export default function () {
    // Generate a birth date 20 years ago from today
    let birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 20);
    let birthDateString = birthDate.toISOString().split('T')[0];

    // Select a random email from the loaded customer data
    let randomEmail = customerFake[Math.floor(Math.random() * customerFake.length)].email;
    // Build the contacts array using the random email
    let contacts = [
        {
            "contact-detail": randomEmail,
            "type": "EMAIL"
        }
    ];

    // Select a random customer for the full name
    let randomCustomer = customerFake[Math.floor(Math.random() * customerFake.length)];
    let fullName = `${randomCustomer.firstName} ${randomCustomer.lastName}`;

    // Build the payload for the POST request
    let payload = JSON.stringify({
        "birth-date": birthDateString,
        "contacts": contacts,
        "full-name": fullName
    });

    // Set request headers
    let params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    };

    // Send a POST request to create a fake customer with the generated data
    let response = http.post(`${BASE_URL}/api/customer/fake`, payload, params);

    sleep(1); // Pause for 1 second between requests
}