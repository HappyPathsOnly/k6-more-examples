import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

const BASE_URL = 'http://localhost:8888/alphamart';

export default function () {
    const promotionCode = randomString(10);
    const url = `${BASE_URL}/api/promotion/fake/${promotionCode}`;

    const response = http.get(url);

    // add K6 check to ensure the response status code is 2xx
    check(response,
        {
            'status is 2xx': (r) => r.status >= 200 && r.status < 300
        },
        {
            'check-case': 'status-is-2xx'
        }
    );

    // add K6 check to ensure the response URL contains '/html/promotion/detail/{promotionCode}'
    check(response,
        {
            'url contains promotionCode': (r) => {
                console.log(`response.url: ${r.url}`);
                return r.url.includes(`/html/promotion/detail/${promotionCode}`)
            }
        },
        {
            'check-case': 'url-contains-promotionCode'
        }
    );

    sleep(1);
}