---
name: cortex-agent-help
description: Show Claude-Flow commands and usage
---

# Claude-Flow Commands

## 🌊 Claude-Flow: Agent Orchestration Platform

Claude-Flow is the ultimate multi-terminal orchestration platform that revolutionizes how you work with Claude Code.

## Core Commands

### 🚀 System Management
- `./cortex-agent start` - Start orchestration system
- `./cortex-agent start --ui` - Start with interactive process management UI
- `./cortex-agent status` - Check system status
- `./cortex-agent monitor` - Real-time monitoring
- `./cortex-agent stop` - Stop orchestration

### 🤖 Agent Management
- `./cortex-agent agent spawn <type>` - Create new agent
- `./cortex-agent agent list` - List active agents
- `./cortex-agent agent info <id>` - Agent details
- `./cortex-agent agent terminate <id>` - Stop agent

### 📋 Task Management
- `./cortex-agent task create <type> "description"` - Create task
- `./cortex-agent task list` - List all tasks
- `./cortex-agent task status <id>` - Task status
- `./cortex-agent task cancel <id>` - Cancel task
- `./cortex-agent task workflow <file>` - Execute workflow

### 🧠 Memory Operations
- `./cortex-agent memory store "key" "value"` - Store data
- `./cortex-agent memory query "search"` - Search memory
- `./cortex-agent memory stats` - Memory statistics
- `./cortex-agent memory export <file>` - Export memory
- `./cortex-agent memory import <file>` - Import memory

### ⚡ SPARC Development
- `./cortex-agent sparc "task"` - Run SPARC orchestrator
- `./cortex-agent sparc modes` - List all 17+ SPARC modes
- `./cortex-agent sparc run <mode> "task"` - Run specific mode
- `./cortex-agent sparc tdd "feature"` - TDD workflow
- `./cortex-agent sparc info <mode>` - Mode details

### 🐝 Swarm Coordination
- `./cortex-agent swarm "task" --strategy <type>` - Start swarm
- `./cortex-agent swarm "task" --background` - Long-running swarm
- `./cortex-agent swarm "task" --monitor` - With monitoring
- `./cortex-agent swarm "task" --ui` - Interactive UI
- `./cortex-agent swarm "task" --distributed` - Distributed coordination

### 🌍 MCP Integration
- `./cortex-agent mcp status` - MCP server status
- `./cortex-agent mcp tools` - List available tools
- `./cortex-agent mcp config` - Show configuration
- `./cortex-agent mcp logs` - View MCP logs

### 🤖 Claude Integration
- `./cortex-agent claude spawn "task"` - Spawn Claude with enhanced guidance
- `./cortex-agent claude batch <file>` - Execute workflow configuration

## 🌟 Quick Examples

### Initialize with SPARC:
```bash
npx -y cortex-agent@latest init --sparc
```

### Start a development swarm:
```bash
./cortex-agent swarm "Build REST API" --strategy development --monitor --review
```

### Run TDD workflow:
```bash
./cortex-agent sparc tdd "user authentication"
```

### Store project context:
```bash
./cortex-agent memory store "project_requirements" "e-commerce platform specs" --namespace project
```

### Spawn specialized agents:
```bash
./cortex-agent agent spawn researcher --name "Senior Researcher" --priority 8
./cortex-agent agent spawn developer --name "Lead Developer" --priority 9
```

## 🎯 Best Practices
- Use `./cortex-agent` instead of `npx cortex-agent` after initialization
- Store important context in memory for cross-session persistence
- Use swarm mode for complex tasks requiring multiple agents
- Enable monitoring for real-time progress tracking
- Use background mode for tasks > 30 minutes

## 📚 Resources
- Documentation: https://github.com/ruvnet/claude-code-flow/docs
- Examples: https://github.com/ruvnet/claude-code-flow/examples
- Issues: https://github.com/ruvnet/claude-code-flow/issues
