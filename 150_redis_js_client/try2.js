const redis = require("redis");
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
    return_buffers: true
});

client.on("error", (err) => {
    console.log("Error " + err);
});

let inData = new Float64Array(2);
inData[0] = 1;
inData[1] = 2.1;

console.log(inData);

let buff = Buffer.from(inData.buffer);

client.set("data1", buff, redis.print);

console.log(buff);

console.log('--- saved ---');

client.get("data1", function (err, reply) {
    console.log('--- reply ---');
    console.log(reply);

    let outData = new Float64Array(
        new Uint8Array(reply).buffer
    );
    
    console.log(outData);

    client.quit();
});
