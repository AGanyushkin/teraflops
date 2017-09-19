
(function () {
    worker = null;
    points = null;

    self.onmessage = function(e) {
        const action = e.data;

        switch (action.type) {
            case 'init':
                console.log(`init worker #${action.payload.part}, from: ${action.payload._from}, count: ${action.payload.count}`)
                worker = action.payload;
                break;
            case 'step':
                // console.log(`new step in worker ${worker.part}`);
                // console.log(`compute #${worker.part}, from: ${worker._from}, count: ${worker.count}`)
                points = new Float64Array(action.points);
                points = computeStep(points, worker._from, worker.count);

                const msg = {
                    type: 'done',
                    points: points.buffer
                };
                postMessage(
                    msg,
                    [msg.points]
                );
                break;
            default:
                break;
        }
    }

    const G = 6.67408e-11;  // [м^3 * кг^-1 * с^-2]
    const RK_DEF_H = 1e3; // [c]

    const MAX_ATTEMPTS = 100;
    const M_MAX = 3;
    const M_MIN = 1;
    const POOL_SIZE = 1000;

    const POINT_X = 0;
    const POINT_Y = 1;
    const POINT_Z = 2;
    const POINT_VX = 3;
    const POINT_VY = 4;
    const POINT_VZ = 5;
    const POINT_M = 6;
    const POINT_SIZE = 7;

    function initModel () {
        const EARTH_MOON = 384403e3;
        const X_MIN = -EARTH_MOON;
        const X_MAX = EARTH_MOON;
        const Y_MIN = -EARTH_MOON;
        const Y_MAX = EARTH_MOON;
        const Z_MIN = Y_MIN;
        const Z_MAX = Y_MAX;

        const M_MIN = 7.36e22;
        const M_MAX = 5.9742e24;

        let points = new Float64Array(POOL_SIZE * POINT_SIZE);
        for (let i = 0, tries = 0; i < POOL_SIZE; i++) {

            if (tries >= MAX_ATTEMPTS) { throw "ACHTUNG!!!" } else tries += 1;

            let created = false;
            while (!created) {

                let x = Math.round(X_MIN + Math.random() * (X_MAX - X_MIN));
                let y = Math.round(Y_MIN + Math.random() * (Y_MAX - Y_MIN));
                let z = 0;
                let vx = 0;
                let vy = 0;
                let vz = 0; // z: Math.round(Z_MIN + Math.random() * (Z_MAX - Z_MIN)),
                let m = M_MIN + Math.random() * (M_MAX - M_MIN); // m: Math.round(M_MIN + Math.random() * (M_MAX - M_MIN))

                let exists = false;
                for (let j = 0; j < i; j++) {

                    exists = (points[j * POINT_SIZE + POINT_X] === x) &&
                        (points[j * POINT_SIZE + POINT_Y] === y);
                    if (exists) break
                }
                if (!exists) {

                    points[i * POINT_SIZE + POINT_X] = x;
                    points[i * POINT_SIZE + POINT_Y] = y;
                    points[i * POINT_SIZE + POINT_Z] = z;
                    points[i * POINT_SIZE + POINT_VX] = vx;
                    points[i * POINT_SIZE + POINT_VY] = vy;
                    points[i * POINT_SIZE + POINT_VZ] = vz;
                    points[i * POINT_SIZE + POINT_M] = m;

                    created = true;
                    tries = 0
                }
            }
        }

        let view = {
            width: Math.round( (X_MAX - X_MIN) * 2),
            height: Math.round( (Y_MAX - Y_MIN) * 2),
            x: 0,
            y: 0
        };
        return {
            points,
            view
        }
    }

    function computeStep (points, _from, count) {
        let h = RK_DEF_H;
        // console.log(`${worker.part}: compute in range (${_from}:${count})`);
        for (let i = _from; i < _from + count; i++) {
            // console.log(`${worker.part}: compute point ${i} in range (${_from}:${count})`);
            RK4Step(points, i, h, POINT_X);
            RK4Step(points, i, h, POINT_Y);
            RK4Step(points, i, h, POINT_Z);

        }
        return points
    }

    function ds (s, v, pointIndex, points, coord) {
        return v
    }

    function dvs (s, v, pointIndex, points, coord) {
        let sum = 0;
        for (let i = 0; i < points.length / POINT_SIZE; i++) {
            if (i !== pointIndex) {
                let R = Math.sqrt(
                    (points[pointIndex * POINT_SIZE + POINT_X] - points[i * POINT_SIZE + POINT_X]) ** 2 +
                    (points[pointIndex * POINT_SIZE + POINT_Y] - points[i * POINT_SIZE + POINT_Y]) ** 2 +
                    (points[pointIndex * POINT_SIZE + POINT_Z] - points[i * POINT_SIZE + POINT_Z]) ** 2
                );
                let e = 1e8;
                sum += G * points[i * POINT_SIZE + POINT_M] * ((points[i * POINT_SIZE + coord] - s) / (R ** 2 + e ** 2) ** (3/2))
            }
        }
        return sum
    }

    function RK4Step(points, pointIndex, h, coord) {
        let s = points[pointIndex * POINT_SIZE + coord];
        let v = points[pointIndex * POINT_SIZE + (coord + 3)];

        let ks0 = ds(s, v, pointIndex, points, coord);
        let kv0 = dvs(s, v, pointIndex, points, coord);

        let ks1 = ds(s + 0.5 * h * ks0, v + 0.5 * h * kv0, pointIndex, points, coord);
        let kv1 = dvs(s + 0.5 * h * ks0, v + 0.5 * h * kv0, pointIndex, points, coord);

        let ks2 = ds(s + 0.5 * h * ks1, v + 0.5 * h * kv1, pointIndex, points, coord);
        let kv2 = dvs(s + 0.5 * h * ks1, v + 0.5 * h * kv1, pointIndex, points, coord);

        let ks3 = ds(s + h * ks2, v + h * kv2, pointIndex, points, coord);
        let kv3 = dvs(s + h * ks2, v + h * kv2, pointIndex, points, coord);

        points[pointIndex * POINT_SIZE + coord] = s + h / 6 * (ks0 + 2 * (ks1 + ks2) + ks3);
        points[pointIndex * POINT_SIZE + (coord + 3)] = v + h / 6 * (kv0 + 2 * (kv1 + kv2) + kv3);
    }

}());

