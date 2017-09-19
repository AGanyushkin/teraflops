#!/bin/bash

# to js 

emcc empty.cpp
mv a.out.js empty.out.js

emcc hello_print.cpp
mv a.out.js hello_print.out.js

emcc hello_cout.cpp #-o empty.html
mv a.out.js hello_cout.out.js

# to asmjs

emcc empty.cpp -O3
mv a.out.js empty.out.asmjs.js

emcc hello_print.cpp -O3
mv a.out.js hello_print.out.asmjs.js

emcc hello_cout.cpp -O3
mv a.out.js hello_cout.out.asmjs.js


# with source map

emcc hello_print.cpp -O3 -g4

emcc hello_print.cpp -O3 -g4 -o index.html

