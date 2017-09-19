const Benchmark = require('benchmark');

let arr = [];
let i = 1000;
while(i--) {
   arr = arr.concat(['abc', 'bac', 'bca', 'ythrew', 'rewr', 'rAr', 'rrA', 'erwer'])
}

let suite = new Benchmark.Suite;

suite
    .add('alg_1', function() {
        const sorted = arr.map(str => str.split('').sort().join(''));
        const anagrams = sorted.reduce((acc, cur) => (
            (acc[cur] = (acc[cur] + 1) || 1),
                acc
        ), {});
    })
    .add('alg_2', function() {

        let i = arr.length;
        while(i--) {
            const str = arr[i];
            const counter = []; counter.length = 26;
            let p = str.length;
            while (p--) {
                let k = str[p].charCodeAt() - 97;
                counter[k] = (counter[k] + 1) || 1;
            }
        }

    })

    .on('cycle', (event) => console.log(String(event.target)))
    .on('complete', function() { console.log('Fastest is ' + this.filter('fastest').map('name')) })
    .run({ 'async': true });
