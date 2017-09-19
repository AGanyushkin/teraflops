#!/usr/bin/env bash

node \
    --max-old-space-size=2048 \
    --trace-gc-verbose \
    ./launch.js
