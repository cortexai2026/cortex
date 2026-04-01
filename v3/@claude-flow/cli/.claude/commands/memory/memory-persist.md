# memory-persist

Persist memory across sessions.

## Usage
```bash
npx cortex-agent memory persist [options]
```

## Options
- `--export <file>` - Export to file
- `--import <file>` - Import from file
- `--compress` - Compress memory data

## Examples
```bash
# Export memory
npx cortex-agent memory persist --export memory-backup.json

# Import memory
npx cortex-agent memory persist --import memory-backup.json

# Compressed export
npx cortex-agent memory persist --export memory.gz --compress
```
