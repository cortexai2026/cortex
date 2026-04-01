# 🔍 Verification Commands

Truth verification system for ensuring code quality and correctness with a 0.95 accuracy threshold.

## Overview

The verification system provides real-time truth checking and validation for all agent tasks, ensuring high-quality outputs and automatic rollback on failures.

## Subcommands

### `verify check`
Run verification checks on current code or agent outputs.

```bash
cortex-agent verify check --file src/app.js
cortex-agent verify check --task "task-123"
cortex-agent verify check --threshold 0.98
```

### `verify rollback`
Automatically rollback changes that fail verification.

```bash
cortex-agent verify rollback --to-commit abc123
cortex-agent verify rollback --last-good
cortex-agent verify rollback --interactive
```

### `verify report`
Generate verification reports and metrics.

```bash
cortex-agent verify report --format json
cortex-agent verify report --export metrics.html
cortex-agent verify report --period 7d
```

### `verify dashboard`
Launch interactive verification dashboard.

```bash
cortex-agent verify dashboard
cortex-agent verify dashboard --port 3000
cortex-agent verify dashboard --export
```

## Configuration

Default threshold: **0.95** (95% accuracy required)

Configure in `.cortex-agent/config.json`:
```json
{
  "verification": {
    "threshold": 0.95,
    "autoRollback": true,
    "gitIntegration": true,
    "hooks": {
      "preCommit": true,
      "preTask": true,
      "postEdit": true
    }
  }
}
```

## Integration

### With Swarm Commands
```bash
cortex-agent swarm --verify --threshold 0.98
cortex-agent hive-mind --verify
```

### With Training Pipeline
```bash
cortex-agent train --verify --rollback-on-fail
```

### With Pair Programming
```bash
cortex-agent pair --verify --real-time
```

## Metrics

- **Truth Score**: 0.0 to 1.0 (higher is better)
- **Confidence Level**: Statistical confidence in verification
- **Rollback Rate**: Percentage of changes rolled back
- **Quality Improvement**: Trend over time

## Examples

### Basic Verification
```bash
# Verify current directory
cortex-agent verify check

# Verify with custom threshold
cortex-agent verify check --threshold 0.99

# Verify and auto-fix
cortex-agent verify check --auto-fix
```

### Advanced Workflows
```bash
# Continuous verification during development
cortex-agent verify watch --directory src/

# Batch verification
cortex-agent verify batch --files "*.js" --parallel

# Integration testing
cortex-agent verify integration --test-suite full
```

## Performance

- Verification latency: <100ms for most checks
- Rollback time: <1s for git-based rollback
- Dashboard refresh: Real-time via WebSocket

## Related Commands

- `truth` - View truth scores and metrics
- `pair` - Collaborative development with verification
- `train` - Training with verification feedback