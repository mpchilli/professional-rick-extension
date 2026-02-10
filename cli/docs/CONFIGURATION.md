# Configuration

> **Attribution:** This CLI was forked and adapted from the original [Pickle Rick Extension](https://github.com/galz10/pickle-rick-extension) by galz10. While the original persona was entertaining, this professional fork prioritises clarity, accessibility, and ease of use for serious engineering work.

## Settings File

Architect Loop CLI uses a settings file at `~/.architect/settings.json` for configuration.

### Creating the Settings File

```bash
mkdir -p ~/.architect
touch ~/.architect/settings.json
```

### Settings Schema

```json
{
  "model": {
    "provider": "gemini",
    "model": "gemini-2.0-flash"
  }
}
```

## Supported Providers

| Provider | Value | Description |
|----------|-------|-------------|
| Gemini | `"gemini"` | Google Gemini CLI (default) |
| OpenCode | `"opencode"` | OpenCode CLI |
| Claude | `"claude"` | Anthropic Claude |
| Cursor | `"cursor"` | Cursor AI |
| Codex | `"codex"` | OpenAI Codex |
| Qwen | `"qwen"` | Alibaba Qwen |
| Droid | `"droid"` | Droid AI |
| Copilot | `"copilot"` | GitHub Copilot |

### Example Configurations

**Using Gemini (default):**
```json
{
  "model": {
    "provider": "gemini"
  }
}
```

**Using OpenCode with specific model:**
```json
{
  "model": {
    "provider": "opencode",
    "model": "gpt-4-turbo"
  }
}
```

**Using Claude:**
```json
{
  "model": {
    "provider": "claude",
    "model": "claude-3-opus"
  }
}
```

## Validating Settings

Use the built-in validator to check your configuration:

```bash
architect validate-settings
```

This will:
- Check JSON syntax
- Validate against the settings schema
- Verify provider name is valid
- Show warnings for common issues

### Auto-fix Common Issues

```bash
architect validate-settings --fix
```

This can automatically fix:
- Trailing commas in JSON
- Whitespace issues

## Environment Variables

Some providers may require environment variables for API keys:

```bash
# Gemini
export GEMINI_API_KEY="your-key-here"

# OpenAI/Codex
export OPENAI_API_KEY="your-key-here"

# Anthropic/Claude
export ANTHROPIC_API_KEY="your-key-here"
```

Add these to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.) for persistence.

## Session Storage Locations

| Location | Purpose |
|----------|---------|
| `.architect/sessions/` | Project-local sessions |
| `.architect/worktrees/` | Isolated git worktrees |
| `~/.architect/settings.json` | Global settings |
| `~/.gemini/extensions/architect-loop/sessions/` | Global session archive |
