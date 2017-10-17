function Waiter() {
    let promiseRes = () => {};
    let promiseRej = () => {};
    let waiter = new Promise(function WaiterPromiseResolver(res, rej) {
        promiseRes = res;
        promiseRej = rej;
    });

    waiter.ready = false;
    waiter.error = false;
    waiter.done = false;

    waiter.resolve = function WaiterPromiseResolve() {
        waiter.ready = true;
        waiter.done = true;
        promiseRes();
    };
    waiter.reject = function WaiterPromiseReject() {
        waiter.error = true;
        waiter.done = true;
        promiseRej();
    };

    waiter.catch((er) => undefined);

    return waiter;
}

module.exports = Waiter;
