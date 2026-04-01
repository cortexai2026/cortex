# pattern-learn

Learn patterns from successful operations.

## Usage
```bash
npx cortex-agent training pattern-learn [options]
```

## Options
- `--source <type>` - Pattern source
- `--threshold <score>` - Success threshold
- `--save <name>` - Save pattern set

## Examples
```bash
# Learn from all ops
npx cortex-agent training pattern-learn

# High success only
npx cortex-agent training pattern-learn --threshold 0.9

# Save patterns
npx cortex-agent training pattern-learn --save optimal-patterns
```
