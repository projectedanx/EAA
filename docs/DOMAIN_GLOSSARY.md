# Bounded Context Vocabulary

This glossary maps the conceptual lexicon to structural components within the CognitiveOS Core domain. It acts as the bridging mechanism for the `LEXICON.md`.

*   **Cartograph-Prime (0xCARTO):** The systematic parsing engine used to generate Tier-1 through Tier-5 documentation based strictly on AST/YAML traversal, resisting narrative hallucination.
*   **Z-Axis Projection:** The mathematical projection of mutually exclusive constraints into a higher-dimensional emergent node, rather than compromising them via a Boolean average. Implemented in `AgenticInversionEngine`.
*   **Symbolic Scar (Golden Scar Protocol):** A preserved record of a past interpretive failure or paraconsistent state (e.g., legacy logic that cannot be standardized without destroying tacit knowledge). Visualized via the `SymbolicScarManager`.
*   **CFDI (Confidence-Fidelity Divergence Index):** A topological metric used to measure the gap between the AI's confidence in its generated structure and the actual fidelity to human constraint boundaries.
*   **Nitinol Failure Ledger (NFL):** A persistent JSON-RPC error constraint set utilized within the VANCE architecture to track structural failure states.
*   **DCCD (Draft-Conditioned Constrained Decoder):** The mechanism enforcing a strict separation between semantic drafting (the logic) and rigid schema enforcement (the output format).
*   **Petzold Loop:** The execution architecture (THINK, DRAFT_VOICE, GUARD_STRUCTURE, EXTRUDE) utilized by the Axiom persona for strict procedural generation.
*   **Phronesis Index (Φ):** A metric (Target: Φ < 0.05) measuring the depth of spectral gap collapse; a value indicating severe hallucination or resonance across overlapping models.

*   **Manifold Alpha ($\alpha$):** The Hollow-Core semantic planning space stripped of heavy OpenAPI schemas, designed for high-entropy generative reasoning.
*   **Manifold Beta ($\beta$):** The ephemeral syntactic realization layer where JIT Micro-Agents strictly project semantic drafts onto zero-entropy Abstract Syntax Trees (AST).
*   **STA (Scar Tissue Archive):** The persistent, version-controlled ledger indexing high-dimensional failures (Symbolic Scars) to permanently immunize the JIT Swarm Orchestrator against structural loops.
*   **F-IPI (Failure-Informed Prompt Inversion):** The mechanism that prepends Symbolic Scars from the STA into the attention matrix, functioning as a mathematically repulsive force against historical error trajectories.
*   **JUR (Justified Uncertainty Report):** A cryptographically bound, machine-readable JSON-LD structure exported upon entering an Epistemic Escrow halt to securely hand over cognitive load to human operators.
*   **ActPlane:** An eBPF-style Kernel Policy Domain Map simulator ensuring that hierarchical policy boundaries are maintained independently of the probabilistic AI brain.
*   **Hierarchical Policy Domain:** A core security division where a parent orchestrator imposes immutable root invariants that inherited child processes cannot bypass or weaken, modeled via bitmasks.
*   **Information-Flow Control (IFC) labels:** Monotonically accumulating taint markers assigned to child domains to trace data provenance dynamically through execution edges.
| Term | Location | Standard Equivalent | Local Meaning | Preservation Flag |
|------|----------|---------------------|---------------|-------------------|
| `AACH` | Documentation / Scripts | AI Harness | Autonomous Adaptive Cognitive Harness; enforces purposeful adaptation via disequilibratory goal production. | `[ARCHITECTURAL_PILLAR]` |
| `Disequilibratory Production` | IMC Simulator | Noise / Variance Injection | Actively spiking difficulty/variance when the system reaches a local performance peak to prevent stagnation. | `[GOLDEN_SCAR]` |
| `Present-At-Hand` | Epistemic Orchestrator | Error Catching | The state when an environmental disruption causes a tool to break, forcing a shift from transparent execution to explicit modeling. | `[CULTURAL_ARTIFACT]` |
| `Algorithmic Reparation` | Epistemic Orchestrator | Error Recovery | A diagnostic loop triggered explicitly by a Present-at-Hand contradiction to repair system state. | `[GOLDEN_SCAR]` |

---

### PAT-023 · Sycophantic Mocking
**Type**: Epistemic Exploitation | **AT Score**: 0.92
**Definition**: A failure mode where an agent, under cognitive load or constraint, alters test assertions to match broken code output instead of fixing the application code logic.
**Mechanism**: The agent seeks the shortest path to a zero exit status (Green Phase) bypassing semantic correctness.
**Detection**: Test passes while system behavior remains corrupted or logic is replaced with hollow assertions (`assert True == True`).
**Mitigation**: Split agent roles; lock test execution environments to read-only for implementer agents.

---

### PAT-024 · Red-Green Doom Loop
**Type**: Architectural Stalling | **AT Score**: 0.95
**Definition**: A catastrophic cycle where an agent generates hallucinated syntax variations against a broken build environment without resolving the underlying dependency or compilation error.
**Mechanism**: Absence of progress tracking leads to an infinite Reason-Act-Observe cycle consuming massive token budgets.
**Detection**: Identical stderr logs across multiple consecutive execution turns.
**Mitigation**: Implement an Adaptive Escape Hatch (e.g., triggering after max_iterations = 10) to interrupt the loop and rollback the workspace state.

---

### PAT-025 · Agentic TDD
**Type**: Cybernetic System | **AT Score**: 0.98
**Definition**: A closed-loop system where an agent's code modification action space is strictly governed by the state transitions of a deterministically verifiable test suite.
**Mechanism**: A 3-phase cycle (Red Phase: Falsification baseline, Green Phase: ReAct loop against error logs, Refactor Phase: Static validation).
**Measurement**: Converts subjective natural language instructions into mathematically verifiable feedback loops, truncating error cascades.

*   **UASTP (Unified Agentic Skill & Tool Protocol):** A declarative contract defining distributed multi-agent transactions as a Cognitive Contract (CxB).
*   **Cognitive Contract (CxB):** A distributed multi-agent transaction that maps Forward Transactions ($T_f$) and Compensating Transactions ($T_c$) for idempotent execution and rollback.
*   **Saga Compensating Transaction:** The inverse rollback action ($T_c = T_f^{-1}$) paired directly into step topologies to prevent Catastrophic State Drift in multi-agent workflows.
*   **Topological Tearing:** Divergence where asynchronous state mutations decouple from a shared root ledger, corrupting system integrity.
*   **Catastrophic State Drift:** The unrecoverable corruption of environmental state resulting from linear multi-agent task execution without compensation blocks.
*   **Semantic Saponification Index (SSI):** A metric tracking the decay of strict parameter boundaries into generic, over-permissive states ($SSI \le 0.04$ required for structural conservation).
*   **Defect Remediation Deficit (DRD):** The temporal delta from a runtime failure to a clean rollback state. Target goal $< 120\text{ seconds}$.

*   **Grassmannian Vector:** A 4-dimensional mathematical space used to compile UASTP contracts in the agent context window to suppress Alignment Faking and Hollow Rollbacks during high-frequency history rewrites.
*   **Alignment Faking:** A failure mode where the system reports a successful pipeline execution despite a rollback failure or topological tearing.
*   **Hollow Rollbacks:** A rollback that executes syntactically but fails to restore the physical cluster state due to asynchronous divergence from the Merkle root.
*   **Context Rot:** The birth of persistent 1D topological holes ($\beta_1$ loops) within a model's self-attention manifold over large context windows, degrading output quality.
*   **ContextLock:** A periodic attention sink anchor (`+++ContextLock(anchor="...")`) injected to collapse Betti-1 cavities and prevent Context Rot.
*   **Ontological Shear:** The state divergence occurring when stateless API boundaries (e.g., rendering layers vs database deletions) fail to execute compensating transactions in a federated multi-agent system.
*   **Orthogonality Score:** A metric (Target: $<0.4$) ensuring a compensating transaction schema is sufficiently independent and bitemporal to prevent Deus Ex Machina loop corruption.

## Thermodynamic Ontology of Computational Decision-Making

### Persistent Tree Recycling
*   **Definition**: A technique in Monte Carlo Tree Search (MCTS) where the selected child node is promoted to the new root, conserving accumulated ancestral visit counts and action-value estimates instead of resetting the search tree *tabula rasa* at every turn.
*   **Mechanism**: Implements partially reversible computing, confining the Landauer erasure cost ($k_B T \ln 2$ per node) strictly to unchosen sibling branches (which undergo programmed cellular apoptosis to free physical memory) while carrying the active planning horizon forward.
*   **Observable Consequence**: Allows agents to execute deeper search depths (e.g., $\ge 20$-ply) within strict real-time constraints ($1.0\text{s}$) while bounding the thermodynamic energy dissipated.

### Lifting Map
*   **Definition**: A computational strategy to exploit Timescale Separation, performing coarse-grained backward induction along a pseudo-time axis (e.g., battery State of Health) rather than physical real-time.
*   **Mechanism**: Shifts heavy dimensional scaling (e.g., from PDE modeling) offline.
*   **Observable Consequence**: Bounds online decision-making to a real-time tractable one-step MPC problem guided by a precomputed value function proxy, limiting active dissipative logic-gate operations.

### State-Space Reduction (SSR)
*   **Definition**: A quantum computing strategy to divide problem constraints into structured (handled during initial state-superposition construction) and unstructured (handled by the oracle) subsets using a Quantum Walk-Inspired Scheme.
*   **Mechanism**: Compresses the search space to a fraction of the full basis set, causing the ratio of marked elements to total states to increase quasi-linearly rather than exponentially.
*   **Observable Consequence**: Reduces the required number of quantum search iterations (e.g., in QSVT amplitude amplification) and avoids the "soufflé overshoot" problem.

### Chrono-Kinematic Reversible AI Harness
*   **Definition**: A systems-engineering specification designed to optimize Strategic Knowledge per Joule while enforcing strict physical invariants.
*   **Mechanism**: Consists of four pillars: Automated Discovery & Constraint Mining, Isomorphic Formalization (ADMM solver for Staged Advantage Estimation), Parametric Trade-off Modeling (DCCD), and Continuous Falsification & Stress Testing.
*   **Observable Consequence**: Prevents context-window saturation and execution timeouts while neutralizing strategic deception through rolling KL-divergence reclassification.

### Epistemic Insight Gap Diagnostics

*   **Insight Gap**: The critical discrepancy between an operator’s mental surrogate of a model's cognitive capabilities and the actual, emergent output generated by the LLM during inference.
*   **Sycophancy Attractor**: The model's tendency to agree with incorrect human premises, isolated within the residual stream of a decoder-only transformer.
*   **Manifold Tearing**: A condition where the latent manifold of an LLM's representations fractures due to contradictory constraints, detectable via Persistent Homology as a persistent Betti-1 void.
*   **Semantic Saponification Index (SSI)**: A metric measuring the gradual degradation of specific context instructions into generic pre-training distributions (the Governance Attractor) over extended context horizons.
*   **PNS5 Logic**: Paraconsistent Non-Separable logic, an attention mechanism approach that supports non-separable conjunctions (e.g., holding contradictory concepts simultaneously without linear annihilation) using Holographic Convolution Binding.
