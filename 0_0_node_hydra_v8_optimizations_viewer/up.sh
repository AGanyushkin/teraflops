#!/usr/bin/env bash

rm -f code.*

node \
    --trace-hydrogen \
    --trace-phase=Z \
    --trace-deopt \
    --code-comments \
    --hydrogen-track-positions \
    --redirect-code-traces \
    --redirect-code-traces-to=code.asm \
    --trace_hydrogen_file=code.cfg \
    --print-opt-code \
    ./launcher.js

dos2unix code.*
