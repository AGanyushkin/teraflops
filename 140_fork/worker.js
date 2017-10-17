var cluster = require('cluster');

if (cluster.isWorker) {
    console.log('I am the thread: ' + process.pid);
    process.send('hi from worker: ' + process.pid);
    process.exit(1);
}
