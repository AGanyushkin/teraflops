
let suiteTypedArrayDifferentTypes = new Benchmark.Suite

suiteTypedArrayDifferentTypes

    .add('Int8Array', function() {
        new Int8Array(ROW * COL)
    })
    .add('Int32Array', function() {
        new Int32Array(ROW * COL)
    })
    .add('Float32Array', function() {
        new Float32Array(ROW * COL)
    })
    .add('Float64Array', function() {
        new Float64Array(ROW * COL)
    })

.on('cycle', function(event) {
    console.log(String(event.target))
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
})

.run({ 'async': false })
