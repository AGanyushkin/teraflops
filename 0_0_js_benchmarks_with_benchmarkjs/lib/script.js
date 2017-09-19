let l = console.log

l('hi')

function empty_v1(r, c) {
    let m = new Float64Array(r * c)
    return m
}

function empty_v2(r, c) {
    let m = new Array(r)
    for (let i = 0; i < r; i++) {
        m[i] = new Array(c)
    }
    return m
}

function empty_v3(r, c) {
    let m = []
    for (let i = 0; i < r; i++) {
        m[i] = []
    }
    return m
}


l(empty_v3(2, 3))



var suite = new Benchmark.Suite;

// add tests
suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
})
.add('String#indexOf', function() {
  'Hello World!'.indexOf('o') > -1;
})
.add('String#match', function() {
  !!'Hello World!'.match(/o/);
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });
