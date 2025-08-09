import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

const BASE_URL = 'http://localhost:8888/alphamart';

export default function () {
    const promotionCode = randomString(10);
    const url = `${BASE_URL}/api/promotion/fake/${promotionCode}`;

    const response = http.get(url);

    // add K6 check to ensure the response status code is 3xx
    check(response,
        {
            'status is 3xx': (r) => r.status >= 300 && r.status < 400
        },
        {
            'check-case': 'status-is-3xx'
        }
    );

    // add k6 check to ensure that HTTP response header "Location" is present and the value includes
    // string '/html/promotion/detail/{promotionCode}
    check(response,
        {
            'Location header contains promotionCode': (r) => {
                console.log(`response.headers: ${JSON.stringify(r.headers)}`);
                return r.headers['Location'].includes(`/html/promotion/detail/${promotionCode}`)
            }
        },
        {
            'check-case': 'location-header-contains-promotionCode'
        }
    );

    sleep(1);
}