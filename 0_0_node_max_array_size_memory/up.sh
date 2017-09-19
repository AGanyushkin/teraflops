#!/usr/bin/env bash

node \
    --max-old-space-size=8192 \
    --trace-gc-verbose \
    ./launch.js
