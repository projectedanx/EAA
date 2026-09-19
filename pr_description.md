# ActPlane eBPF Kernel Policy Simulator

**Rationale:**
The transition from semantic reasoning (Manifold $\alpha$) to actionable sandbox control (Manifold $\beta$) requires a structural barrier against bypass attacks from compromised sub-agents. Relying on user-space prompt filtering or sub-agent rules for security is fundamentally flawed, as probabilistic components can be manipulated. To solve this, security invariants must exist *outside* the agent's executable domain.

**Implementation:**
*   Created a Python simulation (`scripts/actplane_ebpf_sim.py`) that models an "ActPlane" eBPF-style Kernel Policy Domain Map.
*   The script assigns processes to specific domains, enforcing **Hierarchical Policy Domains** natively.
*   Parent orchestrators impose immutable root invariants (e.g., `BLOCK_WRITE_SYS`, `BLOCK_EXEC_GIT`) via read-only bitmasks.
*   The simulation tracks monotonic taint accumulation via **Information-Flow Control (IFC) labels**, blocking processes that acquire sensitive data taints (e.g., `DB_SENSITIVE`) from exfiltrating data via the network.
*   Demonstrated that downstream nodes cannot weaken, disable, or bypass parent-imposed constraints or declassify labels.
*   Updated `docs/lessons-learned.md` (Lesson 20) and `docs/DOMAIN_GLOSSARY.md` to formally document this paraconsistent security structure and the core vocabulary surrounding the hierarchical policy enforcement without boolean collapse.
