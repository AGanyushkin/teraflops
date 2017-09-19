
let program = null;

function ready () {
    let canvas = document.getElementById('glCanvas')
    let aspect = canvas.width / canvas.height

    let gl = initWebGL(canvas)
    if (gl) {
        clear(gl)
        linkingShaders(gl)
        draw(gl, aspect)
    } else {
        alert("gl === null")
    }
}

function initWebGL(canvas) {
    let gl = null
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.')
    }
    gl.viewport(0, 0, canvas.width, canvas.height)
    return gl
}

function draw (gl, aspect) {
    let vertices = new Float32Array([
        -0.5, 0.5*aspect, 0.5, 0.5*aspect, 0.5,-0.5*aspect,
        -0.5, 0.5*aspect, 0.5,-0.5*aspect, -0.5,-0.5*aspect
    ])

    let vbuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    let itemSize = 2
    let numItems = vertices.length / itemSize

    gl.useProgram(program)
    program.uColor = gl.getUniformLocation(program, "uColor")
    gl.uniform4fv(program.uColor, [1.0, 0.0, 0.0, 1.0])
    program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition")
    gl.enableVertexAttribArray(program.aVertexPosition)
    gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, numItems)
}

function clear (gl) {
    gl.clearColor(0.0, 0.5, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function linkingShaders (gl) {
    let v = document.getElementById("vertex").firstChild.nodeValue
    let f = document.getElementById("fragment").firstChild.nodeValue

    let vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, v)
    gl.compileShader(vs)

    let fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, f)
    gl.compileShader(fs)

    program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
}
