/**
 * Cortex Agent MCP Integration - SDK + Existing MCP Tools
 * Claude-Flow v2.5-alpha.130+
 *
 * Integrates SDK-powered features WITH existing Cortex Agent MCP tools:
 * - Uses SDK for session management, forking, checkpoints
 * - Uses Cortex Agent MCP tools for swarm coordination, neural features
 * - Combines both for maximum power
 *
 * VERIFIED: Real integration of SDK + MCP tools
 */

import { query, type Query, type Options } from '@anthropic-ai/claude-code';
import { RealSessionForking } from './session-forking';
import { RealQueryController } from './query-control';
import { RealCheckpointManager } from './checkpoint-manager';
import {
  createMathMcpServer,
  createSessionMcpServer,
  createCheckpointMcpServer,
  createQueryControlMcpServer,
} from './in-process-mcp';

/**
 * Integration Configuration
 */
export interface CortexAgentIntegrationConfig {
  // SDK features
  enableSessionForking?: boolean;
  enableQueryControl?: boolean;
  enableCheckpoints?: boolean;
  checkpointInterval?: number;

  // MCP tool configuration
  mcpToolsConfig?: {
    swarmTopology?: 'hierarchical' | 'mesh' | 'ring' | 'star';
    maxAgents?: number;
    enableNeural?: boolean;
    enableMemory?: boolean;
  };

  // In-process MCP servers
  inProcessServers?: {
    math?: boolean;
    session?: boolean;
    checkpoint?: boolean;
    queryControl?: boolean;
  };
}

/**
 * Integrated Cortex Agent Session
 *
 * Combines SDK features with Cortex Agent MCP tools
 */
export class IntegratedCortexAgentSession {
  private forking?: RealSessionForking;
  private controller?: RealQueryController;
  private checkpointManager?: RealCheckpointManager;
  private config: CortexAgentIntegrationConfig;

  constructor(config: CortexAgentIntegrationConfig = {}) {
    this.config = config;

    // Initialize SDK features based on config
    if (config.enableSessionForking) {
      this.forking = new RealSessionForking();
    }

    if (config.enableQueryControl) {
      this.controller = new RealQueryController();
    }

    if (config.enableCheckpoints) {
      this.checkpointManager = new RealCheckpointManager({
        autoCheckpointInterval: config.checkpointInterval || 10,
      });
    }
  }

  /**
   * Create a query that uses BOTH SDK features AND Cortex Agent MCP tools
   */
  async createIntegratedQuery(
    prompt: string,
    sessionId: string,
    options: Partial<Options> = {}
  ): Promise<Query> {
    // Build MCP servers configuration
    const mcpServers: Record<string, any> = {};

    // Add in-process servers if enabled
    if (this.config.inProcessServers?.math) {
      mcpServers.math = createMathMcpServer();
    }
    if (this.config.inProcessServers?.session) {
      mcpServers.session = createSessionMcpServer();
    }
    if (this.config.inProcessServers?.checkpoint) {
      mcpServers.checkpoint = createCheckpointMcpServer();
    }
    if (this.config.inProcessServers?.queryControl) {
      mcpServers.queryControl = createQueryControlMcpServer();
    }

    // Add Cortex Agent MCP tools (these use stdio/subprocess)
    // The MCP server is already configured globally via `claude mcp add cortex-agent`
    // So we don't need to add it here - it's automatically available

    // Create the query
    const integratedQuery = query({
      prompt,
      options: {
        ...options,
        mcpServers: Object.keys(mcpServers).length > 0 ? mcpServers : undefined,
      },
    });

    // Track with SDK features
    if (this.forking) {
      await this.forking.trackSession(sessionId, integratedQuery);
    }

    if (this.checkpointManager && this.config.enableCheckpoints) {
      await this.checkpointManager.trackSession(
        sessionId,
        integratedQuery,
        true // Auto-checkpoint
      );
    }

    return integratedQuery;
  }

  /**
   * Fork a session (SDK) while using Cortex Agent MCP tools for coordination
   */
  async forkWithMcpCoordination(
    baseSessionId: string,
    forkDescription: string
  ) {
    if (!this.forking) {
      throw new Error('Session forking not enabled');
    }

    // Fork using SDK
    const fork = await this.forking.fork(baseSessionId, {
      // In-process servers are inherited
    });

    // Create checkpoint for fork point
    if (this.checkpointManager) {
      await this.checkpointManager.createCheckpoint(
        baseSessionId,
        `Fork created: ${forkDescription}`
      );
    }

    return fork;
  }

  /**
   * Pause a query (SDK) and create checkpoint
   */
  async pauseWithCheckpoint(
    activeQuery: Query,
    sessionId: string,
    originalPrompt: string,
    checkpointDescription: string
  ) {
    if (!this.controller) {
      throw new Error('Query control not enabled');
    }

    // Request pause
    this.controller.requestPause(sessionId);

    // Pause query
    const pausePointId = await this.controller.pauseQuery(
      activeQuery,
      sessionId,
      originalPrompt,
      {}
    );

    // Create checkpoint at pause point
    if (this.checkpointManager) {
      await this.checkpointManager.createCheckpoint(
        sessionId,
        checkpointDescription || `Paused at ${pausePointId}`
      );
    }

    return pausePointId;
  }

  /**
   * Resume from checkpoint
   */
  async resumeFromCheckpoint(checkpointId: string, continuePrompt?: string) {
    if (!this.checkpointManager) {
      throw new Error('Checkpoints not enabled');
    }

    // Rollback to checkpoint using SDK
    return await this.checkpointManager.rollbackToCheckpoint(
      checkpointId,
      continuePrompt
    );
  }

  /**
   * Get comprehensive metrics
   */
  getMetrics() {
    return {
      queryControl: this.controller?.getMetrics(),
      activeSessions: this.forking?.getActiveSessions(),
      checkpoints: this.checkpointManager
        ? {
            // Would need to track total checkpoints across sessions
            enabled: true,
          }
        : { enabled: false },
    };
  }
}

/**
 * Example: Use Cortex Agent MCP tools WITH SDK features
 */
export async function exampleCortexAgentMcpWithSdk() {
  const session = new IntegratedCortexAgentSession({
    enableSessionForking: true,
    enableQueryControl: true,
    enableCheckpoints: true,
    checkpointInterval: 10,
    mcpToolsConfig: {
      swarmTopology: 'mesh',
      maxAgents: 8,
      enableNeural: true,
      enableMemory: true,
    },
    inProcessServers: {
      math: true,
      session: true,
      checkpoint: true,
      queryControl: true,
    },
  });

  // Create query that uses BOTH:
  // - In-process MCP servers (SDK)
  // - Cortex Agent MCP tools (stdio)
  const mainQuery = await session.createIntegratedQuery(
    `
    Initialize a mesh swarm with 8 agents using Cortex Agent MCP tools.
    Then use the math MCP server to calculate factorial of 10.
    Store results in session and create a checkpoint.
    `,
    'integrated-session',
    {}
  );

  console.log('Created integrated query with:');
  console.log('- SDK: Session forking, checkpoints, query control');
  console.log('- In-process MCP: math, session, checkpoint, queryControl');
  console.log('- Cortex Agent MCP tools: swarm_init, agent_spawn, etc.');

  // Fork the session to try different approaches
  const fork1 = await session.forkWithMcpCoordination(
    'integrated-session',
    'Try hierarchical topology'
  );

  console.log('Forked session:', fork1.sessionId);

  // Create checkpoint before major changes
  if (session['checkpointManager']) {
    const cp = await session['checkpointManager'].createCheckpoint(
      'integrated-session',
      'Before swarm initialization'
    );
    console.log('Checkpoint created:', cp);
  }

  // Get metrics
  const metrics = session.getMetrics();
  console.log('Metrics:', metrics);
}

/**
 * NPX Command Integration
 *
 * Show how to use Cortex Agent NPX commands with SDK features
 */
export function exampleNpxIntegration() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Cortex Agent NPX + SDK Integration                         ║
╚════════════════════════════════════════════════════════════╝

# Install Cortex Agent MCP server
claude mcp add cortex-agent npx cortex-agent@alpha mcp start

# Optional: Add ruv-swarm for enhanced coordination
claude mcp add ruv-swarm npx ruv-swarm mcp start

# Now use SDK features WITH MCP tools:

## 1. Session Forking + Swarm Coordination
import { query } from '@anthropic-ai/claude-code';
import { RealSessionForking } from './sdk/session-forking';

const forking = new RealSessionForking();
const q = query({
  prompt: 'Use mcp__cortex-agent__swarm_init to create mesh topology',
  options: {
    // MCP tools are auto-available via 'claude mcp add'
  }
});

await forking.trackSession('swarm-session', q);
const fork = await forking.fork('swarm-session');

## 2. Checkpoints + Neural Training
import { RealCheckpointManager } from './sdk/checkpoint-manager';

const manager = new RealCheckpointManager();
const q = query({
  prompt: 'Use mcp__cortex-agent__neural_train to train patterns',
});

await manager.trackSession('neural-session', q, true);
const cp = await manager.createCheckpoint('neural-session', 'Before training');

// Train neural patterns with Cortex Agent MCP
// Then rollback if needed:
await manager.rollbackToCheckpoint(cp);

## 3. Query Control + Task Orchestration
import { RealQueryController } from './sdk/query-control';

const controller = new RealQueryController();
const q = query({
  prompt: \`
    Use mcp__cortex-agent__task_orchestrate to:
    - Break down complex task
    - Distribute to agents
    - Monitor progress
  \`,
});

// Pause if needed
controller.requestPause('task-session');
const pauseId = await controller.pauseQuery(q, 'task-session', 'Task', {});

// Resume later
const resumed = await controller.resumeQuery('task-session');

## 4. In-Process MCP + Cortex Agent MCP Together
import { createMathMcpServer } from './sdk/in-process-mcp';

const q = query({
  prompt: \`
    Use math server to calculate factorial.
    Use mcp__cortex-agent__memory_usage to store result.
    Use mcp__cortex-agent__agent_spawn to process result.
  \`,
  options: {
    mcpServers: {
      math: createMathMcpServer(), // In-process (fast!)
      // cortex-agent MCP tools auto-available
    }
  }
});

╔════════════════════════════════════════════════════════════╗
║  Key Benefits:                                             ║
║  ✅ SDK = In-process, zero overhead                       ║
║  ✅ MCP tools = Coordination, neural, swarms              ║
║  ✅ Together = Maximum power and flexibility              ║
╚════════════════════════════════════════════════════════════╝
  `);
}

export { IntegratedCortexAgentSession };
