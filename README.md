# Architect Loop for Gemini CLI ⚙️

## 📥 Installation

```bash
gemini extensions install https://github.com/galz10/pro-rick-opus46-extension
```

## 📋 Prerequisites

- **Gemini CLI**: Version `> 0.25.0-preview.0`
- **Agent Skills & Hooks**: Must be enabled in your Gemini configuration.
- **Node.js**: Required for orchestration and hooks.

> [!WARNING]
> **USE AT YOUR OWN RISK.** This is an experimental demonstration of autonomous AI development workflows. It involves autonomous code modification and shell execution. While safety guardrails are in place, the agent may behave unexpectedly and consume a significant number of tokens.

This extension transforms the Gemini CLI into the **Architect Loop**, an autonomous, iterative development agent that enforces a structured engineering lifecycle with rigorous quality standards.

## 🚀 Overview

The extension enforces a rigid, professional software engineering lifecycle:

1.  **PRD** (Requirements & Scope)
2.  **Breakdown** (Ticket Management)
3.  **Research** (Codebase Analysis)
4.  **Plan** (Technical Design)
5.  **Implement** (Execution & Verification)
6.  **Refactor** (Cleanup & Optimization)

## ⚙️ The Architect Loop Method

Implementation of an iterative, self-referential AI development loop in Gemini.

### What is the Architect Loop?
The Architect Loop is a development methodology based on continuous AI agent loops. **Based on the "Ralph Wiggum" technique**, it relies on the principle that a simple construct repeatedly feeds an AI agent a prompt, allowing it to iteratively improve its work until completion.

### Core Concept
This plugin implements the loop using an **AfterAgent hook** that intercepts Gemini's exit attempts:

```bash
# You run ONCE:
/loop "Your task description" --completion-promise "DONE"

# Then Gemini automatically:
# 1. Works on the task
# 2. Tries to exit
# 3. AfterAgent hook blocks exit
# 4. AfterAgent hook feeds the SAME prompt back
# 5. Repeat until completion
```

The loop happens inside your current session - you don't need external bash loops. The AfterAgent hook in `hooks/stop-hook.js` creates the self-referential feedback loop by blocking normal session exit.

This creates a self-referential feedback loop where:
- The prompt never changes between iterations (ensuring focus).
- The agent's previous work persists in files.
- Each iteration sees modified files and git history.
- The agent autonomously improves by reading its own past work in files.

### ⚠️ Warning
**This loop will continue until the task is complete, the `max-iterations` (default: 5) is reached, the `max-time` (default: 60m) expires, or a `completion-promise` is fulfilled.** (Note: Individual workers have a 20m timeout).

## ✅ When to Use the Architect Loop

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
/loop "Refactor the authentication module"
```

**Options:**
- `--max-iterations <N>`: Stop after N iterations (default: 5).
- `--max-time <M>`: Stop after M minutes (default: 60). (Worker timeout default: 20m).
- `--worker-timeout <S>`: Timeout for individual workers in seconds (default: 1200).
- `--name <SLUG>`: Custom name for the session directory.
- `--completion-promise "TEXT"`: Only stop when the agent outputs `<promise>TEXT</promise>`.
- `--resume [PATH]`: Resume an existing session. If PATH is omitted, uses the latest session.

### Stop the Loop
- `/stop-loop`: Stop/Cancel the current loop.
- `/queue-task`: Add (save) the current task to the queue for later.
- `/run-queue`: Open the queue and execute all queued tasks.
- `/dispatch-worker`: (Internal) Used by the manager to spawn Worker instances.

### Help
To view extension help:
```bash
/help
```

### 📋 Phase-Specific Commands

#### 1. Interactive PRD (Recommended)
Draft a PRD interactively before starting the implementation loop. This initializes a session and primes the agent.
```bash
/draft-prd "I want to add a dark mode toggle"
```
*Tip: After drafting, you can use `/queue-task` to save the task for later execution.*

#### 2. Resume a Session
If a session was interrupted or started via `/draft-prd`, resume it using:
```bash
/loop --resume
```
*Note: This resumes the active session for your current working directory.*

### ⚙️ Important Configuration

To ensure the Architect Loop functions correctly, you must:

2. **Enable Skills & Hooks**: The extension relies on hooks to enforce the persona and manage the loop, and "Skills" to execute specialized engineering tasks. Add this to your `.gemini/settings.json`:

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

2.  **Include Directories**: To ensure the agent can track its work, manage tickets, and persist session state, you **must** add the extension's data directory to your Gemini `includeDirectories` configuration (usually in your `.gemini/settings.json`).

Add the following to your configuration:
```json
{
  "context": {
    "includeDirectories": ["~/.gemini/extensions/Pro-Rick-Opus46"]
  }
}
```

This allows the agent to read and write to the `sessions/` directory where all PRDs, tickets, research, and plans are stored. Without this, the agent will be "blind" to its own progress between iterations.

### 🔍 Viewing Session Logs
If you want to monitor the agent's progress or review past work, you can find all session data (including research, plans, and tickets) in:
```bash
~/.gemini/extensions/Pro-Rick-Opus46/sessions
```

## 🧠 Skills & Capabilities

This extension provides specialized "Skills" that the agent activates during different phases of the lifecycle:

| Skill | Description |
|-------|-------------|
| **`load-persona`** | Activates the engineering persona and standards. |
| **`prd-drafter`** | Defines clear requirements and scope. |
| **`ticket-manager`** | Manages the work breakdown structure (WBS). |
| **`code-researcher`** | Analyzes existing codebase patterns and data flows. |
| **`research-reviewer`** | Validates research for objectivity and completeness. |
| **`implementation-planner`** | Creates detailed, atomic technical plans. |
| **`plan-reviewer`** | Reviews plans for architectural soundness. |
| **`code-implementer`** | Executes plans with rigorous testing and verification. |
| **`ruthless-refactorer`** | Eliminates technical debt and low-quality patterns. |

## 📂 Project Structure

- **`.github/`**: GitHub Actions workflows for CI/CD and releases.
- **`commands/`**: TOML definitions for all extension commands (e.g., `/loop`, `/stop-loop`, `/draft-prd`).
- **`hooks/`**: JavaScript hooks that manage the iterative loop and persona reinforcement.
- **`resources/`**: Static assets like icons and images.
- **`extension/`**: Logic for session management, worker orchestration, and hooks (compiled from TypeScript).
- **`skills/`**: Detailed instructions for each specialized engineering skill.
- **`gemini-extension.json`**: The extension's manifest file.
- **`GEMINI.md`**: Global context file loaded by the extension.
- **`LICENSE`**: Project licensing information.
- **`MANUAL_TESTS.md`**: Guide for manual testing and verification.
- **`TIPS_AND_TRICKS.md`**: Helpful hints for getting the most out of the Architect Loop.

## ⚙️ Configuration

The extension is configured via `gemini-extension.json`.

```json
{
  "name": "Pro-Rick-Opus46",
  "version": "0.1.0",
  "contextFileName": "GEMINI.md"
}
```

## 🏆 Special Thanks & Recognition

*   **Geoffrey Huntley**: For the original ["Ralph Wiggum" technique](https://ghuntley.com/ralph/) and the insight that "Ralph is a Bash loop".
*   **[AsyncFuncAI/ralph-wiggum-extension](https://github.com/AsyncFuncAI/ralph-wiggum-extension)**: For the inspiration and reference implementation.
*   **[dexhorthy](https://github.com/dexhorthy)**: For the context engineering and prompt techniques utilized in this repository.

## 🛡️ Safety & Sandboxing

**The Architect Loop executes code.** It is highly recommended to run this extension in a **sandboxed environment** (Docker container, VM, or a dedicated restricted shell) to prevent accidental system modifications.

If you are running in a sandbox, enable **YOLO mode** (`-y`) so you are not prompted for every tool execution.

```bash
gemini -s -y
```

### Recommended Tool Restrictions
To prevent the agent from accidentally pushing code or performing destructive git operations, we recommend explicitly defining allowed tools in your project's `.gemini/settings.json`:

```json
{
  "tools": {
    "exclude": ["run_shell_command(git push)"],
    "allowed": [
      "run_shell_command(git commit)",
      "run_shell_command(git add)",
      "run_shell_command(git diff)",
      "run_shell_command(git status)"
    ]
  }
}
```

## ⚖️ Legal Disclaimer

**Use at your own risk.** This is an experimental demonstration of autonomous AI development workflows. It involves autonomous code modification and shell execution. While safety guardrails are in place, bugs may exist, and the agent might behave unexpectedly. Always run this in a controlled environment (like a container or a separate git branch) and review changes before committing.

## 📺 Upcoming Features

*   **Notifications**: Real-time OS notifications when a task is complete or fails.
*   **Error Recovery**: Ability for the agent to pause the loop and request human help when stuck in an error loop.
*   **Token Accounting**: A breakdown of total tokens consumed (and cost) after a session finishes.
