// This k6 script demonstrates how to use named check cases (custom tags) for more granular check result tracking.
// Each check is tagged with a unique 'check-case' value, allowing you to filter and analyze check results by case in your reports.

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8888/alphamart';

// call with k6 run .\tags-06.js --config configuration-checks-custom.json
export default function () {
    // Send a GET request to the /api/basic/slow-if-error endpoint
    const response = http.get(`${BASE_URL}/api/basic/slow-if-error`);

    // Check that the response status code is in the 2xx range, and tag this check case
    check(response,
        {
            'response status code is 2xx': (r) => r.status >= 200 && r.status < 300,
        },
        {
            // Custom tag for this check case used inconfiguration-checks-custom.json
            'check-case': 'response-status-code-2xx'
        }
    );

    // Check that the response header 'X-Boolean' is set to 'true', and tag this check case
    check(response,
        {
            'response header x-boolean is true': (r) => r.headers['X-Boolean'] === 'true',
        },
        {
            'check-case': 'response-header-x-boolean-true'
        }
    );

    // Check that the response body contains a non-empty "message" field, and tag this check case
    check(response,
        {
            'response body contains field "message" and is not an empty string': (r) => {
                const body = JSON.parse(r.body);
                return body.hasOwnProperty('message') && body.message !== '';
            }
        },
        {
            'check-case': 'response-body-message-not-empty'
        }
    );

    sleep(1); // Pause for 1 second between iterations
}