const Benchmark = require('benchmark');
const m = require('./implMath');

let {origPoints} = m.initModel(1000, 1000);
let points = m.computeStep(origPoints);

let suite = new Benchmark.Suite;

suite
    .add('computeStep 2', function() {
        m.computeStep(points);
    })

    .on('cycle', (event) => console.log(String(event.target)))
    .on('complete', function() { console.log('Fastest is ' + this.filter('fastest').map('name')) })
    .run({ 'async': true });

/**

 node --version
 v8.1.4
 node -e 'console.log(process.versions.v8);'
 5.8.283.41

 node --version
 v8.4.0
 node -e 'console.log(process.versions.v8);'
 6.0.286.52

 */

/** test

 PS> nvm use 8.4.0
 Now using node v8.4.0 (64-bit)

 PS> node --version
 v8.4.0

 PS> node -e 'console.log(process.versions.v8);'
 6.0.286.52

 PS> node .\try1.js
 computeStep 2 x 0.69 ops/sec ±0.62% (6 runs sampled)
 Fastest is computeStep 2

 PS> nvm use 8.1.4
 Now using node v8.1.4 (64-bit)

 PS> node .\try1.js
 computeStep 2 x 0.18 ops/sec ±0.90% (5 runs sampled)
 Fastest is computeStep 2

 PS> nvm use 7.10.1
 Now using node v7.10.1 (64-bit)

 PS> node .\try1.js
 computeStep 2 x 0.18 ops/sec ±1.45% (5 runs sampled)
 Fastest is computeStep 2

 PS>

 */
