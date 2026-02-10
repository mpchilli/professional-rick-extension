# Architect Loop CLI ⚙️

> **Attribution:** This CLI was forked and adapted from the original [Pickle Rick Extension](https://github.com/galz10/pickle-rick-extension) by galz10. While the original persona was entertaining, this professional fork prioritises clarity, accessibility, and ease of use for serious engineering work.

## 📥 Installation

### From npm

```bash
npm install -g pro-rick-opus46
```

### From Source

```bash
git clone https://github.com/galz10/pickle-rick-extension.git
cd pickle-rick-extension/cli
bun install
bun link
```

## 📋 Prerequisites

- **[Bun](https://bun.sh/)**: Version `>= 1.0.0` - JavaScript runtime
- **Git**: Required for worktree isolation
- **AI Provider**: Gemini CLI, OpenCode, or another supported provider

> [!WARNING]
> **USE AT YOUR OWN RISK.** This CLI orchestrates autonomous AI coding agents that modify files and execute commands. While sessions run in isolated git worktrees, the agent may behave unexpectedly and consume significant tokens. Always review changes before merging.

Architect Loop is an autonomous coding agent orchestrator with a beautiful TUI (Terminal UI) dashboard. Point it at a task, walk away, and let a structured AI agent work through your coding problems using a disciplined engineering workflow — all running safely in isolated git worktrees.

## 🚀 Overview

The Architect Loop executes complex coding tasks through an iterative AI agent loop:

1. **PRD** - Draft Product Requirements Document
2. **Breakdown** - Create atomic tickets from requirements
3. **Research** - Analyse codebase patterns and data flows
4. **Plan** - Design technical implementation approach
5. **Implement** - Execute with rigorous testing
6. **Refactor** - Cleanup and eliminate low-quality patterns

## ⚙️ The Architect Loop Method

This CLI implements the **Architect Loop technique** — an iterative, self-referential AI development loop where the agent continuously improves its work until completion.

### How It Works

```bash
# Launch the TUI dashboard
architect

# Or run directly with a prompt
architect "Implement JWT authentication"

# The agent automatically:
# 1. Creates an isolated git worktree
# 2. Works through the task phases
# 3. Iterates until completion
# 4. Offers to merge changes back
```

### Core Concepts

- **Git Worktree Isolation**: Each session runs in a separate worktree, preventing conflicts with your main branch
- **State Persistence**: Session state saved to disk, allowing resume after interruption
- **Streaming Output**: Real-time progress updates in the TUI
- **Multi-Provider Support**: Works with Gemini, Claude, OpenCode, Cursor, and more

## 🛠️ Usage

### Launch TUI Dashboard

```bash
architect
```

Opens the interactive terminal interface where you can:
- Enter prompts for new coding tasks
- View and manage existing sessions
- Monitor task progress in real-time

### Run with a Prompt

```bash
architect "Your task description here"
```

**Examples:**
```bash
architect "Add unit tests for the authentication module"
architect "Refactor the database layer to use connection pooling"
architect "Fix the bug where users can't logout on mobile"
```

### Command Options

| Option | Description | Default |
|--------|-------------|---------|
| `-m, --max-iterations <n>` | Maximum agent iterations | `20` |
| `-r, --resume <path>` | Resume an existing session | - |
| `--completion-promise <text>` | Stop when this text appears | `"I AM DONE"` |
| `--tui` | Force TUI mode | `false` |

### Additional Commands

```bash
# List all sessions
architect sessions

# Validate settings file
architect validate-settings

# Auto-fix common settings issues
architect validate-settings --fix
```

## ⚙️ Configuration

Settings are stored at `~/.architect/settings.json`:

```json
{
  "model": {
    "provider": "gemini",
    "model": "gemini-2.0-flash"
  }
}
```

### Supported Providers

| Provider | Value | Description |
|----------|-------|-------------|
| Gemini | `"gemini"` | Google Gemini CLI (default) |
| OpenCode | `"opencode"` | OpenCode CLI |
| Claude | `"claude"` | Anthropic Claude |
| Cursor | `"cursor"` | Cursor AI |
| Codex | `"codex"` | OpenAI Codex |
| Qwen | `"qwen"` | Alibaba Qwen |
| Copilot | `"copilot"` | GitHub Copilot |

## 🔍 Session Management

### Session Storage

Sessions are stored in:
- **Local**: `.architect/sessions/<date-hash>/` in your project
- **Worktrees**: `.architect/worktrees/session-<name>/` for isolated execution
- **Global**: `~/.gemini/extensions/Pro-Rick-Opus46/sessions/`

### Resuming Sessions

```bash
# Resume a specific session
architect -r .architect/sessions/2024-01-15-abc123/
```

The agent continues from where it left off with full context preserved.

## 📂 Project Structure

```
cli/
├── docs/               # Documentation
│   ├── INSTALLATION.md # Setup guide
│   ├── USAGE.md        # Command reference
│   ├── CONFIGURATION.md# Settings guide
│   └── ARCHITECTURE.md # Technical design
├── src/
│   ├── index.ts        # CLI entry point
│   ├── services/
│   │   ├── config/     # State & settings management
│   │   ├── execution/  # Orchestrator loop logic
│   │   ├── git/        # Git operations (worktree, diff, PR)
│   │   └── providers/  # AI provider integrations
│   ├── ui/             # TUI components and views
│   ├── games/          # Easter egg games 🎮
│   └── utils/          # Utility functions
└── dist/               # Compiled output (after build)
```

## 🏗️ Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Build production executable
bun run build

# Type check
bun run check

# Run tests
bun test
```

## ✅ When to Use the Architect Loop

**Good for:**
- Well-defined tasks with clear success criteria
- Tasks requiring iteration and refinement
- Greenfield features where you can walk away
- Tasks with automatic verification (tests, linters)

**Not good for:**
- Tasks requiring human judgement mid-execution
- One-shot simple operations
- Tasks with unclear success criteria
- Production debugging

## 🛡️ Safety & Sandboxing

The Architect Loop executes code autonomously. Safety features include:

- **Git Worktree Isolation**: Changes happen in separate worktrees
- **No Auto-Push**: Changes are never pushed without explicit action
- **Merge Review**: Always review changes before merging to main

For additional safety, run in a sandboxed environment (Docker, VM) for untrusted tasks.

## 📚 Documentation

- [Installation & Build](./docs/INSTALLATION.md) - Prerequisites and setup
- [Usage & Commands](./docs/USAGE.md) - Full CLI reference
- [Configuration](./docs/CONFIGURATION.md) - Settings and providers
- [Architecture](./docs/ARCHITECTURE.md) - Technical design

## ⚖️ License

MIT

---

> "Engineering excellence through disciplined iteration." ⚙️
