const mpiImplementation = require('./impl/coreSingleThread');
// const mpiImplementation = require('./impl/forkPool');

function Kakka() {
    const POOL_SIZE ='POOL_SIZE';
    const MY_ID = 'MY_ID';
    const BUFFER = 'BUFFER';
    const BARRIER = 'BARRIER';
    const GET_ENV = 'GET_ENV';
    const RESULT = 'RESULT';
    const TRANSFER = 'TRANSFER';
    const COLLECT = 'COLLECT';

    let mpiImpl = null;

    const core = {
        run(mpiScript, threads, data) {
            if (mpiImpl !== null) throw new Error('mpi already running');

            mpiImpl = mpiImplementation(core);

            return mpiImpl.hwThreadCount()
                .then(hwThreads => {
                    if (threads > 0) {
                        return core.mpiEngineStart(mpiScript, threads, data)
                    } else if (threads < 0) {
                        let count = hwThreads + threads;
                        if (count > 0) {
                            return core.mpiEngineStart(mpiScript, count, data)
                        } else {
                            return core.mpiEngineStart(mpiScript, hwThreads, data)
                        }
                    }
                    return core.mpiEngineStart(mpiScript, hwThreads, data)
                })
                .then((res) => {
                    mpiImpl = null;
                    return res;
                })
        },

        mpiEngineStart(mpiScript, threads, data) {
            let job = {
                threads: []
            };

            for (let thread = 0; thread < threads; thread++) {
                job.threads.push(
                    mpiImpl.startThread(mpiScript, data, thread, threads)
                )
            }

            return Promise.all(job.threads)
        },

        mpiEngineLoop(state) {
            if (!state.step.done) {
                core.mpiEngineHandler(state.step.value, state)
                    .then(stepActionResult => {
                        state.step = state.script.next(stepActionResult);
                        core.mpiEngineLoop(state);
                    });
            } else {
                state.res(state.result);
            }
        },

        mpiEngineHandler(value, state) {
            let res = undefined;
            switch (value.type) {
                case POOL_SIZE:
                    res = mpiImpl.mpiGetPoolSize.call(state);
                    break;
                case MY_ID:
                    res = mpiImpl.mpiGetMyId.call(state);
                    break;
                case BUFFER:
                    res = mpiImpl.mpiBuildBuffer.call(state, value.size);
                    break;
                case BARRIER:
                    res = mpiImpl.mpiWaitBarrier.call(state);
                    break;
                case GET_ENV:
                    res = mpiImpl.getEnv.call(state);
                    break;
                case RESULT:
                    res = mpiImpl.setResult.call(state, value.data);
                    break;
                case TRANSFER:
                    res = mpiImpl.mpiTransfer.call(state, value.data);
                    break;
                case COLLECT:
                    res = mpiImpl.mpiCollect.call(state, value.data);
                    break;
                default:
                    break;
            }
            return res;
        }
    };

    return {
        mpi: {
            poolSize() {
                return { type: POOL_SIZE }
            },
            myId() {
                return { type: MY_ID }
            },
            getEnv() {
                return { type: GET_ENV }
            },
            buffer(size) {
                return { type: BUFFER, size }
            },
            barrier() {
                return { type: BARRIER }
            },
            transfer(data) {
                return { type: TRANSFER, data }
            },
            collect(data) {
                return { type: COLLECT, data }
            },
            result(data) {
                return { type: RESULT, data }
            },

            hwThreadCount() {
                return mpiImpl.hwThreadCount()
            },

            run(mpiScript, threads, data) {
                return core.run(mpiScript, threads, data)
            }
        }
    };
}

module.exports = Kakka;
