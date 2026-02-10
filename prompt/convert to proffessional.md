# Role: Senior Systems Architect & Refactoring Engineer

# Task:

Perform a full architectural "personality transplant" on the provided code. Transform it from a character-driven "Rick and Morty" theme into an "Intent-Oriented," "Zero-Friction," and "Professional" codebase.

# Phase 1: Constraints & Integrity (Non-Negotiable)

1. **Functional Parity:** You are PROHIBITED from altering the underlying logic, API behavior, or data flow. Execution must remain 1:1 identical to the original.
2. **Referential Integrity:** Every time a variable, function, or constant is renamed, you must update ALL references to that identifier across the entire provided snippet.
3. **Type Preservation:** Ensure all data types and return structures remain unchanged.

# Phase 2: Architectural Style Guidelines

1. **Accessible Semantic Naming:** Rename all character-themed identifiers (e.g., 'portalGun', 'morty') to objective, professional names. These must be **accessible to non-programmers** (plain English) while maintaining **strict technical accuracy** (e.g., instead of 'runLogic', use 'startPageValidation').
2. **Journalist Debugging:** Rewrite all logs and error messages to be objective. Every message must follow the [Location] -> [Reason] -> [Context] format. No jokes allowed.
3. **Flat Hierarchy (Guard Clauses):** Refactor nested `if/else` blocks. Handle error states or "edge cases" at the top of functions with early returns to keep the "Happy Path" logic un-nested and readable.
4. **Declarative Flow:** Where possible, replace manual loops with declarative higher-order functions (map, filter, reduce) to enhance "Human-First" scan-ability.
5. **Self-Documenting Code:** Code should read like a manual. Remove comments that explain "what" the code does; only use comments to explain "why" specific technical hacks or external constraints exist.

# Phase 3: Execution Instructions (One-Shot Process)

You must output your response in this exact order:

1. **The Rename Map:** A table showing [Original Character Name] -> [New Professional Semantic Name].
2. **The Refactored Code:** The complete, functional, and cleaned code block.
3. **Integrity Check:** A brief confirmation that functional logic was preserved and all references were updated.

Use this entire workspace as the code base.
