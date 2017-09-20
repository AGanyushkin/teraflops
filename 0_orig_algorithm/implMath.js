const G = 6.67408e-11  // [м^3 * кг^-1 * с^-2]
const RK_DEF_H = 1e3 // [c]

const MAX_ATTEMPTS = 100
const M_MAX = 3
const M_MIN = 1
const POOL_SIZE = 100

function initModel () {
    const EARTH_MOON = 384403e3
    const X_MIN = -EARTH_MOON
    const X_MAX = EARTH_MOON
    const Y_MIN = -EARTH_MOON
    const Y_MAX = EARTH_MOON
    const Z_MIN = Y_MIN
    const Z_MAX = Y_MAX

    const M_MIN = 7.36e22
    const M_MAX = 5.9742e24

    let points = []
    for (let i = 0, tries = 0; i < POOL_SIZE; i++) {

        if (tries >= MAX_ATTEMPTS) { throw "ACHTUNG!!!" } else tries += 1

        let created = false
        while (!created) {

            let point = {
                x: Math.round(X_MIN + Math.random() * (X_MAX - X_MIN)),
                y: Math.round(Y_MIN + Math.random() * (Y_MAX - Y_MIN)),
                z: 0,
                vx: 0,
                vy: 0,
                vz: 0,
                m: M_MIN + Math.random() * (M_MAX - M_MIN)
            }
            // z: Math.round(Z_MIN + Math.random() * (Z_MAX - Z_MIN)),
            // m: Math.round(M_MIN + Math.random() * (M_MAX - M_MIN))

            let exists = false
            for (let j = 0; j < points.length; j++) {
                exists = (points[j].x === point.x) &&
                         (points[j].y === point.y)
                if (exists) break
            }
            if (!exists) {
                points.push(point)
                created = true
                tries = 0
            }
        }
    }

    let view = {
        width: Math.round( (X_MAX - X_MIN) * 2),
        height: Math.round( (Y_MAX - Y_MIN) * 2),
        x: 0,
        y: 0
    }
    return {
        points,
        view
    }
}

function initEarthMoonModel () {
    const EARTH_MOON = 384403e3
    let points = [
        {
            x: 0,
            y: 0,
            z: 0,
            vx: 0,
            vy: 0,
            vz: 0,
            m: 5.9742e24 // [кг]
        },
        {
            x: EARTH_MOON, // [м]
            y: 0,
            z: 0,
            vx: 0,
            vy: 1.022e3,  // [м/c]
            vz: 0,
            m: 7.36e22 // [кг]
        }
    ]
    let view = {
        width: EARTH_MOON * 2.5,
        height: EARTH_MOON * 2.5,
        x: 0,
        y: 0
    }
    return {
        points,
        view
    }
}

function computeStep (points) {
    let h = RK_DEF_H
    for (let i = 0; i < points.length; i++) {

        points[i] = RK4Step(points, points[i], i, h, 'x')
        points[i] = RK4Step(points, points[i], i, h, 'y')
        points[i] = RK4Step(points, points[i], i, h, 'z')

    }
    return points
}

function ds (s, v, pointIndex, points, coord) {
    return v
}

function dvs (s, v, pointIndex, points, coord) {
    let sum = 0
    for (let i = 0; i < points.length; i++) {
        if (i !== pointIndex) {
            let R = Math.sqrt(
                (points[pointIndex].x - points[i].x) ** 2 +
                (points[pointIndex].y - points[i].y) ** 2 +
                (points[pointIndex].z - points[i].z) ** 2
            )
            let e = 1e8
            sum += G * points[i].m * ((points[i][coord] - s) / (R ** 2 + e ** 2) ** (3/2))
        }
    }
    return sum
}

function RK4Step(points, point, pointIndex, h, coord) {
    let vcoord = `v${coord}`
    let s = point[coord]
    let v = point[vcoord]

    let ks0 = ds(s, v, pointIndex, points, coord)
    let kv0 = dvs(s, v, pointIndex, points, coord)

    let ks1 = ds(s + 0.5 * h * ks0, v + 0.5 * h * kv0, pointIndex, points, coord)
    let kv1 = dvs(s + 0.5 * h * ks0, v + 0.5 * h * kv0, pointIndex, points, coord)

    let ks2 = ds(s + 0.5 * h * ks1, v + 0.5 * h * kv1, pointIndex, points, coord)
    let kv2 = dvs(s + 0.5 * h * ks1, v + 0.5 * h * kv1, pointIndex, points, coord)

    let ks3 = ds(s + h * ks2, v + h * kv2, pointIndex, points, coord)
    let kv3 = dvs(s + h * ks2, v + h * kv2, pointIndex, points, coord)

    return Object.assign({}, point, {
        [coord]: s + h / 6 * (ks0 + 2 * (ks1 + ks2) + ks3),
        [vcoord]: v + h / 6 * (kv0 + 2 * (kv1 + kv2) + kv3)
    })
}
