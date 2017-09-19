
let suiteNewZeroArray = new Benchmark.Suite
const LEN = 1e6

suiteNewZeroArray

    .add('xxx', function() {
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
