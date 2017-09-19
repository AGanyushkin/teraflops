const FIXED_LOOP_TIMEOUT = 0

function onload () {
    if (initGUI()) {

        let {points, view} = initModel(scope.width, scope.height)
        // let {points, view} = initEarthMoonModel()

        setTimeout(() => { loop(points, view) }, FIXED_LOOP_TIMEOUT)
    } else {
        alert('undefined canvas')
    }
}

function loop (origPoints, view) {
    let points = computeStep(origPoints)
    // console.log(points)
    draw(origPoints, view)
    setTimeout(() => { loop(points, view) }, FIXED_LOOP_TIMEOUT)
}
