#!/bin/bash
# Safe build script that preserves the existing binary

echo "🔨 Safe Build Script for Cortex Agent"
echo "===================================="

# Create bin directory if it doesn't exist
mkdir -p bin

# Backup existing binary if it exists
if [ -f "bin/cortex-agent" ]; then
    echo "📦 Backing up existing binary..."
    cp bin/cortex-agent bin/cortex-agent.backup
fi

# Set Deno path
export PATH="/home/codespace/.deno/bin:$PATH"

# Build to a temporary file first
echo "🏗️  Building Cortex Agent..."
if deno compile --allow-all --no-check --output=bin/cortex-agent.tmp src/cli/main.ts 2>/dev/null; then
    echo "✅ Build successful!"
    
    # Remove old binary and move new one
    if [ -f "bin/cortex-agent.tmp" ]; then
        mv -f bin/cortex-agent.tmp bin/cortex-agent
        chmod +x bin/cortex-agent
        echo "✅ Binary updated successfully!"
        
        # Remove backup since build was successful
        rm -f bin/cortex-agent.backup
    fi
else
    echo "❌ Build failed!"
    
    # Restore backup if build failed
    if [ -f "bin/cortex-agent.backup" ]; then
        echo "🔄 Restoring backup..."
        mv bin/cortex-agent.backup bin/cortex-agent
        echo "✅ Backup restored!"
    fi
    
    exit 1
fi

# Build prompt copier CLI
echo "🏗️  Building Prompt Copier CLI..."
if deno compile --allow-all --no-check --output=bin/prompt-copier.tmp src/swarm/prompt-cli.ts 2>/dev/null; then
    echo "✅ Prompt copier build successful!"
    
    if [ -f "bin/prompt-copier.tmp" ]; then
        mv -f bin/prompt-copier.tmp bin/prompt-copier
        chmod +x bin/prompt-copier
        echo "✅ Prompt copier binary updated successfully!"
    fi
else
    echo "⚠️  Prompt copier build failed - continuing without it"
fi

echo ""
echo "✅ Build complete!"
echo "   Cortex Agent binary: bin/cortex-agent"
echo "   Prompt Copier binary: bin/prompt-copier"