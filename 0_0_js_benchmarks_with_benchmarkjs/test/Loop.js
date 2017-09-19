//
// Loop-invariant Code Motion
//

let suiteLoop = new Benchmark.Suite

let COUNT = ROW * COL
let STAT = {
    count0: COUNT,
    count1 () {
        return COUNT
    },
    count2 () {
        return ROW * COL
    }
}

suiteLoop

    .add('loop with const barrier', function() {
        let nums = new Float64Array(ROW * COL)
        for (let i = 0; i < ROW * COL; i++) {
            nums[i] = .1
        }
    })

    .add('loop with let/const barrier', function() {
        let nums = new Float64Array(ROW * COL)
        let max = ROW * COL
        for (let i = 0; i < max; i++) {
            nums[i] = .1
        }
    })

    .add('loop with const/const barrier', function() {
        let nums = new Float64Array(ROW * COL)
        const max = ROW * COL
        for (let i = 0; i < max; i++) {
            nums[i] = .1
        }
    })

    .add('loop with property barrier #count0', function() {
        let nums = new Float64Array(ROW * COL)
        for (let i = 0; i < STAT.count0; i++) {
            nums[i] = .1
        }
    })

    .add('loop with func barrier #count1', function() {
        let nums = new Float64Array(ROW * COL)
        for (let i = 0; i < STAT.count1(); i++) {
            nums[i] = .1
        }
    })

    .add('loop with func barrier #count2', function() {
        let nums = new Float64Array(ROW * COL)
        for (let i = 0; i < STAT.count2(); i++) {
            nums[i] = .1
        }
    })

    .add('loop with func/const barrier #count2', function() {
        let nums = new Float64Array(ROW * COL)
        let max = STAT.count2()
        for (let i = 0; i < max; i++) {
            nums[i] = .1
        }
    })

    .add('loop array length property', function() {
        let nums = new Float64Array(ROW * COL)
        for (let i = 0; i < nums.length; i++) {
            nums[i] = .1
        }
    })

    .add('loop array length property as new const', function() {
        let nums = new Float64Array(ROW * COL)
        const max = nums.length
        for (let i = 0; i < max; i++) {
            nums[i] = .1
        }
    })

    .add('while loop with let/const barrier', function() {
        let nums = new Float64Array(ROW * COL)
        let i = ROW * COL
        while (i--) {
            nums[i] = .1
        }
    })

    // todo, object.prototype count property test


.on('cycle', function(event) {
    console.log(String(event.target))
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
})

.run({ 'async': false })
