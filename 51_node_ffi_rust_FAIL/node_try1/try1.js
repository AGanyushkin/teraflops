/**
 * https://medium.com/jim-fleming/complex-types-with-rust-s-ffi-315d14619479
 *
 */
var ffi = require('ffi');
var ref = require('ref');
var ArrayType = require("ref-array");


var F64Array = ArrayType(ref.types.double);

var lib = ffi.Library('D:\\_timeline\\13_CONFERENCE_js_perf_code_conference\\50_node_ffi_rust\\try1\\target\\debug\\gravi.dll', {
// var lib = ffi.Library('D:\\_timeline\\13_CONFERENCE_js_perf_code_conference\\50_node_ffi_rust\\node_try1\\adder.dll', {
    compute_step: [F64Array, [F64Array, 'int', 'long', 'long']]
});

var points = new Float64Array([3.7, 3.8, 3.9, 4.0]);

lib.compute_step(points, points.length, 1, 2);

console.log('--- res ---');
for (var e of points) {
    console.log(e)
}
