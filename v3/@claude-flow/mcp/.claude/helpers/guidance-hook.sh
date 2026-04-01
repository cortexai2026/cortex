#!/bin/bash
# Capture hook guidance for Claude visibility
GUIDANCE_FILE=".cortex-agent/last-guidance.txt"
mkdir -p .cortex-agent

case "$1" in
  "route")
    npx agentic-flow@alpha hooks route "$2" 2>&1 | tee "$GUIDANCE_FILE"
    ;;
  "pre-edit")
    npx agentic-flow@alpha hooks pre-edit "$2" 2>&1 | tee "$GUIDANCE_FILE"
    ;;
esac
