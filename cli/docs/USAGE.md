# Usage & Commands

> **Attribution:** This CLI was forked and adapted from the original [Pickle Rick Extension](https://github.com/galz10/pickle-rick-extension) by galz10. While the original persona was entertaining, this professional fork prioritises clarity, accessibility, and ease of use for serious engineering work.

## Basic Usage

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

Starts a new session directly with the given prompt, bypassing the TUI.

Examples:
```bash
architect "Add unit tests for the authentication module"
architect "Refactor the database layer to use connection pooling"
architect "Fix the bug where users can't logout on mobile"
```

## Commands

### `architect [prompt]`

The default command. Runs the agent with an optional prompt.

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-m, --max-iterations <n>` | Maximum agent iterations | `20` |
| `-r, --resume <path>` | Resume an existing session | - |
| `--completion-promise <text>` | Stop when this text appears in output | `"I AM DONE"` |
| `--tui` | Force TUI mode | `false` |

**Examples:**

```bash
# Run with custom iteration limit
architect "Build a REST API" -m 50

# Resume a previous session
architect -r .architect/sessions/2024-01-15-abc123/

# Force TUI mode with initial prompt
architect "Add dark mode" --tui
```

### `architect sessions`

List all active and past sessions.

```bash
architect sessions
```

Output shows:
- Timestamp
- Status (running, completed, failed)
- Original prompt (truncated)
- Session directory path

### `architect validate-settings`

Validate your `~/.architect/settings.json` configuration file.

```bash
architect validate-settings
```

**Options:**

| Option | Description |
|--------|-------------|
| `--fix` | Automatically fix common issues (like trailing commas) |

```bash
# Auto-fix common JSON issues
architect validate-settings --fix
```

## Session Management

### Session Storage

Sessions are stored in:
- **Local**: `.architect/sessions/<date-hash>/` in your project directory
- **Global**: `~/.gemini/extensions/architect-loop/sessions/`

Each session directory contains:
- `state.json` - Session state and progress
- Agent output logs
- Generated files and artifacts

### Resuming Sessions

To resume a session, use the `-r` flag with the session path:

```bash
architect -r .architect/sessions/2024-01-15-abc123/
```

The agent will continue from where it left off, maintaining context and progress.

## TUI Navigation

When in the TUI dashboard:

| Key | Action |
|-----|--------|
| `Enter` | Submit prompt / Confirm |
| `Esc` | Cancel / Go back |
| `Tab` | Switch focus |
| `Ctrl+C` | Exit |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Execution failed / Error |
