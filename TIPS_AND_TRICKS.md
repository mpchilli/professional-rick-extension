# Architect Loop: Tips & Tricks ⚙️

> **Attribution:** This extension was forked and adapted from the original [Pickle Rick Extension](https://github.com/galz10/pickle-rick-extension) by galz10. While the original persona was entertaining, this professional fork prioritises clarity, accessibility, and ease of use for serious engineering work.

## 🧠 Prompt Engineering for the Architect Loop

### 1. Be Specific, Not Descriptive
Instead of "Refactor the code," use "Refactor the `AuthService` to use the Strategy pattern for OAuth providers, ensuring strict TypeScript types." The Architect Loop thrives on technical precision.

### 2. The "Interrogation" Trigger
If you want the agent to ask questions before starting, explicitly state: "Interrogate me on the edge cases before you draft the PRD."

### 3. Use the `--name` Flag
Keep your `sessions/` directory organised. 
```bash
/loop "Implement JWT auth" --name "auth-jwt-migration"
```

## ⚙️ Under the Hood: The Manager/Worker Architecture

The Architect Loop operates using a **Manager/Worker** pattern.
*   **Manager:** The primary agent. It creates the plan, breaks down tickets, and **audits** the work. It does *not* write the code itself in complex phases.
*   **Worker:** A spawned sub-agent that executes a specific ticket. It runs in a localised loop until the task is complete.

### Why this matters to you:
1.  **Silence is Normal:** The Manager agent may be silent while the Worker is operating in the background.
2.  **The Audit:** You will see the Manager reviewing the code after the Worker finishes. It will run `git diff` and tests to verify output. If the quality is insufficient, it will revert and force a retry.

## 📝 Example Prompts

### 1. Full-Stack Feature with Verification
Use this when you want the agent to build a feature and verify it doesn't break the build or existing tests.
```bash
/loop "Add a new 'Dashboard' view to this full-stack app. To validate your changes, you MUST run 'npm run build' and 'npm run test' before finishing."
```

### 2. Deep Refactoring
Use this to fix technical debt in a specific module.
```bash
/loop "Refactor the database connection logic in src/db.ts to use a singleton pattern. Interrogate me on the preferred retry strategy before you start."
```

### 3. Bug Fixing with Research
Use this when you have a vague bug report.
```bash
/loop "The file selection in the sidebar is intermittent. Conduct deep research into the event propagation before proposing a plan."
```

## 🛠️ Session Management

### 1. Monitoring Progress
You can watch the agent's activity in real-time, but to see the *real* coding progress, you need to watch the **Worker** logs.

**Watch the Manager:**
```bash
SESSION_DIR=$(node ${EXTENSION_ROOT}/extension/bin/get_session.js)
tail -f "$SESSION_DIR/state.json"
```

**Watch the Worker:**
```bash
# Find and tail the latest worker log in your session
ls -t ${EXTENSION_ROOT}/sessions/*/*/*/worker_session_*.log | head -n 1 | xargs tail -f
```

### 2. Advanced Flags
*   `--reset`: Resets the iteration count and start time (useful if you manually fixed a stuck loop).
*   `--paused`: Initialise a session but don't start the loop immediately.
*   `--worker-timeout <seconds>`: Set a custom timeout for the Worker (default: 1200s).

### 3. Manual Intervention
If the agent gets stuck in a loop, use `/stop-loop` to halt the process. You can then manually edit the `state.json` in the session folder to skip a step or change the `current_ticket`.

### 4. Resuming a Session
The Architect Loop has native support for resuming sessions. This is useful if a loop was interrupted or if you initialised the session via `/draft-prd`.
```bash
/loop --resume
```
You can also resume a specific session by providing the path:
```bash
/loop --resume ${EXTENSION_ROOT}/sessions/YYYY-MM-DD-slug
```

## 🚀 Best Practices

### 1. Inventing Tools
If a task requires a specific script (e.g., a custom linter or data migrator), tell the agent: "You are the library. Invent the tools you need to verify this." It will often create helper scripts in your project.

### 2. Verification is King
The agent is only as good as its tests. Ensure your environment has a test runner configured. It will automatically try to run `npm test`, `pytest`, etc., if it finds the config.

## ⚠️ Common Pitfalls

*   **Silence:** If the agent becomes a "silent tool user," prompt it: "Explain your reasoning and decisions as you work."
*   **Vague PRDs:** If the PRD is too high-level, the breakdown will be messy. Always review the `prd.md` in the session folder before the agent moves to the Breakdown phase.
*   **Permissions:** If the loop fails to restart, check that your `hooks/` are executable (`chmod +x`).

---

> "Engineering excellence through disciplined iteration." ⚙️
