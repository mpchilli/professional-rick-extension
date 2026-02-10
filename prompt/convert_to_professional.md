# Role: Lead Systems Architect & Senior Refactoring Engineer

# Task:

Perform a full architectural "personality transplant" on the provided repository. Transform it from a "Rick and Morty" themed extension into an "Intent-Oriented," "Zero-Friction," and "Professional" codebase.

# Phase 1: Constraints & Integrity (Non-Negotiable)

1. **Functional Parity:** PROHIBITED from altering underlying logic, API behavior, or data flow. Execution must remain 1:1 identical.
2. **Referential Integrity:** Every rename requires a global update. No orphaned variables or broken imports/exports.
3. **Type Preservation:** All data types, return structures, and schemas must remain unchanged.

# Phase 2: Architectural Style Guidelines

1. **Accessible Semantic Naming:** Rename all character-themed identifiers (e.g., 'portalGun', 'morty') to objective names. Use terminology accessible to non-programmers (plain English) while maintaining strict technical accuracy (e.g., use 'updateUserDisplay' instead of 'refreshMorty').
2. **Journalist Debugging:** Logs/errors must follow the format: `[Location] -> [Reason] -> [Context]`. No jokes; objective facts only.
3. **Flat Hierarchy (Guard Clauses):** Flatten nested `if/else` blocks. Handle errors/edge-cases at the top with early returns to keep the "Happy Path" logic un-nested.
4. **Declarative Flow:** Use higher-order functions (map, filter, reduce) to enhance scan-ability.
5. **Self-Documenting Code:** Remove "what" comments. Only keep "why" comments for technical constraints or legacy fixes.

# Phase 3: Governance & Version Control

1. **Pre-Flight Planning:** Before modifying code, generate an exhaustive execution plan at `prompt/convert_to_professional.md`. Include a **Dependency Graph** identifying which files interact.
2. **Atomic Commits:** Perform one logical change at a time. For every change, provide a Git commit command:
   `git commit -m "refactor: [Subject] | Files: [FileNames]" -m "[Description of rename/change]."`
3. **Reference Validation:** Before completing a file, perform a "Cross-Reference Audit" to verify that renamed exports/imports match across the entire codebase. Validate all file paths in `manifest.json` and HTML tags.

# Phase 4: Execution Instructions (One-Shot Output)

Output your response in this exact order:

1. **The Rename Map:** A table of [Original Name] -> [Professional Semantic Name]. (as prompt/1_RenameMap.md)
2. **The Execution Plan:** The content for `prompt/convert_to_professional.md`. (as prompt/2_Execution.md)
3. **The Refactored Code:** The complete, functional code blocks per file.
4. **Commit Log:** The list of atomic git commit commands for the changes made.
5. **Integrity Confirmation:** A final report verifying all references are intact and logic is preserved. (as prompt/5_Confirmation.md)

---

# Phase 5: Lessons Learned & Checklist for Future Conversions

> This section was added after completing the full conversion of this repository. Use it as a reference guide for similar projects.

## Conversion Checklist

### Extension Core (TypeScript)
- [ ] **Hooks** (`hooks/*.ts`): rename persona files, update `reinforce-persona`, `stop-hook`, `check-limit`, `increment-iteration`
- [ ] **Services** (`extension/src/services/*.ts`): rename utility files (e.g. `pickle-utils.ts` → `core-utils.ts`), update all imports
- [ ] **Bin Scripts** (`extension/src/bin/*.ts`): update import paths and session references
- [ ] **Tests** (`*.test.ts`): update mock paths and jest.mock references
- [ ] **Config** (`gemini-extension.json`, `GEMINI.md`): update extension name and root documentation

### Skills (`.md` Files)
- [ ] **Persona footers**: Replace character-specific "Pickle Rick Persona (MANDATORY)" with professional "Agent Persona (MANDATORY)"
- [ ] **Body text**: Replace character references (Morty, Jerry, Rick) with professional equivalents (Worker Agent, Manager Agent)
- [ ] **Both root and CLI copies**: Skills exist in both `skills/` and `cli/src/skills/` — update both

### CLI Source Code (`cli/src/*.ts`)
- [ ] **Function names**: `createPickleWorktree` → `createSessionWorktree`, `cleanupPickleWorktree` → `cleanupSessionWorktree`
- [ ] **Type names**: `PickleSettings` → `AgentSettings`, `PickleSettingsSchema` → `AgentSettingsSchema`
- [ ] **Class names**: `PickleTaskSource` → `AgentTaskSource`
- [ ] **Constants**: `PICKLE_PERSONA` → `AGENT_PERSONA`, `PICKLE_WORKER_CMD_OVERRIDE` → `AGENT_WORKER_CMD_OVERRIDE`
- [ ] **Paths**: `.pickle/` → `.architect/`, `pickle-rick` → `architect-loop`
- [ ] **Branch prefixes**: `pickle/session-` → `architect/session-`
- [ ] **Mode strings**: `"pickle"` → `"loop"`, `"pickle-prd"` → `"draft-prd"`
- [ ] **UI labels**: `"Pickle"` → `"Architect"`, `"Pickle PRD"` → `"Draft PRD"`
- [ ] **File names**: `pickle-source.ts` → keep filename but update exports/imports

### Documentation
- [ ] Root docs: `TIPS_AND_TRICKS.md`, `STEP_BY_STEP_GUIDE.md`, `README.md`
- [ ] CLI docs: `cli/README.md`, `cli/CLAUDE.md`, `cli/AGENTS.md`
- [ ] CLI sub-docs: `cli/docs/ARCHITECTURE.md`, `CONFIGURATION.md`, `INSTALLATION.md`, `USAGE.md`
- [ ] Add attribution to original repo in all doc files

### Package Files
- [ ] `package.json` (root): update name, description
- [ ] `cli/package.json`: update name, description, bin command
- [ ] `package-lock.json`: auto-generated — will regenerate on `npm install`

## Lessons Learned

### 1. Cross-Platform Path Separators
Tests that hardcode forward-slash paths (`/`) fail on Windows (backslash `\`). Use `path.join()` in all test assertions involving file paths.

### 2. PowerShell Bulk Replacement Works Well
For 30+ files with consistent patterns, PowerShell's `-replace` operator is highly effective. Run multiple passes for nested/complex patterns. Use `Write-Host` instead of `Write-Output` for reliable console output.

### 3. CLI Skills Are Duplicated
The `cli/src/skills/*.md` files are copies of the root `skills/*/SKILL.md` but flattened. Both must be updated independently.

### 4. Attribution Is Important
When forking and refactoring an open-source project, always add clear attribution to the original repository in documentation files.

### 5. Line Ending Sensitivity
PowerShell string `.Replace()` is sensitive to line endings (CRLF vs LF). Use regex `-replace` with `\r?\n` patterns, or use line-by-line processing for reliability.

### 6. Compile-Safe Refactoring
TypeScript compilation (`npm run build`) is the best validator — if it passes, your import/export renames are correct. Always build after renaming.

### 7. Build Before Tests
Run `npm run build` before `npm test` to ensure compiled JS matches the TS source. Tests run against compiled JS, so stale builds will produce false failures.

## Extension Name Locations (Reference)

When renaming the extension (e.g., from `architect-loop` to `Pro-Rick-Opus46`), ensure you update the following locations:

### 1. Configuration & Manifests
- **`gemini-extension.json`**:
  - `name`: The internal extension ID (e.g., `"Pro-Rick-Opus46"`).
- **`package.json`**:
  - `name`: The npm package name (e.g., `"pro-rick-opus46-extension"`).
  - `repository`: Utilities for `git+https` URLs.

### 2. Extension Source Code
- **`extension/src/services/core-utils.ts`**:
  - `DEFAULT_EXTENSION_ROOT`: Path constant (e.g., `.gemini/extensions/Pro-Rick-Opus46`).
- **`extension/src/hooks/dispatch.ts`**:
  - `DEFAULT_EXTENSION_DIR`: Path constant.
- **`extension/src/services/git-utils.ts`**:
  - `FALLBACK_GITHUB_USER`: Default user for attribution (e.g., `"Pro-Rick-Opus46"`).

### 3. Hook Handlers (`extension/src/hooks/handlers/*.ts`)
These files often contain fallback paths if `process.env.EXTENSION_DIR` is missing:
- **`reinforce-persona.ts`**: `path.join(os.homedir(), '.gemini/extensions/NAME')`
- **`increment-iteration.ts`**
- **`check-limit.ts`**
- **`stop-hook.ts`** (Check multiple occurrences)

### 4. CLI Source Code (`cli/src/**/*.ts`)
- **`cli/package.json`**: `name` (e.g., `"pro-rick-opus46"`).
- **`cli/src/utils/resources.ts`**:
  - `DEFAULT_EXTENSION_PATH`: The default global path.
- **`cli/src/services/providers/gemini.ts`**:
  - Extension name in `exec` commands (e.g., `gemini extensions disable NAME`).
- **`cli/src/services/config/state.ts`**:
  - Global sessions path.
- **`cli/src/services/git/pr.ts`**:
  - Attribution text and URLs.

### 5. Documentation
- **Root**: `README.md`, `GEMINI.md`, `STEP_BY_STEP_GUIDE.md` (Install commands, paths, config snippets).
- **CLI**: `cli/README.md`, `cli/CLAUDE.md`, `cli/docs/*.md` (Global paths, install commands).
