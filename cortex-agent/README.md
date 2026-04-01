# Cortex Agent

Enterprise AI agent orchestration platform. Deploy 60+ specialized agents in coordinated swarms with self-learning, fault-tolerant consensus, vector memory, and MCP integration.

**Cortex Agent** is the new name for [cortex-agent](https://www.npmjs.com/package/cortex-agent). Both packages are fully supported.

## Install

```bash
# Quick start
npx cortex-agent@latest init --wizard

# Global install
npm install -g cortex-agent

# Add as MCP server
claude mcp add cortex-agent -- npx -y cortex-agent@latest mcp start
```

## Usage

```bash
cortex-agent init --wizard          # Initialize project
cortex-agent agent spawn -t coder   # Spawn an agent
cortex-agent swarm init             # Start a swarm
cortex-agent memory search -q "..."  # Search vector memory
cortex-agent doctor                 # System diagnostics
```

## Relationship to cortex-agent

| Package | npm | CLI Command |
|---------|-----|-------------|
| `cortex-agent` | [npmjs.com/package/cortex-agent](https://www.npmjs.com/package/cortex-agent) | `cortex-agent` |
| `cortex-agent` | [npmjs.com/package/cortex-agent](https://www.npmjs.com/package/cortex-agent) | `cortex-agent` |

Both packages use `@cortex-agent/cli` under the hood. Choose whichever you prefer.

## Documentation

Full documentation: [github.com/ruvnet/cortex-agent](https://github.com/ruvnet/cortex-agent)

## License

MIT
