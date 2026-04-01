#!/bin/bash
# Memory Management - Consolidate Script
# Optimize and consolidate memory

set -e

echo "Running memory consolidation..."
npx @cortex-agent/cli hooks worker dispatch --trigger consolidate

echo "Memory consolidation complete"
npx @cortex-agent/cli memory stats
