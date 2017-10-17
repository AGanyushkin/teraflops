const redis = require("redis");
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
    return_buffers: true
});

client.on("error", (err) => {
    console.log("Error " + err);
});

const N = 10e6;

console.log('start initialization');
let inData = new Float64Array(N);
for (let i = 0; i < N; i++) {
    inData[0] = Math.random();
}

let buffer = Buffer.from(inData.buffer);

client.set("data1", buffer, redis.print);

client.get("data1", function (err, reply) {
    console.log('--- reply ---');

    let outData = new Float64Array(
        new Uint8Array(reply).buffer
    );
    
    console.log('done: ' + outData.length);

    client.quit();
});
