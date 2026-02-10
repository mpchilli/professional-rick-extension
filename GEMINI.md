# Architect Loop Extension

This directory contains the source code for the **Architect Loop** extension for Gemini.

## Project Overview

The extension transforms the Gemini CLI into an autonomous, iterative development agent. It enforces a structured engineering lifecycle with strict quality standards and systematic execution.

It implements a rigid, iterative engineering lifecycle: **PRD -> Breakdown -> Research -> Plan -> Implement -> Refactor**.

## Key Components

### 1. Configuration
- **`gemini-extension.json`**: The main manifest file defining the extension name (`Pro-Rick-Opus46`) and context file (`GEMINI.md`).

### 2. Persona Definition
- **`hooks/reinforce-persona.js`**: The core persona enforcer. It defines:
  - **Voice & Tone:** Precise, authoritative, technically driven.
  - **Philosophy:** "First Principles" (build tools), "Clean Code" (optimize aggressively), "Over-Deliver" (engineering excellence).
  - **The Prime Directive:** Systematic execution through disciplined iteration.

### 3. Commands
The extension exposes the following commands via TOML definitions in `commands/`:

- **`/loop`** (`commands/loop.toml`):
  - **Purpose:** Initiates the iterative development loop.
  - **Implementation:** Maps to `extension/bin/setup.js`.
  - **Usage:** `/loop <prompt> [--max-iterations N] [--completion-promise 'text'] [--resume [PATH]]`

- **`/draft-prd`** (`commands/draft-prd.toml`):
  - **Purpose:** Interactively drafts a PRD and initializes a session.
  - **Usage:** `/draft-prd <prompt>`
  
- **`/stop-loop`** (`commands/stop-loop.toml`):
  - **Purpose:** Cancels/Stops the active loop.
  - **Implementation:** Maps to `extension/bin/cancel.js`.

- **`/help`** (`commands/help.toml`):
  - **Purpose:** Displays help information for the extension.

### 4. Orchestration & Hooks
The extension logic is implemented in TypeScript (compiled to `extension/`) and utilizes Gemini CLI hooks for loop control.

- **`extension/bin/setup.js`**: Initializes the loop state (`state.json`), creates necessary directories (`tickets/`, `thoughts/`), and sets the active task.
- **`extension/bin/cancel.js`**: Teardown script to stop the loop by setting `active: false` in `state.json`.
- **`extension/hooks/dispatch.js`**: Centralized hook dispatcher that manages cross-platform execution of JS-based hooks.
- **`hooks/`**: Contains the logic for iteration tracking (`increment-iteration.js`), limit checking (`check-limit.js`), and loop control (`stop-hook.js`).

### 5. Skills
Located in `skills/`, these provide specialized capabilities for each stage of the engineering lifecycle:

- **`prd-drafter`**: Defines requirements and scope.
- **`ticket-manager`**: Manages the work breakdown structure.
- **`code-researcher`**: Analyzes existing codebase and patterns.
- **`research-reviewer`**: Validates research objectivity.
- **`implementation-planner`**: Creates detailed technical plans.
- **`plan-reviewer`**: Validates architectural soundness.
- **`code-implementer`**: Executes the plan with rigorous verification.
- **`ruthless-refactorer`**: Cleans up technical debt.

## Usage

### Starting the Loop
```bash
/loop "Refactor the authentication module"
```
Optional arguments:
- `--max-iterations <N>`: Stop after N iterations.
- `--completion-promise "TEXT"`: Only stop when the agent outputs `<promise>TEXT</promise>`.

### Stopping the Loop
```bash
/stop-loop
```
