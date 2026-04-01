# workflow-create

Create reusable workflow templates.

## Usage
```bash
npx cortex-agent workflow create [options]
```

## Options
- `--name <name>` - Workflow name
- `--from-history` - Create from history
- `--interactive` - Interactive creation

## Examples
```bash
# Create workflow
npx cortex-agent workflow create --name "deploy-api"

# From history
npx cortex-agent workflow create --name "test-suite" --from-history

# Interactive mode
npx cortex-agent workflow create --interactive
```
