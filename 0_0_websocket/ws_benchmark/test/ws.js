//
// Loop-invariant Code Motion
//

let suiteEx = new Benchmark.Suite

const DEBUG = false
const BUF_SIZE = 1024 * 1024
const buffer_1 = new Float64Array(BUF_SIZE)
const buffer_2 = []; buffer_2.length = BUF_SIZE
const buffer_3 = {}
const buffer_4 = new Int32Array(BUF_SIZE)
const buffer_5 = new Int8Array(BUF_SIZE)
const buffer_6 = new Float32Array(BUF_SIZE)
const buffer_7 = []; buffer_7.length = BUF_SIZE

let i = BUF_SIZE
while (i--) {
    buffer_1[i] = Math.random()
    buffer_2[i] = Math.random()
    buffer_3[i] = Math.random()
    buffer_4[i] = i
    buffer_5[i] = 77
    buffer_6[i] = Math.random()
    buffer_7[i] = i
}

function openWS(cb) {
    let socket_arr = null,
        socket_ta = null,
        socket_obj = null,
        socket_ta_i32 = null,
        socket_ta_i8 = null,
        socket_ta_f32 = null,
        socket_arr_int = null

    function check() {
        if (socket_ta &&
            socket_arr &&
            socket_obj &&
            socket_ta_i32 &&
            socket_ta_i8 &&
            socket_ta_f32 &&
            socket_arr_int
        ) {
            cb(
                socket_ta,
                socket_arr,
                socket_obj,
                socket_ta_i32,
                socket_ta_i8,
                socket_ta_f32,
                socket_arr_int
            )
        }
    }

    let _socket_ta = new WebSocket(`ws://localhost:${WS_TA_PORT}`)
    _socket_ta.binaryType = 'arraybuffer'
    _socket_ta.onopen = () => {
        socket_ta = _socket_ta
        check()
    }

    let _socket_arr = new WebSocket(`ws://localhost:${WS_ARR_PORT}`)
    _socket_arr.onopen = () => {
        socket_arr = _socket_arr
        check()
    }

    let _socket_obj = new WebSocket(`ws://localhost:${WS_OBJ_PORT}`)
    _socket_obj.onopen = () => {
        socket_obj = _socket_obj
        check()
    }

    let _socket_ta_i32 = new WebSocket(`ws://localhost:${WS_TA_I32_PORT}`)
    _socket_ta_i32.binaryType = 'arraybuffer'
    _socket_ta_i32.onopen = () => {
        socket_ta_i32 = _socket_ta_i32
        check()
    }


    let _socket_ta_i8 = new WebSocket(`ws://localhost:${WS_TA_I8_PORT}`)
    _socket_ta_i8.binaryType = 'arraybuffer'
    _socket_ta_i8.onopen = () => {
        socket_ta_i8 = _socket_ta_i8
        check()
    }

    let _socket_ta_f32 = new WebSocket(`ws://localhost:${WS_TA_F32_PORT}`)
    _socket_ta_f32.binaryType = 'arraybuffer'
    _socket_ta_f32.onopen = () => {
        socket_ta_f32 = _socket_ta_f32
        check()
    }

    let _socket_arr_int = new WebSocket(`ws://localhost:${WS_ARR_INT_PORT}`)
    _socket_arr_int.onopen = () => {
        socket_arr_int = _socket_arr_int
        check()
    }
}

openWS((socket_ta, socket_arr, socket_obj, socket_ta_i32, socket_ta_i8, socket_ta_f32, socket_arr_int) => {

    suiteEx
        .add('Float64Array', {
            defer: true,
            fn: (deferred) => {
                socket_ta.onmessage = (event) => {
                    let d = new Float64Array(event.data)
                    if (DEBUG) {
                        console.log(d)
                    }
                    deferred.resolve()
                }
                socket_ta.send(buffer_1)
            }
        })

        .add('Float32Array', {
            defer: true,
            fn: (deferred) => {
                socket_ta_f32.onmessage = (event) => {
                    let d = new Float32Array(event.data)
                    if (DEBUG) {
                        console.log(d)
                    }
                    deferred.resolve()
                }
                socket_ta_f32.send(buffer_6)
            }
        })

        .add('Int32Array', {
            defer: true,
            fn: (deferred) => {
                socket_ta_i32.onmessage = (event) => {
                    let d = new Int32Array(event.data)
                    if (DEBUG) {
                        console.log(d)
                    }
                    deferred.resolve()
                }
                socket_ta_i32.send(buffer_4)
            }
        })

        .add('Int8Array', {
            defer: true,
            fn: (deferred) => {
                socket_ta_i8.onmessage = (event) => {
                    let d = new Int8Array(event.data)
                    if (DEBUG) {
                        console.log(d)
                    }
                    deferred.resolve()
                }
                socket_ta_i8.send(buffer_5)
            }
        })

        .add('Array', {
            defer: true,
            fn: (deferred) => {
                socket_arr.onmessage = (event) => {
                    let d = JSON.parse(event.data)
                    if (DEBUG) {
                        console.log(d)
                    }
                    deferred.resolve()
                }
                socket_arr.send(JSON.stringify(buffer_2))
            }
        })

        .add('Array<Int>', {
            defer: true,
            fn: (deferred) => {
                socket_arr_int.onmessage = (event) => {
                    let d = JSON.parse(event.data)
                    if (DEBUG) {
                        console.log(d)
                    }
                    deferred.resolve()
                }
                socket_arr_int.send(JSON.stringify(buffer_7))
            }
        })

        .add('Object', {
            defer: true,
            fn: (deferred) => {
                socket_obj.onmessage = (event) => {
                    let d = JSON.parse(event.data)
                    if (DEBUG) {
                        console.log(d)
                    }
                    deferred.resolve()
                }
                socket_obj.send(JSON.stringify(buffer_3))
            }
        })

        .on('cycle', function(event) {
            console.log(String(event.target))
        })
        .on('complete', function() {
            console.log('Fastest is ' + this.filter('fastest').map('name'))

            socket_ta.close()
            socket_arr.close()
            socket_obj.close()
        })
        .run({ 'async': false })

})
