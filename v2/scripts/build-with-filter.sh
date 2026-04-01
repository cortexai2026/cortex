#!/bin/bash
# Build script that works around Deno compile deprecation warnings

echo "🔨 Building Cortex Agent (filtering deprecation warnings)..."

# Ensure bin directory exists
mkdir -p bin

# Set Deno path
export PATH="/home/codespace/.deno/bin:$PATH"

# Remove any existing binary to avoid conflicts
rm -f bin/cortex-agent

# Create a temporary script that will capture the build process
cat > /tmp/deno-build.sh << 'EOF'
#!/bin/bash
# Run deno compile and capture all output
deno compile --allow-all --no-check --output bin/cortex-agent src/cli/main.ts 2>&1
EOF

chmod +x /tmp/deno-build.sh

# Run the build and capture output
BUILD_OUTPUT=$(/tmp/deno-build.sh)
BUILD_EXIT_CODE=$?

# Check if the binary was created despite the error
if [ -f "bin/cortex-agent" ]; then
    echo "✅ Binary created successfully!"
    chmod +x bin/cortex-agent
    
    # Test if it works
    if bin/cortex-agent --version &>/dev/null; then
        echo "✅ Binary is functional!"
        echo "📍 Location: bin/cortex-agent"
        exit 0
    else
        echo "⚠️  Binary was created but may not be functional"
    fi
else
    # Check for temporary files that might have been created
    TEMP_FILES=$(find bin -name "cortex-agent.tmp*" -type f 2>/dev/null)
    
    if [ -n "$TEMP_FILES" ]; then
        echo "📦 Found temporary build artifacts..."
        
        for temp_file in $TEMP_FILES; do
            echo "  Checking: $temp_file"
            
            # Check if it's a valid executable
            if file "$temp_file" | grep -q "executable"; then
                echo "  ✅ Valid executable found!"
                
                # Move it to the final location
                mv "$temp_file" bin/cortex-agent
                chmod +x bin/cortex-agent
                
                if bin/cortex-agent --version &>/dev/null; then
                    echo "✅ Build successful!"
                    echo "📍 Location: bin/cortex-agent"
                    exit 0
                fi
            fi
        done
    fi
fi

# If we get here, build failed
echo "❌ Build failed"
echo ""
echo "Build output:"
echo "$BUILD_OUTPUT" | grep -v "Import assertions are deprecated"

# Restore backup if available
if [ -f "bin/cortex-agent.working-backup" ]; then
    echo ""
    echo "🔄 Restoring working backup..."
    cp bin/cortex-agent.working-backup bin/cortex-agent
    chmod +x bin/cortex-agent
    echo "✅ Backup restored"
fi

exit 1