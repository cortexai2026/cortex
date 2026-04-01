#!/bin/bash
#
# Phase 7: Validation Script
# Validates implementation with real Claude-Flow CLI commands
#

set -e

echo "=========================================="
echo "Phase 7: CLI Validation"
echo "=========================================="
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

VALIDATION_PASSED=0
VALIDATION_FAILED=0

validate_command() {
  local description=$1
  local command=$2

  echo "Testing: $description"
  echo "Command: $command"

  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Passed${NC}"
    VALIDATION_PASSED=$((VALIDATION_PASSED + 1))
  else
    echo -e "${RED}✗ Failed${NC}"
    VALIDATION_FAILED=$((VALIDATION_FAILED + 1))
  fi
  echo ""
}

echo "=== Session Forking Tests ==="
echo ""

validate_command \
  "Swarm initialization with topology" \
  "./bin/cortex-agent swarm init --topology mesh --max-agents 10"

validate_command \
  "Agent spawn command" \
  "./bin/cortex-agent agent spawn --type coder --capabilities code_generation"

validate_command \
  "Swarm status check" \
  "./bin/cortex-agent swarm status"

echo "=== Hook Matcher Tests ==="
echo ""

validate_command \
  "Pre-task hook with file pattern" \
  "./bin/cortex-agent hooks pre-task --description 'Test task' --file 'src/**/*.ts'"

validate_command \
  "Post-edit hook with memory key" \
  "./bin/cortex-agent hooks post-edit --file 'test.ts' --memory-key 'test/key'"

validate_command \
  "Notify hook" \
  "./bin/cortex-agent hooks notify --message 'Test notification'"

echo "=== In-Process MCP Tests ==="
echo ""

validate_command \
  "MCP server status" \
  "./bin/cortex-agent mcp status"

validate_command \
  "Session restore" \
  "./bin/cortex-agent hooks session-restore --session-id 'test-session'"

echo "=== Memory Operations Tests ==="
echo ""

validate_command \
  "Session end with metrics" \
  "./bin/cortex-agent hooks session-end --export-metrics true"

validate_command \
  "Post-task hook" \
  "./bin/cortex-agent hooks post-task --task-id 'test-task-123'"

echo ""
echo "=========================================="
echo "Validation Summary"
echo "=========================================="
echo ""
echo "Passed: $VALIDATION_PASSED"
echo "Failed: $VALIDATION_FAILED"
echo ""

if [ $VALIDATION_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All CLI validations passed!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠ Some CLI validations failed${NC}"
  exit 1
fi