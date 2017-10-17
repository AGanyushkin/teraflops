const os = require('os');
const Waiter = require('../Waiter');

function mpiImplementation(kakkaMpiCore) {
    let threads = NaN;
    let pool = {};
    let barriers = {};
    let transfers = {};
    let collect = {};
    const _mpiImpl = {
        mpiGetPoolSize() {
            return Promise.resolve(this.threads);
        },
        mpiGetMyId() {
            return Promise.resolve(this.thread);
        },
        getEnv() {
            return Promise.all([
                _mpiImpl.mpiGetPoolSize.call(this),
                _mpiImpl.mpiGetMyId.call(this),
            ])
                .then(list => {
                    return {
                        poolSize: list[0],
                        myId: list[1]
                    }
                })
        },
        mpiBuildBuffer(size) {
            return new Promise((res) => {
                let buffer = [];
                let i = size;
                while(i--) {
                    buffer[i] = 0
                }
                res(buffer)
            })
        },
        mpiWaitBarrier(_name) {
            let name = _name || 'default';
            if (!barriers[name]) {
                barriers[name] = [];
                for (let i = 0; i < threads; i++) {
                    barriers[name].push(new Waiter());
                }
            }
            barriers[name][this.thread].resolve();
            return Promise.all(barriers[name])
                .then(() => {
                    if (this.thread === 0) {
                        delete barriers[name]
                    }
                })
        },
        mpiTransfer(data) {
            const name = '__sys_transfer_waiter__';
            if (!transfers[name]) {
                transfers[name] = data;
            }
            let result = null;
            return _mpiImpl.mpiWaitBarrier.call(this, name)
                .then(() => {
                    result = JSON.parse(JSON.stringify(transfers[name]));
                    return _mpiImpl.mpiWaitBarrier.call(this, name)
                })
                .then(() => {
                    if (this.thread === 0) delete transfers[name];
                    return result
                })
        },
        mpiCollect(data) {
            const name = '__sys_collect_waiter__';
            if (!collect[name]) {
                collect[name] = [];
                for (let i = 0; i < threads; i++) {
                    collect[name].push(null);
                }
            }
            collect[name][this.thread] = data;

            let result = null;
            return _mpiImpl.mpiWaitBarrier.call(this, name)
                .then(() => {
                    result = collect[name];
                    return _mpiImpl.mpiWaitBarrier.call(this, name)
                })
                .then(() => {
                    if (this.thread === 0) delete collect[name];
                    return result
                })
        },
        hwThreadCount() {
            return new Promise((res, rej) => {
                if (global) {
                    res(os.cpus().length || 1);
                } else {
                    res(navigator.hardwareConcurrency || 1);
                }
            });
        },
        setResult(data) {
            return new Promise((res, rej) => {
                this.result = data;
                res();
            });
        },
        startThread(mpiScript, data, thread, _threads) {
            if (isNaN(threads)) {
                threads = _threads;
            } else {
                if (threads !== _threads)
                    throw new Error(`incorrect threads value ${_threads} / ${threads}`);
            }

            let poolItem = new Promise((res, rej) => {
                setTimeout(() => {
                    let script = mpiScript(data);
                    let state = {
                        data,
                        script,
                        step: script.next(),
                        res,
                        rej,
                        threads,
                        thread
                    };
                    kakkaMpiCore.mpiEngineLoop(state)
                }, 0)
            });
            pool[thread] = poolItem;

            return poolItem;
        }
    };

    return _mpiImpl
}

module.exports = mpiImplementation;
