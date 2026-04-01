/**
 * Standardized help command for Claude-Flow CLI
 * Follows Unix/Linux conventions for help output
 */

import { Command } from '../commander-fix.js';
import { HelpFormatter, CommandInfo } from '../help-formatter.js';

export const helpCommand = new Command()
  .name('help')
  .description('Show help information')
  .argument('[command]', 'Command to show help for')
  .option('--all', 'Show all available commands')
  .action(async (command?: string, options?: any) => {
    if (command) {
      showCommandHelp(command);
    } else {
      showMainHelp();
    }
  });

function showMainHelp(): void {
  const mainHelp: CommandInfo = {
    name: 'cortex-agent',
    description: 'Advanced AI agent orchestration system',
    usage: `cortex-agent <command> [<args>] [options]
    cortex-agent <command> --help
    cortex-agent --version`,
    commands: [
      {
        name: 'hive-mind',
        description: 'Manage hive mind swarm intelligence',
      },
      {
        name: 'init',
        description: 'Initialize Cortex Agent configuration',
      },
      {
        name: 'start',
        description: 'Start orchestration system',
      },
      {
        name: 'swarm',
        description: 'Execute multi-agent swarm coordination',
      },
      {
        name: 'agent',
        description: 'Manage individual agents',
      },
      {
        name: 'sparc',
        description: 'Execute SPARC development modes',
      },
      {
        name: 'memory',
        description: 'Manage persistent memory operations',
      },
      {
        name: 'github',
        description: 'Automate GitHub workflows',
      },
      {
        name: 'status',
        description: 'Show system status and health',
      },
      {
        name: 'config',
        description: 'Manage configuration settings',
      },
      {
        name: 'session',
        description: 'Manage sessions and state persistence',
      },
      {
        name: 'help',
        description: 'Show help information',
      },
    ],
    globalOptions: [
      {
        flags: '--config <path>',
        description: 'Configuration file path',
        defaultValue: '.claude/config.json',
      },
      {
        flags: '--verbose',
        description: 'Enable verbose output',
      },
      {
        flags: '--quiet',
        description: 'Suppress non-error output',
      },
      {
        flags: '--json',
        description: 'Output in JSON format',
      },
      {
        flags: '--help',
        description: 'Show help information',
      },
      {
        flags: '--version',
        description: 'Show version information',
      },
    ],
    examples: [
      'cortex-agent init --sparc',
      'cortex-agent hive-mind wizard',
      'cortex-agent swarm "Build REST API"',
      'cortex-agent status --json',
    ],
  };

  console.log(HelpFormatter.formatHelp(mainHelp));
}

function showCommandHelp(command: string): void {
  const commandHelp = getCommandHelp(command);
  if (commandHelp) {
    console.log(HelpFormatter.formatHelp(commandHelp));
  } else {
    console.error(
      HelpFormatter.formatError(
        `Unknown command: ${command}`,
        'cortex-agent help',
        'cortex-agent help [command]',
      ),
    );
  }
}

function getCommandHelp(command: string): CommandInfo | null {
  const commandHelpMap: Record<string, CommandInfo> = {
    'hive-mind': {
      name: 'cortex-agent hive-mind',
      description: 'Manage hive mind swarm intelligence',
      usage: 'cortex-agent hive-mind <subcommand> [options]',
      commands: [
        { name: 'init', description: 'Initialize hive mind system' },
        { name: 'spawn', description: 'Create intelligent swarm with objective' },
        { name: 'status', description: 'View active swarms and metrics' },
        { name: 'stop', description: 'Stop a running swarm' },
        { name: 'ps', description: 'List all running processes' },
        { name: 'resume', description: 'Resume a paused swarm' },
        { name: 'wizard', description: 'Interactive setup wizard' },
      ],
      options: [
        {
          flags: '--queen-type <type>',
          description: 'Queen coordination type',
          defaultValue: 'adaptive',
          validValues: ['strategic', 'tactical', 'adaptive'],
        },
        {
          flags: '--workers <count>',
          description: 'Number of worker agents',
          defaultValue: '5',
        },
        {
          flags: '--timeout <seconds>',
          description: 'Operation timeout',
          defaultValue: '300',
        },
        {
          flags: '--no-consensus',
          description: 'Disable consensus requirements',
        },
        {
          flags: '--help',
          description: 'Show this help message',
        },
      ],
      examples: [
        'cortex-agent hive-mind spawn "Build REST API" --queen-type strategic',
        'cortex-agent hive-mind status --json',
        'cortex-agent hive-mind stop swarm-123',
      ],
    },
    agent: {
      name: 'cortex-agent agent',
      description: 'Manage individual agents',
      usage: 'cortex-agent agent <action> [options]',
      commands: [
        { name: 'spawn', description: 'Create a new agent' },
        { name: 'list', description: 'List all active agents' },
        { name: 'info', description: 'Show agent details' },
        { name: 'terminate', description: 'Stop an agent' },
      ],
      options: [
        {
          flags: '--type <type>',
          description: 'Agent type',
          validValues: ['coordinator', 'researcher', 'coder', 'analyst', 'tester'],
        },
        {
          flags: '--name <name>',
          description: 'Agent name',
        },
        {
          flags: '--json',
          description: 'Output in JSON format',
        },
        {
          flags: '--help',
          description: 'Show this help message',
        },
      ],
      examples: [
        'cortex-agent agent spawn researcher --name "Research Bot"',
        'cortex-agent agent list --json',
        'cortex-agent agent terminate agent-123',
      ],
    },
    init: {
      name: 'cortex-agent init',
      description: 'Initialize Cortex Agent configuration',
      usage: 'cortex-agent init [options]',
      options: [
        {
          flags: '--sparc',
          description: 'Initialize with SPARC mode support',
        },
        {
          flags: '--force',
          description: 'Overwrite existing configuration',
        },
        {
          flags: '--template <name>',
          description: 'Use configuration template',
          validValues: ['default', 'development', 'production'],
        },
        {
          flags: '--help',
          description: 'Show this help message',
        },
      ],
      examples: [
        'cortex-agent init',
        'cortex-agent init --sparc',
        'cortex-agent init --template production',
      ],
    },
  };

  return commandHelpMap[command] || null;
}
