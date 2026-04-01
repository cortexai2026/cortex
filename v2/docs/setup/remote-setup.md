# Cortex Agent Remote Setup Guide

## Problem
When using `npx cortex-agent@alpha` remotely, you may encounter:
- `ENOTEMPTY` npm cache errors
- Version mismatch issues  
- **Missing `./cortex-agent@alpha` wrapper after init** ⭐ **FIXED!**
- Hook functionality not working

## Quick Fix

### Method 1: One-line Installation
```bash
curl -fsSL https://raw.githubusercontent.com/ruvnet/cortex-agent/main/install-remote.sh | bash
```

### Method 2: Manual Installation
```bash
# Clear npm cache and reinstall
npm cache clean --force
npm uninstall -g cortex-agent
npm install -g cortex-agent@alpha --no-optional --legacy-peer-deps

# Verify and initialize
cortex-agent --version
cortex-agent init
```

### Method 3: Local Development Setup
If you're working with the source code:

```bash
# From the claude-code-flow directory
npm pack
npm install -g ./cortex-agent-*.tgz
cortex-agent --version
```

## Verification

Test that everything works:
```bash
# Check version
cortex-agent --version

# Test hooks
cortex-agent hooks notify --message "Setup complete" --level "success"

# Check system status
cortex-agent status

# ⭐ NEW: Test wrapper creation
npx cortex-agent@alpha init --force
ls -la ./cortex-agent*
# Should show: ./cortex-agent@alpha (executable)
./cortex-agent@alpha --version
```

## Troubleshooting

### Cache Issues
```bash
npm cache clean --force
rm -rf ~/.npm/_npx
```

### Permission Issues
```bash
sudo npm install -g cortex-agent@alpha
# or use nvm to avoid sudo
```

### Binary Not Found
```bash
# Check global bin directory
npm config get prefix
# Add to PATH if needed
export PATH="$(npm config get prefix)/bin:$PATH"
```

## Remote Usage Tips

1. **Use stable alpha version**: `cortex-agent@alpha` instead of specific versions
2. **Clear cache first**: Always run `npm cache clean --force` before installation
3. **Use --legacy-peer-deps**: Helps resolve dependency conflicts
4. **Test hooks immediately**: Verify functionality after installation

## Success Indicators

✅ `cortex-agent --version` shows current version  
✅ `cortex-agent status` shows system running  
✅ `cortex-agent hooks notify` works without errors  
✅ All commands available globally