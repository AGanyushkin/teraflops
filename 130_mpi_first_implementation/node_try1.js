const Kakka = require('./kakka');

const {mpi} = Kakka();

function* mpiScript(N) {
    let myid = yield mpi.myId();
    console.log(`${myid}: started`);

    console.log(`${myid}: inputData = ${N}`);

    let poolsize = yield mpi.poolSize();
    console.log(`${myid}: poolsize = ${poolsize}`);

    let {myId, poolSize} = yield mpi.getEnv();
    console.log(`${myid}: poolsize = ${poolSize} / myId = ${myId}`);

    let data;
    if (myId === 0) {
        data = yield mpi.buffer(N);
        console.log(`${myid}: data = ${data}`);
    }

    yield mpi.barrier();
    console.log(`${myid}: barrier`);
    console.log(`${myid}: data = ${data}`);

    data = yield mpi.transfer(data);
    console.log(`${myid}: data = ${data}`);

    for (let i = 0; i < N; i++) {
        data[i] = `${myId}-${i}`;
    }

    let dataPool = yield mpi.collect(data);
    console.log(`${myid}: dataPool = ${JSON.stringify(dataPool)}`);

    if (myId === 0) {
        yield mpi.result(dataPool);
    }
}

const N = 3;
mpi.run(mpiScript, 3, N)
    .then((result) => {
        console.log('DONE with');
        console.log(JSON.stringify(result))
    });

