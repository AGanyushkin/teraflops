
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
    let m = new Array()
    for (let i = 0; i < r; i++) {
        m[i] = new Array(c)
    }
    return m
}

function empty_v4(r, c) {
    let m = []
    m.length = r
    for (let i = 0; i < r; i++) {
        m[i] = []
        m[i].length = c
    }
    return m
}
