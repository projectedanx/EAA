# ADR 008: Temporal Blending and Causal Path Integrity (CPI) Constraint Formalization

## Status
Accepted

## Context
When fusing temporally divergent conceptual spaces (e.g., "1920s Noir Detective" and "2077 Cyberpunk Finance"), generative models often suffer from **Chronotopological Drift**—discontinuous jumps across disjoint semantic territories that break causal continuity. To control this, the **Temporal Blending Engine (TBE)** orchestrates these blends under the **Verifiable Cognition Stack (VCS)**, necessitating a rigorous, mathematically enforceable contract.

## Decision
We have formalized the **Causal Path Integrity (CPI)** constraint and the **Epistemic Rheology** parameters into an executable simulation harness (`scripts/tbe_cpi_harness_sim.py`) that acts as a blueprint for the **System Assurance Agent (SAA)**.

### Mathematical Framework
1. **The Blended Latent Space**: The trajectory is modeled as $\mathbf{S}_t = \mathbf{\Phi}\big(\mathbf{X}_N(t), \mathbf{X}_C(t), \mathbf{W}_t\big)$, representing the semantic flow of a double-scope conceptual blend.
2. **Causal Actions and World Rules**: A discrete mapping to Boolean fluents handles preconditions and effects. A strictly enforced **Frame Operator** resolves the frame problem by ensuring any unmodified fluent variable remains invariant.
3. **Causal Path Integrity (CPI)**: Calculated over $N-1$ state transitions using an indicator function ensuring Preconditions, Effects, and the Frame Operator are logically continuous. The VCS enforces a hard threshold of $\text{CPI} \geq 0.95$.

### Key Properties Proven
1. **The Cascading Contradiction Boundary (The Security Camera Lemma)**: For sequences of length $N < 21$, a single causal contradiction is mathematically impossible to pass under the 0.95 threshold.
2. **Epistemic Rheological Stability**: By applying a Semantic Viscosity ($\mu$) constraint against a Constraint Force ($\mathbf{f}_{\text{constraint}}$), we bound the latent trajectory with a Lipschitz constant, preventing jumping across disjoint territories ($\|\mathbf{S}_{t_{k+1}} - \mathbf{S}_{t_k}\| < \delta$).

### Parametric Trade-offs
We established the mathematical relationship between the **Cost of Coherence Overhead (CCH)** (Verification Depth $\times$ Tokens) and the **Cost of Structural Discovery (CSD)** (Temperature $\times$ Variance). If CSD exceeds the budget threshold, the viscosity $\mu$ drops, causing the Lipschitz bound to collapse, triggering Epistemic Escrow.

## Consequences
- **Positive:** Provides a machine-enforceable safety mechanism against logic hallucinations in long-context AI applications. Enables verifiable causality during conceptual synthesis.
- **Negative:** Enforcing this logic constraint introduces computational overhead (the CCH penalty) when exploring highly novel, low-probability latent vectors.
