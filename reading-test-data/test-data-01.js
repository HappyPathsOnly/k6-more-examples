import http from 'k6/http';
import { sleep } from 'k6';

// Base URL for the API
const BASE_URL = 'http://localhost:8888/alphamart';

// Arrays of sample emails, first names, and last names for generating random test data
const emails = [
    "alex.smith@example.com",
    "jordan.brown@example.com",
    "casey.jones@example.com",
    "morgan.taylor@example.com",
    "jamie.white@example.com",
    "avery.green@example.com",
    "riley.campbell@example.com",
    "dakota.murphy@example.com",
    "cameron.kelly@example.com",
    "blake.bailey@example.com",
    "quinn.cooper@example.com",
    "harper.gray@example.com",
    "finley.fisher@example.com",
    "payton.reed@example.com",
    "sawyer.ward@example.com",
    "rowan.bennett@example.com",
    "kai.perry@example.com",
    "ellis.hughes@example.com",
    "phoenix.brooks@example.com",
    "eden.russell@example.com"
];

const firstNames = [
    "Alex",
    "Jordan",
    "Casey",
    "Morgan",
    "Jamie",
    "Avery",
    "Riley",
    "Dakota",
    "Cameron",
    "Blake",
    "Quinn",
    "Harper",
    "Finley",
    "Payton",
    "Sawyer",
    "Rowan",
    "Kai",
    "Ellis",
    "Phoenix",
    "Eden"
];

const lastNames = [
    "Smith",
    "Brown",
    "Jones",
    "Taylor",
    "White",
    "Green",
    "Campbell",
    "Murphy",
    "Kelly",
    "Bailey",
    "Cooper",
    "Gray",
    "Fisher",
    "Reed",
    "Ward",
    "Bennett",
    "Perry",
    "Hughes",
    "Brooks",
    "Russell"
];

// run with  k6 run --vus 3 --iterations 3 --http-debug=full .\test-data-01.js
export default function () {
    // Generate a birth date 20 years ago from today
    let birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 20);
    let birthDateString = birthDate.toISOString().split('T')[0];

    // Select a random email from the emails array
    let randomEmail = emails[Math.floor(Math.random() * emails.length)];
    // Create a contacts array with the random email
    let contacts = [
        {
            "contact-detail": randomEmail,
            "type": "EMAIL"
        }
    ];

    // Select random first and last names
    let randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    let randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    // Combine to create a full name
    let fullName = `${randomFirstName} ${randomLastName}`;

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

    sleep(1); // Pause for 1 second between iterations
}