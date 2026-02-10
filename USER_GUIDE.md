# AI Architect: Quick Start Guide

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
    "includeDirectories": ["~/.gemini/extensions/Pro-Rick-GPro"]
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
| **`/architect "task"`** | **"Autonomous Execution"**<br>You have a clear task and don't want questions. |
| **`/draft-prd "idea"`** | **"Collaborative Planning"**<br>You have a complex idea and want the Architect to help define the requirements first. |

---

## 3. Real World Examples

### The "Quick Fix" (Use `/architect`)
**Prompt:**
```bash
/architect "Read this github issue [PASTE CONTENT] and apply the fix. Validate by running npm run build and npm test." 
```
**Why:** The problem and solution are clear. The Architect just needs to execute.

### The "New Feature" (Use `/draft-prd`)
**Prompt:**
```bash
/draft-prd "I want to add ZSH-style tab completion to the CLI. If I type 'ls' and tab, show files. Validate by running npm run build and npm test." 
```
**Why:** Complex UX features have "unknowns." The Architect will interrogate you to define the exact behavior before coding.

---

## 4. Controls
*   **Stop:** `/cancel-session`
*   **Resume:** `/architect --resume`