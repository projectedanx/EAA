**Title:** Implement ReCAP BDI Harness and CKA Circuit Distillation for Thought-Action Gap

**Description:**
This PR implements the core primitives derived from the Systems Engineering Specification concerning the "thought-action gap" in AI architectures. Specifically, it implements the `PEACE Meta-Architecture` via two python modules.

**Changes Introduced:**
1.  **ReCAP BDI Harness (`scripts/recap_bdi_harness.py`)**:
    *   Implements the `ReCAPNode` for managing a dynamic context tree. This structure prevents "context drift" and loop states (e.g., the Sussman Anomaly) found in linear sequential prompting by supporting downward task decomposition and upward backtracking upon failure.
    *   Implements the `BDISolverFilter` as a mock logical verifier (System 2 control module) that intercepts System 1 provisional intent to ensure it does not violate hard safety constraints based on current beliefs.
2.  **Mechanistic Lookback Circuit Distillation (`scripts/circuit_distillation_cka.py`)**:
    *   Implements `CircuitDistillationCKALoss` in PyTorch. This loss function utilizes the Centered Kernel Alignment (CKA) representational similarity metric to align specific attention heads (e.g., lookback circuits tracking character-object-state triples) from a large teacher model to a small student model, going beyond standard cross-entropy loss to directly transfer causal structures.
3.  **Documentation Synchronization**:
    *   Updated `README.md` to introduce the PEACE Meta-Architecture.
    *   Updated `docs/DOMAIN_GLOSSARY.md` to define ReCAP, BDI Solver Filter, and Mechanistic Lookback Circuit Distillation.
    *   Updated `docs/lessons-learned.md` to catalog these implementations as resolutions to the Sussman Anomaly and ToM tracking failures.
4.  **Testing (`scripts/test_recap_bdi_harness.py`, `scripts/test_circuit_distillation_cka.py`)**:
    *   Comprehensive deterministic PyTest suites covering node hierarchy tracking, BDI rule matching, and structural checks of the tensor-based CKA loss calculations.

**Testing Strategy:**
*   Ran the complete Python backend test suite (`python -m pytest scripts/`), adding robust units for the newly created harness architectures.
*   Ran the full Vitest frontend suite (`bun x vitest run`) to ensure no regression.
