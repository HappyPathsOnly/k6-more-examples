import http from 'k6/http';
import encoding from 'k6/encoding';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart';

// Create a credentials map for authentication
const credentials = new Map();
credentials.set('guest', 'GuestPassword');

export function setup() {
    // Get a random credential from the credentials map
    const username = [...credentials.keys()][Math.floor(Math.random() * credentials.size)];
    const password = credentials.get(username);
    const plainCredential = `${username}:${password}`;

    // Encode credentials for HTTP Basic Auth
    const base64Credential = encoding.b64encode(plainCredential);

    const loginParams = {
        headers: {
            'Authorization': `Basic ${base64Credential}`
        }
    };

    // Send a POST request to login and obtain an access token
    let resLogin = http.post(`${BASE_URL}/api/auth/login`, null, loginParams);
    const accessToken = resLogin.json('access-token');

    // Generate a random SKU for the product
    const stockKeepingUnit = randomString(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

    // Define the product body for creation
    const productBody = {
        'name': 'Green Tea',
        'price': 3,
        'stock-keeping-unit': stockKeepingUnit,
        'manufacturer': 'Wings Food',
        'description': 'Green Tea description',
        'active': true
    }

    const createProductParams = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    // Send a POST request to create the product
    const resCreateProduct = http.post(`${BASE_URL}/api/product`, JSON.stringify(productBody), createProductParams);

    // Abort the test if product creation fails
    if (resCreateProduct.status > 299) {
        execution.test.abort('Failed to create product');
    }

    // Return the access token and product UUID for use in the test and teardown
    let data = {
        accessToken: accessToken,
        productUuid: resCreateProduct.json('product-uuid')
    }

    return data;
}

// call k6 run .\lifecycle-06.js --vus 20 --duration 5s
export default function (data) {
    // Set the Authorization header for product retrieval
    const params = {
        headers: {
            'Authorization': `Bearer ${data.accessToken}`
        }
    };

    // Send a GET request to retrieve the created product
    const resFindProduct = http.get(`${BASE_URL}/api/product/${data.productUuid}`, params);

    // Add K6 check to ensure resFindProduct status is 2xx, and the product name is 'Green Tea'
    check(resFindProduct, {
        'is status 2xx': (r) => r.status < 300 && r.status >= 200,
        'product name is Green Tea': (r) => r.json('name') === 'Green Tea'
    });

    sleep(1); // Pause for 1 second between iterations
}

export function teardown(data) {
    // Set the Authorization header for product deletion
    const params = {
        headers: {
            'Authorization': `Bearer ${data.accessToken}`,
        }
    };

    // Send a DELETE request to remove the created product
    http.del(`${BASE_URL}/api/product/${data.productUuid}`, null, params);

    // Try to retrieve the deleted product to confirm deletion
    const resFindProduct = http.get(`${BASE_URL}/api/product/${data.productUuid}`, params);

    // Add K6 check to ensure resFindProduct status is 4xx (product should not exist)
    check(resFindProduct, {
        'is status 4xx': (r) => r.status < 500 && r.status >= 400
    });
}