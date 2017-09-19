
const SIZE_1 = 1e3
const SIZE_2 = 1e4
const SIZE_3 = 1e5

function test1 (s) {
    const buffer1 = new Float64Array(s)

    let i = s
    while (i--) {
        buffer1[i] = .8
    }
}

function test2 (s) {
    const buffer2 = new Float64Array(s)

    let i = s
    while (i--) {
        buffer2[i] = .7
    }
}

test1(SIZE_1)
test1(SIZE_2)
test2(SIZE_3)

console.log('Hello world!')
