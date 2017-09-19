import nconf from 'nconf'
import intel from 'intel'

function timeDelta(t1, t2) {
    let _t2 = t2[0] * 1e9 + t2[1]
    let _t1 = t1[0] * 1e9 + t1[1]
    let dt = _t2 - _t1
    return dt * 1e-9
}

function testF() {

}

export default function t2() {
    const log = intel.getLogger('common')
    const TRIES = 1e9

    let time1 = process.hrtime()
    for (let i = 0; i < TRIES; i += 1) {
        testF()
    }
    let time2 = process.hrtime()
    log.debug(`#1; ${timeDelta(time1, time2)} ns`)
}
