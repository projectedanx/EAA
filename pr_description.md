# Implement Epistemic Escrow Agent (EEA)

**Rationale:**
The main agent previously lacked a formal mechanism to handle mutually exclusive instructions or contradictory context without collapsing logic (Euclidean compromise) or halting abruptly. To enforce the "Inversion for Emergence" strategy mapped to a Paraconsistent framework, we implemented the Epistemic Escrow Agent. When the system encounters contradiction ("Resolution Collapse"), it now packages the conflicting parameters into a "Symbolic Scar" (EscrowedScar object) containing a timestamp, the constraints, expected output, and a calculated Aesthetic Tension Score. This allows the system to hold contradictory constraints safely (Directive 1: Paradox Metabolism) and provides an explicit interface for operators to untangle logic without boolean collapse.

**Changes:**
* Created `components/EpistemicEscrowAgent.tsx` dashboard to input contradictions, trigger Resolution Collapses, and apply Debridement Protocols.
* Extended `types.ts` with `EscrowedScar` interface and `ESCROW_AGENT` View enum.
* Updated `components/Sidebar.tsx` and `App.tsx` to integrate the EEA into the core layout.
* Created deterministic JSDOM test coverage (`src/test/EpistemicEscrowAgent.test.tsx`) for contradiction capture and debridement workflows.
* Updated `docs/lessons-learned.md` and `docs/forward-thinking-features.md` to reflect the completed implementation and mapping to Epistemic Directives.
* Verified visual integration using Playwright.
