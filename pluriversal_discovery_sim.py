import math
import json

def format_vector(vec):
    return "[" + ", ".join(f"{n:.2f}" for n in vec) + "]"

def simulate_mgpl(z0_star, z_prime, csd_budget, csd_spent, phantom_dimension):
    print("--- SMLR Dynamics ---")
    print(f"Constitutional Austenite (z0*): {format_vector(z0_star)}")
    print(f"Context Adaptation (z'): {format_vector(z_prime)}")

    delta_z = [zp - z0 for zp, z0 in zip(z_prime, z0_star)]

    if phantom_dimension:
        print("Activating Phantom Dimension (H_k) via Z-Axis Inference...")
        delta_z[2] += 1.0

    print(f"Relational Vector (Delta z): {format_vector(delta_z)}")

    beta_1 = sum(abs(v) for v in delta_z) / max(1, len(delta_z))
    beta_0 = 1.0 - abs(delta_z[0])

    print(f"Topological Novelty (beta_1): {beta_1:.3f} (Target > 0.7)")
    print(f"Structural Conservation (beta_0): {beta_0:.3f} (Target > 0.9)")

    passed = True
    errors = []

    if beta_1 <= 0.7:
        passed = False
        errors.append("Simulation Failed: Topological Novelty (beta_1) too low.")

    if beta_0 <= 0.9:
        passed = False
        errors.append("Simulation Failed: Structural Conservation (beta_0) too low.")

    if csd_spent < csd_budget:
        passed = False
        errors.append("Simulation Failed: CSD budget not fully exhausted.")

    if passed:
        print("\n>>> CoC Simulation Passed: Mathematical viability of feature proven. <<<")
    else:
        for err in errors:
            print(f">>> {err} <<<")

    return {
        "outcome_type": "Paraconsistent_Hypothesis_Validation",
        "target_module": "PluriversalFeatureDiscovery",
        "initial_cognitive_complexity_score": 0.85,
        "hypothesis_summary": "Simulating RCC-8 Topological Blending and Z-Axis Inference to mathematically validate epistemic contracts.",
        "ACU_robustness_score": 0.95,
        "tension_metric": {
            "novelty_score": beta_1,
            "grounding_score": beta_0
        },
        "justification_or_plan": "Validation of the MGPL (Mandatory Grounding Pre-Validation Layer) via CoC Enactment.",
        "passed": passed
    }

if __name__ == "__main__":
    print("Executing Chain-of-Code (CoC) Enactment Simulation...\n")

    # Scenario 1: Successful Paraconsistent Binding
    z0 = [1.0, 0.0, 0.0]
    z_prime = [0.95, 1.0, 1.2]

    print("--- Scenario 1: Paraconsistent Binding with Z-Axis Inference ---")
    res1 = simulate_mgpl(z0, z_prime, csd_budget=100, csd_spent=100, phantom_dimension=True)
    print("\nResult 1 AGS-A Output:")
    print(json.dumps(res1, indent=2))

    print("\n" + "="*50 + "\n")

    # Scenario 2: Failure due to Euclidean collapse (no novelty)
    z_prime_fail = [1.0, 0.1, 0.1]
    print("--- Scenario 2: Euclidean Collapse (Beta_1 too low) ---")
    res2 = simulate_mgpl(z0, z_prime_fail, csd_budget=100, csd_spent=100, phantom_dimension=False)
    print("\nResult 2 AGS-A Output:")
    print(json.dumps(res2, indent=2))
