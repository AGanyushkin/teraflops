// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = (typeof Module !== 'undefined' ? Module : null) || {};

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() thread proxied to worker. (with Emscripten -s PROXY_TO_WORKER=1) (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)

if (Module['ENVIRONMENT']) {
  if (Module['ENVIRONMENT'] === 'WEB') {
    ENVIRONMENT_IS_WEB = true;
  } else if (Module['ENVIRONMENT'] === 'WORKER') {
    ENVIRONMENT_IS_WORKER = true;
  } else if (Module['ENVIRONMENT'] === 'NODE') {
    ENVIRONMENT_IS_NODE = true;
  } else if (Module['ENVIRONMENT'] === 'SHELL') {
    ENVIRONMENT_IS_SHELL = true;
  } else {
    throw new Error('The provided Module[\'ENVIRONMENT\'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.');
  }
} else {
  ENVIRONMENT_IS_WEB = typeof window === 'object';
  ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function' && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
  ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
}


if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = console.log;
  if (!Module['printErr']) Module['printErr'] = console.warn;

  var nodeFS;
  var nodePath;

  Module['read'] = function read(filename, binary) {
    if (!nodeFS) nodeFS = require('fs');
    if (!nodePath) nodePath = require('path');
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    return binary ? ret : ret.toString();
  };

  Module['readBinary'] = function readBinary(filename) {
    var ret = Module['read'](filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  if (!Module['thisProgram']) {
    if (process['argv'].length > 1) {
      Module['thisProgram'] = process['argv'][1].replace(/\\/g, '/');
    } else {
      Module['thisProgram'] = 'unknown-program';
    }
  }

  Module['arguments'] = process['argv'].slice(2);

  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });

  Module['inspect'] = function () { return '[Emscripten Module object]'; };
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available' };
  }

  Module['readBinary'] = function readBinary(f) {
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    var data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof quit === 'function') {
    Module['quit'] = function(status, toThrow) {
      quit(status);
    }
  }

}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (ENVIRONMENT_IS_WORKER) {
    Module['readBinary'] = function read(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return xhr.response;
    };
  }

  Module['readAsync'] = function readAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
      } else {
        onerror();
      }
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.warn(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WORKER) {
    Module['load'] = importScripts;
  }

  if (typeof Module['setWindowTitle'] === 'undefined') {
    Module['setWindowTitle'] = function(title) { document.title = title };
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
if (!Module['thisProgram']) {
  Module['thisProgram'] = './this.program';
}
if (!Module['quit']) {
  Module['quit'] = function(status, toThrow) {
    throw toThrow;
  }
}

// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = undefined;



// {{PREAMBLE_ADDITIONS}}

// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  setTempRet0: function (value) {
    tempRet0 = value;
    return value;
  },
  getTempRet0: function () {
    return tempRet0;
  },
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  STACK_ALIGN: 16,
  prepVararg: function (ptr, type) {
    if (type === 'double' || type === 'i64') {
      // move so the load is aligned
      if (ptr & 7) {
        assert((ptr & 7) === 4);
        ptr += 4;
      }
    } else {
      assert((ptr & 3) === 0);
    }
    return ptr;
  },
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[sig]) {
      Runtime.funcWrappers[sig] = {};
    }
    var sigCache = Runtime.funcWrappers[sig];
    if (!sigCache[func]) {
      // optimize away arguments usage in common cases
      if (sig.length === 1) {
        sigCache[func] = function dynCall_wrapper() {
          return Runtime.dynCall(sig, func);
        };
      } else if (sig.length === 2) {
        sigCache[func] = function dynCall_wrapper(arg) {
          return Runtime.dynCall(sig, func, [arg]);
        };
      } else {
        // general case
        sigCache[func] = function dynCall_wrapper() {
          return Runtime.dynCall(sig, func, Array.prototype.slice.call(arguments));
        };
      }
    }
    return sigCache[func];
  },
  getCompilerSetting: function (name) {
    throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work';
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+15)&-16); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+15)&-16); return ret; },
  dynamicAlloc: function (size) { var ret = HEAP32[DYNAMICTOP_PTR>>2];var end = (((ret + size + 15)|0) & -16);HEAP32[DYNAMICTOP_PTR>>2] = end;if (end >= TOTAL_MEMORY) {var success = enlargeMemory();if (!success) {HEAP32[DYNAMICTOP_PTR>>2] = ret;return 0;}}return ret;},
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 16))*(quantum ? quantum : 16); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*(+4294967296))) : ((+((low>>>0)))+((+((high|0)))*(+4294967296)))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}



Module["Runtime"] = Runtime;



//========================================
// Runtime essentials
//========================================

var ABORT = 0; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  if (!func) {
    try { func = eval('_' + ident); } catch(e) {}
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

var cwrap, ccall;
(function(){
  var JSfuncs = {
    // Helpers for cwrap -- it can't refer to Runtime directly because it might
    // be renamed by closure, instead it calls JSfuncs['stackSave'].body to find
    // out what the minified function name is.
    'stackSave': function() {
      Runtime.stackSave()
    },
    'stackRestore': function() {
      Runtime.stackRestore()
    },
    // type conversion from js to c
    'arrayToC' : function(arr) {
      var ret = Runtime.stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    },
    'stringToC' : function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) { // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        var len = (str.length << 2) + 1;
        ret = Runtime.stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    }
  };
  // For fast lookup of conversion functions
  var toC = {'string' : JSfuncs['stringToC'], 'array' : JSfuncs['arrayToC']};

  // C calling interface.
  ccall = function ccallFunc(ident, returnType, argTypes, args, opts) {
    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    if (args) {
      for (var i = 0; i < args.length; i++) {
        var converter = toC[argTypes[i]];
        if (converter) {
          if (stack === 0) stack = Runtime.stackSave();
          cArgs[i] = converter(args[i]);
        } else {
          cArgs[i] = args[i];
        }
      }
    }
    var ret = func.apply(null, cArgs);
    if (returnType === 'string') ret = Pointer_stringify(ret);
    if (stack !== 0) {
      if (opts && opts.async) {
        EmterpreterAsync.asyncFinalizers.push(function() {
          Runtime.stackRestore(stack);
        });
        return;
      }
      Runtime.stackRestore(stack);
    }
    return ret;
  }

  var sourceRegex = /^function\s*[a-zA-Z$_0-9]*\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;
  function parseJSFunc(jsfunc) {
    // Match the body and the return value of a javascript function source
    var parsed = jsfunc.toString().match(sourceRegex).slice(1);
    return {arguments : parsed[0], body : parsed[1], returnValue: parsed[2]}
  }

  // sources of useful functions. we create this lazily as it can trigger a source decompression on this entire file
  var JSsource = null;
  function ensureJSsource() {
    if (!JSsource) {
      JSsource = {};
      for (var fun in JSfuncs) {
        if (JSfuncs.hasOwnProperty(fun)) {
          // Elements of toCsource are arrays of three items:
          // the code, and the return value
          JSsource[fun] = parseJSFunc(JSfuncs[fun]);
        }
      }
    }
  }

  cwrap = function cwrap(ident, returnType, argTypes) {
    argTypes = argTypes || [];
    var cfunc = getCFunc(ident);
    // When the function takes numbers and returns a number, we can just return
    // the original function
    var numericArgs = argTypes.every(function(type){ return type === 'number'});
    var numericRet = (returnType !== 'string');
    if ( numericRet && numericArgs) {
      return cfunc;
    }
    // Creation of the arguments list (["$1","$2",...,"$nargs"])
    var argNames = argTypes.map(function(x,i){return '$'+i});
    var funcstr = "(function(" + argNames.join(',') + ") {";
    var nargs = argTypes.length;
    if (!numericArgs) {
      // Generate the code needed to convert the arguments from javascript
      // values to pointers
      ensureJSsource();
      funcstr += 'var stack = ' + JSsource['stackSave'].body + ';';
      for (var i = 0; i < nargs; i++) {
        var arg = argNames[i], type = argTypes[i];
        if (type === 'number') continue;
        var convertCode = JSsource[type + 'ToC']; // [code, return]
        funcstr += 'var ' + convertCode.arguments + ' = ' + arg + ';';
        funcstr += convertCode.body + ';';
        funcstr += arg + '=(' + convertCode.returnValue + ');';
      }
    }

    // When the code is compressed, the name of cfunc is not literally 'cfunc' anymore
    var cfuncname = parseJSFunc(function(){return cfunc}).returnValue;
    // Call the function
    funcstr += 'var ret = ' + cfuncname + '(' + argNames.join(',') + ');';
    if (!numericRet) { // Return type can only by 'string' or 'number'
      // Convert the result to a string
      var strgfy = parseJSFunc(function(){return Pointer_stringify}).returnValue;
      funcstr += 'ret = ' + strgfy + '(ret);';
    }
    if (!numericArgs) {
      // If we had a stack, restore it
      ensureJSsource();
      funcstr += JSsource['stackRestore'].body.replace('()', '(stack)') + ';';
    }
    funcstr += 'return ret})';
    return eval(funcstr);
  };
})();
Module["ccall"] = ccall;
Module["cwrap"] = cwrap;

function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module["setValue"] = setValue;


function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module["getValue"] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
Module["ALLOC_STACK"] = ALLOC_STACK;
Module["ALLOC_STATIC"] = ALLOC_STATIC;
Module["ALLOC_DYNAMIC"] = ALLOC_DYNAMIC;
Module["ALLOC_NONE"] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [typeof _malloc === 'function' ? _malloc : Runtime.staticAlloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)>>0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module["allocate"] = allocate;

// Allocate memory during any stage of startup - static memory early on, dynamic memory later, malloc when ready
function getMemory(size) {
  if (!staticSealed) return Runtime.staticAlloc(size);
  if (!runtimeInitialized) return Runtime.dynamicAlloc(size);
  return _malloc(size);
}
Module["getMemory"] = getMemory;

function Pointer_stringify(ptr, /* optional */ length) {
  if (length === 0 || !ptr) return '';
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = 0;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))>>0)];
    hasUtf |= t;
    if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (hasUtf < 128) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  return Module['UTF8ToString'](ptr);
}
Module["Pointer_stringify"] = Pointer_stringify;

// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAP8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}
Module["AsciiToString"] = AsciiToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}
Module["stringToAscii"] = stringToAscii;

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;
function UTF8ArrayToString(u8Array, idx) {
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  while (u8Array[endPtr]) ++endPtr;

  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var u0, u1, u2, u3, u4, u5;

    var str = '';
    while (1) {
      // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
      u0 = u8Array[idx++];
      if (!u0) return str;
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      u1 = u8Array[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      u2 = u8Array[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u3 = u8Array[idx++] & 63;
        if ((u0 & 0xF8) == 0xF0) {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3;
        } else {
          u4 = u8Array[idx++] & 63;
          if ((u0 & 0xFC) == 0xF8) {
            u0 = ((u0 & 3) << 24) | (u1 << 18) | (u2 << 12) | (u3 << 6) | u4;
          } else {
            u5 = u8Array[idx++] & 63;
            u0 = ((u0 & 1) << 30) | (u1 << 24) | (u2 << 18) | (u3 << 12) | (u4 << 6) | u5;
          }
        }
      }
      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
}
Module["UTF8ArrayToString"] = UTF8ArrayToString;

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function UTF8ToString(ptr) {
  return UTF8ArrayToString(HEAPU8,ptr);
}
Module["UTF8ToString"] = UTF8ToString;

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 0xC0 | (u >> 6);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 0xE0 | (u >> 12);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0x1FFFFF) {
      if (outIdx + 3 >= endIdx) break;
      outU8Array[outIdx++] = 0xF0 | (u >> 18);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0x3FFFFFF) {
      if (outIdx + 4 >= endIdx) break;
      outU8Array[outIdx++] = 0xF8 | (u >> 24);
      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 5 >= endIdx) break;
      outU8Array[outIdx++] = 0xFC | (u >> 30);
      outU8Array[outIdx++] = 0x80 | ((u >> 24) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
}
Module["stringToUTF8Array"] = stringToUTF8Array;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}
Module["stringToUTF8"] = stringToUTF8;

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) {
      ++len;
    } else if (u <= 0x7FF) {
      len += 2;
    } else if (u <= 0xFFFF) {
      len += 3;
    } else if (u <= 0x1FFFFF) {
      len += 4;
    } else if (u <= 0x3FFFFFF) {
      len += 5;
    } else {
      len += 6;
    }
  }
  return len;
}
Module["lengthBytesUTF8"] = lengthBytesUTF8;

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;
function UTF16ToString(ptr) {
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  while (HEAP16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var i = 0;

    var str = '';
    while (1) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0) return str;
      ++i;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }
  }
}


// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)]=codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)]=0;
  return outPtr - startPtr;
}


// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}


function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}


// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)]=codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)]=0;
  return outPtr - startPtr;
}


// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}


function demangle(func) {
  var __cxa_demangle_func = Module['___cxa_demangle'] || Module['__cxa_demangle'];
  if (__cxa_demangle_func) {
    try {
      var s =
        func.substr(1);
      var len = lengthBytesUTF8(s)+1;
      var buf = _malloc(len);
      stringToUTF8(s, buf, len);
      var status = _malloc(4);
      var ret = __cxa_demangle_func(buf, 0, 0, status);
      if (getValue(status, 'i32') === 0 && ret) {
        return Pointer_stringify(ret);
      }
      // otherwise, libcxxabi failed
    } catch(e) {
      // ignore problems here
    } finally {
      if (buf) _free(buf);
      if (status) _free(status);
      if (ret) _free(ret);
    }
    // failure when using libcxxabi, don't demangle
    return func;
  }
  Runtime.warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
  return func;
}

function demangleAll(text) {
  var regex =
    /__Z[\w\d_]+/g;
  return text.replace(regex,
    function(x) {
      var y = demangle(x);
      return x === y ? x : (x + ' [' + y + ']');
    });
}

function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
    // so try that as a special-case.
    try {
      throw new Error(0);
    } catch(e) {
      err = e;
    }
    if (!err.stack) {
      return '(no stack trace available)';
    }
  }
  return err.stack.toString();
}

function stackTrace() {
  var js = jsStackTrace();
  if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
  return demangleAll(js);
}
Module["stackTrace"] = stackTrace;

// Memory management

var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;
var MIN_TOTAL_MEMORY = 16777216;

function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}

var HEAP;
var buffer;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateGlobalBuffer(buf) {
  Module['buffer'] = buffer = buf;
}

function updateGlobalBufferViews() {
  Module['HEAP8'] = HEAP8 = new Int8Array(buffer);
  Module['HEAP16'] = HEAP16 = new Int16Array(buffer);
  Module['HEAP32'] = HEAP32 = new Int32Array(buffer);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buffer);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buffer);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buffer);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buffer);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buffer);
}

var STATIC_BASE, STATICTOP, staticSealed; // static area
var STACK_BASE, STACKTOP, STACK_MAX; // stack area
var DYNAMIC_BASE, DYNAMICTOP_PTR; // dynamic area handled by sbrk

  STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
  staticSealed = false;



function abortOnCannotGrowMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which adjusts the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
}


function enlargeMemory() {
  abortOnCannotGrowMemory();
}


var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr('TOTAL_MEMORY should be larger than TOTAL_STACK, was ' + TOTAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

// Initialize the runtime's memory



// Use a provided buffer, if there is one, or else allocate a new one
if (Module['buffer']) {
  buffer = Module['buffer'];
} else {
  // Use a WebAssembly memory where available
  {
    buffer = new ArrayBuffer(TOTAL_MEMORY);
  }
}
updateGlobalBufferViews();


function getTotalMemory() {
  return TOTAL_MEMORY;
}

// Endianness check (note: assumes compiler arch was little-endian)
  HEAP32[0] = 0x63736d65; /* 'emsc' */
HEAP16[1] = 0x6373;
if (HEAPU8[2] !== 0x73 || HEAPU8[3] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';

Module['HEAP'] = HEAP;
Module['buffer'] = buffer;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Module['dynCall_v'](func);
      } else {
        Module['dynCall_vi'](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;
var runtimeExited = false;


function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
  runtimeExited = true;
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module["addOnPreRun"] = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module["addOnInit"] = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module["addOnPreMain"] = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module["addOnExit"] = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module["addOnPostRun"] = addOnPostRun;

// Tools


function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}
Module["intArrayFromString"] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module["intArrayToString"] = intArrayToString;

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
function writeStringToMemory(string, buffer, dontAddNull) {
  Runtime.warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var lastChar, end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}
Module["writeStringToMemory"] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}
Module["writeArrayToMemory"] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    HEAP8[((buffer++)>>0)]=str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)]=0;
}
Module["writeAsciiToMemory"] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}


// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];


if (!Math['clz32']) Math['clz32'] = function(x) {
  x = x >>> 0;
  for (var i = 0; i < 32; i++) {
    if (x & (1 << (31 - i))) return i;
  }
  return 32;
};
Math.clz32 = Math['clz32']

if (!Math['trunc']) Math['trunc'] = function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};
Math.trunc = Math['trunc'];

var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function getUniqueRunDependency(id) {
  return id;
}

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module["addRunDependency"] = addRunDependency;

function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module["removeRunDependency"] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data



var memoryInitializer = null;






// === Body ===

var ASM_CONSTS = [];




STATIC_BASE = 8;

STATICTOP = STATIC_BASE + 2016;
  /* global initializers */  __ATINIT__.push();
  

memoryInitializer = "a.out.js.mem";





/* no memory initializer */
var tempDoublePtr = STATICTOP; STATICTOP += 16;

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}

// {{PRE_LIBRARY}}


  
  function ___setErrNo(value) {
      if (Module['___errno_location']) HEAP32[((Module['___errno_location']())>>2)]=value;
      return value;
    } 
  Module["_sbrk"] = _sbrk;

   
  Module["_memset"] = _memset;

  function ___lock() {}

  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 
  Module["_memcpy"] = _memcpy;

  function _abort() {
      Module['abort']();
    }

  
  var SYSCALLS={varargs:0,get:function (varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function () {
        var ret = Pointer_stringify(SYSCALLS.get());
        return ret;
      },get64:function () {
        var low = SYSCALLS.get(), high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      },getZero:function () {
        assert(SYSCALLS.get() === 0);
      }};function ___syscall140(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // llseek
      var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
      var offset = offset_low;
      assert(offset_high === 0);
      FS.llseek(stream, offset, whence);
      HEAP32[((result)>>2)]=stream.position;
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall146(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // writev
      // hack to support printf in NO_FILESYSTEM
      var stream = SYSCALLS.get(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
      var ret = 0;
      if (!___syscall146.buffer) {
        ___syscall146.buffers = [null, [], []]; // 1 => stdout, 2 => stderr
        ___syscall146.printChar = function(stream, curr) {
          var buffer = ___syscall146.buffers[stream];
          assert(buffer);
          if (curr === 0 || curr === 10) {
            (stream === 1 ? Module['print'] : Module['printErr'])(UTF8ArrayToString(buffer, 0));
            buffer.length = 0;
          } else {
            buffer.push(curr);
          }
        };
      }
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[(((iov)+(i*8))>>2)];
        var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
        for (var j = 0; j < len; j++) {
          ___syscall146.printChar(stream, HEAPU8[ptr+j]);
        }
        ret += len;
      }
      return ret;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall54(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // ioctl
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___unlock() {}

  function ___syscall6(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // close
      var stream = SYSCALLS.getStreamFromFD();
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }
/* flush anything remaining in the buffer during shutdown */ __ATEXIT__.push(function() { var fflush = Module["_fflush"]; if (fflush) fflush(0); var printChar = ___syscall146.printChar; if (!printChar) return; var buffers = ___syscall146.buffers; if (buffers[1].length) printChar(1, 10); if (buffers[2].length) printChar(2, 10); });;
DYNAMICTOP_PTR = allocate(1, "i32", ALLOC_STATIC);

STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

STACK_MAX = STACK_BASE + TOTAL_STACK;

DYNAMIC_BASE = Runtime.alignMemory(STACK_MAX);

HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;

staticSealed = true; // seal the static portion of memory



function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

Module.asmGlobalArg = { "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array, "NaN": NaN, "Infinity": Infinity };

Module.asmLibraryArg = { "abort": abort, "assert": assert, "enlargeMemory": enlargeMemory, "getTotalMemory": getTotalMemory, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "invoke_ii": invoke_ii, "invoke_iiii": invoke_iiii, "___lock": ___lock, "___syscall6": ___syscall6, "___setErrNo": ___setErrNo, "_abort": _abort, "___syscall140": ___syscall140, "_emscripten_memcpy_big": _emscripten_memcpy_big, "___syscall54": ___syscall54, "___unlock": ___unlock, "___syscall146": ___syscall146, "DYNAMICTOP_PTR": DYNAMICTOP_PTR, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX };
// EMSCRIPTEN_START_ASM
var asm = (function(global, env, buffer) {
  'use asm';
  
  
  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);


  var DYNAMICTOP_PTR=env.DYNAMICTOP_PTR|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;
  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;

  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var nan = global.NaN, inf = global.Infinity;
  var tempInt = 0, tempBigInt = 0, tempBigIntP = 0, tempBigIntS = 0, tempBigIntR = 0.0, tempBigIntI = 0, tempBigIntD = 0, tempValue = 0, tempDouble = 0.0;
  var tempRet0 = 0;

  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var Math_min=global.Math.min;
  var Math_max=global.Math.max;
  var Math_clz32=global.Math.clz32;
  var abort=env.abort;
  var assert=env.assert;
  var enlargeMemory=env.enlargeMemory;
  var getTotalMemory=env.getTotalMemory;
  var abortOnCannotGrowMemory=env.abortOnCannotGrowMemory;
  var invoke_ii=env.invoke_ii;
  var invoke_iiii=env.invoke_iiii;
  var ___lock=env.___lock;
  var ___syscall6=env.___syscall6;
  var ___setErrNo=env.___setErrNo;
  var _abort=env._abort;
  var ___syscall140=env.___syscall140;
  var _emscripten_memcpy_big=env._emscripten_memcpy_big;
  var ___syscall54=env.___syscall54;
  var ___unlock=env.___unlock;
  var ___syscall146=env.___syscall146;
  var tempFloat = 0.0;

// EMSCRIPTEN_START_FUNCS
function _malloc($0) {
 $0 = $0 | 0;
 var $$$0192$i = 0, $$$0193$i = 0, $$$4351$i = 0, $$$i = 0, $$0 = 0, $$0$i$i = 0, $$0$i$i$i = 0, $$0$i18$i = 0, $$01$i$i = 0, $$0189$i = 0, $$0192$lcssa$i = 0, $$01928$i = 0, $$0193$lcssa$i = 0, $$01937$i = 0, $$0197 = 0, $$0199 = 0, $$0206$i$i = 0, $$0207$i$i = 0, $$0211$i$i = 0, $$0212$i$i = 0, $$024371$i = 0, $$0287$i$i = 0, $$0288$i$i = 0, $$0289$i$i = 0, $$0295$i$i = 0, $$0296$i$i = 0, $$0342$i = 0, $$0344$i = 0, $$0345$i = 0, $$0347$i = 0, $$0353$i = 0, $$0358$i = 0, $$0359$i = 0, $$0361$i = 0, $$0362$i = 0, $$0368$i = 0, $$1196$i = 0, $$1198$i = 0, $$124470$i = 0, $$1291$i$i = 0, $$1293$i$i = 0, $$1343$i = 0, $$1348$i = 0, $$1363$i = 0, $$1370$i = 0, $$1374$i = 0, $$2234253237$i = 0, $$2247$ph$i = 0, $$2253$ph$i = 0, $$2355$i = 0, $$3$i = 0, $$3$i$i = 0, $$3$i201 = 0, $$3350$i = 0, $$3372$i = 0, $$4$lcssa$i = 0, $$4$ph$i = 0, $$415$i = 0, $$4236$i = 0, $$4351$lcssa$i = 0, $$435114$i = 0, $$4357$$4$i = 0, $$4357$ph$i = 0, $$435713$i = 0, $$723948$i = 0, $$749$i = 0, $$pre$phi$i$iZ2D = 0, $$pre$phi$i20$iZ2D = 0, $$pre$phi$i211Z2D = 0, $$pre$phi$iZ2D = 0, $$pre$phi11$i$iZ2D = 0, $$pre$phiZ2D = 0, $1 = 0, $1001 = 0, $1007 = 0, $101 = 0, $1010 = 0, $1011 = 0, $102 = 0, $1029 = 0, $1031 = 0, $1038 = 0, $1039 = 0, $1040 = 0, $1048 = 0, $1050 = 0, $1051 = 0, $1052 = 0, $108 = 0, $112 = 0, $114 = 0, $115 = 0, $117 = 0, $119 = 0, $121 = 0, $123 = 0, $125 = 0, $127 = 0, $129 = 0, $134 = 0, $138 = 0, $14 = 0, $142 = 0, $145 = 0, $148 = 0, $149 = 0, $155 = 0, $157 = 0, $16 = 0, $160 = 0, $162 = 0, $165 = 0, $167 = 0, $17 = 0, $170 = 0, $173 = 0, $174 = 0, $176 = 0, $177 = 0, $179 = 0, $18 = 0, $180 = 0, $182 = 0, $183 = 0, $188 = 0, $189 = 0, $19 = 0, $20 = 0, $201 = 0, $205 = 0, $211 = 0, $218 = 0, $222 = 0, $231 = 0, $232 = 0, $234 = 0, $235 = 0, $239 = 0, $240 = 0, $248 = 0, $249 = 0, $250 = 0, $252 = 0, $253 = 0, $258 = 0, $259 = 0, $262 = 0, $264 = 0, $267 = 0, $27 = 0, $272 = 0, $279 = 0, $289 = 0, $293 = 0, $299 = 0, $30 = 0, $303 = 0, $306 = 0, $310 = 0, $312 = 0, $313 = 0, $315 = 0, $317 = 0, $319 = 0, $321 = 0, $323 = 0, $325 = 0, $327 = 0, $337 = 0, $338 = 0, $34 = 0, $348 = 0, $350 = 0, $353 = 0, $355 = 0, $358 = 0, $360 = 0, $363 = 0, $366 = 0, $367 = 0, $369 = 0, $37 = 0, $370 = 0, $372 = 0, $373 = 0, $375 = 0, $376 = 0, $381 = 0, $382 = 0, $387 = 0, $394 = 0, $398 = 0, $404 = 0, $41 = 0, $411 = 0, $415 = 0, $423 = 0, $426 = 0, $427 = 0, $428 = 0, $432 = 0, $433 = 0, $439 = 0, $44 = 0, $444 = 0, $445 = 0, $448 = 0, $450 = 0, $453 = 0, $458 = 0, $464 = 0, $466 = 0, $468 = 0, $47 = 0, $470 = 0, $487 = 0, $489 = 0, $49 = 0, $496 = 0, $497 = 0, $498 = 0, $50 = 0, $506 = 0, $508 = 0, $509 = 0, $511 = 0, $52 = 0, $520 = 0, $524 = 0, $526 = 0, $527 = 0, $528 = 0, $538 = 0, $539 = 0, $54 = 0, $540 = 0, $541 = 0, $542 = 0, $543 = 0, $544 = 0, $546 = 0, $548 = 0, $549 = 0, $555 = 0, $557 = 0, $559 = 0, $56 = 0, $564 = 0, $566 = 0, $568 = 0, $569 = 0, $570 = 0, $578 = 0, $579 = 0, $58 = 0, $582 = 0, $586 = 0, $589 = 0, $591 = 0, $597 = 0, $6 = 0, $60 = 0, $601 = 0, $605 = 0, $614 = 0, $615 = 0, $62 = 0, $621 = 0, $623 = 0, $627 = 0, $630 = 0, $632 = 0, $637 = 0, $64 = 0, $643 = 0, $648 = 0, $649 = 0, $650 = 0, $656 = 0, $657 = 0, $658 = 0, $662 = 0, $67 = 0, $673 = 0, $678 = 0, $679 = 0, $681 = 0, $687 = 0, $689 = 0, $69 = 0, $693 = 0, $699 = 0, $7 = 0, $70 = 0, $703 = 0, $709 = 0, $71 = 0, $711 = 0, $717 = 0, $72 = 0, $721 = 0, $722 = 0, $727 = 0, $73 = 0, $733 = 0, $738 = 0, $741 = 0, $742 = 0, $745 = 0, $747 = 0, $749 = 0, $752 = 0, $763 = 0, $768 = 0, $77 = 0, $770 = 0, $773 = 0, $775 = 0, $778 = 0, $781 = 0, $782 = 0, $783 = 0, $785 = 0, $787 = 0, $788 = 0, $790 = 0, $791 = 0, $796 = 0, $797 = 0, $8 = 0, $80 = 0, $810 = 0, $813 = 0, $814 = 0, $820 = 0, $828 = 0, $834 = 0, $837 = 0, $838 = 0, $839 = 0, $84 = 0, $843 = 0, $844 = 0, $850 = 0, $855 = 0, $856 = 0, $859 = 0, $861 = 0, $864 = 0, $869 = 0, $87 = 0, $875 = 0, $877 = 0, $879 = 0, $880 = 0, $898 = 0, $9 = 0, $900 = 0, $907 = 0, $908 = 0, $909 = 0, $916 = 0, $92 = 0, $920 = 0, $924 = 0, $926 = 0, $93 = 0, $932 = 0, $933 = 0, $935 = 0, $936 = 0, $937 = 0, $940 = 0, $945 = 0, $946 = 0, $947 = 0, $95 = 0, $953 = 0, $955 = 0, $96 = 0, $961 = 0, $966 = 0, $969 = 0, $970 = 0, $971 = 0, $975 = 0, $976 = 0, $98 = 0, $982 = 0, $987 = 0, $988 = 0, $991 = 0, $993 = 0, $996 = 0, label = 0, sp = 0, $955$looptemp = 0;
 sp = STACKTOP; //@line 862
 STACKTOP = STACKTOP + 16 | 0; //@line 863
 $1 = sp; //@line 864
 do {
  if ($0 >>> 0 < 245) {
   $6 = $0 >>> 0 < 11 ? 16 : $0 + 11 & -8; //@line 871
   $7 = $6 >>> 3; //@line 872
   $8 = HEAP32[119] | 0; //@line 873
   $9 = $8 >>> $7; //@line 874
   if ($9 & 3 | 0) {
    $14 = ($9 & 1 ^ 1) + $7 | 0; //@line 880
    $16 = 516 + ($14 << 1 << 2) | 0; //@line 882
    $17 = $16 + 8 | 0; //@line 883
    $18 = HEAP32[$17 >> 2] | 0; //@line 884
    $19 = $18 + 8 | 0; //@line 885
    $20 = HEAP32[$19 >> 2] | 0; //@line 886
    do {
     if (($16 | 0) == ($20 | 0)) {
      HEAP32[119] = $8 & ~(1 << $14); //@line 893
     } else {
      if ($20 >>> 0 < (HEAP32[123] | 0) >>> 0) {
       _abort(); //@line 898
      }
      $27 = $20 + 12 | 0; //@line 901
      if ((HEAP32[$27 >> 2] | 0) == ($18 | 0)) {
       HEAP32[$27 >> 2] = $16; //@line 905
       HEAP32[$17 >> 2] = $20; //@line 906
       break;
      } else {
       _abort(); //@line 909
      }
     }
    } while (0);
    $30 = $14 << 3; //@line 914
    HEAP32[$18 + 4 >> 2] = $30 | 3; //@line 917
    $34 = $18 + $30 + 4 | 0; //@line 919
    HEAP32[$34 >> 2] = HEAP32[$34 >> 2] | 1; //@line 922
    $$0 = $19; //@line 923
    STACKTOP = sp; //@line 924
    return $$0 | 0; //@line 924
   }
   $37 = HEAP32[121] | 0; //@line 926
   if ($6 >>> 0 > $37 >>> 0) {
    if ($9 | 0) {
     $41 = 2 << $7; //@line 932
     $44 = $9 << $7 & ($41 | 0 - $41); //@line 935
     $47 = ($44 & 0 - $44) + -1 | 0; //@line 938
     $49 = $47 >>> 12 & 16; //@line 940
     $50 = $47 >>> $49; //@line 941
     $52 = $50 >>> 5 & 8; //@line 943
     $54 = $50 >>> $52; //@line 945
     $56 = $54 >>> 2 & 4; //@line 947
     $58 = $54 >>> $56; //@line 949
     $60 = $58 >>> 1 & 2; //@line 951
     $62 = $58 >>> $60; //@line 953
     $64 = $62 >>> 1 & 1; //@line 955
     $67 = ($52 | $49 | $56 | $60 | $64) + ($62 >>> $64) | 0; //@line 958
     $69 = 516 + ($67 << 1 << 2) | 0; //@line 960
     $70 = $69 + 8 | 0; //@line 961
     $71 = HEAP32[$70 >> 2] | 0; //@line 962
     $72 = $71 + 8 | 0; //@line 963
     $73 = HEAP32[$72 >> 2] | 0; //@line 964
     do {
      if (($69 | 0) == ($73 | 0)) {
       $77 = $8 & ~(1 << $67); //@line 970
       HEAP32[119] = $77; //@line 971
       $98 = $77; //@line 972
      } else {
       if ($73 >>> 0 < (HEAP32[123] | 0) >>> 0) {
        _abort(); //@line 977
       }
       $80 = $73 + 12 | 0; //@line 980
       if ((HEAP32[$80 >> 2] | 0) == ($71 | 0)) {
        HEAP32[$80 >> 2] = $69; //@line 984
        HEAP32[$70 >> 2] = $73; //@line 985
        $98 = $8; //@line 986
        break;
       } else {
        _abort(); //@line 989
       }
      }
     } while (0);
     $84 = ($67 << 3) - $6 | 0; //@line 995
     HEAP32[$71 + 4 >> 2] = $6 | 3; //@line 998
     $87 = $71 + $6 | 0; //@line 999
     HEAP32[$87 + 4 >> 2] = $84 | 1; //@line 1002
     HEAP32[$87 + $84 >> 2] = $84; //@line 1004
     if ($37 | 0) {
      $92 = HEAP32[124] | 0; //@line 1007
      $93 = $37 >>> 3; //@line 1008
      $95 = 516 + ($93 << 1 << 2) | 0; //@line 1010
      $96 = 1 << $93; //@line 1011
      if (!($98 & $96)) {
       HEAP32[119] = $98 | $96; //@line 1016
       $$0199 = $95; //@line 1018
       $$pre$phiZ2D = $95 + 8 | 0; //@line 1018
      } else {
       $101 = $95 + 8 | 0; //@line 1020
       $102 = HEAP32[$101 >> 2] | 0; //@line 1021
       if ($102 >>> 0 < (HEAP32[123] | 0) >>> 0) {
        _abort(); //@line 1025
       } else {
        $$0199 = $102; //@line 1028
        $$pre$phiZ2D = $101; //@line 1028
       }
      }
      HEAP32[$$pre$phiZ2D >> 2] = $92; //@line 1031
      HEAP32[$$0199 + 12 >> 2] = $92; //@line 1033
      HEAP32[$92 + 8 >> 2] = $$0199; //@line 1035
      HEAP32[$92 + 12 >> 2] = $95; //@line 1037
     }
     HEAP32[121] = $84; //@line 1039
     HEAP32[124] = $87; //@line 1040
     $$0 = $72; //@line 1041
     STACKTOP = sp; //@line 1042
     return $$0 | 0; //@line 1042
    }
    $108 = HEAP32[120] | 0; //@line 1044
    if (!$108) {
     $$0197 = $6; //@line 1047
    } else {
     $112 = ($108 & 0 - $108) + -1 | 0; //@line 1051
     $114 = $112 >>> 12 & 16; //@line 1053
     $115 = $112 >>> $114; //@line 1054
     $117 = $115 >>> 5 & 8; //@line 1056
     $119 = $115 >>> $117; //@line 1058
     $121 = $119 >>> 2 & 4; //@line 1060
     $123 = $119 >>> $121; //@line 1062
     $125 = $123 >>> 1 & 2; //@line 1064
     $127 = $123 >>> $125; //@line 1066
     $129 = $127 >>> 1 & 1; //@line 1068
     $134 = HEAP32[780 + (($117 | $114 | $121 | $125 | $129) + ($127 >>> $129) << 2) >> 2] | 0; //@line 1073
     $138 = (HEAP32[$134 + 4 >> 2] & -8) - $6 | 0; //@line 1077
     $142 = HEAP32[$134 + 16 + (((HEAP32[$134 + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0; //@line 1083
     if (!$142) {
      $$0192$lcssa$i = $134; //@line 1086
      $$0193$lcssa$i = $138; //@line 1086
     } else {
      $$01928$i = $134; //@line 1088
      $$01937$i = $138; //@line 1088
      $145 = $142; //@line 1088
      while (1) {
       $148 = (HEAP32[$145 + 4 >> 2] & -8) - $6 | 0; //@line 1093
       $149 = $148 >>> 0 < $$01937$i >>> 0; //@line 1094
       $$$0193$i = $149 ? $148 : $$01937$i; //@line 1095
       $$$0192$i = $149 ? $145 : $$01928$i; //@line 1096
       $145 = HEAP32[$145 + 16 + (((HEAP32[$145 + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0; //@line 1102
       if (!$145) {
        $$0192$lcssa$i = $$$0192$i; //@line 1105
        $$0193$lcssa$i = $$$0193$i; //@line 1105
        break;
       } else {
        $$01928$i = $$$0192$i; //@line 1108
        $$01937$i = $$$0193$i; //@line 1108
       }
      }
     }
     $155 = HEAP32[123] | 0; //@line 1112
     if ($$0192$lcssa$i >>> 0 < $155 >>> 0) {
      _abort(); //@line 1115
     }
     $157 = $$0192$lcssa$i + $6 | 0; //@line 1118
     if ($$0192$lcssa$i >>> 0 >= $157 >>> 0) {
      _abort(); //@line 1121
     }
     $160 = HEAP32[$$0192$lcssa$i + 24 >> 2] | 0; //@line 1125
     $162 = HEAP32[$$0192$lcssa$i + 12 >> 2] | 0; //@line 1127
     do {
      if (($162 | 0) == ($$0192$lcssa$i | 0)) {
       $173 = $$0192$lcssa$i + 20 | 0; //@line 1131
       $174 = HEAP32[$173 >> 2] | 0; //@line 1132
       if (!$174) {
        $176 = $$0192$lcssa$i + 16 | 0; //@line 1135
        $177 = HEAP32[$176 >> 2] | 0; //@line 1136
        if (!$177) {
         $$3$i = 0; //@line 1139
         break;
        } else {
         $$1196$i = $177; //@line 1142
         $$1198$i = $176; //@line 1142
        }
       } else {
        $$1196$i = $174; //@line 1145
        $$1198$i = $173; //@line 1145
       }
       while (1) {
        $179 = $$1196$i + 20 | 0; //@line 1148
        $180 = HEAP32[$179 >> 2] | 0; //@line 1149
        if ($180 | 0) {
         $$1196$i = $180; //@line 1152
         $$1198$i = $179; //@line 1152
         continue;
        }
        $182 = $$1196$i + 16 | 0; //@line 1155
        $183 = HEAP32[$182 >> 2] | 0; //@line 1156
        if (!$183) {
         break;
        } else {
         $$1196$i = $183; //@line 1161
         $$1198$i = $182; //@line 1161
        }
       }
       if ($$1198$i >>> 0 < $155 >>> 0) {
        _abort(); //@line 1166
       } else {
        HEAP32[$$1198$i >> 2] = 0; //@line 1169
        $$3$i = $$1196$i; //@line 1170
        break;
       }
      } else {
       $165 = HEAP32[$$0192$lcssa$i + 8 >> 2] | 0; //@line 1175
       if ($165 >>> 0 < $155 >>> 0) {
        _abort(); //@line 1178
       }
       $167 = $165 + 12 | 0; //@line 1181
       if ((HEAP32[$167 >> 2] | 0) != ($$0192$lcssa$i | 0)) {
        _abort(); //@line 1185
       }
       $170 = $162 + 8 | 0; //@line 1188
       if ((HEAP32[$170 >> 2] | 0) == ($$0192$lcssa$i | 0)) {
        HEAP32[$167 >> 2] = $162; //@line 1192
        HEAP32[$170 >> 2] = $165; //@line 1193
        $$3$i = $162; //@line 1194
        break;
       } else {
        _abort(); //@line 1197
       }
      }
     } while (0);
     L73 : do {
      if ($160 | 0) {
       $188 = HEAP32[$$0192$lcssa$i + 28 >> 2] | 0; //@line 1206
       $189 = 780 + ($188 << 2) | 0; //@line 1207
       do {
        if (($$0192$lcssa$i | 0) == (HEAP32[$189 >> 2] | 0)) {
         HEAP32[$189 >> 2] = $$3$i; //@line 1212
         if (!$$3$i) {
          HEAP32[120] = $108 & ~(1 << $188); //@line 1218
          break L73;
         }
        } else {
         if ($160 >>> 0 < (HEAP32[123] | 0) >>> 0) {
          _abort(); //@line 1225
         } else {
          HEAP32[$160 + 16 + (((HEAP32[$160 + 16 >> 2] | 0) != ($$0192$lcssa$i | 0) & 1) << 2) >> 2] = $$3$i; //@line 1233
          if (!$$3$i) {
           break L73;
          } else {
           break;
          }
         }
        }
       } while (0);
       $201 = HEAP32[123] | 0; //@line 1243
       if ($$3$i >>> 0 < $201 >>> 0) {
        _abort(); //@line 1246
       }
       HEAP32[$$3$i + 24 >> 2] = $160; //@line 1250
       $205 = HEAP32[$$0192$lcssa$i + 16 >> 2] | 0; //@line 1252
       do {
        if ($205 | 0) {
         if ($205 >>> 0 < $201 >>> 0) {
          _abort(); //@line 1258
         } else {
          HEAP32[$$3$i + 16 >> 2] = $205; //@line 1262
          HEAP32[$205 + 24 >> 2] = $$3$i; //@line 1264
          break;
         }
        }
       } while (0);
       $211 = HEAP32[$$0192$lcssa$i + 20 >> 2] | 0; //@line 1270
       if ($211 | 0) {
        if ($211 >>> 0 < (HEAP32[123] | 0) >>> 0) {
         _abort(); //@line 1276
        } else {
         HEAP32[$$3$i + 20 >> 2] = $211; //@line 1280
         HEAP32[$211 + 24 >> 2] = $$3$i; //@line 1282
         break;
        }
       }
      }
     } while (0);
     if ($$0193$lcssa$i >>> 0 < 16) {
      $218 = $$0193$lcssa$i + $6 | 0; //@line 1290
      HEAP32[$$0192$lcssa$i + 4 >> 2] = $218 | 3; //@line 1293
      $222 = $$0192$lcssa$i + $218 + 4 | 0; //@line 1295
      HEAP32[$222 >> 2] = HEAP32[$222 >> 2] | 1; //@line 1298
     } else {
      HEAP32[$$0192$lcssa$i + 4 >> 2] = $6 | 3; //@line 1302
      HEAP32[$157 + 4 >> 2] = $$0193$lcssa$i | 1; //@line 1305
      HEAP32[$157 + $$0193$lcssa$i >> 2] = $$0193$lcssa$i; //@line 1307
      if ($37 | 0) {
       $231 = HEAP32[124] | 0; //@line 1310
       $232 = $37 >>> 3; //@line 1311
       $234 = 516 + ($232 << 1 << 2) | 0; //@line 1313
       $235 = 1 << $232; //@line 1314
       if (!($8 & $235)) {
        HEAP32[119] = $8 | $235; //@line 1319
        $$0189$i = $234; //@line 1321
        $$pre$phi$iZ2D = $234 + 8 | 0; //@line 1321
       } else {
        $239 = $234 + 8 | 0; //@line 1323
        $240 = HEAP32[$239 >> 2] | 0; //@line 1324
        if ($240 >>> 0 < (HEAP32[123] | 0) >>> 0) {
         _abort(); //@line 1328
        } else {
         $$0189$i = $240; //@line 1331
         $$pre$phi$iZ2D = $239; //@line 1331
        }
       }
       HEAP32[$$pre$phi$iZ2D >> 2] = $231; //@line 1334
       HEAP32[$$0189$i + 12 >> 2] = $231; //@line 1336
       HEAP32[$231 + 8 >> 2] = $$0189$i; //@line 1338
       HEAP32[$231 + 12 >> 2] = $234; //@line 1340
      }
      HEAP32[121] = $$0193$lcssa$i; //@line 1342
      HEAP32[124] = $157; //@line 1343
     }
     $$0 = $$0192$lcssa$i + 8 | 0; //@line 1346
     STACKTOP = sp; //@line 1347
     return $$0 | 0; //@line 1347
    }
   } else {
    $$0197 = $6; //@line 1350
   }
  } else {
   if ($0 >>> 0 > 4294967231) {
    $$0197 = -1; //@line 1355
   } else {
    $248 = $0 + 11 | 0; //@line 1357
    $249 = $248 & -8; //@line 1358
    $250 = HEAP32[120] | 0; //@line 1359
    if (!$250) {
     $$0197 = $249; //@line 1362
    } else {
     $252 = 0 - $249 | 0; //@line 1364
     $253 = $248 >>> 8; //@line 1365
     if (!$253) {
      $$0358$i = 0; //@line 1368
     } else {
      if ($249 >>> 0 > 16777215) {
       $$0358$i = 31; //@line 1372
      } else {
       $258 = ($253 + 1048320 | 0) >>> 16 & 8; //@line 1376
       $259 = $253 << $258; //@line 1377
       $262 = ($259 + 520192 | 0) >>> 16 & 4; //@line 1380
       $264 = $259 << $262; //@line 1382
       $267 = ($264 + 245760 | 0) >>> 16 & 2; //@line 1385
       $272 = 14 - ($262 | $258 | $267) + ($264 << $267 >>> 15) | 0; //@line 1390
       $$0358$i = $249 >>> ($272 + 7 | 0) & 1 | $272 << 1; //@line 1396
      }
     }
     $279 = HEAP32[780 + ($$0358$i << 2) >> 2] | 0; //@line 1400
     L117 : do {
      if (!$279) {
       $$2355$i = 0; //@line 1404
       $$3$i201 = 0; //@line 1404
       $$3350$i = $252; //@line 1404
       label = 81; //@line 1405
      } else {
       $$0342$i = 0; //@line 1412
       $$0347$i = $252; //@line 1412
       $$0353$i = $279; //@line 1412
       $$0359$i = $249 << (($$0358$i | 0) == 31 ? 0 : 25 - ($$0358$i >>> 1) | 0); //@line 1412
       $$0362$i = 0; //@line 1412
       while (1) {
        $289 = (HEAP32[$$0353$i + 4 >> 2] & -8) - $249 | 0; //@line 1417
        if ($289 >>> 0 < $$0347$i >>> 0) {
         if (!$289) {
          $$415$i = $$0353$i; //@line 1422
          $$435114$i = 0; //@line 1422
          $$435713$i = $$0353$i; //@line 1422
          label = 85; //@line 1423
          break L117;
         } else {
          $$1343$i = $$0353$i; //@line 1426
          $$1348$i = $289; //@line 1426
         }
        } else {
         $$1343$i = $$0342$i; //@line 1429
         $$1348$i = $$0347$i; //@line 1429
        }
        $293 = HEAP32[$$0353$i + 20 >> 2] | 0; //@line 1432
        $$0353$i = HEAP32[$$0353$i + 16 + ($$0359$i >>> 31 << 2) >> 2] | 0; //@line 1435
        $$1363$i = ($293 | 0) == 0 | ($293 | 0) == ($$0353$i | 0) ? $$0362$i : $293; //@line 1439
        $299 = ($$0353$i | 0) == 0; //@line 1440
        if ($299) {
         $$2355$i = $$1363$i; //@line 1445
         $$3$i201 = $$1343$i; //@line 1445
         $$3350$i = $$1348$i; //@line 1445
         label = 81; //@line 1446
         break;
        } else {
         $$0342$i = $$1343$i; //@line 1449
         $$0347$i = $$1348$i; //@line 1449
         $$0359$i = $$0359$i << (($299 ^ 1) & 1); //@line 1449
         $$0362$i = $$1363$i; //@line 1449
        }
       }
      }
     } while (0);
     if ((label | 0) == 81) {
      if (($$2355$i | 0) == 0 & ($$3$i201 | 0) == 0) {
       $303 = 2 << $$0358$i; //@line 1459
       $306 = $250 & ($303 | 0 - $303); //@line 1462
       if (!$306) {
        $$0197 = $249; //@line 1465
        break;
       }
       $310 = ($306 & 0 - $306) + -1 | 0; //@line 1470
       $312 = $310 >>> 12 & 16; //@line 1472
       $313 = $310 >>> $312; //@line 1473
       $315 = $313 >>> 5 & 8; //@line 1475
       $317 = $313 >>> $315; //@line 1477
       $319 = $317 >>> 2 & 4; //@line 1479
       $321 = $317 >>> $319; //@line 1481
       $323 = $321 >>> 1 & 2; //@line 1483
       $325 = $321 >>> $323; //@line 1485
       $327 = $325 >>> 1 & 1; //@line 1487
       $$4$ph$i = 0; //@line 1493
       $$4357$ph$i = HEAP32[780 + (($315 | $312 | $319 | $323 | $327) + ($325 >>> $327) << 2) >> 2] | 0; //@line 1493
      } else {
       $$4$ph$i = $$3$i201; //@line 1495
       $$4357$ph$i = $$2355$i; //@line 1495
      }
      if (!$$4357$ph$i) {
       $$4$lcssa$i = $$4$ph$i; //@line 1499
       $$4351$lcssa$i = $$3350$i; //@line 1499
      } else {
       $$415$i = $$4$ph$i; //@line 1501
       $$435114$i = $$3350$i; //@line 1501
       $$435713$i = $$4357$ph$i; //@line 1501
       label = 85; //@line 1502
      }
     }
     if ((label | 0) == 85) {
      while (1) {
       label = 0; //@line 1507
       $337 = (HEAP32[$$435713$i + 4 >> 2] & -8) - $249 | 0; //@line 1511
       $338 = $337 >>> 0 < $$435114$i >>> 0; //@line 1512
       $$$4351$i = $338 ? $337 : $$435114$i; //@line 1513
       $$4357$$4$i = $338 ? $$435713$i : $$415$i; //@line 1514
       $$435713$i = HEAP32[$$435713$i + 16 + (((HEAP32[$$435713$i + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0; //@line 1520
       if (!$$435713$i) {
        $$4$lcssa$i = $$4357$$4$i; //@line 1523
        $$4351$lcssa$i = $$$4351$i; //@line 1523
        break;
       } else {
        $$415$i = $$4357$$4$i; //@line 1526
        $$435114$i = $$$4351$i; //@line 1526
        label = 85; //@line 1527
       }
      }
     }
     if (!$$4$lcssa$i) {
      $$0197 = $249; //@line 1533
     } else {
      if ($$4351$lcssa$i >>> 0 < ((HEAP32[121] | 0) - $249 | 0) >>> 0) {
       $348 = HEAP32[123] | 0; //@line 1539
       if ($$4$lcssa$i >>> 0 < $348 >>> 0) {
        _abort(); //@line 1542
       }
       $350 = $$4$lcssa$i + $249 | 0; //@line 1545
       if ($$4$lcssa$i >>> 0 >= $350 >>> 0) {
        _abort(); //@line 1548
       }
       $353 = HEAP32[$$4$lcssa$i + 24 >> 2] | 0; //@line 1552
       $355 = HEAP32[$$4$lcssa$i + 12 >> 2] | 0; //@line 1554
       do {
        if (($355 | 0) == ($$4$lcssa$i | 0)) {
         $366 = $$4$lcssa$i + 20 | 0; //@line 1558
         $367 = HEAP32[$366 >> 2] | 0; //@line 1559
         if (!$367) {
          $369 = $$4$lcssa$i + 16 | 0; //@line 1562
          $370 = HEAP32[$369 >> 2] | 0; //@line 1563
          if (!$370) {
           $$3372$i = 0; //@line 1566
           break;
          } else {
           $$1370$i = $370; //@line 1569
           $$1374$i = $369; //@line 1569
          }
         } else {
          $$1370$i = $367; //@line 1572
          $$1374$i = $366; //@line 1572
         }
         while (1) {
          $372 = $$1370$i + 20 | 0; //@line 1575
          $373 = HEAP32[$372 >> 2] | 0; //@line 1576
          if ($373 | 0) {
           $$1370$i = $373; //@line 1579
           $$1374$i = $372; //@line 1579
           continue;
          }
          $375 = $$1370$i + 16 | 0; //@line 1582
          $376 = HEAP32[$375 >> 2] | 0; //@line 1583
          if (!$376) {
           break;
          } else {
           $$1370$i = $376; //@line 1588
           $$1374$i = $375; //@line 1588
          }
         }
         if ($$1374$i >>> 0 < $348 >>> 0) {
          _abort(); //@line 1593
         } else {
          HEAP32[$$1374$i >> 2] = 0; //@line 1596
          $$3372$i = $$1370$i; //@line 1597
          break;
         }
        } else {
         $358 = HEAP32[$$4$lcssa$i + 8 >> 2] | 0; //@line 1602
         if ($358 >>> 0 < $348 >>> 0) {
          _abort(); //@line 1605
         }
         $360 = $358 + 12 | 0; //@line 1608
         if ((HEAP32[$360 >> 2] | 0) != ($$4$lcssa$i | 0)) {
          _abort(); //@line 1612
         }
         $363 = $355 + 8 | 0; //@line 1615
         if ((HEAP32[$363 >> 2] | 0) == ($$4$lcssa$i | 0)) {
          HEAP32[$360 >> 2] = $355; //@line 1619
          HEAP32[$363 >> 2] = $358; //@line 1620
          $$3372$i = $355; //@line 1621
          break;
         } else {
          _abort(); //@line 1624
         }
        }
       } while (0);
       L164 : do {
        if (!$353) {
         $470 = $250; //@line 1632
        } else {
         $381 = HEAP32[$$4$lcssa$i + 28 >> 2] | 0; //@line 1635
         $382 = 780 + ($381 << 2) | 0; //@line 1636
         do {
          if (($$4$lcssa$i | 0) == (HEAP32[$382 >> 2] | 0)) {
           HEAP32[$382 >> 2] = $$3372$i; //@line 1641
           if (!$$3372$i) {
            $387 = $250 & ~(1 << $381); //@line 1646
            HEAP32[120] = $387; //@line 1647
            $470 = $387; //@line 1648
            break L164;
           }
          } else {
           if ($353 >>> 0 < (HEAP32[123] | 0) >>> 0) {
            _abort(); //@line 1655
           } else {
            HEAP32[$353 + 16 + (((HEAP32[$353 + 16 >> 2] | 0) != ($$4$lcssa$i | 0) & 1) << 2) >> 2] = $$3372$i; //@line 1663
            if (!$$3372$i) {
             $470 = $250; //@line 1666
             break L164;
            } else {
             break;
            }
           }
          }
         } while (0);
         $394 = HEAP32[123] | 0; //@line 1674
         if ($$3372$i >>> 0 < $394 >>> 0) {
          _abort(); //@line 1677
         }
         HEAP32[$$3372$i + 24 >> 2] = $353; //@line 1681
         $398 = HEAP32[$$4$lcssa$i + 16 >> 2] | 0; //@line 1683
         do {
          if ($398 | 0) {
           if ($398 >>> 0 < $394 >>> 0) {
            _abort(); //@line 1689
           } else {
            HEAP32[$$3372$i + 16 >> 2] = $398; //@line 1693
            HEAP32[$398 + 24 >> 2] = $$3372$i; //@line 1695
            break;
           }
          }
         } while (0);
         $404 = HEAP32[$$4$lcssa$i + 20 >> 2] | 0; //@line 1701
         if (!$404) {
          $470 = $250; //@line 1704
         } else {
          if ($404 >>> 0 < (HEAP32[123] | 0) >>> 0) {
           _abort(); //@line 1709
          } else {
           HEAP32[$$3372$i + 20 >> 2] = $404; //@line 1713
           HEAP32[$404 + 24 >> 2] = $$3372$i; //@line 1715
           $470 = $250; //@line 1716
           break;
          }
         }
        }
       } while (0);
       do {
        if ($$4351$lcssa$i >>> 0 < 16) {
         $411 = $$4351$lcssa$i + $249 | 0; //@line 1725
         HEAP32[$$4$lcssa$i + 4 >> 2] = $411 | 3; //@line 1728
         $415 = $$4$lcssa$i + $411 + 4 | 0; //@line 1730
         HEAP32[$415 >> 2] = HEAP32[$415 >> 2] | 1; //@line 1733
        } else {
         HEAP32[$$4$lcssa$i + 4 >> 2] = $249 | 3; //@line 1737
         HEAP32[$350 + 4 >> 2] = $$4351$lcssa$i | 1; //@line 1740
         HEAP32[$350 + $$4351$lcssa$i >> 2] = $$4351$lcssa$i; //@line 1742
         $423 = $$4351$lcssa$i >>> 3; //@line 1743
         if ($$4351$lcssa$i >>> 0 < 256) {
          $426 = 516 + ($423 << 1 << 2) | 0; //@line 1747
          $427 = HEAP32[119] | 0; //@line 1748
          $428 = 1 << $423; //@line 1749
          if (!($427 & $428)) {
           HEAP32[119] = $427 | $428; //@line 1754
           $$0368$i = $426; //@line 1756
           $$pre$phi$i211Z2D = $426 + 8 | 0; //@line 1756
          } else {
           $432 = $426 + 8 | 0; //@line 1758
           $433 = HEAP32[$432 >> 2] | 0; //@line 1759
           if ($433 >>> 0 < (HEAP32[123] | 0) >>> 0) {
            _abort(); //@line 1763
           } else {
            $$0368$i = $433; //@line 1766
            $$pre$phi$i211Z2D = $432; //@line 1766
           }
          }
          HEAP32[$$pre$phi$i211Z2D >> 2] = $350; //@line 1769
          HEAP32[$$0368$i + 12 >> 2] = $350; //@line 1771
          HEAP32[$350 + 8 >> 2] = $$0368$i; //@line 1773
          HEAP32[$350 + 12 >> 2] = $426; //@line 1775
          break;
         }
         $439 = $$4351$lcssa$i >>> 8; //@line 1778
         if (!$439) {
          $$0361$i = 0; //@line 1781
         } else {
          if ($$4351$lcssa$i >>> 0 > 16777215) {
           $$0361$i = 31; //@line 1785
          } else {
           $444 = ($439 + 1048320 | 0) >>> 16 & 8; //@line 1789
           $445 = $439 << $444; //@line 1790
           $448 = ($445 + 520192 | 0) >>> 16 & 4; //@line 1793
           $450 = $445 << $448; //@line 1795
           $453 = ($450 + 245760 | 0) >>> 16 & 2; //@line 1798
           $458 = 14 - ($448 | $444 | $453) + ($450 << $453 >>> 15) | 0; //@line 1803
           $$0361$i = $$4351$lcssa$i >>> ($458 + 7 | 0) & 1 | $458 << 1; //@line 1809
          }
         }
         $464 = 780 + ($$0361$i << 2) | 0; //@line 1812
         HEAP32[$350 + 28 >> 2] = $$0361$i; //@line 1814
         $466 = $350 + 16 | 0; //@line 1815
         HEAP32[$466 + 4 >> 2] = 0; //@line 1817
         HEAP32[$466 >> 2] = 0; //@line 1818
         $468 = 1 << $$0361$i; //@line 1819
         if (!($470 & $468)) {
          HEAP32[120] = $470 | $468; //@line 1824
          HEAP32[$464 >> 2] = $350; //@line 1825
          HEAP32[$350 + 24 >> 2] = $464; //@line 1827
          HEAP32[$350 + 12 >> 2] = $350; //@line 1829
          HEAP32[$350 + 8 >> 2] = $350; //@line 1831
          break;
         }
         $$0344$i = $$4351$lcssa$i << (($$0361$i | 0) == 31 ? 0 : 25 - ($$0361$i >>> 1) | 0); //@line 1840
         $$0345$i = HEAP32[$464 >> 2] | 0; //@line 1840
         while (1) {
          if ((HEAP32[$$0345$i + 4 >> 2] & -8 | 0) == ($$4351$lcssa$i | 0)) {
           label = 139; //@line 1847
           break;
          }
          $487 = $$0345$i + 16 + ($$0344$i >>> 31 << 2) | 0; //@line 1851
          $489 = HEAP32[$487 >> 2] | 0; //@line 1853
          if (!$489) {
           label = 136; //@line 1856
           break;
          } else {
           $$0344$i = $$0344$i << 1; //@line 1859
           $$0345$i = $489; //@line 1859
          }
         }
         if ((label | 0) == 136) {
          if ($487 >>> 0 < (HEAP32[123] | 0) >>> 0) {
           _abort(); //@line 1866
          } else {
           HEAP32[$487 >> 2] = $350; //@line 1869
           HEAP32[$350 + 24 >> 2] = $$0345$i; //@line 1871
           HEAP32[$350 + 12 >> 2] = $350; //@line 1873
           HEAP32[$350 + 8 >> 2] = $350; //@line 1875
           break;
          }
         } else if ((label | 0) == 139) {
          $496 = $$0345$i + 8 | 0; //@line 1880
          $497 = HEAP32[$496 >> 2] | 0; //@line 1881
          $498 = HEAP32[123] | 0; //@line 1882
          if ($497 >>> 0 >= $498 >>> 0 & $$0345$i >>> 0 >= $498 >>> 0) {
           HEAP32[$497 + 12 >> 2] = $350; //@line 1888
           HEAP32[$496 >> 2] = $350; //@line 1889
           HEAP32[$350 + 8 >> 2] = $497; //@line 1891
           HEAP32[$350 + 12 >> 2] = $$0345$i; //@line 1893
           HEAP32[$350 + 24 >> 2] = 0; //@line 1895
           break;
          } else {
           _abort(); //@line 1898
          }
         }
        }
       } while (0);
       $$0 = $$4$lcssa$i + 8 | 0; //@line 1905
       STACKTOP = sp; //@line 1906
       return $$0 | 0; //@line 1906
      } else {
       $$0197 = $249; //@line 1908
      }
     }
    }
   }
  }
 } while (0);
 $506 = HEAP32[121] | 0; //@line 1915
 if ($506 >>> 0 >= $$0197 >>> 0) {
  $508 = $506 - $$0197 | 0; //@line 1918
  $509 = HEAP32[124] | 0; //@line 1919
  if ($508 >>> 0 > 15) {
   $511 = $509 + $$0197 | 0; //@line 1922
   HEAP32[124] = $511; //@line 1923
   HEAP32[121] = $508; //@line 1924
   HEAP32[$511 + 4 >> 2] = $508 | 1; //@line 1927
   HEAP32[$511 + $508 >> 2] = $508; //@line 1929
   HEAP32[$509 + 4 >> 2] = $$0197 | 3; //@line 1932
  } else {
   HEAP32[121] = 0; //@line 1934
   HEAP32[124] = 0; //@line 1935
   HEAP32[$509 + 4 >> 2] = $506 | 3; //@line 1938
   $520 = $509 + $506 + 4 | 0; //@line 1940
   HEAP32[$520 >> 2] = HEAP32[$520 >> 2] | 1; //@line 1943
  }
  $$0 = $509 + 8 | 0; //@line 1946
  STACKTOP = sp; //@line 1947
  return $$0 | 0; //@line 1947
 }
 $524 = HEAP32[122] | 0; //@line 1949
 if ($524 >>> 0 > $$0197 >>> 0) {
  $526 = $524 - $$0197 | 0; //@line 1952
  HEAP32[122] = $526; //@line 1953
  $527 = HEAP32[125] | 0; //@line 1954
  $528 = $527 + $$0197 | 0; //@line 1955
  HEAP32[125] = $528; //@line 1956
  HEAP32[$528 + 4 >> 2] = $526 | 1; //@line 1959
  HEAP32[$527 + 4 >> 2] = $$0197 | 3; //@line 1962
  $$0 = $527 + 8 | 0; //@line 1964
  STACKTOP = sp; //@line 1965
  return $$0 | 0; //@line 1965
 }
 if (!(HEAP32[237] | 0)) {
  HEAP32[239] = 4096; //@line 1970
  HEAP32[238] = 4096; //@line 1971
  HEAP32[240] = -1; //@line 1972
  HEAP32[241] = -1; //@line 1973
  HEAP32[242] = 0; //@line 1974
  HEAP32[230] = 0; //@line 1975
  $538 = $1 & -16 ^ 1431655768; //@line 1978
  HEAP32[$1 >> 2] = $538; //@line 1979
  HEAP32[237] = $538; //@line 1980
  $542 = 4096; //@line 1981
 } else {
  $542 = HEAP32[239] | 0; //@line 1984
 }
 $539 = $$0197 + 48 | 0; //@line 1986
 $540 = $$0197 + 47 | 0; //@line 1987
 $541 = $542 + $540 | 0; //@line 1988
 $543 = 0 - $542 | 0; //@line 1989
 $544 = $541 & $543; //@line 1990
 if ($544 >>> 0 <= $$0197 >>> 0) {
  $$0 = 0; //@line 1993
  STACKTOP = sp; //@line 1994
  return $$0 | 0; //@line 1994
 }
 $546 = HEAP32[229] | 0; //@line 1996
 if ($546 | 0) {
  $548 = HEAP32[227] | 0; //@line 1999
  $549 = $548 + $544 | 0; //@line 2000
  if ($549 >>> 0 <= $548 >>> 0 | $549 >>> 0 > $546 >>> 0) {
   $$0 = 0; //@line 2005
   STACKTOP = sp; //@line 2006
   return $$0 | 0; //@line 2006
  }
 }
 L244 : do {
  if (!(HEAP32[230] & 4)) {
   $555 = HEAP32[125] | 0; //@line 2014
   L246 : do {
    if (!$555) {
     label = 163; //@line 2018
    } else {
     $$0$i$i = 924; //@line 2020
     while (1) {
      $557 = HEAP32[$$0$i$i >> 2] | 0; //@line 2022
      if ($557 >>> 0 <= $555 >>> 0) {
       $559 = $$0$i$i + 4 | 0; //@line 2025
       if (($557 + (HEAP32[$559 >> 2] | 0) | 0) >>> 0 > $555 >>> 0) {
        break;
       }
      }
      $564 = HEAP32[$$0$i$i + 8 >> 2] | 0; //@line 2034
      if (!$564) {
       label = 163; //@line 2037
       break L246;
      } else {
       $$0$i$i = $564; //@line 2040
      }
     }
     $589 = $541 - $524 & $543; //@line 2044
     if ($589 >>> 0 < 2147483647) {
      $591 = _sbrk($589 | 0) | 0; //@line 2047
      if (($591 | 0) == ((HEAP32[$$0$i$i >> 2] | 0) + (HEAP32[$559 >> 2] | 0) | 0)) {
       if (($591 | 0) == (-1 | 0)) {
        $$2234253237$i = $589; //@line 2055
       } else {
        $$723948$i = $589; //@line 2057
        $$749$i = $591; //@line 2057
        label = 180; //@line 2058
        break L244;
       }
      } else {
       $$2247$ph$i = $591; //@line 2062
       $$2253$ph$i = $589; //@line 2062
       label = 171; //@line 2063
      }
     } else {
      $$2234253237$i = 0; //@line 2066
     }
    }
   } while (0);
   do {
    if ((label | 0) == 163) {
     $566 = _sbrk(0) | 0; //@line 2072
     if (($566 | 0) == (-1 | 0)) {
      $$2234253237$i = 0; //@line 2075
     } else {
      $568 = $566; //@line 2077
      $569 = HEAP32[238] | 0; //@line 2078
      $570 = $569 + -1 | 0; //@line 2079
      $$$i = (($570 & $568 | 0) == 0 ? 0 : ($570 + $568 & 0 - $569) - $568 | 0) + $544 | 0; //@line 2087
      $578 = HEAP32[227] | 0; //@line 2088
      $579 = $$$i + $578 | 0; //@line 2089
      if ($$$i >>> 0 > $$0197 >>> 0 & $$$i >>> 0 < 2147483647) {
       $582 = HEAP32[229] | 0; //@line 2094
       if ($582 | 0) {
        if ($579 >>> 0 <= $578 >>> 0 | $579 >>> 0 > $582 >>> 0) {
         $$2234253237$i = 0; //@line 2101
         break;
        }
       }
       $586 = _sbrk($$$i | 0) | 0; //@line 2105
       if (($586 | 0) == ($566 | 0)) {
        $$723948$i = $$$i; //@line 2108
        $$749$i = $566; //@line 2108
        label = 180; //@line 2109
        break L244;
       } else {
        $$2247$ph$i = $586; //@line 2112
        $$2253$ph$i = $$$i; //@line 2112
        label = 171; //@line 2113
       }
      } else {
       $$2234253237$i = 0; //@line 2116
      }
     }
    }
   } while (0);
   do {
    if ((label | 0) == 171) {
     $597 = 0 - $$2253$ph$i | 0; //@line 2123
     if (!($539 >>> 0 > $$2253$ph$i >>> 0 & ($$2253$ph$i >>> 0 < 2147483647 & ($$2247$ph$i | 0) != (-1 | 0)))) {
      if (($$2247$ph$i | 0) == (-1 | 0)) {
       $$2234253237$i = 0; //@line 2132
       break;
      } else {
       $$723948$i = $$2253$ph$i; //@line 2135
       $$749$i = $$2247$ph$i; //@line 2135
       label = 180; //@line 2136
       break L244;
      }
     }
     $601 = HEAP32[239] | 0; //@line 2140
     $605 = $540 - $$2253$ph$i + $601 & 0 - $601; //@line 2144
     if ($605 >>> 0 >= 2147483647) {
      $$723948$i = $$2253$ph$i; //@line 2147
      $$749$i = $$2247$ph$i; //@line 2147
      label = 180; //@line 2148
      break L244;
     }
     if ((_sbrk($605 | 0) | 0) == (-1 | 0)) {
      _sbrk($597 | 0) | 0; //@line 2154
      $$2234253237$i = 0; //@line 2155
      break;
     } else {
      $$723948$i = $605 + $$2253$ph$i | 0; //@line 2159
      $$749$i = $$2247$ph$i; //@line 2159
      label = 180; //@line 2160
      break L244;
     }
    }
   } while (0);
   HEAP32[230] = HEAP32[230] | 4; //@line 2167
   $$4236$i = $$2234253237$i; //@line 2168
   label = 178; //@line 2169
  } else {
   $$4236$i = 0; //@line 2171
   label = 178; //@line 2172
  }
 } while (0);
 if ((label | 0) == 178) {
  if ($544 >>> 0 < 2147483647) {
   $614 = _sbrk($544 | 0) | 0; //@line 2178
   $615 = _sbrk(0) | 0; //@line 2179
   $621 = $615 - $614 | 0; //@line 2187
   $623 = $621 >>> 0 > ($$0197 + 40 | 0) >>> 0; //@line 2189
   if (!(($614 | 0) == (-1 | 0) | $623 ^ 1 | $614 >>> 0 < $615 >>> 0 & (($614 | 0) != (-1 | 0) & ($615 | 0) != (-1 | 0)) ^ 1)) {
    $$723948$i = $623 ? $621 : $$4236$i; //@line 2197
    $$749$i = $614; //@line 2197
    label = 180; //@line 2198
   }
  }
 }
 if ((label | 0) == 180) {
  $627 = (HEAP32[227] | 0) + $$723948$i | 0; //@line 2204
  HEAP32[227] = $627; //@line 2205
  if ($627 >>> 0 > (HEAP32[228] | 0) >>> 0) {
   HEAP32[228] = $627; //@line 2209
  }
  $630 = HEAP32[125] | 0; //@line 2211
  do {
   if (!$630) {
    $632 = HEAP32[123] | 0; //@line 2215
    if (($632 | 0) == 0 | $$749$i >>> 0 < $632 >>> 0) {
     HEAP32[123] = $$749$i; //@line 2220
    }
    HEAP32[231] = $$749$i; //@line 2222
    HEAP32[232] = $$723948$i; //@line 2223
    HEAP32[234] = 0; //@line 2224
    HEAP32[128] = HEAP32[237]; //@line 2226
    HEAP32[127] = -1; //@line 2227
    $$01$i$i = 0; //@line 2228
    do {
     $637 = 516 + ($$01$i$i << 1 << 2) | 0; //@line 2231
     HEAP32[$637 + 12 >> 2] = $637; //@line 2233
     HEAP32[$637 + 8 >> 2] = $637; //@line 2235
     $$01$i$i = $$01$i$i + 1 | 0; //@line 2236
    } while (($$01$i$i | 0) != 32);
    $643 = $$749$i + 8 | 0; //@line 2246
    $648 = ($643 & 7 | 0) == 0 ? 0 : 0 - $643 & 7; //@line 2251
    $649 = $$749$i + $648 | 0; //@line 2252
    $650 = $$723948$i + -40 - $648 | 0; //@line 2253
    HEAP32[125] = $649; //@line 2254
    HEAP32[122] = $650; //@line 2255
    HEAP32[$649 + 4 >> 2] = $650 | 1; //@line 2258
    HEAP32[$649 + $650 + 4 >> 2] = 40; //@line 2261
    HEAP32[126] = HEAP32[241]; //@line 2263
   } else {
    $$024371$i = 924; //@line 2265
    while (1) {
     $656 = HEAP32[$$024371$i >> 2] | 0; //@line 2267
     $657 = $$024371$i + 4 | 0; //@line 2268
     $658 = HEAP32[$657 >> 2] | 0; //@line 2269
     if (($$749$i | 0) == ($656 + $658 | 0)) {
      label = 190; //@line 2273
      break;
     }
     $662 = HEAP32[$$024371$i + 8 >> 2] | 0; //@line 2277
     if (!$662) {
      break;
     } else {
      $$024371$i = $662; //@line 2282
     }
    }
    if ((label | 0) == 190) {
     if (!(HEAP32[$$024371$i + 12 >> 2] & 8)) {
      if ($630 >>> 0 < $$749$i >>> 0 & $630 >>> 0 >= $656 >>> 0) {
       HEAP32[$657 >> 2] = $658 + $$723948$i; //@line 2296
       $673 = $630 + 8 | 0; //@line 2299
       $678 = ($673 & 7 | 0) == 0 ? 0 : 0 - $673 & 7; //@line 2304
       $679 = $630 + $678 | 0; //@line 2305
       $681 = (HEAP32[122] | 0) + ($$723948$i - $678) | 0; //@line 2307
       HEAP32[125] = $679; //@line 2308
       HEAP32[122] = $681; //@line 2309
       HEAP32[$679 + 4 >> 2] = $681 | 1; //@line 2312
       HEAP32[$679 + $681 + 4 >> 2] = 40; //@line 2315
       HEAP32[126] = HEAP32[241]; //@line 2317
       break;
      }
     }
    }
    $687 = HEAP32[123] | 0; //@line 2322
    if ($$749$i >>> 0 < $687 >>> 0) {
     HEAP32[123] = $$749$i; //@line 2325
     $752 = $$749$i; //@line 2326
    } else {
     $752 = $687; //@line 2328
    }
    $689 = $$749$i + $$723948$i | 0; //@line 2330
    $$124470$i = 924; //@line 2331
    while (1) {
     if ((HEAP32[$$124470$i >> 2] | 0) == ($689 | 0)) {
      label = 198; //@line 2336
      break;
     }
     $693 = HEAP32[$$124470$i + 8 >> 2] | 0; //@line 2340
     if (!$693) {
      break;
     } else {
      $$124470$i = $693; //@line 2345
     }
    }
    if ((label | 0) == 198) {
     if (!(HEAP32[$$124470$i + 12 >> 2] & 8)) {
      HEAP32[$$124470$i >> 2] = $$749$i; //@line 2354
      $699 = $$124470$i + 4 | 0; //@line 2355
      HEAP32[$699 >> 2] = (HEAP32[$699 >> 2] | 0) + $$723948$i; //@line 2358
      $703 = $$749$i + 8 | 0; //@line 2360
      $709 = $$749$i + (($703 & 7 | 0) == 0 ? 0 : 0 - $703 & 7) | 0; //@line 2366
      $711 = $689 + 8 | 0; //@line 2368
      $717 = $689 + (($711 & 7 | 0) == 0 ? 0 : 0 - $711 & 7) | 0; //@line 2374
      $721 = $709 + $$0197 | 0; //@line 2378
      $722 = $717 - $709 - $$0197 | 0; //@line 2379
      HEAP32[$709 + 4 >> 2] = $$0197 | 3; //@line 2382
      do {
       if (($717 | 0) == ($630 | 0)) {
        $727 = (HEAP32[122] | 0) + $722 | 0; //@line 2387
        HEAP32[122] = $727; //@line 2388
        HEAP32[125] = $721; //@line 2389
        HEAP32[$721 + 4 >> 2] = $727 | 1; //@line 2392
       } else {
        if (($717 | 0) == (HEAP32[124] | 0)) {
         $733 = (HEAP32[121] | 0) + $722 | 0; //@line 2398
         HEAP32[121] = $733; //@line 2399
         HEAP32[124] = $721; //@line 2400
         HEAP32[$721 + 4 >> 2] = $733 | 1; //@line 2403
         HEAP32[$721 + $733 >> 2] = $733; //@line 2405
         break;
        }
        $738 = HEAP32[$717 + 4 >> 2] | 0; //@line 2409
        if (($738 & 3 | 0) == 1) {
         $741 = $738 & -8; //@line 2413
         $742 = $738 >>> 3; //@line 2414
         L314 : do {
          if ($738 >>> 0 < 256) {
           $745 = HEAP32[$717 + 8 >> 2] | 0; //@line 2419
           $747 = HEAP32[$717 + 12 >> 2] | 0; //@line 2421
           $749 = 516 + ($742 << 1 << 2) | 0; //@line 2423
           do {
            if (($745 | 0) != ($749 | 0)) {
             if ($745 >>> 0 < $752 >>> 0) {
              _abort(); //@line 2429
             }
             if ((HEAP32[$745 + 12 >> 2] | 0) == ($717 | 0)) {
              break;
             }
             _abort(); //@line 2438
            }
           } while (0);
           if (($747 | 0) == ($745 | 0)) {
            HEAP32[119] = HEAP32[119] & ~(1 << $742); //@line 2448
            break;
           }
           do {
            if (($747 | 0) == ($749 | 0)) {
             $$pre$phi11$i$iZ2D = $747 + 8 | 0; //@line 2455
            } else {
             if ($747 >>> 0 < $752 >>> 0) {
              _abort(); //@line 2459
             }
             $763 = $747 + 8 | 0; //@line 2462
             if ((HEAP32[$763 >> 2] | 0) == ($717 | 0)) {
              $$pre$phi11$i$iZ2D = $763; //@line 2466
              break;
             }
             _abort(); //@line 2469
            }
           } while (0);
           HEAP32[$745 + 12 >> 2] = $747; //@line 2474
           HEAP32[$$pre$phi11$i$iZ2D >> 2] = $745; //@line 2475
          } else {
           $768 = HEAP32[$717 + 24 >> 2] | 0; //@line 2478
           $770 = HEAP32[$717 + 12 >> 2] | 0; //@line 2480
           do {
            if (($770 | 0) == ($717 | 0)) {
             $781 = $717 + 16 | 0; //@line 2484
             $782 = $781 + 4 | 0; //@line 2485
             $783 = HEAP32[$782 >> 2] | 0; //@line 2486
             if (!$783) {
              $785 = HEAP32[$781 >> 2] | 0; //@line 2489
              if (!$785) {
               $$3$i$i = 0; //@line 2492
               break;
              } else {
               $$1291$i$i = $785; //@line 2495
               $$1293$i$i = $781; //@line 2495
              }
             } else {
              $$1291$i$i = $783; //@line 2498
              $$1293$i$i = $782; //@line 2498
             }
             while (1) {
              $787 = $$1291$i$i + 20 | 0; //@line 2501
              $788 = HEAP32[$787 >> 2] | 0; //@line 2502
              if ($788 | 0) {
               $$1291$i$i = $788; //@line 2505
               $$1293$i$i = $787; //@line 2505
               continue;
              }
              $790 = $$1291$i$i + 16 | 0; //@line 2508
              $791 = HEAP32[$790 >> 2] | 0; //@line 2509
              if (!$791) {
               break;
              } else {
               $$1291$i$i = $791; //@line 2514
               $$1293$i$i = $790; //@line 2514
              }
             }
             if ($$1293$i$i >>> 0 < $752 >>> 0) {
              _abort(); //@line 2519
             } else {
              HEAP32[$$1293$i$i >> 2] = 0; //@line 2522
              $$3$i$i = $$1291$i$i; //@line 2523
              break;
             }
            } else {
             $773 = HEAP32[$717 + 8 >> 2] | 0; //@line 2528
             if ($773 >>> 0 < $752 >>> 0) {
              _abort(); //@line 2531
             }
             $775 = $773 + 12 | 0; //@line 2534
             if ((HEAP32[$775 >> 2] | 0) != ($717 | 0)) {
              _abort(); //@line 2538
             }
             $778 = $770 + 8 | 0; //@line 2541
             if ((HEAP32[$778 >> 2] | 0) == ($717 | 0)) {
              HEAP32[$775 >> 2] = $770; //@line 2545
              HEAP32[$778 >> 2] = $773; //@line 2546
              $$3$i$i = $770; //@line 2547
              break;
             } else {
              _abort(); //@line 2550
             }
            }
           } while (0);
           if (!$768) {
            break;
           }
           $796 = HEAP32[$717 + 28 >> 2] | 0; //@line 2560
           $797 = 780 + ($796 << 2) | 0; //@line 2561
           do {
            if (($717 | 0) == (HEAP32[$797 >> 2] | 0)) {
             HEAP32[$797 >> 2] = $$3$i$i; //@line 2566
             if ($$3$i$i | 0) {
              break;
             }
             HEAP32[120] = HEAP32[120] & ~(1 << $796); //@line 2575
             break L314;
            } else {
             if ($768 >>> 0 < (HEAP32[123] | 0) >>> 0) {
              _abort(); //@line 2581
             } else {
              HEAP32[$768 + 16 + (((HEAP32[$768 + 16 >> 2] | 0) != ($717 | 0) & 1) << 2) >> 2] = $$3$i$i; //@line 2589
              if (!$$3$i$i) {
               break L314;
              } else {
               break;
              }
             }
            }
           } while (0);
           $810 = HEAP32[123] | 0; //@line 2599
           if ($$3$i$i >>> 0 < $810 >>> 0) {
            _abort(); //@line 2602
           }
           HEAP32[$$3$i$i + 24 >> 2] = $768; //@line 2606
           $813 = $717 + 16 | 0; //@line 2607
           $814 = HEAP32[$813 >> 2] | 0; //@line 2608
           do {
            if ($814 | 0) {
             if ($814 >>> 0 < $810 >>> 0) {
              _abort(); //@line 2614
             } else {
              HEAP32[$$3$i$i + 16 >> 2] = $814; //@line 2618
              HEAP32[$814 + 24 >> 2] = $$3$i$i; //@line 2620
              break;
             }
            }
           } while (0);
           $820 = HEAP32[$813 + 4 >> 2] | 0; //@line 2626
           if (!$820) {
            break;
           }
           if ($820 >>> 0 < (HEAP32[123] | 0) >>> 0) {
            _abort(); //@line 2634
           } else {
            HEAP32[$$3$i$i + 20 >> 2] = $820; //@line 2638
            HEAP32[$820 + 24 >> 2] = $$3$i$i; //@line 2640
            break;
           }
          }
         } while (0);
         $$0$i18$i = $717 + $741 | 0; //@line 2647
         $$0287$i$i = $741 + $722 | 0; //@line 2647
        } else {
         $$0$i18$i = $717; //@line 2649
         $$0287$i$i = $722; //@line 2649
        }
        $828 = $$0$i18$i + 4 | 0; //@line 2651
        HEAP32[$828 >> 2] = HEAP32[$828 >> 2] & -2; //@line 2654
        HEAP32[$721 + 4 >> 2] = $$0287$i$i | 1; //@line 2657
        HEAP32[$721 + $$0287$i$i >> 2] = $$0287$i$i; //@line 2659
        $834 = $$0287$i$i >>> 3; //@line 2660
        if ($$0287$i$i >>> 0 < 256) {
         $837 = 516 + ($834 << 1 << 2) | 0; //@line 2664
         $838 = HEAP32[119] | 0; //@line 2665
         $839 = 1 << $834; //@line 2666
         do {
          if (!($838 & $839)) {
           HEAP32[119] = $838 | $839; //@line 2672
           $$0295$i$i = $837; //@line 2674
           $$pre$phi$i20$iZ2D = $837 + 8 | 0; //@line 2674
          } else {
           $843 = $837 + 8 | 0; //@line 2676
           $844 = HEAP32[$843 >> 2] | 0; //@line 2677
           if ($844 >>> 0 >= (HEAP32[123] | 0) >>> 0) {
            $$0295$i$i = $844; //@line 2681
            $$pre$phi$i20$iZ2D = $843; //@line 2681
            break;
           }
           _abort(); //@line 2684
          }
         } while (0);
         HEAP32[$$pre$phi$i20$iZ2D >> 2] = $721; //@line 2688
         HEAP32[$$0295$i$i + 12 >> 2] = $721; //@line 2690
         HEAP32[$721 + 8 >> 2] = $$0295$i$i; //@line 2692
         HEAP32[$721 + 12 >> 2] = $837; //@line 2694
         break;
        }
        $850 = $$0287$i$i >>> 8; //@line 2697
        do {
         if (!$850) {
          $$0296$i$i = 0; //@line 2701
         } else {
          if ($$0287$i$i >>> 0 > 16777215) {
           $$0296$i$i = 31; //@line 2705
           break;
          }
          $855 = ($850 + 1048320 | 0) >>> 16 & 8; //@line 2710
          $856 = $850 << $855; //@line 2711
          $859 = ($856 + 520192 | 0) >>> 16 & 4; //@line 2714
          $861 = $856 << $859; //@line 2716
          $864 = ($861 + 245760 | 0) >>> 16 & 2; //@line 2719
          $869 = 14 - ($859 | $855 | $864) + ($861 << $864 >>> 15) | 0; //@line 2724
          $$0296$i$i = $$0287$i$i >>> ($869 + 7 | 0) & 1 | $869 << 1; //@line 2730
         }
        } while (0);
        $875 = 780 + ($$0296$i$i << 2) | 0; //@line 2733
        HEAP32[$721 + 28 >> 2] = $$0296$i$i; //@line 2735
        $877 = $721 + 16 | 0; //@line 2736
        HEAP32[$877 + 4 >> 2] = 0; //@line 2738
        HEAP32[$877 >> 2] = 0; //@line 2739
        $879 = HEAP32[120] | 0; //@line 2740
        $880 = 1 << $$0296$i$i; //@line 2741
        if (!($879 & $880)) {
         HEAP32[120] = $879 | $880; //@line 2746
         HEAP32[$875 >> 2] = $721; //@line 2747
         HEAP32[$721 + 24 >> 2] = $875; //@line 2749
         HEAP32[$721 + 12 >> 2] = $721; //@line 2751
         HEAP32[$721 + 8 >> 2] = $721; //@line 2753
         break;
        }
        $$0288$i$i = $$0287$i$i << (($$0296$i$i | 0) == 31 ? 0 : 25 - ($$0296$i$i >>> 1) | 0); //@line 2762
        $$0289$i$i = HEAP32[$875 >> 2] | 0; //@line 2762
        while (1) {
         if ((HEAP32[$$0289$i$i + 4 >> 2] & -8 | 0) == ($$0287$i$i | 0)) {
          label = 265; //@line 2769
          break;
         }
         $898 = $$0289$i$i + 16 + ($$0288$i$i >>> 31 << 2) | 0; //@line 2773
         $900 = HEAP32[$898 >> 2] | 0; //@line 2775
         if (!$900) {
          label = 262; //@line 2778
          break;
         } else {
          $$0288$i$i = $$0288$i$i << 1; //@line 2781
          $$0289$i$i = $900; //@line 2781
         }
        }
        if ((label | 0) == 262) {
         if ($898 >>> 0 < (HEAP32[123] | 0) >>> 0) {
          _abort(); //@line 2788
         } else {
          HEAP32[$898 >> 2] = $721; //@line 2791
          HEAP32[$721 + 24 >> 2] = $$0289$i$i; //@line 2793
          HEAP32[$721 + 12 >> 2] = $721; //@line 2795
          HEAP32[$721 + 8 >> 2] = $721; //@line 2797
          break;
         }
        } else if ((label | 0) == 265) {
         $907 = $$0289$i$i + 8 | 0; //@line 2802
         $908 = HEAP32[$907 >> 2] | 0; //@line 2803
         $909 = HEAP32[123] | 0; //@line 2804
         if ($908 >>> 0 >= $909 >>> 0 & $$0289$i$i >>> 0 >= $909 >>> 0) {
          HEAP32[$908 + 12 >> 2] = $721; //@line 2810
          HEAP32[$907 >> 2] = $721; //@line 2811
          HEAP32[$721 + 8 >> 2] = $908; //@line 2813
          HEAP32[$721 + 12 >> 2] = $$0289$i$i; //@line 2815
          HEAP32[$721 + 24 >> 2] = 0; //@line 2817
          break;
         } else {
          _abort(); //@line 2820
         }
        }
       }
      } while (0);
      $$0 = $709 + 8 | 0; //@line 2827
      STACKTOP = sp; //@line 2828
      return $$0 | 0; //@line 2828
     }
    }
    $$0$i$i$i = 924; //@line 2831
    while (1) {
     $916 = HEAP32[$$0$i$i$i >> 2] | 0; //@line 2833
     if ($916 >>> 0 <= $630 >>> 0) {
      $920 = $916 + (HEAP32[$$0$i$i$i + 4 >> 2] | 0) | 0; //@line 2838
      if ($920 >>> 0 > $630 >>> 0) {
       break;
      }
     }
     $$0$i$i$i = HEAP32[$$0$i$i$i + 8 >> 2] | 0; //@line 2846
    }
    $924 = $920 + -47 | 0; //@line 2848
    $926 = $924 + 8 | 0; //@line 2850
    $932 = $924 + (($926 & 7 | 0) == 0 ? 0 : 0 - $926 & 7) | 0; //@line 2856
    $933 = $630 + 16 | 0; //@line 2857
    $935 = $932 >>> 0 < $933 >>> 0 ? $630 : $932; //@line 2859
    $936 = $935 + 8 | 0; //@line 2860
    $937 = $935 + 24 | 0; //@line 2861
    $940 = $$749$i + 8 | 0; //@line 2864
    $945 = ($940 & 7 | 0) == 0 ? 0 : 0 - $940 & 7; //@line 2869
    $946 = $$749$i + $945 | 0; //@line 2870
    $947 = $$723948$i + -40 - $945 | 0; //@line 2871
    HEAP32[125] = $946; //@line 2872
    HEAP32[122] = $947; //@line 2873
    HEAP32[$946 + 4 >> 2] = $947 | 1; //@line 2876
    HEAP32[$946 + $947 + 4 >> 2] = 40; //@line 2879
    HEAP32[126] = HEAP32[241]; //@line 2881
    $953 = $935 + 4 | 0; //@line 2882
    HEAP32[$953 >> 2] = 27; //@line 2883
    HEAP32[$936 >> 2] = HEAP32[231]; //@line 2884
    HEAP32[$936 + 4 >> 2] = HEAP32[232]; //@line 2884
    HEAP32[$936 + 8 >> 2] = HEAP32[233]; //@line 2884
    HEAP32[$936 + 12 >> 2] = HEAP32[234]; //@line 2884
    HEAP32[231] = $$749$i; //@line 2885
    HEAP32[232] = $$723948$i; //@line 2886
    HEAP32[234] = 0; //@line 2887
    HEAP32[233] = $936; //@line 2888
    $955 = $937; //@line 2889
    do {
     $955$looptemp = $955;
     $955 = $955 + 4 | 0; //@line 2891
     HEAP32[$955 >> 2] = 7; //@line 2892
    } while (($955$looptemp + 8 | 0) >>> 0 < $920 >>> 0);
    if (($935 | 0) != ($630 | 0)) {
     $961 = $935 - $630 | 0; //@line 2905
     HEAP32[$953 >> 2] = HEAP32[$953 >> 2] & -2; //@line 2908
     HEAP32[$630 + 4 >> 2] = $961 | 1; //@line 2911
     HEAP32[$935 >> 2] = $961; //@line 2912
     $966 = $961 >>> 3; //@line 2913
     if ($961 >>> 0 < 256) {
      $969 = 516 + ($966 << 1 << 2) | 0; //@line 2917
      $970 = HEAP32[119] | 0; //@line 2918
      $971 = 1 << $966; //@line 2919
      if (!($970 & $971)) {
       HEAP32[119] = $970 | $971; //@line 2924
       $$0211$i$i = $969; //@line 2926
       $$pre$phi$i$iZ2D = $969 + 8 | 0; //@line 2926
      } else {
       $975 = $969 + 8 | 0; //@line 2928
       $976 = HEAP32[$975 >> 2] | 0; //@line 2929
       if ($976 >>> 0 < (HEAP32[123] | 0) >>> 0) {
        _abort(); //@line 2933
       } else {
        $$0211$i$i = $976; //@line 2936
        $$pre$phi$i$iZ2D = $975; //@line 2936
       }
      }
      HEAP32[$$pre$phi$i$iZ2D >> 2] = $630; //@line 2939
      HEAP32[$$0211$i$i + 12 >> 2] = $630; //@line 2941
      HEAP32[$630 + 8 >> 2] = $$0211$i$i; //@line 2943
      HEAP32[$630 + 12 >> 2] = $969; //@line 2945
      break;
     }
     $982 = $961 >>> 8; //@line 2948
     if (!$982) {
      $$0212$i$i = 0; //@line 2951
     } else {
      if ($961 >>> 0 > 16777215) {
       $$0212$i$i = 31; //@line 2955
      } else {
       $987 = ($982 + 1048320 | 0) >>> 16 & 8; //@line 2959
       $988 = $982 << $987; //@line 2960
       $991 = ($988 + 520192 | 0) >>> 16 & 4; //@line 2963
       $993 = $988 << $991; //@line 2965
       $996 = ($993 + 245760 | 0) >>> 16 & 2; //@line 2968
       $1001 = 14 - ($991 | $987 | $996) + ($993 << $996 >>> 15) | 0; //@line 2973
       $$0212$i$i = $961 >>> ($1001 + 7 | 0) & 1 | $1001 << 1; //@line 2979
      }
     }
     $1007 = 780 + ($$0212$i$i << 2) | 0; //@line 2982
     HEAP32[$630 + 28 >> 2] = $$0212$i$i; //@line 2984
     HEAP32[$630 + 20 >> 2] = 0; //@line 2986
     HEAP32[$933 >> 2] = 0; //@line 2987
     $1010 = HEAP32[120] | 0; //@line 2988
     $1011 = 1 << $$0212$i$i; //@line 2989
     if (!($1010 & $1011)) {
      HEAP32[120] = $1010 | $1011; //@line 2994
      HEAP32[$1007 >> 2] = $630; //@line 2995
      HEAP32[$630 + 24 >> 2] = $1007; //@line 2997
      HEAP32[$630 + 12 >> 2] = $630; //@line 2999
      HEAP32[$630 + 8 >> 2] = $630; //@line 3001
      break;
     }
     $$0206$i$i = $961 << (($$0212$i$i | 0) == 31 ? 0 : 25 - ($$0212$i$i >>> 1) | 0); //@line 3010
     $$0207$i$i = HEAP32[$1007 >> 2] | 0; //@line 3010
     while (1) {
      if ((HEAP32[$$0207$i$i + 4 >> 2] & -8 | 0) == ($961 | 0)) {
       label = 292; //@line 3017
       break;
      }
      $1029 = $$0207$i$i + 16 + ($$0206$i$i >>> 31 << 2) | 0; //@line 3021
      $1031 = HEAP32[$1029 >> 2] | 0; //@line 3023
      if (!$1031) {
       label = 289; //@line 3026
       break;
      } else {
       $$0206$i$i = $$0206$i$i << 1; //@line 3029
       $$0207$i$i = $1031; //@line 3029
      }
     }
     if ((label | 0) == 289) {
      if ($1029 >>> 0 < (HEAP32[123] | 0) >>> 0) {
       _abort(); //@line 3036
      } else {
       HEAP32[$1029 >> 2] = $630; //@line 3039
       HEAP32[$630 + 24 >> 2] = $$0207$i$i; //@line 3041
       HEAP32[$630 + 12 >> 2] = $630; //@line 3043
       HEAP32[$630 + 8 >> 2] = $630; //@line 3045
       break;
      }
     } else if ((label | 0) == 292) {
      $1038 = $$0207$i$i + 8 | 0; //@line 3050
      $1039 = HEAP32[$1038 >> 2] | 0; //@line 3051
      $1040 = HEAP32[123] | 0; //@line 3052
      if ($1039 >>> 0 >= $1040 >>> 0 & $$0207$i$i >>> 0 >= $1040 >>> 0) {
       HEAP32[$1039 + 12 >> 2] = $630; //@line 3058
       HEAP32[$1038 >> 2] = $630; //@line 3059
       HEAP32[$630 + 8 >> 2] = $1039; //@line 3061
       HEAP32[$630 + 12 >> 2] = $$0207$i$i; //@line 3063
       HEAP32[$630 + 24 >> 2] = 0; //@line 3065
       break;
      } else {
       _abort(); //@line 3068
      }
     }
    }
   }
  } while (0);
  $1048 = HEAP32[122] | 0; //@line 3075
  if ($1048 >>> 0 > $$0197 >>> 0) {
   $1050 = $1048 - $$0197 | 0; //@line 3078
   HEAP32[122] = $1050; //@line 3079
   $1051 = HEAP32[125] | 0; //@line 3080
   $1052 = $1051 + $$0197 | 0; //@line 3081
   HEAP32[125] = $1052; //@line 3082
   HEAP32[$1052 + 4 >> 2] = $1050 | 1; //@line 3085
   HEAP32[$1051 + 4 >> 2] = $$0197 | 3; //@line 3088
   $$0 = $1051 + 8 | 0; //@line 3090
   STACKTOP = sp; //@line 3091
   return $$0 | 0; //@line 3091
  }
 }
 HEAP32[(___errno_location() | 0) >> 2] = 12; //@line 3095
 $$0 = 0; //@line 3096
 STACKTOP = sp; //@line 3097
 return $$0 | 0; //@line 3097
}
function _free($0) {
 $0 = $0 | 0;
 var $$0212$i = 0, $$0212$in$i = 0, $$0383 = 0, $$0384 = 0, $$0396 = 0, $$0403 = 0, $$1 = 0, $$1382 = 0, $$1387 = 0, $$1390 = 0, $$1398 = 0, $$1402 = 0, $$2 = 0, $$3 = 0, $$3400 = 0, $$pre$phi443Z2D = 0, $$pre$phi445Z2D = 0, $$pre$phiZ2D = 0, $10 = 0, $104 = 0, $105 = 0, $113 = 0, $114 = 0, $115 = 0, $122 = 0, $124 = 0, $13 = 0, $130 = 0, $135 = 0, $136 = 0, $139 = 0, $141 = 0, $143 = 0, $158 = 0, $16 = 0, $163 = 0, $165 = 0, $168 = 0, $17 = 0, $171 = 0, $174 = 0, $177 = 0, $178 = 0, $179 = 0, $181 = 0, $183 = 0, $184 = 0, $186 = 0, $187 = 0, $193 = 0, $194 = 0, $2 = 0, $207 = 0, $21 = 0, $210 = 0, $211 = 0, $217 = 0, $232 = 0, $235 = 0, $236 = 0, $237 = 0, $24 = 0, $241 = 0, $242 = 0, $248 = 0, $253 = 0, $254 = 0, $257 = 0, $259 = 0, $26 = 0, $262 = 0, $267 = 0, $273 = 0, $277 = 0, $278 = 0, $28 = 0, $296 = 0, $298 = 0, $3 = 0, $305 = 0, $306 = 0, $307 = 0, $315 = 0, $41 = 0, $46 = 0, $48 = 0, $51 = 0, $53 = 0, $56 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $63 = 0, $65 = 0, $66 = 0, $68 = 0, $69 = 0, $7 = 0, $74 = 0, $75 = 0, $88 = 0, $9 = 0, $91 = 0, $92 = 0, $98 = 0, label = 0;
 if (!$0) {
  return;
 }
 $2 = $0 + -8 | 0; //@line 3124
 $3 = HEAP32[123] | 0; //@line 3125
 if ($2 >>> 0 < $3 >>> 0) {
  _abort(); //@line 3128
 }
 $6 = HEAP32[$0 + -4 >> 2] | 0; //@line 3132
 $7 = $6 & 3; //@line 3133
 if (($7 | 0) == 1) {
  _abort(); //@line 3136
 }
 $9 = $6 & -8; //@line 3139
 $10 = $2 + $9 | 0; //@line 3140
 L10 : do {
  if (!($6 & 1)) {
   $13 = HEAP32[$2 >> 2] | 0; //@line 3145
   if (!$7) {
    return;
   }
   $16 = $2 + (0 - $13) | 0; //@line 3151
   $17 = $13 + $9 | 0; //@line 3152
   if ($16 >>> 0 < $3 >>> 0) {
    _abort(); //@line 3155
   }
   if (($16 | 0) == (HEAP32[124] | 0)) {
    $104 = $10 + 4 | 0; //@line 3161
    $105 = HEAP32[$104 >> 2] | 0; //@line 3162
    if (($105 & 3 | 0) != 3) {
     $$1 = $16; //@line 3166
     $$1382 = $17; //@line 3166
     $113 = $16; //@line 3166
     break;
    }
    HEAP32[121] = $17; //@line 3173
    HEAP32[$104 >> 2] = $105 & -2; //@line 3174
    HEAP32[$16 + 4 >> 2] = $17 | 1; //@line 3175
    HEAP32[$16 + $17 >> 2] = $17; //@line 3176
    return;
   }
   $21 = $13 >>> 3; //@line 3179
   if ($13 >>> 0 < 256) {
    $24 = HEAP32[$16 + 8 >> 2] | 0; //@line 3183
    $26 = HEAP32[$16 + 12 >> 2] | 0; //@line 3185
    $28 = 516 + ($21 << 1 << 2) | 0; //@line 3187
    if (($24 | 0) != ($28 | 0)) {
     if ($24 >>> 0 < $3 >>> 0) {
      _abort(); //@line 3192
     }
     if ((HEAP32[$24 + 12 >> 2] | 0) != ($16 | 0)) {
      _abort(); //@line 3199
     }
    }
    if (($26 | 0) == ($24 | 0)) {
     HEAP32[119] = HEAP32[119] & ~(1 << $21); //@line 3209
     $$1 = $16; //@line 3210
     $$1382 = $17; //@line 3210
     $113 = $16; //@line 3210
     break;
    }
    if (($26 | 0) == ($28 | 0)) {
     $$pre$phi445Z2D = $26 + 8 | 0; //@line 3216
    } else {
     if ($26 >>> 0 < $3 >>> 0) {
      _abort(); //@line 3220
     }
     $41 = $26 + 8 | 0; //@line 3223
     if ((HEAP32[$41 >> 2] | 0) == ($16 | 0)) {
      $$pre$phi445Z2D = $41; //@line 3227
     } else {
      _abort(); //@line 3229
     }
    }
    HEAP32[$24 + 12 >> 2] = $26; //@line 3234
    HEAP32[$$pre$phi445Z2D >> 2] = $24; //@line 3235
    $$1 = $16; //@line 3236
    $$1382 = $17; //@line 3236
    $113 = $16; //@line 3236
    break;
   }
   $46 = HEAP32[$16 + 24 >> 2] | 0; //@line 3240
   $48 = HEAP32[$16 + 12 >> 2] | 0; //@line 3242
   do {
    if (($48 | 0) == ($16 | 0)) {
     $59 = $16 + 16 | 0; //@line 3246
     $60 = $59 + 4 | 0; //@line 3247
     $61 = HEAP32[$60 >> 2] | 0; //@line 3248
     if (!$61) {
      $63 = HEAP32[$59 >> 2] | 0; //@line 3251
      if (!$63) {
       $$3 = 0; //@line 3254
       break;
      } else {
       $$1387 = $63; //@line 3257
       $$1390 = $59; //@line 3257
      }
     } else {
      $$1387 = $61; //@line 3260
      $$1390 = $60; //@line 3260
     }
     while (1) {
      $65 = $$1387 + 20 | 0; //@line 3263
      $66 = HEAP32[$65 >> 2] | 0; //@line 3264
      if ($66 | 0) {
       $$1387 = $66; //@line 3267
       $$1390 = $65; //@line 3267
       continue;
      }
      $68 = $$1387 + 16 | 0; //@line 3270
      $69 = HEAP32[$68 >> 2] | 0; //@line 3271
      if (!$69) {
       break;
      } else {
       $$1387 = $69; //@line 3276
       $$1390 = $68; //@line 3276
      }
     }
     if ($$1390 >>> 0 < $3 >>> 0) {
      _abort(); //@line 3281
     } else {
      HEAP32[$$1390 >> 2] = 0; //@line 3284
      $$3 = $$1387; //@line 3285
      break;
     }
    } else {
     $51 = HEAP32[$16 + 8 >> 2] | 0; //@line 3290
     if ($51 >>> 0 < $3 >>> 0) {
      _abort(); //@line 3293
     }
     $53 = $51 + 12 | 0; //@line 3296
     if ((HEAP32[$53 >> 2] | 0) != ($16 | 0)) {
      _abort(); //@line 3300
     }
     $56 = $48 + 8 | 0; //@line 3303
     if ((HEAP32[$56 >> 2] | 0) == ($16 | 0)) {
      HEAP32[$53 >> 2] = $48; //@line 3307
      HEAP32[$56 >> 2] = $51; //@line 3308
      $$3 = $48; //@line 3309
      break;
     } else {
      _abort(); //@line 3312
     }
    }
   } while (0);
   if (!$46) {
    $$1 = $16; //@line 3319
    $$1382 = $17; //@line 3319
    $113 = $16; //@line 3319
   } else {
    $74 = HEAP32[$16 + 28 >> 2] | 0; //@line 3322
    $75 = 780 + ($74 << 2) | 0; //@line 3323
    do {
     if (($16 | 0) == (HEAP32[$75 >> 2] | 0)) {
      HEAP32[$75 >> 2] = $$3; //@line 3328
      if (!$$3) {
       HEAP32[120] = HEAP32[120] & ~(1 << $74); //@line 3335
       $$1 = $16; //@line 3336
       $$1382 = $17; //@line 3336
       $113 = $16; //@line 3336
       break L10;
      }
     } else {
      if ($46 >>> 0 < (HEAP32[123] | 0) >>> 0) {
       _abort(); //@line 3343
      } else {
       HEAP32[$46 + 16 + (((HEAP32[$46 + 16 >> 2] | 0) != ($16 | 0) & 1) << 2) >> 2] = $$3; //@line 3351
       if (!$$3) {
        $$1 = $16; //@line 3354
        $$1382 = $17; //@line 3354
        $113 = $16; //@line 3354
        break L10;
       } else {
        break;
       }
      }
     }
    } while (0);
    $88 = HEAP32[123] | 0; //@line 3362
    if ($$3 >>> 0 < $88 >>> 0) {
     _abort(); //@line 3365
    }
    HEAP32[$$3 + 24 >> 2] = $46; //@line 3369
    $91 = $16 + 16 | 0; //@line 3370
    $92 = HEAP32[$91 >> 2] | 0; //@line 3371
    do {
     if ($92 | 0) {
      if ($92 >>> 0 < $88 >>> 0) {
       _abort(); //@line 3377
      } else {
       HEAP32[$$3 + 16 >> 2] = $92; //@line 3381
       HEAP32[$92 + 24 >> 2] = $$3; //@line 3383
       break;
      }
     }
    } while (0);
    $98 = HEAP32[$91 + 4 >> 2] | 0; //@line 3389
    if (!$98) {
     $$1 = $16; //@line 3392
     $$1382 = $17; //@line 3392
     $113 = $16; //@line 3392
    } else {
     if ($98 >>> 0 < (HEAP32[123] | 0) >>> 0) {
      _abort(); //@line 3397
     } else {
      HEAP32[$$3 + 20 >> 2] = $98; //@line 3401
      HEAP32[$98 + 24 >> 2] = $$3; //@line 3403
      $$1 = $16; //@line 3404
      $$1382 = $17; //@line 3404
      $113 = $16; //@line 3404
      break;
     }
    }
   }
  } else {
   $$1 = $2; //@line 3410
   $$1382 = $9; //@line 3410
   $113 = $2; //@line 3410
  }
 } while (0);
 if ($113 >>> 0 >= $10 >>> 0) {
  _abort(); //@line 3415
 }
 $114 = $10 + 4 | 0; //@line 3418
 $115 = HEAP32[$114 >> 2] | 0; //@line 3419
 if (!($115 & 1)) {
  _abort(); //@line 3423
 }
 if (!($115 & 2)) {
  $122 = HEAP32[124] | 0; //@line 3431
  if (($10 | 0) == (HEAP32[125] | 0)) {
   $124 = (HEAP32[122] | 0) + $$1382 | 0; //@line 3434
   HEAP32[122] = $124; //@line 3435
   HEAP32[125] = $$1; //@line 3436
   HEAP32[$$1 + 4 >> 2] = $124 | 1; //@line 3439
   if (($$1 | 0) != ($122 | 0)) {
    return;
   }
   HEAP32[124] = 0; //@line 3444
   HEAP32[121] = 0; //@line 3445
   return;
  }
  if (($10 | 0) == ($122 | 0)) {
   $130 = (HEAP32[121] | 0) + $$1382 | 0; //@line 3451
   HEAP32[121] = $130; //@line 3452
   HEAP32[124] = $113; //@line 3453
   HEAP32[$$1 + 4 >> 2] = $130 | 1; //@line 3456
   HEAP32[$113 + $130 >> 2] = $130; //@line 3458
   return;
  }
  $135 = ($115 & -8) + $$1382 | 0; //@line 3462
  $136 = $115 >>> 3; //@line 3463
  L108 : do {
   if ($115 >>> 0 < 256) {
    $139 = HEAP32[$10 + 8 >> 2] | 0; //@line 3468
    $141 = HEAP32[$10 + 12 >> 2] | 0; //@line 3470
    $143 = 516 + ($136 << 1 << 2) | 0; //@line 3472
    if (($139 | 0) != ($143 | 0)) {
     if ($139 >>> 0 < (HEAP32[123] | 0) >>> 0) {
      _abort(); //@line 3478
     }
     if ((HEAP32[$139 + 12 >> 2] | 0) != ($10 | 0)) {
      _abort(); //@line 3485
     }
    }
    if (($141 | 0) == ($139 | 0)) {
     HEAP32[119] = HEAP32[119] & ~(1 << $136); //@line 3495
     break;
    }
    if (($141 | 0) == ($143 | 0)) {
     $$pre$phi443Z2D = $141 + 8 | 0; //@line 3501
    } else {
     if ($141 >>> 0 < (HEAP32[123] | 0) >>> 0) {
      _abort(); //@line 3506
     }
     $158 = $141 + 8 | 0; //@line 3509
     if ((HEAP32[$158 >> 2] | 0) == ($10 | 0)) {
      $$pre$phi443Z2D = $158; //@line 3513
     } else {
      _abort(); //@line 3515
     }
    }
    HEAP32[$139 + 12 >> 2] = $141; //@line 3520
    HEAP32[$$pre$phi443Z2D >> 2] = $139; //@line 3521
   } else {
    $163 = HEAP32[$10 + 24 >> 2] | 0; //@line 3524
    $165 = HEAP32[$10 + 12 >> 2] | 0; //@line 3526
    do {
     if (($165 | 0) == ($10 | 0)) {
      $177 = $10 + 16 | 0; //@line 3530
      $178 = $177 + 4 | 0; //@line 3531
      $179 = HEAP32[$178 >> 2] | 0; //@line 3532
      if (!$179) {
       $181 = HEAP32[$177 >> 2] | 0; //@line 3535
       if (!$181) {
        $$3400 = 0; //@line 3538
        break;
       } else {
        $$1398 = $181; //@line 3541
        $$1402 = $177; //@line 3541
       }
      } else {
       $$1398 = $179; //@line 3544
       $$1402 = $178; //@line 3544
      }
      while (1) {
       $183 = $$1398 + 20 | 0; //@line 3547
       $184 = HEAP32[$183 >> 2] | 0; //@line 3548
       if ($184 | 0) {
        $$1398 = $184; //@line 3551
        $$1402 = $183; //@line 3551
        continue;
       }
       $186 = $$1398 + 16 | 0; //@line 3554
       $187 = HEAP32[$186 >> 2] | 0; //@line 3555
       if (!$187) {
        break;
       } else {
        $$1398 = $187; //@line 3560
        $$1402 = $186; //@line 3560
       }
      }
      if ($$1402 >>> 0 < (HEAP32[123] | 0) >>> 0) {
       _abort(); //@line 3566
      } else {
       HEAP32[$$1402 >> 2] = 0; //@line 3569
       $$3400 = $$1398; //@line 3570
       break;
      }
     } else {
      $168 = HEAP32[$10 + 8 >> 2] | 0; //@line 3575
      if ($168 >>> 0 < (HEAP32[123] | 0) >>> 0) {
       _abort(); //@line 3579
      }
      $171 = $168 + 12 | 0; //@line 3582
      if ((HEAP32[$171 >> 2] | 0) != ($10 | 0)) {
       _abort(); //@line 3586
      }
      $174 = $165 + 8 | 0; //@line 3589
      if ((HEAP32[$174 >> 2] | 0) == ($10 | 0)) {
       HEAP32[$171 >> 2] = $165; //@line 3593
       HEAP32[$174 >> 2] = $168; //@line 3594
       $$3400 = $165; //@line 3595
       break;
      } else {
       _abort(); //@line 3598
      }
     }
    } while (0);
    if ($163 | 0) {
     $193 = HEAP32[$10 + 28 >> 2] | 0; //@line 3606
     $194 = 780 + ($193 << 2) | 0; //@line 3607
     do {
      if (($10 | 0) == (HEAP32[$194 >> 2] | 0)) {
       HEAP32[$194 >> 2] = $$3400; //@line 3612
       if (!$$3400) {
        HEAP32[120] = HEAP32[120] & ~(1 << $193); //@line 3619
        break L108;
       }
      } else {
       if ($163 >>> 0 < (HEAP32[123] | 0) >>> 0) {
        _abort(); //@line 3626
       } else {
        HEAP32[$163 + 16 + (((HEAP32[$163 + 16 >> 2] | 0) != ($10 | 0) & 1) << 2) >> 2] = $$3400; //@line 3634
        if (!$$3400) {
         break L108;
        } else {
         break;
        }
       }
      }
     } while (0);
     $207 = HEAP32[123] | 0; //@line 3644
     if ($$3400 >>> 0 < $207 >>> 0) {
      _abort(); //@line 3647
     }
     HEAP32[$$3400 + 24 >> 2] = $163; //@line 3651
     $210 = $10 + 16 | 0; //@line 3652
     $211 = HEAP32[$210 >> 2] | 0; //@line 3653
     do {
      if ($211 | 0) {
       if ($211 >>> 0 < $207 >>> 0) {
        _abort(); //@line 3659
       } else {
        HEAP32[$$3400 + 16 >> 2] = $211; //@line 3663
        HEAP32[$211 + 24 >> 2] = $$3400; //@line 3665
        break;
       }
      }
     } while (0);
     $217 = HEAP32[$210 + 4 >> 2] | 0; //@line 3671
     if ($217 | 0) {
      if ($217 >>> 0 < (HEAP32[123] | 0) >>> 0) {
       _abort(); //@line 3677
      } else {
       HEAP32[$$3400 + 20 >> 2] = $217; //@line 3681
       HEAP32[$217 + 24 >> 2] = $$3400; //@line 3683
       break;
      }
     }
    }
   }
  } while (0);
  HEAP32[$$1 + 4 >> 2] = $135 | 1; //@line 3692
  HEAP32[$113 + $135 >> 2] = $135; //@line 3694
  if (($$1 | 0) == (HEAP32[124] | 0)) {
   HEAP32[121] = $135; //@line 3698
   return;
  } else {
   $$2 = $135; //@line 3701
  }
 } else {
  HEAP32[$114 >> 2] = $115 & -2; //@line 3705
  HEAP32[$$1 + 4 >> 2] = $$1382 | 1; //@line 3708
  HEAP32[$113 + $$1382 >> 2] = $$1382; //@line 3710
  $$2 = $$1382; //@line 3711
 }
 $232 = $$2 >>> 3; //@line 3713
 if ($$2 >>> 0 < 256) {
  $235 = 516 + ($232 << 1 << 2) | 0; //@line 3717
  $236 = HEAP32[119] | 0; //@line 3718
  $237 = 1 << $232; //@line 3719
  if (!($236 & $237)) {
   HEAP32[119] = $236 | $237; //@line 3724
   $$0403 = $235; //@line 3726
   $$pre$phiZ2D = $235 + 8 | 0; //@line 3726
  } else {
   $241 = $235 + 8 | 0; //@line 3728
   $242 = HEAP32[$241 >> 2] | 0; //@line 3729
   if ($242 >>> 0 < (HEAP32[123] | 0) >>> 0) {
    _abort(); //@line 3733
   } else {
    $$0403 = $242; //@line 3736
    $$pre$phiZ2D = $241; //@line 3736
   }
  }
  HEAP32[$$pre$phiZ2D >> 2] = $$1; //@line 3739
  HEAP32[$$0403 + 12 >> 2] = $$1; //@line 3741
  HEAP32[$$1 + 8 >> 2] = $$0403; //@line 3743
  HEAP32[$$1 + 12 >> 2] = $235; //@line 3745
  return;
 }
 $248 = $$2 >>> 8; //@line 3748
 if (!$248) {
  $$0396 = 0; //@line 3751
 } else {
  if ($$2 >>> 0 > 16777215) {
   $$0396 = 31; //@line 3755
  } else {
   $253 = ($248 + 1048320 | 0) >>> 16 & 8; //@line 3759
   $254 = $248 << $253; //@line 3760
   $257 = ($254 + 520192 | 0) >>> 16 & 4; //@line 3763
   $259 = $254 << $257; //@line 3765
   $262 = ($259 + 245760 | 0) >>> 16 & 2; //@line 3768
   $267 = 14 - ($257 | $253 | $262) + ($259 << $262 >>> 15) | 0; //@line 3773
   $$0396 = $$2 >>> ($267 + 7 | 0) & 1 | $267 << 1; //@line 3779
  }
 }
 $273 = 780 + ($$0396 << 2) | 0; //@line 3782
 HEAP32[$$1 + 28 >> 2] = $$0396; //@line 3784
 HEAP32[$$1 + 20 >> 2] = 0; //@line 3787
 HEAP32[$$1 + 16 >> 2] = 0; //@line 3788
 $277 = HEAP32[120] | 0; //@line 3789
 $278 = 1 << $$0396; //@line 3790
 do {
  if (!($277 & $278)) {
   HEAP32[120] = $277 | $278; //@line 3796
   HEAP32[$273 >> 2] = $$1; //@line 3797
   HEAP32[$$1 + 24 >> 2] = $273; //@line 3799
   HEAP32[$$1 + 12 >> 2] = $$1; //@line 3801
   HEAP32[$$1 + 8 >> 2] = $$1; //@line 3803
  } else {
   $$0383 = $$2 << (($$0396 | 0) == 31 ? 0 : 25 - ($$0396 >>> 1) | 0); //@line 3811
   $$0384 = HEAP32[$273 >> 2] | 0; //@line 3811
   while (1) {
    if ((HEAP32[$$0384 + 4 >> 2] & -8 | 0) == ($$2 | 0)) {
     label = 124; //@line 3818
     break;
    }
    $296 = $$0384 + 16 + ($$0383 >>> 31 << 2) | 0; //@line 3822
    $298 = HEAP32[$296 >> 2] | 0; //@line 3824
    if (!$298) {
     label = 121; //@line 3827
     break;
    } else {
     $$0383 = $$0383 << 1; //@line 3830
     $$0384 = $298; //@line 3830
    }
   }
   if ((label | 0) == 121) {
    if ($296 >>> 0 < (HEAP32[123] | 0) >>> 0) {
     _abort(); //@line 3837
    } else {
     HEAP32[$296 >> 2] = $$1; //@line 3840
     HEAP32[$$1 + 24 >> 2] = $$0384; //@line 3842
     HEAP32[$$1 + 12 >> 2] = $$1; //@line 3844
     HEAP32[$$1 + 8 >> 2] = $$1; //@line 3846
     break;
    }
   } else if ((label | 0) == 124) {
    $305 = $$0384 + 8 | 0; //@line 3851
    $306 = HEAP32[$305 >> 2] | 0; //@line 3852
    $307 = HEAP32[123] | 0; //@line 3853
    if ($306 >>> 0 >= $307 >>> 0 & $$0384 >>> 0 >= $307 >>> 0) {
     HEAP32[$306 + 12 >> 2] = $$1; //@line 3859
     HEAP32[$305 >> 2] = $$1; //@line 3860
     HEAP32[$$1 + 8 >> 2] = $306; //@line 3862
     HEAP32[$$1 + 12 >> 2] = $$0384; //@line 3864
     HEAP32[$$1 + 24 >> 2] = 0; //@line 3866
     break;
    } else {
     _abort(); //@line 3869
    }
   }
  }
 } while (0);
 $315 = (HEAP32[127] | 0) + -1 | 0; //@line 3876
 HEAP32[127] = $315; //@line 3877
 if (!$315) {
  $$0212$in$i = 932; //@line 3880
 } else {
  return;
 }
 while (1) {
  $$0212$i = HEAP32[$$0212$in$i >> 2] | 0; //@line 3885
  if (!$$0212$i) {
   break;
  } else {
   $$0212$in$i = $$0212$i + 8 | 0; //@line 3891
  }
 }
 HEAP32[127] = -1; //@line 3894
 return;
}
function ___stdio_write($0, $1, $2) {
 $0 = $0 | 0;
 $1 = $1 | 0;
 $2 = $2 | 0;
 var $$0 = 0, $$04756 = 0, $$04855 = 0, $$04954 = 0, $$051 = 0, $$1 = 0, $$150 = 0, $12 = 0, $13 = 0, $17 = 0, $20 = 0, $26 = 0, $3 = 0, $36 = 0, $37 = 0, $4 = 0, $43 = 0, $5 = 0, $7 = 0, $9 = 0, $vararg_buffer = 0, $vararg_buffer3 = 0, label = 0, sp = 0;
 sp = STACKTOP; //@line 74
 STACKTOP = STACKTOP + 48 | 0; //@line 75
 $vararg_buffer3 = sp + 16 | 0; //@line 76
 $vararg_buffer = sp; //@line 77
 $3 = sp + 32 | 0; //@line 78
 $4 = $0 + 28 | 0; //@line 79
 $5 = HEAP32[$4 >> 2] | 0; //@line 80
 HEAP32[$3 >> 2] = $5; //@line 81
 $7 = $0 + 20 | 0; //@line 83
 $9 = (HEAP32[$7 >> 2] | 0) - $5 | 0; //@line 85
 HEAP32[$3 + 4 >> 2] = $9; //@line 86
 HEAP32[$3 + 8 >> 2] = $1; //@line 88
 HEAP32[$3 + 12 >> 2] = $2; //@line 90
 $12 = $9 + $2 | 0; //@line 91
 $13 = $0 + 60 | 0; //@line 92
 HEAP32[$vararg_buffer >> 2] = HEAP32[$13 >> 2]; //@line 95
 HEAP32[$vararg_buffer + 4 >> 2] = $3; //@line 97
 HEAP32[$vararg_buffer + 8 >> 2] = 2; //@line 99
 $17 = ___syscall_ret(___syscall146(146, $vararg_buffer | 0) | 0) | 0; //@line 101
 L1 : do {
  if (($12 | 0) == ($17 | 0)) {
   label = 3; //@line 105
  } else {
   $$04756 = 2; //@line 107
   $$04855 = $12; //@line 107
   $$04954 = $3; //@line 107
   $26 = $17; //@line 107
   while (1) {
    if (($26 | 0) < 0) {
     break;
    }
    $$04855 = $$04855 - $26 | 0; //@line 113
    $36 = HEAP32[$$04954 + 4 >> 2] | 0; //@line 115
    $37 = $26 >>> 0 > $36 >>> 0; //@line 116
    $$150 = $37 ? $$04954 + 8 | 0 : $$04954; //@line 118
    $$1 = ($37 << 31 >> 31) + $$04756 | 0; //@line 120
    $$0 = $26 - ($37 ? $36 : 0) | 0; //@line 122
    HEAP32[$$150 >> 2] = (HEAP32[$$150 >> 2] | 0) + $$0; //@line 125
    $43 = $$150 + 4 | 0; //@line 126
    HEAP32[$43 >> 2] = (HEAP32[$43 >> 2] | 0) - $$0; //@line 129
    HEAP32[$vararg_buffer3 >> 2] = HEAP32[$13 >> 2]; //@line 132
    HEAP32[$vararg_buffer3 + 4 >> 2] = $$150; //@line 134
    HEAP32[$vararg_buffer3 + 8 >> 2] = $$1; //@line 136
    $26 = ___syscall_ret(___syscall146(146, $vararg_buffer3 | 0) | 0) | 0; //@line 138
    if (($$04855 | 0) == ($26 | 0)) {
     label = 3; //@line 141
     break L1;
    } else {
     $$04756 = $$1; //@line 144
     $$04954 = $$150; //@line 144
    }
   }
   HEAP32[$0 + 16 >> 2] = 0; //@line 148
   HEAP32[$4 >> 2] = 0; //@line 149
   HEAP32[$7 >> 2] = 0; //@line 150
   HEAP32[$0 >> 2] = HEAP32[$0 >> 2] | 32; //@line 153
   if (($$04756 | 0) == 2) {
    $$051 = 0; //@line 156
   } else {
    $$051 = $2 - (HEAP32[$$04954 + 4 >> 2] | 0) | 0; //@line 161
   }
  }
 } while (0);
 if ((label | 0) == 3) {
  $20 = HEAP32[$0 + 44 >> 2] | 0; //@line 167
  HEAP32[$0 + 16 >> 2] = $20 + (HEAP32[$0 + 48 >> 2] | 0); //@line 172
  HEAP32[$4 >> 2] = $20; //@line 173
  HEAP32[$7 >> 2] = $20; //@line 174
  $$051 = $2; //@line 175
 }
 STACKTOP = sp; //@line 177
 return $$051 | 0; //@line 177
}
function _memcpy(dest, src, num) {
 dest = dest | 0;
 src = src | 0;
 num = num | 0;
 var ret = 0, aligned_dest_end = 0, block_aligned_dest_end = 0, dest_end = 0;
 if ((num | 0) >= 8192) {
  return _emscripten_memcpy_big(dest | 0, src | 0, num | 0) | 0; //@line 3985
 }
 ret = dest | 0; //@line 3988
 dest_end = dest + num | 0; //@line 3989
 if ((dest & 3) == (src & 3)) {
  while (dest & 3) {
   if (!num) return ret | 0; //@line 3993
   HEAP8[dest >> 0] = HEAP8[src >> 0] | 0; //@line 3994
   dest = dest + 1 | 0; //@line 3995
   src = src + 1 | 0; //@line 3996
   num = num - 1 | 0; //@line 3997
  }
  aligned_dest_end = dest_end & -4 | 0; //@line 3999
  block_aligned_dest_end = aligned_dest_end - 64 | 0; //@line 4000
  while ((dest | 0) <= (block_aligned_dest_end | 0)) {
   HEAP32[dest >> 2] = HEAP32[src >> 2]; //@line 4002
   HEAP32[dest + 4 >> 2] = HEAP32[src + 4 >> 2]; //@line 4003
   HEAP32[dest + 8 >> 2] = HEAP32[src + 8 >> 2]; //@line 4004
   HEAP32[dest + 12 >> 2] = HEAP32[src + 12 >> 2]; //@line 4005
   HEAP32[dest + 16 >> 2] = HEAP32[src + 16 >> 2]; //@line 4006
   HEAP32[dest + 20 >> 2] = HEAP32[src + 20 >> 2]; //@line 4007
   HEAP32[dest + 24 >> 2] = HEAP32[src + 24 >> 2]; //@line 4008
   HEAP32[dest + 28 >> 2] = HEAP32[src + 28 >> 2]; //@line 4009
   HEAP32[dest + 32 >> 2] = HEAP32[src + 32 >> 2]; //@line 4010
   HEAP32[dest + 36 >> 2] = HEAP32[src + 36 >> 2]; //@line 4011
   HEAP32[dest + 40 >> 2] = HEAP32[src + 40 >> 2]; //@line 4012
   HEAP32[dest + 44 >> 2] = HEAP32[src + 44 >> 2]; //@line 4013
   HEAP32[dest + 48 >> 2] = HEAP32[src + 48 >> 2]; //@line 4014
   HEAP32[dest + 52 >> 2] = HEAP32[src + 52 >> 2]; //@line 4015
   HEAP32[dest + 56 >> 2] = HEAP32[src + 56 >> 2]; //@line 4016
   HEAP32[dest + 60 >> 2] = HEAP32[src + 60 >> 2]; //@line 4017
   dest = dest + 64 | 0; //@line 4018
   src = src + 64 | 0; //@line 4019
  }
  while ((dest | 0) < (aligned_dest_end | 0)) {
   HEAP32[dest >> 2] = HEAP32[src >> 2]; //@line 4022
   dest = dest + 4 | 0; //@line 4023
   src = src + 4 | 0; //@line 4024
  }
 } else {
  aligned_dest_end = dest_end - 4 | 0; //@line 4028
  while ((dest | 0) < (aligned_dest_end | 0)) {
   HEAP8[dest >> 0] = HEAP8[src >> 0] | 0; //@line 4030
   HEAP8[dest + 1 >> 0] = HEAP8[src + 1 >> 0] | 0; //@line 4031
   HEAP8[dest + 2 >> 0] = HEAP8[src + 2 >> 0] | 0; //@line 4032
   HEAP8[dest + 3 >> 0] = HEAP8[src + 3 >> 0] | 0; //@line 4033
   dest = dest + 4 | 0; //@line 4034
   src = src + 4 | 0; //@line 4035
  }
 }
 while ((dest | 0) < (dest_end | 0)) {
  HEAP8[dest >> 0] = HEAP8[src >> 0] | 0; //@line 4040
  dest = dest + 1 | 0; //@line 4041
  src = src + 1 | 0; //@line 4042
 }
 return ret | 0; //@line 4044
}
function ___fwritex($0, $1, $2) {
 $0 = $0 | 0;
 $1 = $1 | 0;
 $2 = $2 | 0;
 var $$038 = 0, $$1 = 0, $$139 = 0, $$141 = 0, $$143 = 0, $10 = 0, $12 = 0, $14 = 0, $22 = 0, $28 = 0, $3 = 0, $31 = 0, $4 = 0, $9 = 0, label = 0;
 $3 = $2 + 16 | 0; //@line 304
 $4 = HEAP32[$3 >> 2] | 0; //@line 305
 if (!$4) {
  if (!(___towrite($2) | 0)) {
   $12 = HEAP32[$3 >> 2] | 0; //@line 312
   label = 5; //@line 313
  } else {
   $$1 = 0; //@line 315
  }
 } else {
  $12 = $4; //@line 319
  label = 5; //@line 320
 }
 L5 : do {
  if ((label | 0) == 5) {
   $9 = $2 + 20 | 0; //@line 324
   $10 = HEAP32[$9 >> 2] | 0; //@line 325
   $14 = $10; //@line 328
   if (($12 - $10 | 0) >>> 0 < $1 >>> 0) {
    $$1 = FUNCTION_TABLE_iiii[HEAP32[$2 + 36 >> 2] & 3]($2, $0, $1) | 0; //@line 333
    break;
   }
   L10 : do {
    if ((HEAP8[$2 + 75 >> 0] | 0) > -1) {
     $$038 = $1; //@line 341
     while (1) {
      if (!$$038) {
       $$139 = 0; //@line 345
       $$141 = $0; //@line 345
       $$143 = $1; //@line 345
       $31 = $14; //@line 345
       break L10;
      }
      $22 = $$038 + -1 | 0; //@line 348
      if ((HEAP8[$0 + $22 >> 0] | 0) == 10) {
       break;
      } else {
       $$038 = $22; //@line 355
      }
     }
     $28 = FUNCTION_TABLE_iiii[HEAP32[$2 + 36 >> 2] & 3]($2, $0, $$038) | 0; //@line 360
     if ($28 >>> 0 < $$038 >>> 0) {
      $$1 = $28; //@line 363
      break L5;
     }
     $$139 = $$038; //@line 369
     $$141 = $0 + $$038 | 0; //@line 369
     $$143 = $1 - $$038 | 0; //@line 369
     $31 = HEAP32[$9 >> 2] | 0; //@line 369
    } else {
     $$139 = 0; //@line 371
     $$141 = $0; //@line 371
     $$143 = $1; //@line 371
     $31 = $14; //@line 371
    }
   } while (0);
   _memcpy($31 | 0, $$141 | 0, $$143 | 0) | 0; //@line 374
   HEAP32[$9 >> 2] = (HEAP32[$9 >> 2] | 0) + $$143; //@line 377
   $$1 = $$139 + $$143 | 0; //@line 379
  }
 } while (0);
 return $$1 | 0; //@line 382
}
function _memset(ptr, value, num) {
 ptr = ptr | 0;
 value = value | 0;
 num = num | 0;
 var end = 0, aligned_end = 0, block_aligned_end = 0, value4 = 0;
 end = ptr + num | 0; //@line 3930
 value = value & 255; //@line 3932
 if ((num | 0) >= 67) {
  while (ptr & 3) {
   HEAP8[ptr >> 0] = value; //@line 3935
   ptr = ptr + 1 | 0; //@line 3936
  }
  aligned_end = end & -4 | 0; //@line 3939
  block_aligned_end = aligned_end - 64 | 0; //@line 3940
  value4 = value | value << 8 | value << 16 | value << 24; //@line 3941
  while ((ptr | 0) <= (block_aligned_end | 0)) {
   HEAP32[ptr >> 2] = value4; //@line 3944
   HEAP32[ptr + 4 >> 2] = value4; //@line 3945
   HEAP32[ptr + 8 >> 2] = value4; //@line 3946
   HEAP32[ptr + 12 >> 2] = value4; //@line 3947
   HEAP32[ptr + 16 >> 2] = value4; //@line 3948
   HEAP32[ptr + 20 >> 2] = value4; //@line 3949
   HEAP32[ptr + 24 >> 2] = value4; //@line 3950
   HEAP32[ptr + 28 >> 2] = value4; //@line 3951
   HEAP32[ptr + 32 >> 2] = value4; //@line 3952
   HEAP32[ptr + 36 >> 2] = value4; //@line 3953
   HEAP32[ptr + 40 >> 2] = value4; //@line 3954
   HEAP32[ptr + 44 >> 2] = value4; //@line 3955
   HEAP32[ptr + 48 >> 2] = value4; //@line 3956
   HEAP32[ptr + 52 >> 2] = value4; //@line 3957
   HEAP32[ptr + 56 >> 2] = value4; //@line 3958
   HEAP32[ptr + 60 >> 2] = value4; //@line 3959
   ptr = ptr + 64 | 0; //@line 3960
  }
  while ((ptr | 0) < (aligned_end | 0)) {
   HEAP32[ptr >> 2] = value4; //@line 3964
   ptr = ptr + 4 | 0; //@line 3965
  }
 }
 while ((ptr | 0) < (end | 0)) {
  HEAP8[ptr >> 0] = value; //@line 3970
  ptr = ptr + 1 | 0; //@line 3971
 }
 return end - num | 0; //@line 3973
}
function _fflush($0) {
 $0 = $0 | 0;
 var $$0 = 0, $$02325 = 0, $$02327 = 0, $$024$lcssa = 0, $$02426 = 0, $$1 = 0, $26 = 0, $29 = 0, $7 = 0, $phitmp = 0;
 do {
  if (!$0) {
   if (!(HEAP32[95] | 0)) {
    $29 = 0; //@line 629
   } else {
    $29 = _fflush(HEAP32[95] | 0) | 0; //@line 633
   }
   $$02325 = HEAP32[(___ofl_lock() | 0) >> 2] | 0; //@line 636
   if (!$$02325) {
    $$024$lcssa = $29; //@line 639
   } else {
    $$02327 = $$02325; //@line 641
    $$02426 = $29; //@line 641
    while (1) {
     if ((HEAP32[$$02327 + 76 >> 2] | 0) > -1) {
      $26 = ___lockfile($$02327) | 0; //@line 648
     } else {
      $26 = 0; //@line 650
     }
     if ((HEAP32[$$02327 + 20 >> 2] | 0) >>> 0 > (HEAP32[$$02327 + 28 >> 2] | 0) >>> 0) {
      $$1 = ___fflush_unlocked($$02327) | 0 | $$02426; //@line 660
     } else {
      $$1 = $$02426; //@line 662
     }
     if ($26 | 0) {
      ___unlockfile($$02327); //@line 666
     }
     $$02327 = HEAP32[$$02327 + 56 >> 2] | 0; //@line 669
     if (!$$02327) {
      $$024$lcssa = $$1; //@line 672
      break;
     } else {
      $$02426 = $$1; //@line 675
     }
    }
   }
   ___ofl_unlock(); //@line 679
   $$0 = $$024$lcssa; //@line 680
  } else {
   if ((HEAP32[$0 + 76 >> 2] | 0) <= -1) {
    $$0 = ___fflush_unlocked($0) | 0; //@line 687
    break;
   }
   $phitmp = (___lockfile($0) | 0) == 0; //@line 691
   $7 = ___fflush_unlocked($0) | 0; //@line 692
   if ($phitmp) {
    $$0 = $7; //@line 694
   } else {
    ___unlockfile($0); //@line 696
    $$0 = $7; //@line 697
   }
  }
 } while (0);
 return $$0 | 0; //@line 701
}
function _strlen($0) {
 $0 = $0 | 0;
 var $$0 = 0, $$015$lcssa = 0, $$01519 = 0, $$1$lcssa = 0, $$pn = 0, $$sink = 0, $1 = 0, $10 = 0, $19 = 0, $23 = 0, $6 = 0, label = 0;
 $1 = $0; //@line 428
 L1 : do {
  if (!($1 & 3)) {
   $$015$lcssa = $0; //@line 433
   label = 4; //@line 434
  } else {
   $$01519 = $0; //@line 436
   $23 = $1; //@line 436
   while (1) {
    if (!(HEAP8[$$01519 >> 0] | 0)) {
     $$sink = $23; //@line 441
     break L1;
    }
    $6 = $$01519 + 1 | 0; //@line 444
    $23 = $6; //@line 445
    if (!($23 & 3)) {
     $$015$lcssa = $6; //@line 449
     label = 4; //@line 450
     break;
    } else {
     $$01519 = $6; //@line 453
    }
   }
  }
 } while (0);
 if ((label | 0) == 4) {
  $$0 = $$015$lcssa; //@line 459
  while (1) {
   $10 = HEAP32[$$0 >> 2] | 0; //@line 461
   if (!(($10 & -2139062144 ^ -2139062144) & $10 + -16843009)) {
    $$0 = $$0 + 4 | 0; //@line 469
   } else {
    break;
   }
  }
  if (!(($10 & 255) << 24 >> 24)) {
   $$1$lcssa = $$0; //@line 477
  } else {
   $$pn = $$0; //@line 479
   while (1) {
    $19 = $$pn + 1 | 0; //@line 481
    if (!(HEAP8[$19 >> 0] | 0)) {
     $$1$lcssa = $19; //@line 485
     break;
    } else {
     $$pn = $19; //@line 488
    }
   }
  }
  $$sink = $$1$lcssa; //@line 493
 }
 return $$sink - $1 | 0; //@line 496
}
function ___overflow($0, $1) {
 $0 = $0 | 0;
 $1 = $1 | 0;
 var $$0 = 0, $10 = 0, $12 = 0, $13 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP; //@line 550
 STACKTOP = STACKTOP + 16 | 0; //@line 551
 $2 = sp; //@line 552
 $3 = $1 & 255; //@line 553
 HEAP8[$2 >> 0] = $3; //@line 554
 $4 = $0 + 16 | 0; //@line 555
 $5 = HEAP32[$4 >> 2] | 0; //@line 556
 if (!$5) {
  if (!(___towrite($0) | 0)) {
   $12 = HEAP32[$4 >> 2] | 0; //@line 563
   label = 4; //@line 564
  } else {
   $$0 = -1; //@line 566
  }
 } else {
  $12 = $5; //@line 569
  label = 4; //@line 570
 }
 do {
  if ((label | 0) == 4) {
   $9 = $0 + 20 | 0; //@line 574
   $10 = HEAP32[$9 >> 2] | 0; //@line 575
   if ($10 >>> 0 < $12 >>> 0) {
    $13 = $1 & 255; //@line 578
    if (($13 | 0) != (HEAP8[$0 + 75 >> 0] | 0)) {
     HEAP32[$9 >> 2] = $10 + 1; //@line 585
     HEAP8[$10 >> 0] = $3; //@line 586
     $$0 = $13; //@line 587
     break;
    }
   }
   if ((FUNCTION_TABLE_iiii[HEAP32[$0 + 36 >> 2] & 3]($0, $2, 1) | 0) == 1) {
    $$0 = HEAPU8[$2 >> 0] | 0; //@line 598
   } else {
    $$0 = -1; //@line 600
   }
  }
 } while (0);
 STACKTOP = sp; //@line 604
 return $$0 | 0; //@line 604
}
function ___fflush_unlocked($0) {
 $0 = $0 | 0;
 var $$0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $3 = 0, label = 0;
 $1 = $0 + 20 | 0; //@line 708
 $3 = $0 + 28 | 0; //@line 710
 if ((HEAP32[$1 >> 2] | 0) >>> 0 > (HEAP32[$3 >> 2] | 0) >>> 0) {
  FUNCTION_TABLE_iiii[HEAP32[$0 + 36 >> 2] & 3]($0, 0, 0) | 0; //@line 716
  if (!(HEAP32[$1 >> 2] | 0)) {
   $$0 = -1; //@line 720
  } else {
   label = 3; //@line 722
  }
 } else {
  label = 3; //@line 725
 }
 if ((label | 0) == 3) {
  $10 = $0 + 4 | 0; //@line 728
  $11 = HEAP32[$10 >> 2] | 0; //@line 729
  $12 = $0 + 8 | 0; //@line 730
  $13 = HEAP32[$12 >> 2] | 0; //@line 731
  if ($11 >>> 0 < $13 >>> 0) {
   FUNCTION_TABLE_iiii[HEAP32[$0 + 40 >> 2] & 3]($0, $11 - $13 | 0, 1) | 0; //@line 739
  }
  HEAP32[$0 + 16 >> 2] = 0; //@line 742
  HEAP32[$3 >> 2] = 0; //@line 743
  HEAP32[$1 >> 2] = 0; //@line 744
  HEAP32[$12 >> 2] = 0; //@line 745
  HEAP32[$10 >> 2] = 0; //@line 746
  $$0 = 0; //@line 747
 }
 return $$0 | 0; //@line 749
}
function runPostSets() {}
function _sbrk(increment) {
 increment = increment | 0;
 var oldDynamicTop = 0, newDynamicTop = 0;
 increment = increment + 15 & -16 | 0; //@line 3905
 oldDynamicTop = HEAP32[DYNAMICTOP_PTR >> 2] | 0; //@line 3906
 newDynamicTop = oldDynamicTop + increment | 0; //@line 3907
 if ((increment | 0) > 0 & (newDynamicTop | 0) < (oldDynamicTop | 0) | (newDynamicTop | 0) < 0) {
  abortOnCannotGrowMemory() | 0; //@line 3911
  ___setErrNo(12); //@line 3912
  return -1;
 }
 HEAP32[DYNAMICTOP_PTR >> 2] = newDynamicTop; //@line 3916
 if ((newDynamicTop | 0) > (getTotalMemory() | 0)) {
  if (!(enlargeMemory() | 0)) {
   ___setErrNo(12); //@line 3920
   HEAP32[DYNAMICTOP_PTR >> 2] = oldDynamicTop; //@line 3921
   return -1;
  }
 }
 return oldDynamicTop | 0; //@line 3925
}
function _puts($0) {
 $0 = $0 | 0;
 var $1 = 0, $11 = 0, $12 = 0, $19 = 0, $21 = 0;
 $1 = HEAP32[63] | 0; //@line 756
 if ((HEAP32[$1 + 76 >> 2] | 0) > -1) {
  $21 = ___lockfile($1) | 0; //@line 762
 } else {
  $21 = 0; //@line 764
 }
 do {
  if ((_fputs($0, $1) | 0) < 0) {
   $19 = 1; //@line 770
  } else {
   if ((HEAP8[$1 + 75 >> 0] | 0) != 10) {
    $11 = $1 + 20 | 0; //@line 776
    $12 = HEAP32[$11 >> 2] | 0; //@line 777
    if ($12 >>> 0 < (HEAP32[$1 + 16 >> 2] | 0) >>> 0) {
     HEAP32[$11 >> 2] = $12 + 1; //@line 783
     HEAP8[$12 >> 0] = 10; //@line 784
     $19 = 0; //@line 785
     break;
    }
   }
   $19 = (___overflow($1, 10) | 0) < 0; //@line 791
  }
 } while (0);
 if ($21 | 0) {
  ___unlockfile($1); //@line 797
 }
 return $19 << 31 >> 31 | 0; //@line 799
}
function ___stdio_seek($0, $1, $2) {
 $0 = $0 | 0;
 $1 = $1 | 0;
 $2 = $2 | 0;
 var $10 = 0, $3 = 0, $vararg_buffer = 0, sp = 0;
 sp = STACKTOP; //@line 184
 STACKTOP = STACKTOP + 32 | 0; //@line 185
 $vararg_buffer = sp; //@line 186
 $3 = sp + 20 | 0; //@line 187
 HEAP32[$vararg_buffer >> 2] = HEAP32[$0 + 60 >> 2]; //@line 191
 HEAP32[$vararg_buffer + 4 >> 2] = 0; //@line 193
 HEAP32[$vararg_buffer + 8 >> 2] = $1; //@line 195
 HEAP32[$vararg_buffer + 12 >> 2] = $3; //@line 197
 HEAP32[$vararg_buffer + 16 >> 2] = $2; //@line 199
 if ((___syscall_ret(___syscall140(140, $vararg_buffer | 0) | 0) | 0) < 0) {
  HEAP32[$3 >> 2] = -1; //@line 204
  $10 = -1; //@line 205
 } else {
  $10 = HEAP32[$3 >> 2] | 0; //@line 208
 }
 STACKTOP = sp; //@line 210
 return $10 | 0; //@line 210
}
function _fwrite($0, $1, $2, $3) {
 $0 = $0 | 0;
 $1 = $1 | 0;
 $2 = $2 | 0;
 $3 = $3 | 0;
 var $$ = 0, $11 = 0, $13 = 0, $15 = 0, $4 = 0, $phitmp = 0;
 $4 = Math_imul($2, $1) | 0; //@line 516
 $$ = ($1 | 0) == 0 ? 0 : $2; //@line 518
 if ((HEAP32[$3 + 76 >> 2] | 0) > -1) {
  $phitmp = (___lockfile($3) | 0) == 0; //@line 524
  $11 = ___fwritex($0, $4, $3) | 0; //@line 525
  if ($phitmp) {
   $13 = $11; //@line 527
  } else {
   ___unlockfile($3); //@line 529
   $13 = $11; //@line 530
  }
 } else {
  $13 = ___fwritex($0, $4, $3) | 0; //@line 534
 }
 if (($13 | 0) == ($4 | 0)) {
  $15 = $$; //@line 538
 } else {
  $15 = ($13 >>> 0) / ($1 >>> 0) | 0; //@line 541
 }
 return $15 | 0; //@line 543
}
function ___stdout_write($0, $1, $2) {
 $0 = $0 | 0;
 $1 = $1 | 0;
 $2 = $2 | 0;
 var $14 = 0, $vararg_buffer = 0, sp = 0;
 sp = STACKTOP; //@line 256
 STACKTOP = STACKTOP + 32 | 0; //@line 257
 $vararg_buffer = sp; //@line 258
 HEAP32[$0 + 36 >> 2] = 3; //@line 261
 if (!(HEAP32[$0 >> 2] & 64)) {
  HEAP32[$vararg_buffer >> 2] = HEAP32[$0 + 60 >> 2]; //@line 269
  HEAP32[$vararg_buffer + 4 >> 2] = 21523; //@line 271
  HEAP32[$vararg_buffer + 8 >> 2] = sp + 16; //@line 273
  if (___syscall54(54, $vararg_buffer | 0) | 0) {
   HEAP8[$0 + 75 >> 0] = -1; //@line 278
  }
 }
 $14 = ___stdio_write($0, $1, $2) | 0; //@line 281
 STACKTOP = sp; //@line 282
 return $14 | 0; //@line 282
}
function ___towrite($0) {
 $0 = $0 | 0;
 var $$0 = 0, $1 = 0, $14 = 0, $3 = 0, $7 = 0;
 $1 = $0 + 74 | 0; //@line 389
 $3 = HEAP8[$1 >> 0] | 0; //@line 391
 HEAP8[$1 >> 0] = $3 + 255 | $3; //@line 395
 $7 = HEAP32[$0 >> 2] | 0; //@line 396
 if (!($7 & 8)) {
  HEAP32[$0 + 8 >> 2] = 0; //@line 401
  HEAP32[$0 + 4 >> 2] = 0; //@line 403
  $14 = HEAP32[$0 + 44 >> 2] | 0; //@line 405
  HEAP32[$0 + 28 >> 2] = $14; //@line 407
  HEAP32[$0 + 20 >> 2] = $14; //@line 409
  HEAP32[$0 + 16 >> 2] = $14 + (HEAP32[$0 + 48 >> 2] | 0); //@line 414
  $$0 = 0; //@line 415
 } else {
  HEAP32[$0 >> 2] = $7 | 32; //@line 418
  $$0 = -1; //@line 419
 }
 return $$0 | 0; //@line 421
}
function ___stdio_close($0) {
 $0 = $0 | 0;
 var $5 = 0, $vararg_buffer = 0, sp = 0;
 sp = STACKTOP; //@line 55
 STACKTOP = STACKTOP + 16 | 0; //@line 56
 $vararg_buffer = sp; //@line 57
 HEAP32[$vararg_buffer >> 2] = _dummy_738(HEAP32[$0 + 60 >> 2] | 0) | 0; //@line 61
 $5 = ___syscall_ret(___syscall6(6, $vararg_buffer | 0) | 0) | 0; //@line 63
 STACKTOP = sp; //@line 64
 return $5 | 0; //@line 64
}
function ___syscall_ret($0) {
 $0 = $0 | 0;
 var $$0 = 0;
 if ($0 >>> 0 > 4294963200) {
  HEAP32[(___errno_location() | 0) >> 2] = 0 - $0; //@line 220
  $$0 = -1; //@line 221
 } else {
  $$0 = $0; //@line 223
 }
 return $$0 | 0; //@line 225
}
function stackAlloc(size) {
 size = size | 0;
 var ret = 0;
 ret = STACKTOP; //@line 4
 STACKTOP = STACKTOP + size | 0; //@line 5
 STACKTOP = STACKTOP + 15 & -16; //@line 6
 return ret | 0; //@line 8
}
function dynCall_iiii(index, a1, a2, a3) {
 index = index | 0;
 a1 = a1 | 0;
 a2 = a2 | 0;
 a3 = a3 | 0;
 return FUNCTION_TABLE_iiii[index & 3](a1 | 0, a2 | 0, a3 | 0) | 0; //@line 4058
}
function _fputs($0, $1) {
 $0 = $0 | 0;
 $1 = $1 | 0;
 var $2 = 0;
 $2 = _strlen($0) | 0; //@line 503
 return ((_fwrite($0, 1, $2, $1) | 0) != ($2 | 0)) << 31 >> 31 | 0; //@line 507
}
function establishStackSpace(stackBase, stackMax) {
 stackBase = stackBase | 0;
 stackMax = stackMax | 0;
 STACKTOP = stackBase; //@line 20
 STACK_MAX = stackMax; //@line 21
}
function setThrew(threw, value) {
 threw = threw | 0;
 value = value | 0;
 if (!__THREW__) {
  __THREW__ = threw; //@line 28
  threwValue = value; //@line 29
 }
}
function dynCall_ii(index, a1) {
 index = index | 0;
 a1 = a1 | 0;
 return FUNCTION_TABLE_ii[index & 1](a1 | 0) | 0; //@line 4051
}
function b1(p0, p1, p2) {
 p0 = p0 | 0;
 p1 = p1 | 0;
 p2 = p2 | 0;
 abort(1); //@line 4065
 return 0; //@line 4065
}
function ___errno_location() {
 return (___pthread_self_108() | 0) + 64 | 0; //@line 232
}
function setTempRet0(value) {
 value = value | 0;
 tempRet0 = value; //@line 35
}
function b0(p0) {
 p0 = p0 | 0;
 abort(0); //@line 4062
 return 0; //@line 4062
}
function ___ofl_lock() {
 ___lock(464); //@line 609
 return 472; //@line 610
}
function ___pthread_self_108() {
 return _pthread_self() | 0; //@line 238
}
function stackRestore(top) {
 top = top | 0;
 STACKTOP = top; //@line 15
}
function _main() {
 _puts(384) | 0; //@line 44
 return 0; //@line 45
}
function _dummy_738($0) {
 $0 = $0 | 0;
 return $0 | 0; //@line 249
}
function _emscripten_get_global_libc() {
 return 400; //@line 50
}
function ___ofl_unlock() {
 ___unlock(464); //@line 615
 return;
}
function ___lockfile($0) {
 $0 = $0 | 0;
 return 0; //@line 288
}
function getTempRet0() {
 return tempRet0 | 0; //@line 38
}
function stackSave() {
 return STACKTOP | 0; //@line 11
}
function ___unlockfile($0) {
 $0 = $0 | 0;
 return;
}
function _pthread_self() {
 return 8; //@line 243
}

// EMSCRIPTEN_END_FUNCS
var FUNCTION_TABLE_ii = [b0,___stdio_close];
var FUNCTION_TABLE_iiii = [b1,___stdout_write,___stdio_seek,___stdio_write];

  return { _sbrk: _sbrk, _free: _free, _main: _main, _memset: _memset, _malloc: _malloc, _emscripten_get_global_libc: _emscripten_get_global_libc, _memcpy: _memcpy, _fflush: _fflush, ___errno_location: ___errno_location, runPostSets: runPostSets, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, establishStackSpace: establishStackSpace, setTempRet0: setTempRet0, getTempRet0: getTempRet0, setThrew: setThrew, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, establishStackSpace: establishStackSpace, setThrew: setThrew, setTempRet0: setTempRet0, getTempRet0: getTempRet0, dynCall_ii: dynCall_ii, dynCall_iiii: dynCall_iiii };
})
// EMSCRIPTEN_END_ASM
(Module.asmGlobalArg, Module.asmLibraryArg, buffer);

var _malloc = Module["_malloc"] = asm["_malloc"];
var getTempRet0 = Module["getTempRet0"] = asm["getTempRet0"];
var _free = Module["_free"] = asm["_free"];
var _main = Module["_main"] = asm["_main"];
var setTempRet0 = Module["setTempRet0"] = asm["setTempRet0"];
var establishStackSpace = Module["establishStackSpace"] = asm["establishStackSpace"];
var stackSave = Module["stackSave"] = asm["stackSave"];
var _memset = Module["_memset"] = asm["_memset"];
var _sbrk = Module["_sbrk"] = asm["_sbrk"];
var _emscripten_get_global_libc = Module["_emscripten_get_global_libc"] = asm["_emscripten_get_global_libc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var stackAlloc = Module["stackAlloc"] = asm["stackAlloc"];
var setThrew = Module["setThrew"] = asm["setThrew"];
var _fflush = Module["_fflush"] = asm["_fflush"];
var stackRestore = Module["stackRestore"] = asm["stackRestore"];
var ___errno_location = Module["___errno_location"] = asm["___errno_location"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
;

Runtime.stackAlloc = Module['stackAlloc'];
Runtime.stackSave = Module['stackSave'];
Runtime.stackRestore = Module['stackRestore'];
Runtime.establishStackSpace = Module['establishStackSpace'];

Runtime.setTempRet0 = Module['setTempRet0'];
Runtime.getTempRet0 = Module['getTempRet0'];



// === Auto-generated postamble setup entry stuff ===

Module['asm'] = asm;



if (memoryInitializer) {
  if (typeof Module['locateFile'] === 'function') {
    memoryInitializer = Module['locateFile'](memoryInitializer);
  } else if (Module['memoryInitializerPrefixURL']) {
    memoryInitializer = Module['memoryInitializerPrefixURL'] + memoryInitializer;
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module['readBinary'](memoryInitializer);
    HEAPU8.set(data, Runtime.GLOBAL_BASE);
  } else {
    addRunDependency('memory initializer');
    var applyMemoryInitializer = function(data) {
      if (data.byteLength) data = new Uint8Array(data);
      HEAPU8.set(data, Runtime.GLOBAL_BASE);
      // Delete the typed array that contains the large blob of the memory initializer request response so that
      // we won't keep unnecessary memory lying around. However, keep the XHR object itself alive so that e.g.
      // its .status field can still be accessed later.
      if (Module['memoryInitializerRequest']) delete Module['memoryInitializerRequest'].response;
      removeRunDependency('memory initializer');
    }
    function doBrowserLoad() {
      Module['readAsync'](memoryInitializer, applyMemoryInitializer, function() {
        throw 'could not load memory initializer ' + memoryInitializer;
      });
    }
    if (Module['memoryInitializerRequest']) {
      // a network request has already been created, just use that
      function useRequest() {
        var request = Module['memoryInitializerRequest'];
        if (request.status !== 200 && request.status !== 0) {
          // If you see this warning, the issue may be that you are using locateFile or memoryInitializerPrefixURL, and defining them in JS. That
          // means that the HTML file doesn't know about them, and when it tries to create the mem init request early, does it to the wrong place.
          // Look in your browser's devtools network console to see what's going on.
          console.warn('a problem seems to have happened with Module.memoryInitializerRequest, status: ' + request.status + ', retrying ' + memoryInitializer);
          doBrowserLoad();
          return;
        }
        applyMemoryInitializer(request.response);
      }
      if (Module['memoryInitializerRequest'].response) {
        setTimeout(useRequest, 0); // it's already here; but, apply it asynchronously
      } else {
        Module['memoryInitializerRequest'].addEventListener('load', useRequest); // wait for it
      }
    } else {
      // fetch it from the network ourselves
      doBrowserLoad();
    }
  }
}


function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun']) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = Module.callMain = function callMain(args) {

  args = args || [];

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString(Module['thisProgram']), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);


  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
    exit(ret, /* implicit = */ true);
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      var toLog = e;
      if (e && typeof e === 'object' && e.stack) {
        toLog = [e, e.stack];
      }
      Module.printErr('exception thrown: ' + toLog);
      Module['quit'](1, e);
    }
  } finally {
    calledMain = true;
  }
}




function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    return;
  }


  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    if (ABORT) return;

    ensureInitRuntime();

    preMain();


    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    if (Module['_main'] && shouldRunNow) Module['callMain'](args);

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;

function exit(status, implicit) {
  if (implicit && Module['noExitRuntime']) {
    return;
  }

  if (Module['noExitRuntime']) {
  } else {

    ABORT = true;
    EXITSTATUS = status;
    STACKTOP = initialStackTop;

    exitRuntime();

    if (Module['onExit']) Module['onExit'](status);
  }

  if (ENVIRONMENT_IS_NODE) {
    process['exit'](status);
  }
  Module['quit'](status, new ExitStatus(status));
}
Module['exit'] = Module.exit = exit;

var abortDecorators = [];

function abort(what) {
  if (what !== undefined) {
    Module.print(what);
    Module.printErr(what);
    what = JSON.stringify(what)
  } else {
    what = '';
  }

  ABORT = true;
  EXITSTATUS = 1;

  var extra = '\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.';

  var output = 'abort(' + what + ') at ' + stackTrace() + extra;
  if (abortDecorators) {
    abortDecorators.forEach(function(decorator) {
      output = decorator(output, what);
    });
  }
  throw output;
}
Module['abort'] = Module.abort = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}


run();

// {{POST_RUN_ADDITIONS}}





// {{MODULE_ADDITIONS}}






//# sourceMappingURL=a.out.js.map