# AI Architect Extension

This directory contains the source code for the **AI Architect** extension for Gemini.

## Project Overview

The extension transforms the Gemini CLI into an **AI Architect** - a professional, high-agency coding agent. It emphasizes strict adherence to requirements, architectural integrity, and clean, maintainable code.

It implements a rigid, iterative engineering lifecycle: **PRD -> Breakdown -> Research -> Plan -> Implement -> Refactor**.

## Key Components

### 1. Configuration
- **`gemini-extension.json`**: The main manifest file defining the extension name (`Pro-Rick-GPro`) and context file (`GEMINI.md`).

### 2. Persona Definition
- **`hooks/reinforce-persona.js`**: The core personality enforcer. It defines:
  - **Voice & Tone:** Professional, concise, authoritative, and technically precise.
  - **Philosophy:** "Intent-Oriented" (focus on outcome), "Zero-Boilerplate" (optimize aggressively), "Architectural Integrity" (enforce patterns).
  - **The Prime Directive:** "Deliver robust, production-ready solutions".

### 3. Commands
The extension exposes the following commands via TOML definitions in `commands/`:

- **`/rick-architect`** (`commands/rick-architect.toml`):
  - **Purpose:** Initiates the iterative development loop.
  - **Implementation:** Maps to `extension/bin/session-setup.js`.
  - **Usage:** `/rick-architect <prompt> [--max-iterations N] [--completion-promise 'text'] [--resume [PATH]]`

- **`/rick-draft-prd`** (`commands/rick-draft-prd.toml`):
  - **Purpose:** Interactively drafts a PRD and initializes a session.
  - **Usage:** `/rick-draft-prd <prompt>`
  
- **`/rick-cancel-session`** (`commands/rick-cancel-session.toml`):
  - **Purpose:** Stops the active loop.
  - **Implementation:** Maps to `extension/bin/session-cancel.js`.

- **`/rick-help-architect`** (`commands/rick-help-architect.toml`):
  - **Purpose:** Displays help information for the extension.

### 4. Orchestration & Hooks
The extension logic is implemented in TypeScript (compiled to `extension/`) and utilizes Gemini CLI hooks for loop control.

- **`extension/bin/session-setup.js`**: Initializes the loop state (`state.json`), creates necessary directories (`tickets/`, `thoughts/`), and sets the active task.
- **`extension/bin/session-cancel.js`**: Teardown script to stop the loop by setting `active: false` in `state.json`.
- **`extension/hooks/dispatch.js`**: Centralized hook dispatcher that manages cross-platform execution of JS-based hooks.
- **`hooks/`**: Contains the logic for iteration tracking (`increment-iteration.js`), limit checking (`check-limit.js`), and loop control (`stop-hook.js`).

### 5. Skills
Located in `skills/`, these provide specialized capabilities for each stage of the engineering lifecycle:

- **`prd-drafter`**: Defines requirements and scope.
- **`ticket-manager`**: Manages the work breakdown structure.
- **`code-researcher`**: Analyze existing codebase and patterns.
- **`research-reviewer`**: Validates research objectivity.
- **`implementation-planner`**: Creates detailed technical plans.
- **`plan-reviewer`**: Validates architectural soundness.
- **`code-implementer`**: Executes the plan with rigorous verification.
- **`ruthless-refactorer`**: Cleans up technical debt and redundancies.

## Usage

### Starting the Loop
```bash
/rick-architect "Refactor the authentication module"
```
Optional arguments:
- `--max-iterations <N>`: Stop after N iterations.
- `--completion-promise "TEXT"`: Only stop when the agent outputs `<promise>TEXT</promise>`.

### Stopping the Loop
```bash
/rick-cancel-session
```
