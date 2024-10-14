#!/bin/bash

find . \
    \( \
    -name bun.lockb \
    -o -name 'vite.config.ts.*' \
    -o -type d -name node_modules \
    -o -type d -name dist \
    -o -name d -name logs \
    -o -name d -name cache \
    -o -name d -name tmp \
    \) \
    -exec rm -rf {} +

find . -type d -empty -delete

echo "✅ Pruned project"
