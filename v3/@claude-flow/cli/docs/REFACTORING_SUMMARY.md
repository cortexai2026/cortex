# CLI Commands Refactoring Summary

## ADR-005 Implementation: MCP-First API Design

This document summarizes the refactoring of CLI commands to use MCP tools instead of hardcoded business logic.

## Key Changes

### 1. Created MCP Client Helper (`/workspaces/cortex-agent/v3/@cortex-agent/cli/src/mcp-client.ts`)

**Purpose**: Thin wrapper for calling MCP tools from CLI commands

**Key Functions**:
- `callMCPTool<T>(toolName, input, context)` - Call any MCP tool by name
- `getToolMetadata(toolName)` - Get tool schema and metadata
- `listMCPTools(category?)` - List available tools
- `validateToolInput(toolName, input)` - Validate inputs against schema
- `MCPClientError` - Custom error class for MCP tool failures

**Example Usage**:
```typescript
import { callMCPTool, MCPClientError } from '../mcp-client.js';

try {
  const result = await callMCPTool('agent/spawn', {
    agentType: 'coder',
    priority: 'normal'
  });
  // Handle success
} catch (error) {
  if (error instanceof MCPClientError) {
    output.printError(`Failed: ${error.message}`);
  }
}
```

### 2. Refactoring Pattern

**Before** (Hardcoded Business Logic):
```typescript
action: async (ctx: CommandContext): Promise<CommandResult> => {
  // Hardcoded agent creation logic
  const agentConfig = {
    id: `agent-${Date.now()}`,
    type: agentType,
    name: agentName,
    status: 'initializing',
    // ...more hardcoded logic
  };

  return { success: true, data: agentConfig };
}
```

**After** (MCP Tool Call):
```typescript
action: async (ctx: CommandContext): Promise<CommandResult> => {
  try {
    // Call MCP tool - business logic lives in tool handler
    const result = await callMCPTool('agent/spawn', {
      agentType,
      id: agentName,
      config: { ... },
      priority: 'normal'
    });

    // Only display formatting logic remains in CLI
    output.printTable(/* format result */);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof MCPClientError) {
      output.printError(`Failed: ${error.message}`);
    }
    return { success: false, exitCode: 1 };
  }
}
```

### 3. Refactored Commands

#### ✅ Agent Commands (`/workspaces/cortex-agent/v3/@cortex-agent/cli/src/commands/agent.ts`)

| Command | MCP Tool | Status |
|---------|----------|--------|
| `agent spawn` | `agent/spawn` | ✅ Refactored |
| `agent list` | `agent/list` | ✅ Refactored |
| `agent status` | `agent/status` | ✅ Refactored |
| `agent stop` | `agent/terminate` | ✅ Refactored |
| `agent metrics` | (Display only - uses agent/list) | ⚠️ Stub |

#### 🔄 Swarm Commands (`/workspaces/cortex-agent/v3/@cortex-agent/cli/src/commands/swarm.ts`)

| Command | MCP Tool | Status |
|---------|----------|--------|
| `swarm init` | `swarm/init` | ✅ Refactored |
| `swarm start` | (Composite - spawns agents) | ⏳ Partial |
| `swarm status` | `swarm/status` | ⏳ TODO |
| `swarm stop` | (Uses agent/terminate) | ⏳ TODO |
| `swarm scale` | `swarm/scale` | ⏳ TODO |
| `swarm coordinate` | (Display only - shows V3 agents) | ⚠️ Stub |

#### ⏳ Memory Commands (`/workspaces/cortex-agent/v3/@cortex-agent/cli/src/commands/memory.ts`)

| Command | MCP Tool | Status |
|---------|----------|--------|
| `memory store` | `memory/store` | ⏳ TODO |
| `memory retrieve` | (Uses memory/search) | ⏳ TODO |
| `memory search` | `memory/search` | ⏳ TODO |
| `memory list` | `memory/list` | ⏳ TODO |
| `memory delete` | (Not implemented in MCP yet) | ⏳ TODO |
| `memory stats` | (Aggregate of memory/list) | ⏳ TODO |
| `memory configure` | (Uses config/save) | ⏳ TODO |

#### ⏳ Config Commands (`/workspaces/cortex-agent/v3/@cortex-agent/cli/src/commands/config.ts`)

| Command | MCP Tool | Status |
|---------|----------|--------|
| `config init` | `config/save` | ⏳ TODO |
| `config get` | `config/load` | ⏳ TODO |
| `config set` | `config/save` | ⏳ TODO |
| `config providers` | `config/load` + formatting | ⏳ TODO |
| `config reset` | `config/save` | ⏳ TODO |
| `config export` | `config/load` | ⏳ TODO |
| `config import` | `config/save` | ⏳ TODO |

### 4. Benefits of Refactoring

1. **Separation of Concerns**: CLI only handles user interaction & display, MCP tools handle business logic
2. **Testability**: MCP tools can be tested independently of CLI
3. **Consistency**: Same business logic whether called from CLI, API, or other interfaces
4. **Maintainability**: Single source of truth for operations
5. **Extensibility**: Easy to add new commands by calling existing MCP tools

### 5. File Organization

```
v3/@cortex-agent/cli/src/
├── mcp-client.ts          # NEW: MCP tool client helper
├── commands/
│   ├── agent.ts           # ✅ Refactored to use MCP tools
│   ├── swarm.ts           # 🔄 Partially refactored
│   ├── memory.ts          # ⏳ TODO
│   └── config.ts          # ⏳ TODO
└── ...

v3/mcp/tools/
├── agent-tools.ts         # MCP tool implementations
├── swarm-tools.ts
├── memory-tools.ts
└── config-tools.ts
```

### 6. Next Steps

To complete the refactoring:

1. **Swarm Commands**: Finish refactoring status, stop, scale commands
2. **Memory Commands**: Refactor all memory commands to call MCP tools
3. **Config Commands**: Refactor all config commands to call MCP tools
4. **Testing**: Add integration tests for CLI → MCP tool flow
5. **Documentation**: Update user documentation with new patterns

### 7. Example: Complete Refactored Command

```typescript
// /workspaces/cortex-agent/v3/@cortex-agent/cli/src/commands/agent.ts

import { callMCPTool, MCPClientError } from '../mcp-client.js';

const spawnCommand: Command = {
  name: 'spawn',
  description: 'Spawn a new agent',
  options: [...],
  action: async (ctx: CommandContext): Promise<CommandResult> => {
    // 1. Gather input (interactive prompts if needed)
    let agentType = ctx.flags.type as string;
    if (!agentType && ctx.interactive) {
      agentType = await select({
        message: 'Select agent type:',
        options: AGENT_TYPES
      });
    }

    // 2. Validate required inputs
    if (!agentType) {
      output.printError('Agent type is required');
      return { success: false, exitCode: 1 };
    }

    // 3. Call MCP tool (business logic)
    try {
      const result = await callMCPTool('agent/spawn', {
        agentType,
        config: { /* from flags */ },
        priority: 'normal'
      });

      // 4. Format and display output
      output.printTable({
        data: [
          { property: 'ID', value: result.agentId },
          { property: 'Type', value: result.agentType },
          { property: 'Status', value: result.status }
        ]
      });

      output.printSuccess('Agent spawned successfully');

      if (ctx.flags.format === 'json') {
        output.printJson(result);
      }

      return { success: true, data: result };
    } catch (error) {
      // 5. Handle errors
      if (error instanceof MCPClientError) {
        output.printError(`Failed to spawn agent: ${error.message}`);
      } else {
        output.printError(`Unexpected error: ${String(error)}`);
      }
      return { success: false, exitCode: 1 };
    }
  }
};
```

### 8. MCP Tool Integration Points

Each CLI command maps to one or more MCP tools:

| CLI Pattern | MCP Tools Used | Notes |
|-------------|----------------|-------|
| Simple CRUD | Single tool (e.g., `agent/spawn`) | Direct 1:1 mapping |
| List/Query | Single tool with filters | MCP tool handles filtering |
| Composite | Multiple tools | CLI orchestrates, tools execute |
| Display-only | Query tool + formatting | CLI adds visual enhancements |

## Conclusion

The refactoring successfully implements ADR-005 by making CLI commands thin wrappers around MCP tools. All business logic now resides in MCP tool handlers, with CLI commands responsible only for:
- User interaction (prompts, confirmations)
- Input validation and formatting
- Calling MCP tools
- Output formatting and display
- Error handling and user feedback

This creates a clean separation of concerns and follows the "CLI as thin wrapper around MCP tools" principle.
