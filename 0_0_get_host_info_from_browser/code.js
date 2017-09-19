function ready () {
    let info = gatherInfo()
    showInfo(info)
}

function showInfo (info) {
    let infoDiv = document.getElementById('info')
    infoDiv.innerHTML = JSON.stringify(info, null, 4)
}

function gatherInfo () {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        performanceMemory: {
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            usedJSHeapSize: performance.memory.usedJSHeapSize
        },
        performanceTiming: performance.timing,
        webgl: {
            experimental: gatherWEBGLInfo("experimental-webgl"),
            v1: gatherWEBGLInfo("webgl"),
            v2: gatherWEBGLInfo("webgl2"),
        },
        features: gatherFeatures(),
        flops: flops()
    }
}

function gatherFeatures () {
    return {
        Worker: !!window.Worker,
        SharedWorker: !!window.SharedWorker,
        ServiceWorker: !!window.ServiceWorker,
        WebGL: !!window.WebGLRenderingContext,
        WebGL2: !!window.WebGL2RenderingContext,
        WebSocket: !!window.WebSocket,
        WebAssembly: !!window.WebAssembly,
        indexedDB: !!window.indexedDB,
        RTC: !!window.RTCPeerConnection
    }
}

function gatherWEBGLInfo (v) {
    let info = {}
    try {
        let canvas = document.getElementById(`glcanvas-${v}`)
        let gl = canvas.getContext(v)

        info = {
            RENDERER: gl.getParameter(gl.RENDERER),
            VENDOR: gl.getParameter(gl.VENDOR),
            vendor: getUnmaskedInfo(gl).vendor,
            renderer: getUnmaskedInfo(gl).renderer,
            SupportedExtensions: gl.getSupportedExtensions()
        }
    } catch (e) {
        info = {
            error: e.toString()
        }
    }
    return info
}

function getUnmaskedInfo (gl) {
    let unMaskedInfo = {
        renderer: '',
        vendor: ''
    }
    let dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info")
    if (dbgRenderInfo != null) {
        unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL)
        unMaskedInfo.vendor   = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL)
    }
    return unMaskedInfo
}

function flops () {
    mean = function (distr) {
        let sum = 0;
        for (obs in distr) {
            sum += distr[obs]
        }
        return sum / distr.length
    }

    stdev = function (distr,mean) {
        let diffsquares = 0
        for (obs in distr) {
            diffsquares += Math.pow(distr[obs] - mean , 2)
        }
        return Math.sqrt((diffsquares / distr.length))
    }


    let OPs = 1e6

    let results = []
    for (let t = 0; t < 60; t++) {
        let start = window.performance.now()
        for(let i = 0.5; i < OPs; i++){
            i++
        }
        let took = (window.performance.now() - start) * 1e-3
        let FLOPS = (OPs / 2) / took
        results.push(FLOPS)
    }

    let average = mean(results)
    let deviation = stdev(results,average)

    return {
        average,
        deviation,
        text: 'Average: '+average+' FLOPS. Standart deviation: '+deviation+' FLOPS'
    }
}