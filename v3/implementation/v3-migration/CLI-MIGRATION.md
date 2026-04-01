# CLI Commands Migration Guide

> Migrating from V2 CLI (25 commands) to V3 CLI (7 commands)

## Overview

V3 CLI is streamlined with 7 core commands. Many V2 commands need migration or have been consolidated.

## Command Coverage

| Status | V2 Commands | V3 Commands |
|--------|-------------|-------------|
| ✅ Implemented | 7 | 7 |
| ❌ Missing | 18 | - |
| **Total** | 25 | 7 |

## Implemented Commands ✅

### agent
```bash
# V2
npx cortex-agent agent spawn --type coder --name my-coder
npx cortex-agent agent list --detailed
npx cortex-agent agent info <agentId>
npx cortex-agent agent terminate <agentId>

# V3 (same)
npx cortex-agent agent spawn --type coder --id my-coder
npx cortex-agent agent list --detailed
npx cortex-agent agent status <agentId>
npx cortex-agent agent terminate <agentId>
```

### memory
```bash
# V2
npx cortex-agent memory store --namespace default --content "data"
npx cortex-agent memory query --search "keyword" --limit 10
npx cortex-agent memory list --namespace default

# V3 (enhanced)
npx cortex-agent memory store --type episodic --content "data"
npx cortex-agent memory search --query "keyword" --search-type hybrid
npx cortex-agent memory list --type all --sort-by relevance
```

### swarm
```bash
# V2
npx cortex-agent swarm --strategy auto --max-agents 5

# V3 (enhanced)
npx cortex-agent swarm init --topology hierarchical-mesh --max-agents 15
npx cortex-agent swarm status --include-metrics
npx cortex-agent swarm scale --target 10 --strategy gradual
```

### hooks
```bash
# V2
npx cortex-agent hooks pre-edit --file src/app.ts
npx cortex-agent hooks post-edit --file src/app.ts --success true

# V3 (enhanced with learning)
npx cortex-agent hooks pre-edit src/app.ts
npx cortex-agent hooks post-edit src/app.ts --success true
npx cortex-agent hooks route "implement feature X"
npx cortex-agent hooks explain "implement feature X"
npx cortex-agent hooks pretrain
npx cortex-agent hooks metrics
```

### mcp
```bash
# V2
npx cortex-agent mcp start --port 3000 --transport stdio
npx cortex-agent mcp stop
npx cortex-agent mcp status

# V3 (same)
npx cortex-agent mcp start --port 3000 --transport stdio
npx cortex-agent mcp stop
npx cortex-agent mcp status
```

### config
```bash
# V2
npx cortex-agent config get orchestrator
npx cortex-agent config set orchestrator.maxAgents 10

# V3
npx cortex-agent config load --scope project
npx cortex-agent config save --create-backup
npx cortex-agent config validate --strict
```

### migrate
```bash
# V3 only
npx cortex-agent migrate status
npx cortex-agent migrate run --target all --backup
npx cortex-agent migrate verify
npx cortex-agent migrate rollback --backup-id <id>
```

## Missing Commands ❌

### Priority 1 - HIGH

#### init
```bash
# V2
npx cortex-agent init
npx cortex-agent init --minimal
npx cortex-agent init --flow-nexus

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/init.ts
export const initCommand = {
  command: 'init',
  description: 'Initialize Claude Code integration files',
  options: [
    { flags: '-f, --force', description: 'Overwrite existing files' },
    { flags: '-m, --minimal', description: 'Create minimal configuration' },
    { flags: '--flow-nexus', description: 'Initialize with Flow Nexus' }
  ],
  action: async (options) => {
    await createCortexAgentConfig(options);
    await createDefaultAgents(options);
    if (!options.minimal) {
      await createHooksConfig(options);
      await createWorkflowTemplates(options);
    }
  }
};
```

#### start
```bash
# V2
npx cortex-agent start
npx cortex-agent start --daemon
npx cortex-agent start --port 3000

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/start.ts
export const startCommand = {
  command: 'start',
  description: 'Start the orchestration system',
  options: [
    { flags: '-d, --daemon', description: 'Run as daemon' },
    { flags: '-p, --port <port>', description: 'MCP server port' }
  ],
  action: async (options) => {
    const swarm = await initializeV3Swarm();
    await swarm.spawnAllAgents();
    if (options.port) {
      await startMCPServer({ port: options.port });
    }
  }
};
```

#### status
```bash
# V2
npx cortex-agent status
npx cortex-agent status --watch
npx cortex-agent status --json
npx cortex-agent status --health-check

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/status.ts
export const statusCommand = {
  command: 'status',
  description: 'Show enhanced system status',
  options: [
    { flags: '-w, --watch', description: 'Watch mode' },
    { flags: '-i, --interval <seconds>', description: 'Update interval' },
    { flags: '--json', description: 'Output in JSON format' },
    { flags: '--health-check', description: 'Perform health checks' }
  ],
  action: async (options) => {
    const status = await getSystemStatus();
    if (options.healthCheck) {
      status.health = await performHealthChecks();
    }
    if (options.watch) {
      await watchStatus(status, options.interval);
    } else {
      displayStatus(status, options.json);
    }
  }
};
```

#### task
```bash
# V2
npx cortex-agent task create --type implementation --description "Build feature"
npx cortex-agent task list --status running
npx cortex-agent task status <taskId>
npx cortex-agent task cancel <taskId>
npx cortex-agent task assign <taskId> --agent <agentId>

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/task.ts
export const taskCommand = {
  command: 'task',
  description: 'Manage tasks',
  subcommands: [
    {
      command: 'create',
      options: [
        { flags: '-t, --type <type>', description: 'Task type' },
        { flags: '-d, --description <desc>', description: 'Task description' },
        { flags: '-p, --priority <priority>', description: 'Task priority' },
        { flags: '-a, --assign <agentId>', description: 'Assign to agent' }
      ]
    },
    { command: 'list', options: [{ flags: '-s, --status <status>' }] },
    { command: 'status', args: '<taskId>' },
    { command: 'cancel', args: '<taskId>' },
    { command: 'assign', args: '<taskId>', options: [{ flags: '--agent <agentId>' }] }
  ]
};
```

#### session
```bash
# V2
npx cortex-agent session list
npx cortex-agent session save --description "Checkpoint"
npx cortex-agent session restore <sessionId>
npx cortex-agent session delete <sessionId>
npx cortex-agent session export --include-memory
npx cortex-agent session import <file>

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/session.ts
export const sessionCommand = {
  command: 'session',
  description: 'Manage Claude-Flow sessions',
  subcommands: [
    { command: 'list', options: [{ flags: '-a, --active' }] },
    { command: 'save', options: [{ flags: '-d, --description <desc>' }] },
    { command: 'restore', args: '<sessionId>' },
    { command: 'delete', args: '<sessionId>' },
    { command: 'export', options: [{ flags: '--include-memory' }] },
    { command: 'import', args: '<file>' }
  ]
};
```

### Priority 2 - MEDIUM

#### hive
```bash
# V2
npx cortex-agent hive --topology mesh --consensus quorum --max-agents 8
npx cortex-agent hive-mind init
npx cortex-agent hive-mind status
npx cortex-agent hive-mind spawn --type queen
npx cortex-agent hive-mind task --description "Task"
npx cortex-agent hive-mind wizard
npx cortex-agent hive-mind pause
npx cortex-agent hive-mind resume
npx cortex-agent hive-mind stop

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/hive.ts
export const hiveCommand = {
  command: 'hive',
  description: 'Hive Mind multi-agent coordination',
  options: [
    { flags: '--topology <type>', description: 'Topology: mesh, hierarchical, ring, star' },
    { flags: '--consensus <type>', description: 'Consensus: quorum, unanimous, weighted' },
    { flags: '--max-agents <n>', description: 'Maximum agents' }
  ],
  subcommands: [
    { command: 'init' },
    { command: 'status' },
    { command: 'spawn', options: [{ flags: '-t, --type <type>' }] },
    { command: 'task', options: [{ flags: '-d, --description <desc>' }] },
    { command: 'wizard' },
    { command: 'pause' },
    { command: 'resume' },
    { command: 'stop' }
  ]
};
```

#### sparc
```bash
# V2
npx cortex-agent sparc modes
npx cortex-agent sparc info <mode>
npx cortex-agent sparc run --mode specification
npx cortex-agent sparc tdd --sequential
npx cortex-agent sparc workflow --dry-run

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/sparc.ts
export const sparcCommand = {
  command: 'sparc',
  description: 'SPARC methodology commands',
  subcommands: [
    { command: 'modes', description: 'List SPARC modes' },
    { command: 'info', args: '<mode>' },
    { command: 'run', options: [{ flags: '-m, --mode <mode>' }] },
    { command: 'tdd', options: [{ flags: '--sequential' }] },
    { command: 'workflow', options: [{ flags: '--dry-run' }] }
  ]
};
```

#### monitor
```bash
# V2
npx cortex-agent monitor
npx cortex-agent monitor --interval 2
npx cortex-agent monitor --compact
npx cortex-agent monitor --focus agents

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/monitor.ts
export const monitorCommand = {
  command: 'monitor',
  description: 'Start live monitoring dashboard',
  options: [
    { flags: '-i, --interval <seconds>', description: 'Update interval' },
    { flags: '-c, --compact', description: 'Compact view' },
    { flags: '--focus <component>', description: 'Focus on component' }
  ],
  action: async (options) => {
    const dashboard = createDashboard(options);
    await dashboard.start();
  }
};
```

#### github
```bash
# V2
npx cortex-agent github init
npx cortex-agent github gh-coordinator
npx cortex-agent github pr-manager
npx cortex-agent github issue-tracker
npx cortex-agent github release-manager
npx cortex-agent github repo-architect
npx cortex-agent github sync-coordinator

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/github.ts
export const githubCommand = {
  command: 'github',
  description: 'GitHub workflow automation',
  subcommands: [
    { command: 'init' },
    { command: 'gh-coordinator' },
    { command: 'pr-manager' },
    { command: 'issue-tracker' },
    { command: 'release-manager' },
    { command: 'repo-architect' },
    { command: 'sync-coordinator' }
  ],
  options: [
    { flags: '--auto-approve', description: 'Auto-approve permissions' },
    { flags: '--dry-run', description: 'Preview only' }
  ]
};
```

### Priority 3 - LOW

#### neural
```bash
# V2
npx cortex-agent neural init
npx cortex-agent neural init --force --target .claude/agents/neural

# V3: Replaced by hooks pretrain
npx cortex-agent hooks pretrain
```

#### goal
```bash
# V2
npx cortex-agent goal init

# V3: Replaced by hooks system
npx cortex-agent hooks pretrain --include-goap
```

#### claude
```bash
# V2
npx cortex-agent claude spawn --tools View,Edit,Bash --mode full

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/claude.ts
export const claudeCommand = {
  command: 'claude',
  description: 'Spawn Claude instances',
  subcommands: [
    {
      command: 'spawn',
      options: [
        { flags: '-t, --tools <tools>', description: 'Allowed tools' },
        { flags: '-m, --mode <mode>', description: 'Dev mode' },
        { flags: '--parallel', description: 'Enable parallel execution' }
      ]
    }
  ]
};
```

#### workflow
```bash
# V2
npx cortex-agent workflow create --name "my-workflow"
npx cortex-agent workflow execute <workflow>
npx cortex-agent workflow list

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/workflow.ts
```

#### repl
```bash
# V2
npx cortex-agent repl

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/repl.ts
export const replCommand = {
  command: 'repl',
  description: 'Start interactive REPL mode',
  action: async () => {
    const rl = createInterface({ input: stdin, output: stdout });
    // REPL loop
  }
};
```

#### version
```bash
# V2
npx cortex-agent version
npx cortex-agent version --short

# V3 Migration needed:
# Add version flag to CLI root
```

#### completion
```bash
# V2
npx cortex-agent completion bash
npx cortex-agent completion --install

# V3 Migration needed:
# Add to v3/@cortex-agent/cli/src/commands/completion.ts
```

## Implementation Plan

### Phase 1 (Week 1-2): Core Commands
1. `init` - Project initialization
2. `start` - System startup
3. `status` - System status
4. `task` - Task management
5. `session` - Session management

### Phase 2 (Week 3-4): Feature Commands
1. `hive` - Hive-mind mode
2. `sparc` - SPARC methodology
3. `monitor` - Live dashboard
4. `github` - GitHub integration

### Phase 3 (Week 5-6): Utilities
1. `workflow` - Workflow management
2. `claude` - Claude spawning
3. `repl` - Interactive mode
4. `version` - Version info
5. `completion` - Shell completion
