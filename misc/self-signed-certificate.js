import http from 'k6/http';
import { check } from 'k6';

export default function() {
    let res = http.get('https://self-signed.badssl.com');
    check(res, {
        'status is 2xx': (r) => r.status >= 200 && r.status < 300,
    });
}