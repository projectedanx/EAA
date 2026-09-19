# ADR 0002: Skill Drifting Stress Test in Voyager-class Architectures

## 1. Context and Problem Statement
In lifelong learning agents relying on dynamic code synthesis and recursive execution (Voyager-class architectures), the phenomenon of **Skill Drifting** poses a severe existential threat. Skill Drifting is defined as the accumulation of latent logical and syntactic errors in deeply nested executable primitives. When lower-level skills (e.g., Level 0 primitives) undergo structural changes (such as API schema adjustments in an external mock database MCP tool), these changes propagate through the dependency hierarchy, potentially causing cascading failures.

The problem is compounded by context window saturation. During deep debugging cycles, the agent's context may become overloaded with execution traces and tracebacks, leading to a "lazy implementer" state where it outputs placeholder logic instead of functional code.

## 2. High-Fidelity Stress-Test Pipeline

We have designed a systematic stress-test pipeline to probe the reliability limits of a retrieved Skill Library across deep execution horizons.

### 2.1 Precedence Hierarchy Mapping
The dependency structure is modeled as a Directed Acyclic Graph (DAG) up to Depth Level 5.
*   **Level 0 (Base Primitives):** Direct hardware or API interfaces (e.g., `fetch_db_schema()`).
*   **Level 1 (Compound Actions):** Aggregation of base primitives (e.g., `query_and_parse_user()`).
*   **Level 2-4 (Complex Strategies):** Multi-step planning nodes.
*   **Level 5 (Meta-Execution):** The overarching goal coordinator.

Changes at Level 0 are mathematically tracked as they ripple upwards, forcing recompilation and re-evaluation at each subsequent tier.

### 2.2 Simulated Dependency Collision
The stress test introduces a breaking API schema change at Level 0.
The Sandboxed Debugger attempts to compile and self-heal the nested functions.
We monitor the Context Saturation Point (CSP)—the specific depth at which the token limit is breached, forcing the LLM into a generalized placeholder state (`// TODO: implement`).

### 2.3 Real-Time Pattern Ledger Instrumentation
During the self-healing cycle, we track:
*   **MTLD (Measure of Textual Lexical Diversity):** Evaluates structural diversity. A dropping MTLD indicates repetitive, looping generation.
*   **Distinct-3:** Measures local token entropy (n-grams).
*   **Semantic Reynolds Number ($Re_s$):** Monitors the turbulent transition from coherent debugging to infinite looping.

### 2.4 Epistemic Escrow and Rollback
To prevent infinite catastrophic loops, the pipeline enforces an **Epistemic Escrow**.
If the agent executes the identical failing repair script three times consecutively without reducing compilation errors (measured by error count or AST diff size), the execution halts.
The system serializes the entire state object and generates a detailed rollback manifest using `git check-point` primitives.

## 3. Mathematical Formalization

### 3.1 Operator Drift Score ($ODS$)
The Operator Drift Score quantifies the divergence of a modified skill from its verified origin, incorporating dependency depth and entropy.

$$ODS = \sum_{d=0}^{D_{max}} \left( \frac{\Delta AST_d}{e^{-k \cdot d}} \times Re_s \right)$$
*Where:*
*   $d$: Dependency depth level.
*   $\Delta AST_d$: The Abstract Syntax Tree diff magnitude at depth $d$.
*   $k$: A decay constant for dependency importance.
*   $Re_s$: Semantic Reynolds Number (turbulence of recent token generations).

### 3.2 Context Compaction Heuristic ($CCH$)
To prevent amnesia during long-horizon repair cycles, the $CCH$ filters the context window:
1.  **Keep:** The original goal, the strict API schema, and the most recent failed AST diff.
2.  **Compress:** Intermediate passing execution logs into semantic summaries.
3.  **Discard:** Syntactically invalid prior drafts and repetitive tracebacks.

### 3.3 Dependency Whitelist Schema
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Skill Dependency Whitelist",
  "type": "object",
  "properties": {
    "skill_id": { "type": "string" },
    "max_depth": { "type": "integer", "maximum": 5 },
    "allowed_dependencies": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Strictly enforces which Level 0-4 skills can be invoked, preventing arbitrary deep nesting."
    },
    "freeze_state": { "type": "boolean", "default": false }
  },
  "required": ["skill_id", "max_depth", "allowed_dependencies"]
}
```
