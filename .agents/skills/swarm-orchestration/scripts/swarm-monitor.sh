#!/bin/bash
# Swarm Orchestration - Monitor Script
# Real-time swarm monitoring

set -e

echo "Starting swarm monitor..."
npx @cortex-agent/cli swarm status --watch --interval 5
