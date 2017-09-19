
let suiteNewZeroArray = new Benchmark.Suite
const LEN = 1e6

suiteNewZeroArray

    .add('ArrayBuffer with Float64Array', function() {
        new Float64Array(
            new ArrayBuffer(LEN * 8)
        )
    })
    .add('Float64Array', function() {
        new Float64Array(LEN)
    })
    .add('Array with length', function() {
        let a = []          //
        a.length = LEN      // or new Array(LEN)
        for (let i = 0; i < LEN; i++) {
            a[i] = .0
        }
    })
    .add('Array without length', function() {
        let a = []
        for (let i = 0; i < LEN; i++) {
            a[i] = .0
        }
    })
    .add('Array.apply & map #LEN', function() {
        Array.apply(null, Array(LEN)).map(Number.prototype.valueOf, 0)
    })
    .add('Array.apply & map #1e5', function() {
        Array.apply(null, Array(1e5)).map(Number.prototype.valueOf, 0)
    })
    .add('Array.fill', function() {
        new Array(LEN).fill(0)
    })

.on('cycle', function(event) {
    console.log(String(event.target))
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
})
.on('error', function(event) {
    console.error(event.target.error)
})

.run({ 'async': false })
