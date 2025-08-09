// This k6 script demonstrates how to perform detailed checks on a JSON response from a local API endpoint.
// It validates the response status, timing, age range, address types, and coordinate values.

import { check, sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart' // Base URL for the API

export default function () {
    // Send an HTTP GET request to the /api/customer/fake endpoint
    const response = http.get(`${BASE_URL}/api/customer/fake`);

    // Calculate date ranges for age validation
    const eighteenYearsAgo = new Date().setFullYear(new Date().getFullYear() - 18); // 18 years ago from today
    const sixtyFiveYearsAgo = new Date().setFullYear(new Date().getFullYear() - 65); // 65 years ago from today
    const birthDate = new Date(response.json('birth-date')); // Parse the birth-date from the response

    // Perform detailed checks on the response
    check(response, {
        // Check that the response status code is in the 2xx range
        'status is 2xx': (r) => r.status >= 200 && r.status < 300,
        // Check that the response duration is less than 500 milliseconds
        'response duration < 500 ms': (r) => r.timings.duration < 500,
        // Check that the birth-date is between 18 and 65 years ago
        'birth-date is between 18 to 65 years ago':
            (r) => birthDate.getTime() < eighteenYearsAgo && birthDate.getTime() > sixtyFiveYearsAgo,
        // Check that every address type is either HOME or OFFICE
        'addresses.type is either HOME or OFFICE': (r) => {
            const addresses = r.json('addresses');
            return addresses.every((address) => ['HOME', 'OFFICE'].includes(address.type));
        },
        // Check that every coordinate is a valid latitude and longitude
        'addresses.coordinate is valid latitude / longitude': (r) => {
            const coordinates = r.json('addresses.#.coordinate');
            return coordinates.every((coordinate) => {
                return coordinate.latitude >= -90 && coordinate.latitude <= 90
                    && coordinate.longitude >= -180 && coordinate.longitude <= 180;
            });
        },
    });

    sleep(1); // Pause for 1 second between iterations
}