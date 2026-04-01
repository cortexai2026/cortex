# swarm-monitor

Real-time swarm monitoring.

## Usage
```bash
npx cortex-agent swarm monitor [options]
```

## Options
- `--interval <ms>` - Update interval
- `--metrics` - Show detailed metrics
- `--export` - Export monitoring data

## Examples
```bash
# Start monitoring
npx cortex-agent swarm monitor

# Custom interval
npx cortex-agent swarm monitor --interval 5000

# With metrics
npx cortex-agent swarm monitor --metrics
```
