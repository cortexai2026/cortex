# swarm-spawn

Spawn agents in the swarm.

## Usage
```bash
npx cortex-agent swarm spawn [options]
```

## Options
- `--type <type>` - Agent type
- `--count <n>` - Number to spawn
- `--capabilities <list>` - Agent capabilities

## Examples
```bash
npx cortex-agent swarm spawn --type coder --count 3
npx cortex-agent swarm spawn --type researcher --capabilities "web-search,analysis"
```
