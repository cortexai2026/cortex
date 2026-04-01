#!/bin/bash
# Workaround build script for Deno deprecation warning

echo "🔨 Building Cortex Agent with workaround..."

# Ensure bin directory exists
mkdir -p bin

# Set Deno path
export PATH="/home/codespace/.deno/bin:$PATH"

# First, try to build normally to a temp file
echo "Attempting build..."

# Build command that continues despite warnings
(deno compile --allow-all --no-check --output=bin/cortex-agent.tmp src/cli/main.ts 2>&1 || true) | grep -v "Import assertions are deprecated"

# Check if the temporary binary was created despite the error
if [ -f "bin/cortex-agent.tmp" ]; then
    echo "✅ Build artifact created!"
    
    # The binary might still work, so let's test it
    if bin/cortex-agent.tmp --version &>/dev/null; then
        echo "✅ Binary is functional!"
        
        # Backup existing binary
        if [ -f "bin/cortex-agent" ]; then
            cp bin/cortex-agent bin/cortex-agent.backup
        fi
        
        # Replace with new binary
        mv bin/cortex-agent.tmp bin/cortex-agent
        chmod +x bin/cortex-agent
        echo "✅ Build successful!"
        exit 0
    else
        echo "❌ Binary is not functional"
        rm -f bin/cortex-agent.tmp
    fi
fi

# If we get here, try bundling as a fallback
echo "Trying bundle approach..."

# Bundle the TypeScript to JavaScript first
if deno bundle src/cli/main.ts bin/cortex-agent.bundle.js &>/dev/null; then
    # Create a wrapper script
    cat > bin/cortex-agent.new << 'EOF'
#!/usr/bin/env -S deno run --allow-all --no-check
import "./cortex-agent.bundle.js";
EOF
    
    chmod +x bin/cortex-agent.new
    
    # Test the wrapper
    if bin/cortex-agent.new --version &>/dev/null; then
        echo "✅ Bundle wrapper is functional!"
        
        # Backup and replace
        if [ -f "bin/cortex-agent" ]; then
            cp bin/cortex-agent bin/cortex-agent.backup
        fi
        mv bin/cortex-agent.new bin/cortex-agent
        echo "✅ Build successful (bundle mode)!"
        exit 0
    fi
fi

echo "❌ All build attempts failed"
echo "Keeping existing binary in place"
exit 1