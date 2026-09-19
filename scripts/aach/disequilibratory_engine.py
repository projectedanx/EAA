import json
import logging
from dataclasses import dataclass
from typing import Dict, List, Any

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

@dataclass
class OrganizationState:
    agile_maturity: float
    decentralization_index: float
    current_goal_difficulty: float
    performance_variance: float

class InternalModelController:
    def __init__(self, initial_state: OrganizationState):
        self.state = initial_state
        self.roadmap = []
        self.equilibrium_threshold = 0.05
        self.iteration = 0

    def apply_subjective_wellbeing(self, target_state: Dict[str, float]) -> Dict[str, float]:
        logging.info("Applying Subjective Well-Being Modifier...")
        # E.g. A stakeholder cannot tolerate 100% decentralization due to compliance constraints
        # Hard limit decentralization to 85% to preserve local subjective stability
        if target_state.get('decentralization_index', 0) > 0.85:
            logging.info("Constraint active: capping decentralization at 0.85 to respect subjective well-being constraints.")
            target_state['decentralization_index'] = 0.85
        return target_state

    def equilibratory_reduction(self, target: Dict[str, float]):
        logging.info("Executing Equilibratory Reduction (Model Predictive Control)...")
        # Shift current state towards target
        self.state.agile_maturity += (target['agile_maturity'] - self.state.agile_maturity) * 0.5
        self.state.decentralization_index += (target['decentralization_index'] - self.state.decentralization_index) * 0.5

        # Simulate variance reducing as system masters the current goal
        self.state.performance_variance *= 0.6
        logging.info(f"State Update -> Agile: {self.state.agile_maturity:.2f}, Decent: {self.state.decentralization_index:.2f}, Var: {self.state.performance_variance:.3f}")

    def disequilibratory_production(self):
        logging.info(f"Performance variance {self.state.performance_variance:.3f} below threshold {self.equilibrium_threshold}.")
        logging.warning("System converging on local fitness peak! Triggering Disequilibratory Production.")
        # Spike the difficulty to prevent death by equilibrium
        self.state.current_goal_difficulty += 2.0
        self.state.performance_variance += 0.3 # Inject artificial variance/tension
        logging.info(f"New Goal Difficulty: {self.state.current_goal_difficulty:.2f}")

    def simulate_epoch(self, base_target: Dict[str, float]):
        self.iteration += 1
        logging.info(f"\n--- Epoch {self.iteration} ---")

        target = self.apply_subjective_wellbeing(base_target.copy())

        # A. Equilibratory Reduction
        self.equilibratory_reduction(target)

        # Record roadmap
        self.roadmap.append({
            "epoch": self.iteration,
            "agile_maturity": round(self.state.agile_maturity, 3),
            "decentralization_index": round(self.state.decentralization_index, 3),
            "variance": round(self.state.performance_variance, 3),
            "goal_difficulty": round(self.state.current_goal_difficulty, 3)
        })

        # B. Disequilibratory Production
        if self.state.performance_variance < self.equilibrium_threshold:
            self.disequilibratory_production()

def main():
    print("--- [ROLE: Internal Model Control Feed-Forward Goal Tuner] ---")

    initial = OrganizationState(
        agile_maturity=0.1,
        decentralization_index=0.1,
        current_goal_difficulty=1.0,
        performance_variance=0.2
    )

    imc = InternalModelController(initial)

    # Base ideal target (e.g. 100% agile, 100% decentralized)
    target = {
        'agile_maturity': 1.0,
        'decentralization_index': 1.0
    }

    # Run simulation for 5 epochs
    for _ in range(5):
        imc.simulate_epoch(target)

    output = {
        "Architecture": "Switched Hybrid Dual-Cyclic System (Equilibratory / Disequilibratory)",
        "LivingPlan": imc.roadmap
    }

    print("\n--- COMPILED DYNAMIC PLAN ---")
    print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()
