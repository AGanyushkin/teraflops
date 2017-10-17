const { Compiler, CompilerTarget, CompilerMemoryModel, typescript } = require("assemblyscript");

const xxx = Compiler.compileString(`
export function add(a: i32, b: i32): i32 {
  return a + b;
}
`, {
  target: CompilerTarget.WASM32,
  silent: false,
  noRuntime: false
});

// console.error(typescript.formatDiagnostics(Compiler.lastDiagnostics));
// console.log(Compiler.lastDiagnostics);

if (!xxx)
  throw Error("compilation failed");

xxx.optimize();

if (!xxx.validate())
  throw Error("validation failed");

const textFile = xxx.emitText();
const wasmFile = xxx.emitBinary();

// console.log(textFile);
// console.log(wasmFile);
console.log(xxx);

// console.log(xxx.add(1, 2));

xxx.dispose();
