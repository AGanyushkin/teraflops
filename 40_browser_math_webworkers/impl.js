const FIXED_LOOP_TIMEOUT = 0

function onload () {
    if (initGUI()) {

        let {points, view} = initModel(scope.width, scope.height)
        // let {points, view} = initEarthMoonModel()

        const pointCount = points.length / POINT_SIZE;
        const parts = 4;
        const poolSize = Math.ceil(pointCount / parts);

        console.log(`points.length = ${points.length}`);
        console.log(`pointCount = ${pointCount}`);
        console.log(`poolSize = ${poolSize}`);
        console.log(`parts = ${parts}`);

        const workers = [];

        for (let part = 0; part < parts; part++) {
            let _from = part * poolSize;
            let count = ((_from + poolSize) <= (pointCount - 1)) ? poolSize : (pointCount - _from);

            console.log(`for worker ${part} use from: ${_from}, count ${count}`);

            workers[part] = {
                part,
                worker: new Worker("implMathWorker.js"),
                _from,
                count
            };
            workers[part].worker.onmessage = (e) => workerCallback(workers[part], e);

            workers[part].worker.postMessage(
                {type: 'init', payload: {
                    part: workers[part].part,
                    _from: workers[part]._from,
                    count: workers[part].count
                }}
            );
            console.log(`created: part: ${part}, _from: ${workers[part]._from}, count: ${workers[part].count}`);
        }

        gData.workers = workers;
        gData.points = points;
        gData.view = view;

        loop();
    } else {
        alert('undefined canvas')
    }
}

function workerCallback(worker, e) {
    const action = e.data;

    switch (action.type) {
        case 'done':

            const result = new Float64Array(action.points);

            // console.log(`merge results from ${worker.part}, from: ${worker._from}, count: ${worker.count}`);

            for (let i = worker._from; i < worker._from + worker.count; i++) {
                let f = POINT_SIZE;
                while (f--) {
                    gData.points[i * POINT_SIZE + f] = result[i * POINT_SIZE + f]
                }
            }

            gData.stepDoneCounter = gData.stepDoneCounter - 1;

            if (gData.stepDoneCounter === 0) {
                // console.log('itt - done');
                draw(gData.points, gData.view);
                loop();
            }
            break;
        default:
            break;
    }
}

const gData = {
    stepDoneCounter: 0,
    workers: null,
    points: null,
    view: null
}

function loop() {

    gData.stepDoneCounter = gData.workers.length;

    for (let part = 0; part < gData.workers.length; part++) {

        const msg = {
            type: 'step',
            points: new Float64Array(gData.points).buffer
        };

        gData.workers[part].worker.postMessage(
            msg,
            [msg.points]
        );
    }
}
