# model-update

Update neural models with new data.

## Usage
```bash
npx cortex-agent training model-update [options]
```

## Options
- `--model <name>` - Model to update
- `--incremental` - Incremental update
- `--validate` - Validate after update

## Examples
```bash
# Update all models
npx cortex-agent training model-update

# Specific model
npx cortex-agent training model-update --model agent-selector

# Incremental with validation
npx cortex-agent training model-update --incremental --validate
```
