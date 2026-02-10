# Installation & Build

> **Attribution:** This CLI was forked and adapted from the original [Pickle Rick Extension](https://github.com/galz10/pickle-rick-extension) by galz10. While the original persona was entertaining, this professional fork prioritises clarity, accessibility, and ease of use for serious engineering work.

## Prerequisites

### Required

- **[Bun](https://bun.sh/)** v1.0.0 or later - JavaScript runtime
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

- **Git** - Version control (for worktree isolation)

### AI Provider (at least one)

- **[Gemini CLI](https://github.com/google-gemini/gemini-cli)** (default)
  ```bash
  npm install -g @google/gemini-cli
  ```

- Or another supported provider (see [Configuration](./CONFIGURATION.md))

## Installation Methods

### From npm (Recommended)

```bash
npm install -g architect-loop
```

After installation, the `architect` command will be available globally.

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/galz10/pickle-rick-extension.git
   cd pickle-rick-extension/cli
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Link globally (optional):
   ```bash
   bun link
   ```

4. Or run directly:
   ```bash
   bun run dev
   ```

## Build Commands

```bash
# Install dependencies
bun install

# Run in development mode (TUI dashboard)
bun run dev

# Build production executable (macOS ARM64)
bun run build

# Type check without emitting
bun run check

# Run tests
bun test

# Run a single test file
bun test src/path/to/file.test.ts
```

## Build Output

After running `bun run build`:

- `dist/architect` - Compiled native executable for macOS ARM64
- `dist/worker-executor.js` - Worker script for parallel execution

## Verifying Installation

```bash
# Check version
architect --version

# Launch TUI dashboard
architect

# Show help
architect --help
```

## Troubleshooting

### "command not found: architect"

If installed via npm, ensure your npm global bin directory is in your PATH:
```bash
export PATH="$PATH:$(npm config get prefix)/bin"
```

### Bun not found

Install Bun first:
```bash
curl -fsSL https://bun.sh/install | bash
```

Then restart your terminal or source your shell profile.

### Permission denied

Make sure the bin.js file is executable:
```bash
chmod +x ./bin.js
```
