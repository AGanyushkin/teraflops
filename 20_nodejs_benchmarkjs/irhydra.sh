#!/usr/bin/env bash

nvm use 8.1.4

node --trace-hydrogen \
	--trace-phase=Z \
	--trace-deopt \
	--code-comments \
	--hydrogen-track-positions \
	--redirect-code-traces \
	--redirect-code-traces-to=code.asm \
	--trace_hydrogen_file=code.cfg \
	--print-opt-code \
	try1.js

# node --trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces --redirect-code-traces-to=code.asm --trace_hydrogen_file=code.cfg --print-opt-code try1.js

# node --trace-deopt try1.js
