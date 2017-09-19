import nconf from 'nconf'
import intel from 'intel'
import uuid from 'uuid'

let C_CHECK = 0
let TYPES = {
    A: 1,
    B: 2,
    C: 3
}
let HANDLERS = {
    [TYPES.A]: () => {},
    [TYPES.B]: (entity) => { C_CHECK += 1; },
    [TYPES.C]: () => {}
}

function buildEntity(i, type) {
    return {
        type,
        x: i,
        y: i
    }
}

function initEntities(entities) {
    const COUNT = 1e6
    // const COUNT = 100e3
    for (let i = 0; i < COUNT; i += 1) {
        //let key = uuid.v4()
        let key = i
        entities[key] = buildEntity(key, TYPES.B)
    }
}

function timeDelta(t1, t2) {
    let _t2 = t2[0] * 1e9 + t2[1]
    let _t1 = t1[0] * 1e9 + t1[1]
    let dt = _t2 - _t1
    return dt * 1e-9
}

function pullEntity(key, entities) {
    return entities[key]
}

function loopEntities(entities) {
    for (let key in entities) {
        let entity = entities[key]

        let _entity = null
        for (let i = 0; i < 40; i += 1) {
            _entity = pullEntity(key, entities)
        }

        if (HANDLERS.hasOwnProperty(_entity.type)) {
            HANDLERS[_entity.type](_entity)
        }
    }
}

export default function t1() {
    const log = intel.getLogger('common')
    const TRIES = 3

    let t_create = []
    let t_loop = []

    for (let i = 0; i < TRIES; i += 1) {
        C_CHECK = 0
        let entities = {}

        let time1 = process.hrtime()
        initEntities(entities)
        let time2 = process.hrtime()
        t_create.push(timeDelta(time1, time2))

        let time3 = process.hrtime()
        loopEntities(entities)
        let time4 = process.hrtime()
        t_loop.push(timeDelta(time3, time4))
    }

    let s_create = 0
    for (let a of t_create) {
        s_create += a
    }

    let s_loop = 0
    for (let a of t_loop) {
        s_loop += a
    }

    log.info(`create ~ ${(s_create / t_create.length).toFixed(3)} s`)
    log.info(`loop ~ ${(s_loop / t_loop.length).toFixed(3)} s`)
}
