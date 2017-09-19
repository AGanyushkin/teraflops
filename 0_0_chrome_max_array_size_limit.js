const SIZE = 2 ** 25 - 1

let arr = []

for (let p = 0; p < 3; p++) {

    let a = []; a.length = SIZE
    arr.push(a)

    let i = a.length
    while (i--) {
        a[i] = Math.random()
    }
}

let y1 = new Int8Array(2 ** 29 - 1)
let y2 = new Int8Array(2 ** 29 - 1)
