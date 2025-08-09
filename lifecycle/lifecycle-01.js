import exec from 'k6/execution';

// call  k6 run .\lifecycle-01.js --iterations 10
export default function () {
    // Log the current iteration number for this VU in the scenario
    console.log(`Current iteration : ${exec.scenario.iterationInInstance}`);
}