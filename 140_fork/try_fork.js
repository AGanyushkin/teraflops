// https://nodejs.org/api/cluster.html#cluster_worker_send_message_sendhandle_callback

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        var worker = cluster.fork();

        worker.on('message', function(msg) {
            console.log(msg);
        });
    }

    cluster.on('exit', function() {
        if (Object.keys(cluster.workers).length === 0) {
            console.log('done');
        }
    });
} else {
    console.log('I am the thread: ' + process.pid);
    process.send('hi from worker: ' + process.pid);
    process.exit(1);
}