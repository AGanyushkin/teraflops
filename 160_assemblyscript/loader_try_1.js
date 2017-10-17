const load = require("assemblyscript-loader").load;

load("./build/out.64.nort.wasm", {
  
})
  .then(module => {
    console.log(
      module.exports.add(1.2, 2.0001)
    )
  })
  .catch(console.log);
