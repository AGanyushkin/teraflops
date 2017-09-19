//
// Loop-invariant Code Motion
//

let suiteEx = new Benchmark.Suite

suiteEx

    .add('example bm', function() {
        let a = 1 + 2
    })

.on('cycle', function(event) {
    console.log(String(event.target))
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
})

.run({ 'async': false })
