#!/bin/bash
# Publish script for @cortex-agent/cli
# Publishes to both @cortex-agent/cli@alpha AND cortex-agent@v3alpha

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_DIR="$(dirname "$SCRIPT_DIR")"

cd "$CLI_DIR"

# Get current version
VERSION=$(node -p "require('./package.json').version")
echo "Publishing version: $VERSION"

# 1. Publish @cortex-agent/cli with alpha tag
echo ""
echo "=== Publishing @cortex-agent/cli@$VERSION (alpha tag) ==="
npm publish --tag alpha

# 2. Publish to cortex-agent with v3alpha tag
echo ""
echo "=== Publishing cortex-agent@$VERSION (v3alpha tag) ==="

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Copy necessary files
cp -r dist bin src package.json README.md "$TEMP_DIR/"

# Change package name to unscoped
cd "$TEMP_DIR"
sed -i 's/"name": "@cortex-agent\/cli"/"name": "cortex-agent"/' package.json

# Publish with v3alpha tag
npm publish --tag v3alpha

echo ""
echo "=== Updating dist-tags ==="

# Update all tags to point to the new version
npm dist-tag add @cortex-agent/cli@$VERSION alpha
npm dist-tag add @cortex-agent/cli@$VERSION latest
npm dist-tag add @cortex-agent/cli@$VERSION v3alpha
npm dist-tag add cortex-agent@$VERSION alpha
npm dist-tag add cortex-agent@$VERSION latest
npm dist-tag add cortex-agent@$VERSION v3alpha

echo ""
echo "=== Published successfully ==="
echo "  @cortex-agent/cli@$VERSION (alpha, latest, v3alpha)"
echo "  cortex-agent@$VERSION (alpha, latest, v3alpha)"
echo ""
echo "Install with:"
echo "  npx cortex-agent@alpha"
echo "  npx @cortex-agent/cli@latest"
