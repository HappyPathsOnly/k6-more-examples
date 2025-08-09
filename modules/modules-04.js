import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';
import { normalDistributionStages } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const BASE_URL = 'http://localhost:8888/alphamart';

const credentials = new Map();
credentials.set('administrator', 'AdministratorPassword');
credentials.set('operator.one', 'OperatorOnePassword');
credentials.set('operator.two', 'OperatorTwoPassword');

// Create threshold for metric "checks" by creating a K6 option containing thresholds for each tag "check-case" used in this script.
export let options = {
    thresholds: {
        'checks{check-case:status-is-2xx}': [
            {
                threshold: 'rate == 1',
                abortOnFail: true,
            }
        ]
    },
    // Use normal distribution stages to simulate a realistic load pattern
    // Parameters are maxVus, duration in seconds and number of stages

    stages: normalDistributionStages(50, 90, 6)
};

export default function () {
    // get random credential from credentials map
    const username = [...credentials.keys()][Math.floor(Math.random() * credentials.size)];
    const password = credentials.get(username);
    const plainCredential = `${username}:${password}`;

    const base64Credential = encoding.b64encode(plainCredential);

    const params = {
        headers: {
            'Authorization': `Basic ${base64Credential}`
        }
    };

    let response = http.post(`${BASE_URL}/api/auth/login`, null, params);

    // add a k6 check to ensure the response status code is 2xx
    check(response,
        {
            'status is 2xx': (r) => r.status >= 200 && r.status < 300
        },
        {
            'check-case': 'status-is-2xx'
        }
    );

    sleep(1);
}