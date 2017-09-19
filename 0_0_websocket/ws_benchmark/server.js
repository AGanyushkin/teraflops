let http = require('http')
let WebSocketServer = new require('ws')
let Static = require('node-static')

/** ----------------------------------------------------------------------- */

const WS_TA_PORT = 8081
const WS_ARR_PORT = 8082
const WS_OBJ_PORT = 8083
const WS_TA_I32_PORT = 8084

const WS_TA_I8_PORT = 8085
const WS_TA_F32_PORT = 8086
const WS_ARR_INT_PORT = 8087
const STATIC_PORT = 8080

let clients_TA = {},
    clients_ARR = {},
    clients_OBJ = {},
    clients_TA_I32 = {},
    clients_TA_I8 = {},
    clients_TA_F32 = {},
    clients_ARR_INT = {}

init(WS_ARR_INT_PORT, clients_ARR_INT, (message) => {
    let d = JSON.parse(message)
    for (let key in clients_ARR_INT) {
        clients_ARR_INT[key].send(JSON.stringify(d))
    }
})

init(WS_TA_F32_PORT, clients_TA_F32, (message) => {
    let d = new Int8Array(message)
    for (let key in clients_TA_F32) {
        clients_TA_F32[key].send(d)
    }
})

init(WS_TA_I8_PORT, clients_TA_I8, (message) => {
    let d = new Int8Array(message)
    for (let key in clients_TA_I8) {
        clients_TA_I8[key].send(d)
    }
})

init(WS_TA_I32_PORT, clients_TA_I32, (message) => {
    let d = new Int32Array(message)
    for (let key in clients_TA_I32) {
        clients_TA_I32[key].send(d)
    }
})

init(WS_TA_PORT, clients_TA, (message) => {
    let d = new Float64Array(message)
    for (let key in clients_TA) {
        clients_TA[key].send(d)
    }
})

init(WS_ARR_PORT, clients_ARR, (message) => {
    let d = JSON.parse(message)
    for (let key in clients_ARR) {
        clients_ARR[key].send(JSON.stringify(d))
    }
})

init(WS_OBJ_PORT, clients_OBJ, (message) => {
    let d = JSON.parse(message)
    for (let key in clients_OBJ) {
        clients_OBJ[key].send(JSON.stringify(d))
    }
})

/** ----------------------------------------------------------------------- */

function init(port, clients, onHandler) {
    let wsCli = new WebSocketServer.Server({port: port})
    wsCli.on('connection', (ws) => {

        let id = Math.random()
        clients[id] = ws
        console.log("new connection " + id)

        ws.on('message', onHandler)

        ws.on('close', () => {
            console.log('connection closed ' + id)
            delete clients[id]
        })

    })
    return wsCli
}

let fileServer = new Static.Server('.')
http.createServer((req, res) => {
    fileServer.serve(req, res)
}).listen(STATIC_PORT)

console.log(`started, ports: {static: ${STATIC_PORT}, WA_TA: ${WS_TA_PORT}, WA_ARR: ${WS_ARR_PORT}}`)
