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
