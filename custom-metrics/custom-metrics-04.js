// This k6 script demonstrates how to use a custom Gauge metric to track the size of article content returned by an API.
// It sends a GET request to the promotion article endpoint with a random sentence count and records the response body size.

import http from 'k6/http';
import { sleep } from 'k6';
import { Gauge } from 'k6/metrics';

const BASE_URL = 'http://localhost:8888/alphamart';

// Create a Gauge metric to track the size of the article content in bytes
let articleContentSize = new Gauge('article_content_size');

export default function () {
    // Generate a random sentence count between 10 and 200 for the request
    const sentenceCount = Math.floor(Math.random() * (200 - 10 + 1)) + 10;

    // Send a GET request to the promotion article endpoint
    const res = http.get(`${BASE_URL}/api/promotion/article?sentence-count=${sentenceCount}`, {
        headers: { 'Accept': 'application/json' },
    });

    // Add the length of the response body to the Gauge metric
    articleContentSize.add(res.body.length);

    sleep(1); // Pause for 1 second between iterations
}