import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';
import exec from 'k6/execution';
import { randomIntBetween, randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const BASE_URL = 'http://localhost:8888/alphamart';

// Create a map of user credentials for authentication
const credentials = new Map();
credentials.set('administrator', 'AdministratorPassword');
credentials.set('operator.one', 'OperatorOnePassword');
credentials.set('operator.two', 'OperatorTwoPassword');

export default function () {
    // Get a random username and password from the credentials map
    const username = [...credentials.keys()][Math.floor(Math.random() * credentials.size)];
    const password = credentials.get(username);
    const plainCredential = `${username}:${password}`;

    // Encode the credentials in base64 for HTTP Basic Auth
    const base64Credential = encoding.b64encode(plainCredential);

    // Set headers for the login request
    const params = {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic ' + base64Credential,
        },
    };

    // Send a POST request to the login endpoint to obtain an access token
    const resLogin = http.post(`${BASE_URL}/api/auth/login`, null, params);

    // Abort the test if login fails
    if (resLogin.status !== 200) {
        exec.test.abort('Failed to login');
    }

    // Extract the access token from the login response
    const accessToken = resLogin.json('access-token');

    // Generate random product data for creation
    let price = randomIntBetween(1, 99) + (randomIntBetween(0, 99) / 100);
    let stockKeepingUnit = randomString(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    let active = Math.random() < 0.5;
    let name = 'Product name' + '-' + stockKeepingUnit;
    let manufacturer = 'Manufacturer' + '-' + stockKeepingUnit;
    let description = 'Description' + '-' + stockKeepingUnit;

    // Define the product data object
    const product = {
        price: price,
        'stock-keeping-unit': stockKeepingUnit,
        active: active,
        name: name,
        manufacturer: manufacturer,
        description: description,
    };

    // Define the HTTP request headers for product creation
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    // Send the HTTP request to create the product
    const resCreateProduct = http.post(`${BASE_URL}/api/product`, JSON.stringify(product), { headers: headers });

    if (resCreateProduct.status >= 200 && resCreateProduct.status < 300) {
        // If product creation is successful, extract the product UUID
        const productUuid = resCreateProduct.json('product-uuid');
        const getProductUrl = `${BASE_URL}/api/product/${productUuid}`;
        const getProductHeaders = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        };
        // Send a GET request to retrieve the created product
        const resGetProduct = http.get(getProductUrl, { headers: getProductHeaders });

        // Check the response for correct status and SKU value
        check(resGetProduct, {
            'status is 2xx': (r) => r.status >= 200 && r.status < 300,
            'stock-keeping-unit is correct': (r) => r.json('stock-keeping-unit') === stockKeepingUnit,
        });
    } else {
        // Abort the test if product creation fails
        exec.test.abort('Failed to create product');
    }

    sleep(1); // Pause for 1 second
}