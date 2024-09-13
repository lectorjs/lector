#!/bin/bash
find . \
    \( \
    -name bun.lockb \
    -o -type d -name node_modules \
    -o -type d -name build \
    -o -type d -name dist \
    -o -type d -name .svelte-kit \
    -o -name 'vite.config.ts.*' \
    \) \
    -exec rm -rf {} +

find . -type d -empty -delete

echo "✅ Workspace pruned"
