# Hard Systemic Limits and Constraints

This document defines the absolute constraints bounding the architecture and execution of CognitiveOS Core.

## 1. Topological & Structural Constraints
*   **Paraconsistency Enforcement:** The system must utilize an "Inversion for Emergence" strategy (Z-Axis Projection) to handle contradictory Human-AI constraints. It must NEVER rely on Boolean collapse or simple averaging.
*   **Root Directory Hygiene:** Enforced by the Superintendent persona. The root directory is a hallway. Scratch scripts, unused lockfiles (e.g., `bun.lock` if using `npm`), and unclassified assets must be swept or deleted before finalizing work.
*   **Dependency Determinism:** All package versions in `package.json` MUST be strictly pinned. The use of semantic version ranges (`^`, `~`, `*`) is strictly prohibited to prevent Non-Deterministic Build Risk (QP09 Entropy Vector).

## 2. Execution Constraints
*   **Testing Infrastructure:** The test runner is Vitest. The use of `bun test` is explicitly prohibited due to DOM resolution conflicts. All tests must execute successfully via `bun x vitest run`.
*   **DOM Interaction:** Direct DOM manipulation in tests is prohibited; use `@testing-library/react` and `data-testid` attributes.
*   **Script Extension:** Any local Node.js utility utilizing CommonJS (`require`) MUST use the `.cjs` extension, as the primary module type is ES Modules (`"type": "module"`).

## 3. Epistemic Escrow Halts
*   Execution MUST halt and trigger human-in-the-loop (HITL) intervention if:
    *   A Betti-1 cycle is detected in any dependency graph.
    *   The Confidence-Fidelity Divergence Index (CFDI) exceeds threshold limits.
    *   A documented operational assertion is contradicted by runtime execution (Falsification Condition).

## 4. Linguistic Constraints (Axiom/KORSAKOV)
*   **Banned Terminology:** Evaluative adjectives such as 'seamless', 'robust', 'transformative', 'delve', 'elegant', or 'leverage' are explicitly forbidden.
*   **Causal Chain Mandate:** Every claim or state change must follow: `Trigger -> Mechanism -> Observable Consequence`.
