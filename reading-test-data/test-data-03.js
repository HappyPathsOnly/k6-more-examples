import http from 'k6/http';
import { sleep } from 'k6';
import { SharedArray } from 'k6/data';

const BASE_URL = 'http://localhost:8888/alphamart';

// Load JSON data from ./data-customer-fake.json into K6 SharedArray as a constant named "customerFake"
const customerFake = new SharedArray('customerFake', function () {
    return JSON.parse(open('./data-customer-fake.json'));
});

// run with  k6 run --vus 3 --iterations 3 --http-debug=full .\test-data-03.js
export default function () {
    let birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 20);
    let birthDateString = birthDate.toISOString().split('T')[0];

    let randomEmail = customerFake[Math.floor(Math.random() * customerFake.length)].email;
    let contacts = [
        {
            "contact-detail": randomEmail,
            "type": "EMAIL"
        }
    ];

    let randomCustomer = customerFake[Math.floor(Math.random() * customerFake.length)];
    let fullName = `${randomCustomer.firstName} ${randomCustomer.lastName}`;

    let payload = JSON.stringify({
        "birth-date": birthDateString,
        "contacts": contacts,
        "full-name": fullName
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    };

    let response = http.post(`${BASE_URL}/api/customer/fake`, payload, params);

    sleep(1);
}