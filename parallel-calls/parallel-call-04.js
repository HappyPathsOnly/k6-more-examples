import { check, sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8888/alphamart';

// call  k6 run parallel-call-04.js 
export default function () {
    const customer = {
        'full-name': 'Bruce Wayne',
        'birth-date': '2000-05-01',
        'contacts': [
            {
                'contact-detail': 'bruce.wayne@example.com',
                'type': 'EMAIL',
            }
        ],
    }

    const postParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    const requests = {
        'first-request': `${BASE_URL}/api/basic/fast`,
        'second-request': `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-1`,
        'third-request': {
            method: 'POST',
            url: `${BASE_URL}/api/customer/fake`,
            body: JSON.stringify(customer),
            params: postParams,
        },
        'fourth-request': `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-2`,
        'fifth-request': `${BASE_URL}/api/basic/custom-delay?delay=2000&identifier=custom-delay-3`,
    }

    const responses = http.batch(requests);

    // add K6 check to make sure 'first-request' returning 2xx with duration less than 3 seconds
    check(responses['first-request'], {
        'first-request status is 2xx': (res) => res.status >= 200 && res.status < 300,
        'first-request duration is less than 3 seconds': (res) => res.timings.duration < 3000,
    });

    // add K6 check to make sure 'second-request' returning 2xx with duration less than 3 seconds
    check(responses['second-request'], {
        'second-request status is 2xx': (res) => res.status >= 200 && res.status < 300,
        'second-request duration is less than 3 seconds': (res) => res.timings.duration < 3000,
    });

    // add K6 check to make sure 'third-request' returning 2xx with duration less than 3 seconds
    check(responses['third-request'], {
        'third-request status is 2xx': (res) => res.status >= 200 && res.status < 300,
        'third-request duration is less than 3 seconds': (res) => res.timings.duration < 3000,
    });

    // add K6 check to make sure 'fourth-request' returning 2xx with duration less than 3 seconds
    check(responses['fourth-request'], {
        'fourth-request status is 2xx': (res) => res.status >= 200 && res.status < 300,
        'fourth-request duration is less than 3 seconds': (res) => res.timings.duration < 3000,
    });

    // add K6 check to make sure 'fifth-request' returning 2xx with duration less than 3 seconds
    check(responses['fifth-request'], {
        'fifth-request status is 2xx': (res) => res.status >= 200 && res.status < 300,
        'fifth-request duration is less than 3 seconds': (res) => res.timings.duration < 3000,
    });

    sleep(1);
}