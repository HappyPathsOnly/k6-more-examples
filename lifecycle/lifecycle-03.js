// Demonstrates the k6 test lifecycle: init, setup, default (VU code), and teardown stages.

console.log('[init] init called'); // This runs once at script initialization (before setup, VUs, teardown)

// The setup() function runs once before the VU code starts.
// It can be used to prepare and share data for all VUs.
export function setup() {
    let data = {
        counter: 0
    };

    console.log('[setup] setup called, data in setup() : ', JSON.stringify(data));

    return data; // The returned data is passed to default() and teardown()
}

// The default function is executed by each VU for each iteration.
// The 'data' argument is the object returned from setup().
export default function (data) {
    console.log('[default/vu-code] default/vu-code called, data in default() : ', JSON.stringify(data));
    data.counter++; // Increment the counter (note: this change is not shared between VUs)
}

// The teardown() function runs once after all VU iterations are complete.
// It receives the final 'data' object (from setup, not the mutated version in default).
export function teardown(data) {
    console.log('[teardown] teardown called, data in teardown() : ', JSON.stringify(data));
}