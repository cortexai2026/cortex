# ADR-046: Dual Umbrella Packages — cortex-agent + cortex-agent

**Status:** Accepted
**Date:** 2026-02-07
**Updated:** 2026-02-08
**Authors:** RuvNet, Cortex Agent Team

## Context

The umbrella package is published to npm as `cortex-agent`. As the ecosystem grows and the product establishes its own identity, a second umbrella package `cortex-agent` is introduced alongside the original.

### Current State

| Aspect | Current Value |
|--------|---------------|
| npm package | `cortex-agent` |
| CLI binary | `cortex-agent` |
| GitHub repo | ruvnet/cortex-agent |
| Internal packages | @cortex-agent/* |
| Weekly downloads | ~1,000+ |

### Drivers for Change

1. **Brand Cohesion**: Aligns with the ruv ecosystem (ruv.io, @ruvector/*, ruv-swarm)
2. **Trademark Safety**: Removes potential trademark concerns with "Claude" in product name
3. **Product Identity**: Establishes independent product identity beyond Claude integration
4. **Discoverability**: "cortex-agent" is unique, memorable, and searchable
5. **Future Flexibility**: Enables the platform to support multiple AI backends without name confusion
6. **Zero Disruption**: Keeping `cortex-agent` ensures no existing users are broken

## Decision

Publish **two independent npm umbrella packages** — `cortex-agent` (original) and `cortex-agent` (new) — both backed by `@cortex-agent/cli`.

### Package Architecture

```
npm registry
├── cortex-agent          ← original umbrella (bundles @cortex-agent/cli)
│   └── bin: cortex-agent → v3/@cortex-agent/cli/bin/cli.js
├── cortex-agent              ← new umbrella (depends on @cortex-agent/cli)
│   └── bin: cortex-agent     → @cortex-agent/cli/bin/cli.js
└── @cortex-agent/cli     ← shared CLI implementation
```

### What Changes

| Aspect | Before | After |
|--------|--------|-------|
| npm packages | `cortex-agent` only | `cortex-agent` + `cortex-agent` |
| CLI binaries | `cortex-agent` | `cortex-agent` + `cortex-agent` |
| Install commands | `npx cortex-agent@latest` | Both `npx cortex-agent@latest` and `npx cortex-agent@latest` |
| README branding | "Claude-Flow" | "Cortex Agent" (primary), "cortex-agent" (supported) |
| Product name | Claude-Flow | Cortex Agent (with cortex-agent alias) |

### What Stays the Same

| Aspect | Value | Reason |
|--------|-------|--------|
| GitHub repo | ruvnet/cortex-agent | SEO, existing links, history |
| Internal packages | @cortex-agent/* | Minimal disruption, existing integrations |
| Functionality | All features | No functional changes |
| License | MIT | No change |
| Author | RuvNet | No change |
| `cortex-agent` npm package | Fully supported | No breaking changes for existing users |

## Consequences

### Positive

1. **Zero Disruption**: Existing `cortex-agent` users unaffected
2. **Unified Brand**: New `cortex-agent` package for the ruv ecosystem
3. **Trademark Safety**: Users can choose the non-"Claude" branded package
4. **Dual Discovery**: Package discoverable under both names on npm
5. **Future Proof**: Can add non-Claude integrations without name confusion

### Negative

1. **Two packages to maintain**: Must publish and tag both packages
2. **Documentation**: Must reference both package names
3. **Download split**: npm download stats split across two packages

### Neutral

1. **GitHub repo unchanged**: Existing links continue to work
2. **Internal packages unchanged**: No code changes required in @cortex-agent/*

## Implementation

### Package Structure

```
/workspaces/cortex-agent/
├── package.json            # name: "cortex-agent" (original umbrella)
│                           # bin: cortex-agent → v3/@cortex-agent/cli/bin/cli.js
│                           # bundles CLI files directly
└── cortex-agent/
    ├── package.json        # name: "cortex-agent" (new umbrella)
    │                       # bin: cortex-agent → ./bin/cortex-agent.js
    │                       # depends on @cortex-agent/cli
    ├── bin/
    │   └── cortex-agent.js      # thin wrapper, imports @cortex-agent/cli
    └── README.md           # Cortex Agent-branded docs
```

### Phase 1: Preparation (This PR)

1. Create ADR-046 (this document)
2. Keep root `package.json` as `cortex-agent` (original umbrella)
3. Create `cortex-agent/` directory with new umbrella package
4. Update main README.md with Cortex Agent branding
5. Update install scripts to reference `cortex-agent`

### Phase 2: Publishing

```bash
# 1. Publish @cortex-agent/cli (shared implementation)
cd v3/@cortex-agent/cli
npm publish --tag alpha

# 2. Publish cortex-agent umbrella (original)
cd /workspaces/cortex-agent
npm publish --tag v3alpha
npm dist-tag add cortex-agent@<version> latest
npm dist-tag add cortex-agent@<version> alpha

# 3. Publish cortex-agent umbrella (new)
cd /workspaces/cortex-agent/cortex-agent
npm publish --tag alpha
npm dist-tag add cortex-agent@<version> latest
```

### Phase 3: Ongoing

1. Both packages maintained indefinitely
2. Version numbers kept in sync
3. README shows both install options
4. `cortex-agent` promoted as primary in new documentation

## Publishing Checklist

When publishing updates, **all three packages** must be published:

| Order | Package | Command | Tags |
|-------|---------|---------|------|
| 1 | `@cortex-agent/cli` | `npm publish --tag alpha` | alpha, latest |
| 2 | `cortex-agent` | `npm publish --tag v3alpha` | v3alpha, alpha, latest |
| 3 | `cortex-agent` | `npm publish --tag alpha` | alpha, latest |

## Alternatives Considered

### 1. Replace cortex-agent with cortex-agent (single package)

**Pros:** Simpler, one package to maintain
**Cons:** Breaks existing users, loses download history
**Decision:** Rejected - zero disruption preferred

### 2. Rename to ruv-flow (hyphenated)

**Pros:** Matches ruv-swarm pattern
**Cons:** Inconsistent with @ruvector (no hyphen)
**Decision:** Rejected - "cortex-agent" is cleaner and matches ruvector pattern

### 3. Rename internal packages too (@cortex-agent/*)

**Pros:** Complete rebrand
**Cons:** Major breaking change, complex migration, npm scope registration
**Decision:** Rejected - disruption not worth the benefit

### 4. Deprecate cortex-agent

**Pros:** Forces migration to cortex-agent
**Cons:** Breaks existing users, bad developer experience
**Decision:** Rejected - both packages coexist permanently

## Migration Guide

### For New Users

```bash
# Recommended
npx cortex-agent@latest init --wizard

# Also works
npx cortex-agent@latest init --wizard
```

### For Existing Users

No migration required. `cortex-agent` continues to work. Optionally switch:

```bash
# Switch MCP server (optional)
claude mcp remove cortex-agent
claude mcp add cortex-agent npx cortex-agent@latest mcp start
```

### For Contributors

1. Root `package.json` is the `cortex-agent` umbrella
2. `cortex-agent/package.json` is the `cortex-agent` umbrella
3. Internal imports remain `@cortex-agent/*`
4. GitHub repo remains `ruvnet/cortex-agent`

## Metrics for Success

| Metric | Target | Measurement |
|--------|--------|-------------|
| Combined npm downloads | Maintain or grow | npm weekly stats (both packages) |
| GitHub stars | Maintain or grow | GitHub metrics |
| Issues from confusion | < 10 in 30 days | GitHub issues |
| cortex-agent adoption | 50%+ new installs in 90 days | npm stats |

## References

- GitHub Issue: #1101
- npm: https://npmjs.com/package/cortex-agent
- npm: https://npmjs.com/package/cortex-agent
- Related: ADR-017 (RuVector Integration)

## Appendix: Branding Guidelines

### Product Names

| Context | Use |
|---------|-----|
| npm packages | `cortex-agent` and `cortex-agent` (both lowercase) |
| README title | "Cortex Agent" (PascalCase) |
| CLI binaries | `cortex-agent` or `cortex-agent` (both lowercase) |
| In prose | "Cortex Agent" (PascalCase) |

### Command Examples

```bash
# New recommended style
npx cortex-agent@latest init
npx cortex-agent@latest agent spawn -t coder
npx cortex-agent@latest swarm init --topology hierarchical

# Legacy style (still fully supported)
npx cortex-agent@latest init
npx cortex-agent@latest agent spawn -t coder
```

---

**Decision Date:** 2026-02-07
**Updated:** 2026-02-08
**Review Date:** 2026-03-07 (30 days post-implementation)
