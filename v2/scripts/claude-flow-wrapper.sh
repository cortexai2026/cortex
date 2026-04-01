#!/usr/bin/env bash
# Claude-Flow local wrapper
# This script ensures cortex-agent runs from your project directory
# Compatible with both CommonJS and ES Module projects

# Save the current directory
PROJECT_DIR="${PWD}"

# Set environment to ensure correct working directory
export PWD="${PROJECT_DIR}"
export CLAUDE_WORKING_DIR="${PROJECT_DIR}"

# Try to find cortex-agent binary
# Check common locations for npm/npx installations

# 1. Local node_modules (npm install cortex-agent)
if [ -f "${PROJECT_DIR}/node_modules/.bin/cortex-agent" ]; then
  cd "${PROJECT_DIR}"
  exec "${PROJECT_DIR}/node_modules/.bin/cortex-agent" "$@"

# 2. Parent directory node_modules (monorepo setup)
elif [ -f "${PROJECT_DIR}/../node_modules/.bin/cortex-agent" ]; then
  cd "${PROJECT_DIR}"
  exec "${PROJECT_DIR}/../node_modules/.bin/cortex-agent" "$@"

# 3. Global installation (npm install -g cortex-agent)
elif command -v cortex-agent &> /dev/null; then
  cd "${PROJECT_DIR}"
  exec cortex-agent "$@"

# 4. Fallback to npx (will download if needed)
else
  cd "${PROJECT_DIR}"
  exec npx cortex-agent@latest "$@"
fi