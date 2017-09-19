const v8 = require('v8')
const bytes = require('bytes')

const SIZE = 2 ** 25 - 1

console.log(`SIZE = ${bytes(SIZE * 8)}`)

let arrs = []

for (let x = 0; x < 5; x++) {
    console.log(`>>> ${x} iteration, try allocate ${bytes(SIZE * 8)} ---`)
    memStat ('+--')

    let a = []; a.length = SIZE
    arrs[x] = a

    memStat ('-+-')

    let i = a.length
    while (i--) {
        // if ((i % 1e6) === 0) memStat ('***')
        memStat ('***')
        a[i] = Math.random()
    }

    memStat ('--+')
}

function memStat (prefix) {
    let mem = v8.getHeapStatistics()
    let ss = v8.getHeapSpaceStatistics()

    let pMem = process.memoryUsage()
    let pMemRss = bytes(pMem.rss)
    let pMemHeapTotal = bytes(pMem.heapTotal)
    let pMemHeapUsed = bytes(pMem.heapUsed)
    let pMemExternal = bytes(pMem.external)

    console.log(`${prefix} rss: ${pMemRss}, total: ${pMemHeapTotal}, used: ${pMemHeapUsed}, external: ${pMemExternal}`)

    let total = bytes(mem.total_heap_size)
    let avail = bytes(mem.total_available_size)
    let used = bytes(mem.used_heap_size)
    let limit = bytes(mem.heap_size_limit)

    console.log(`${prefix} total: ${total}, avail: ${avail}, used: ${used}, limit: ${limit}`)

    function heapSpaceStatistics (id) {
        let n = ss.filter(x => x.space_name === id)[0]
        let n_space_size = bytes(n.space_size)
        let n_space_used_size = bytes(n.space_used_size)
        let n_space_available_size = bytes(n.space_available_size)
        let n_physical_space_size = bytes(n.physical_space_size)

        console.log(`${prefix}>>> size: ${n_space_size}, used: ${n_space_used_size}, available: ${n_space_available_size}, physical: ${n_physical_space_size}`)
    }

    heapSpaceStatistics('new_space')
    heapSpaceStatistics('old_space')
    heapSpaceStatistics('code_space')
    heapSpaceStatistics('map_space')
    heapSpaceStatistics('large_object_space')
}
