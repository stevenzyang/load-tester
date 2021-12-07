export async function runPerfTest(rpss: Array<number>, duration: number, testFn: () => Promise<any>) {
    const promises = []
    const durations = []
    let errors = 0;

    async function sendRequests() {
        for (const rps of rpss) {
            const start = Date.now();
            const numReqs = rps * duration
            const sleepMs = 1 / rps * 1000;
            for (let i = 0; i < numReqs; i++) {
                if (i % 100 == 0) process.stdout.write(".");
                promises.push(makeRequest());
                await sleep(sleepMs);
            }
            console.log(`Made ${numReqs} requests in ${(Date.now() - start) / 1000} seconds`);
        }
    }

    async function makeRequest() {
        const start = Date.now();
        try {
            const s = await testFn();
            // process.stdout.write("+")
            // console.log(s);
        } catch (e) {
            console.log("ERROR returned", e);
            console.log(`took ${Date.now() - start}`)
            errors += 1;
        }
        const timeMs = Date.now() - start;
        // console.log(`Took ${timeMs / 1000} seconds`);
        durations.push(timeMs / 1000);
        process.stdout.write((timeMs / 1000) + "-");
    }

    await sendRequests();
    await Promise.all(promises);
    durations.sort();
    const median = durations[Math.floor(durations.length/2)];
    const p95 = durations[Math.floor(.95 * durations.length)];
    console.log(durations);
    console.log(`Median: ${median}, p95: ${p95}`);
    console.log("Errors: " + errors);
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 