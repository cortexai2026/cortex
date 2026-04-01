# workflow-execute

Execute saved workflows.

## Usage
```bash
npx cortex-agent workflow execute [options]
```

## Options
- `--name <name>` - Workflow name
- `--params <json>` - Workflow parameters
- `--dry-run` - Preview execution

## Examples
```bash
# Execute workflow
npx cortex-agent workflow execute --name "deploy-api"

# With parameters
npx cortex-agent workflow execute --name "test-suite" --params '{"env": "staging"}'

# Dry run
npx cortex-agent workflow execute --name "deploy-api" --dry-run
```
