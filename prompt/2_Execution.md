# Execution Plan: Project "Architect" Conversion

## Phase 1: Preparation & Documentation (Safe)
- [ ] Create `prompt/1_RenameMap.md` (Complete)
- [ ] Create `prompt/2_Execution.md` (This file)
- [ ] Update `GEMINI.md` to define the new "Professional Architect" persona and remove Rick & Morty references.
- [ ] Rename and update documentation files:
    - `README.md`: Rewrite intro, installation, and usage.
    - `TIPS_AND_TRICKS.md` -> `BEST_PRACTICES.md`
    - `STEP_BY_STEP_GUIDE.md` -> `USER_GUIDE.md`

## Phase 2: Configuration & Commands (Breaking)
- [ ] Update `gemini-extension.json`:
    - Rename extension to "AI Architect".
    - Update description.
- [ ] Update `package.json`:
    - Name: `Pro-Rick-GPro`
    - Description: "Professional AI Architect for Gemini"
- [ ] Refactor `commands/`:
    - Delete `pickle.toml`, `pickle-prd.toml`, `eat-pickle.toml`, `send-to-morty.toml`.
    - Create `architect.toml`, `draft-prd.toml`, `cancel.toml`, `dispatch-worker.toml`.
    - Update command mappings to point to renamed scripts.

## Phase 3: Core Logic (Deep Refactor)
- [ ] Refactor `extension/src/bin/`:
    - `setup.ts`: Remove "Pickle" logic, rename to `session-setup.ts`.
    - `cancel.ts`: Rename to `session-cancel.ts`.
    - `spawn-rick.ts` -> `spawn-manager.ts`.
    - `spawn-morty.ts` -> `spawn-worker.ts`.
    - `jar-runner.ts` -> `artifact-runner.ts`.
- [ ] Refactor `extension/src/services/`:
    - `pickle-utils.ts` -> `core-utils.ts`.
    - `pr-factory.ts` -> `agent-factory.ts`.
    - `jar-utils.ts` -> `store-utils.ts`.
    - Remove all character quotes and "jokes" from log messages.
- [ ] Refactor `extension/src/hooks/`:
    - `reinforce-persona.ts`: Rewrite logic to enforce "Professional" tone instead of "Rick" tone.
    - `stop-hook.ts`: Ensure cleanly stopping "Architect" sessions.

## Phase 4: Skills (Content Update)
- [ ] Update all `.md` files in `skills/`:
    - Replace "Pickle Rick" with "AI Architect".
    - Replace "Morty" with "Implementation Worker".
    - Remove "Don't think about it" style directives.
    - Add "Verify Assumption" directives.

## Phase 5: Verification
- [ ] Build project (`npm run build`).
- [ ] Run tests (`npm test`).
- [ ] Manual smoke test of `/architect` command.
