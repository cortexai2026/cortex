#!/bin/bash
# Setup MCP server for Cortex Agent

echo "🚀 Setting up Cortex Agent MCP server..."

# Check if claude command exists
if ! command -v claude &> /dev/null; then
    echo "❌ Error: Claude Code CLI not found"
    echo "Please install Claude Code first"
    exit 1
fi

# Add MCP server
echo "📦 Adding Cortex Agent MCP server..."
claude mcp add cortex-agent npx cortex-agent mcp start

echo "✅ MCP server setup complete!"
echo "🎯 You can now use mcp__cortex-agent__ tools in Claude Code"
