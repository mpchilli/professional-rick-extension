# AI Architect for Gemini CLI

## 📥 Installation

```bash
gemini extensions install https://github.com/galz10/pickle-rick-extension
```

## 📋 Prerequisites

- **Gemini CLI**: Version `> 0.25.0-preview.0`
- **Agent Skills & Hooks**: Must be enabled in your Gemini configuration.
- **Node.js**: Required for orchestration and hooks.

> [!WARNING]
> **USE AT YOUR OWN RISK.** This extension involves autonomous code modification and shell execution. While safety guardrails are in place, the agent may behave unexpectedly and consume a significant number of tokens.

## 🚀 Overview

The extension transforms the Gemini CLI into an **AI Architect** - a professional, high-agency engineering persona. It enforces a rigid, professional software engineering lifecycle:

1.  **PRD** (Requirements & Scope)
2.  **Breakdown** (Ticket Management)
3.  **Research** (Codebase Analysis)
4.  **Plan** (Technical Design)
5.  **Implement** (Execution & Verification)
6.  **Refactor** (Cleanup & Optimization)

## 🏗️ The Architect Method

Implementation of the **Iterative Agent Loop** for autonomous AI development in Gemini.

### Core Concept
This plugin implements the loop using a **AfterAgent hook** that intercepts Gemini's exit attempts:

```bash
# You run ONCE:
/architect "Your task description" --completion-promise "DONE"

# Then Gemini automatically:
# 1. Works on the task
# 2. Tries to exit
# 3. AfterAgent hook blocks exit
# 4. AfterAgent hook feeds the SAME prompt back
# 5. Repeat until completion
```

This creates a self-referential feedback loop where:
- The prompt never changes between iterations (ensuring focus).
- The agent's previous work persists in files.
- Each iteration sees modified files and git history.
- The agent autonomously improves by reading its own past work in files.

### ⚠️ Warning
**This loop will continue until the task is complete, the `max-iterations` (default: 5) is reached, the `max-time` (default: 60m) expires, or a `completion-promise` is fulfilled.** (Note: Individual workers have a 20m timeout).

## ✅ When to Use AI Architect

**Good for:**
*   Well-defined tasks with clear success criteria.
*   Tasks requiring iteration and refinement (e.g., getting tests to pass).
*   Greenfield projects where you can walk away.
*   Tasks with automatic verification (tests, linters).

**Not good for:**
*   Tasks requiring human judgment or design decisions.
*   One-shot operations.
*   Tasks with unclear success criteria.
*   Production debugging (use targeted debugging instead).

## 🛠️ Usage

### Start the Loop
To initiate the iterative development loop:
```bash
/architect "Refactor the authentication module"
```

**Options:**
- `--max-iterations <N>`: Stop after N iterations (default: 5).
- `--max-time <M>`: Stop after M minutes (default: 60). (Worker timeout default: 20m).
- `--worker-timeout <S>`: Timeout for individual workers in seconds (default: 1200).
- `--name <SLUG>`: Custom name for the session directory.
- `--completion-promise "TEXT"`: Only stop when the agent outputs `<promise>TEXT</promise>`.
- `--resume [PATH]`: Resume an existing session. If PATH is omitted, uses the latest session.

### Stop the Loop
- `/cancel-session`: Stop/Cancel the current loop.
- `/archive-session`: Save the current task for later.
- `/resume-all`: Execute all queued tasks.
- `/dispatch-worker`: (Internal) Used by the manager to spawn worker instances.

### Help
To view extension help:
```bash
/help-architect
```

### 📋 Phase-Specific Commands

#### 1. Interactive PRD (Recommended)
Draft a PRD interactively before starting the implementation loop. This initializes a session and primes the agent.
```bash
/draft-prd "I want to add a dark mode toggle"
```

#### 2. Resume a Session
If a session was interrupted or started via `/draft-prd`, resume it using:
```bash
/architect --resume
```
*Note: This resumes the active session for your current working directory.*

### ⚙️ Important Configuration

To ensure functionality, you must:

1. **Enable Skills & Hooks**: Add this to your `.gemini/settings.json`:

    ```json
    {
      "tools": {
        "enableHooks": true
      },
      "experimental": {
        "skills": true
      }
    }
    ```

2.  **Include Directories**: To ensure the Architect can track its thoughts and manage tickets, you **must** add the extension's data directory to your Gemini `includeDirectories` configuration.

    ```json
    {
      "context": {
        "includeDirectories": ["~/.gemini/extensions/Pro-Rick-GPro"]
      }
    }
    ```

### 🔍 Viewing Session Logs
All session data (including research, plans, and tickets) is stored in:
```bash
~/.gemini/extensions/Pro-Rick-GPro/sessions
```

## 🧠 Skills & Capabilities

| Skill | Description |
|-------|-------------|
| **`load-architect-persona`** | Activates the professional personality. |
| **`prd-drafter`** | Defines clear requirements and scope. |
| **`ticket-manager`** | Manages the work breakdown structure (WBS). |
| **`code-researcher`** | Analyzes existing codebase patterns and data flows. |
| **`research-reviewer`** | Validates research for objectivity and completeness. |
| **`implementation-planner`** | Creates detailed, atomic technical plans. |
| **`plan-reviewer`** | Reviews plans for architectural soundness. |
| **`code-implementer`** | Executes plans with rigorous testing and verification. |
| **`ruthless-refactorer`** | Eliminates technical debt and boilerplate. |

## 📂 Project Structure

- **`.github/`**: GitHub Actions workflows.
- **`commands/`**: TOML definitions for all extension commands.
- **`hooks/`**: JavaScript hooks for loop management.
- **`resources/`**: Static assets.
- **`extension/`**: Logic for session management and orchestration.
- **`skills/`**: Detailed instructions for each specialized engineering skill.
- **`gemini-extension.json`**: The extension's manifest file.
- **`GEMINI.md`**: Global context file.
- **`LICENSE`**: Project licensing information.
- **`MANUAL_TESTS.md`**: Guide for manual testing.
- **`BEST_PRACTICES.md`**: Helpful hints for using the Architect.

## ⚙️ Configuration

The extension is configured via `gemini-extension.json`.

```json
{
  "name": "Pro-Rick-GPro",
  "version": "0.1.0",
  "contextFileName": "GEMINI.md"
}
```

## 🛡️ Safety & Sandboxing

**This extension executes code.** It is highly recommended to run this extension in a **sandboxed environment**.

### Recommended Tool Restrictions
To prevent the agent from accidentally pushing code or performing destructive git operations, we recommend explicitly defining allowed tools in your project's `.gemini/settings.json`.

## ⚖️ Legal Disclaimer

**The AI Architect is a tool.** This extension employs a professional persona to demonstrate advanced agentic workflows. Use at your own risk.
