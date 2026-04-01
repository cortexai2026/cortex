# memory-search

Search through stored memory.

## Usage
```bash
npx cortex-agent memory search [options]
```

## Options
- `--query <text>` - Search query
- `--pattern <regex>` - Pattern matching
- `--limit <n>` - Result limit

## Examples
```bash
# Search memory
npx cortex-agent memory search --query "authentication"

# Pattern search
npx cortex-agent memory search --pattern "api-.*"

# Limited results
npx cortex-agent memory search --query "config" --limit 10
```
