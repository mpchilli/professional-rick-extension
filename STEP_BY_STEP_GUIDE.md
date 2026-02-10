# ⚙️ Architect Loop: Quick Start Guide

> **Attribution:** This extension was forked and adapted from the original [Pickle Rick Extension](https://github.com/galz10/pickle-rick-extension) by galz10. While the original persona was entertaining, this professional fork prioritises clarity, accessibility, and ease of use for serious engineering work.

## 1. Install & Configure

**Step 1: Install Extension**
```bash
gemini extensions install https://github.com/galz10/pickle-rick-extension
```

**Step 2: Update Settings**
Add this to your `~/.gemini/settings.json` to enable the agent and secure git operations:
```json
{
  "hooks": { "enabled": true },
  "experimental": { "skills": true },
  "context": {
    "includeDirectories": ["~/.gemini/extensions/architect-loop"]
  },
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

**Step 3: Launch Safely**
Always run in sandbox mode for safety. Enabling **YOLO mode** (`-y`) prevents constant prompts for tool execution:
```bash
gemini -s -y
```

---

## 2. Choose Your Mode

| Command | Best For... |
| :--- | :--- |
| **`/loop "task"`** | **"Execute Immediately"**<br>You have a clear task and want autonomous execution. |
| **`/draft-prd "idea"`** | **"Collaborative Planning"**<br>You have a complex idea and want the agent to help define the requirements first. |

---

## 3. Real World Examples

### The "Quick Fix" (Use `/loop`)
**Prompt:**
```bash
/loop "Read this github issue [PASTE CONTENT] and apply the fix. Validate by running npm run build and npm test." 
```
**Why:** The problem and solution are clear. The agent just needs to execute.

### The "New Feature" (Use `/draft-prd`)
**Prompt:**
```bash
/draft-prd "I want to add ZSH-style tab completion to the CLI. If I type 'ls' and tab, show files. Validate by running npm run build and npm test." 
```
**Why:** Complex UX features have "unknowns." The agent will interrogate you to define the exact behaviour before coding.

---

## 4. Controls
*   **Stop:** `/stop-loop`
*   **Resume:** `/loop --resume`