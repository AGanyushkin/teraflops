var ffi = require('ffi');

var lib = ffi.Library('adder.dll', {
    add: ['int', ['int', 'int']]
});

console.log(
    lib.add(1,2)
);
