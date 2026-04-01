# workflow-export

Export workflows for sharing.

## Usage
```bash
npx cortex-agent workflow export [options]
```

## Options
- `--name <name>` - Workflow to export
- `--format <type>` - Export format
- `--include-history` - Include execution history

## Examples
```bash
# Export workflow
npx cortex-agent workflow export --name "deploy-api"

# As YAML
npx cortex-agent workflow export --name "test-suite" --format yaml

# With history
npx cortex-agent workflow export --name "deploy-api" --include-history
```
