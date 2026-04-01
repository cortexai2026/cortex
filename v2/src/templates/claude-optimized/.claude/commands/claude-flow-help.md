---
name: cortex-agent-help
description: Show Claude-Flow commands and usage with batchtools optimization
---

# Claude-Flow Commands (Batchtools Optimized)

## Core Commands with Batch Operations

### System Management (Batch Operations)

- `npx cortex-agent start` - Start orchestration system
- `npx cortex-agent status` - Check system status
- `npx cortex-agent monitor` - Real-time monitoring
- `npx cortex-agent stop` - Stop orchestration

**Batch Operations:**

```bash
# Check multiple system components in parallel
npx cortex-agent batch status --components "agents,tasks,memory,connections"

# Start multiple services concurrently
npx cortex-agent batch start --services "monitor,scheduler,coordinator"
```

### Agent Management (Parallel Operations)

- `npx cortex-agent agent spawn <type>` - Create new agent
- `npx cortex-agent agent list` - List active agents
- `npx cortex-agent agent info <id>` - Agent details
- `npx cortex-agent agent terminate <id>` - Stop agent

**Batch Operations:**

```bash
# Spawn multiple agents in parallel
npx cortex-agent agent batch-spawn "code:3,test:2,review:1"

# Get info for multiple agents concurrently
npx cortex-agent agent batch-info "agent1,agent2,agent3"

# Terminate multiple agents
npx cortex-agent agent batch-terminate --pattern "test-*"
```

### Task Management (Concurrent Processing)

- `npx cortex-agent task create <type> "description"` - Create task
- `npx cortex-agent task list` - List all tasks
- `npx cortex-agent task status <id>` - Task status
- `npx cortex-agent task cancel <id>` - Cancel task

**Batch Operations:**

```bash
# Create multiple tasks from file
npx cortex-agent task batch-create tasks.json

# Check status of multiple tasks concurrently
npx cortex-agent task batch-status --ids "task1,task2,task3"

# Process task queue in parallel
npx cortex-agent task process-queue --parallel 5
```

### Memory Operations (Bulk Processing)

- `npx cortex-agent memory store "key" "value"` - Store data
- `npx cortex-agent memory query "search"` - Search memory
- `npx cortex-agent memory stats` - Memory statistics
- `npx cortex-agent memory export <file>` - Export memory

**Batch Operations:**

```bash
# Bulk store from JSON file
npx cortex-agent memory batch-store data.json

# Parallel query across namespaces
npx cortex-agent memory batch-query "search term" --namespaces "all"

# Export multiple namespaces concurrently
npx cortex-agent memory batch-export --namespaces "project,agents,tasks"
```

### SPARC Development (Parallel Workflows)

- `npx cortex-agent sparc modes` - List SPARC modes
- `npx cortex-agent sparc run <mode> "task"` - Run mode
- `npx cortex-agent sparc tdd "feature"` - TDD workflow
- `npx cortex-agent sparc info <mode>` - Mode details

**Batch Operations:**

```bash
# Run multiple SPARC modes in parallel
npx cortex-agent sparc batch-run --modes "spec:task1,architect:task2,code:task3"

# Execute parallel TDD for multiple features
npx cortex-agent sparc batch-tdd features.json

# Analyze multiple components concurrently
npx cortex-agent sparc batch-analyze --components "auth,api,database"
```

### Swarm Coordination (Enhanced Parallelization)

- `npx cortex-agent swarm "task" --strategy <type>` - Start swarm
- `npx cortex-agent swarm "task" --background` - Long-running swarm
- `npx cortex-agent swarm "task" --monitor` - With monitoring

**Batch Operations:**

```bash
# Launch multiple swarms for different components
npx cortex-agent swarm batch --config swarms.json

# Coordinate parallel swarm strategies
npx cortex-agent swarm multi-strategy "project" --strategies "dev:frontend,test:backend,docs:api"
```

## Advanced Batch Examples

### Parallel Development Workflow:

```bash
# Initialize complete project setup in parallel
npx cortex-agent batch init --actions "memory:setup,agents:spawn,tasks:queue"

# Run comprehensive analysis
npx cortex-agent batch analyze --targets "code:quality,security:audit,performance:profile"
```

### Concurrent Testing Suite:

```bash
# Execute parallel test suites
npx cortex-agent sparc batch-test --suites "unit,integration,e2e" --parallel

# Generate reports concurrently
npx cortex-agent batch report --types "coverage,performance,security"
```

### Bulk Operations:

```bash
# Process multiple files in parallel
npx cortex-agent batch process --files "*.ts" --action "lint,format,analyze"

# Parallel code generation
npx cortex-agent batch generate --templates "api:users,api:products,api:orders"
```

## Performance Tips

- Use `--parallel` flag for concurrent operations
- Batch similar operations to reduce overhead
- Leverage `--async` for non-blocking execution
- Use `--stream` for real-time progress updates
- Enable `--cache` for repeated operations

## Monitoring Batch Operations

```bash
# Real-time batch monitoring
npx cortex-agent monitor --batch

# Batch operation statistics
npx cortex-agent stats --batch-ops

# Performance profiling
npx cortex-agent profile --batch-execution
```
