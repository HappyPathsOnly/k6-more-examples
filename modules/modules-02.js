import http from 'k6/http';
import { check, sleep } from 'k6';
// Use this import to calculate the expected monthly installment based on the loan amount, tenure, and interest rate
import { calculateMonthlyInstallment } from './loan.js';

const BASE_URL = 'http://localhost:8888/alphamart';

export default function () {
    // Generate a random annual interest rate between 0.01 and 1 (as a string with 2 decimals)
    const annualInterestRate = (Math.random() * (1 - 0.01) + 0.01).toFixed(2);
    // Generate a random loan amount between 500 and 100000
    const loanAmount = Math.floor(Math.random() * (100000 - 500 + 1) + 500);
    // Generate a random tenure between 6 and 60 months
    const tenureInMonths = Math.floor(Math.random() * (60 - 6 + 1) + 6);

    // Prepare the payload for the API request
    const payload = {
        'annual-interest-rate': annualInterestRate,
        'loan-amount': loanAmount,
        'tenure-in-months': tenureInMonths,
    };

    // Set the request headers
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    // Send a POST request to the loan calculator endpoint
    const response = http.post(`${BASE_URL}/api/loan/calculator`, JSON.stringify(payload), { headers });

    // Calculate the expected monthly installment using the imported function
    const expectedMonthlyInstallment = calculateMonthlyInstallment(loanAmount, tenureInMonths, annualInterestRate);

    // Add k6 check to validate response status code is 2xx
    check(response,
        {
            'status is 2xx': (r) => r.status >= 200 && r.status < 300,
        },
        {
            // Tag this check case for granular reporting
            'check-case': 'status-is-2xx'
        }
    );

    // Add k6 check to validate that the monthly installment is correct
    // The check passes if the difference between the expected and actual monthly installment is less than 1
    check(response,
        {
            'monthly installment is correct': (r) => {
                const actualMonthlyInstallment = JSON.parse(r.body)['monthly-installment-amount'];
                return Math.abs(actualMonthlyInstallment - expectedMonthlyInstallment) < 1;
            },
        },
        {
            // Tag this check case for granular reporting
            'check-case': 'monthly-installment-is-correct'
        }
    );

    sleep(1); // Pause for 1 second
}