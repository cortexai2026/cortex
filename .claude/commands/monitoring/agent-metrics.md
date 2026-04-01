# agent-metrics

View agent performance metrics.

## Usage
```bash
npx cortex-agent agent metrics [options]
```

## Options
- `--agent-id <id>` - Specific agent
- `--period <time>` - Time period
- `--format <type>` - Output format

## Examples
```bash
# All agents metrics
npx cortex-agent agent metrics

# Specific agent
npx cortex-agent agent metrics --agent-id agent-001

# Last hour
npx cortex-agent agent metrics --period 1h
```
