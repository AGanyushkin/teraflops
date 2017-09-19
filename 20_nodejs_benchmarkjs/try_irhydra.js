const m = require('./implMath');

let {origPoints} = m.initModel(1000, 1000);
let points = origPoints;

let i = 10;
while (i--) {
    points = m.computeStep(points);
}
