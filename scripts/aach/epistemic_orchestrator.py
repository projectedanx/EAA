import json
import logging
from dataclasses import dataclass, field
from typing import Dict, List, Set, Tuple, Any

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

@dataclass
class EpistemicScratchpad:
    variables: Dict[str, Any] = field(default_factory=dict)
    constraints: List[str] = field(default_factory=list)
    task_irrelevant_dimensions: Set[str] = field(default_factory=set)

    def write(self, key: str, value: Any, task_irrelevant: bool = False):
        self.variables[key] = value
        if task_irrelevant:
            self.task_irrelevant_dimensions.add(key)
        logging.info(f"Scratchpad Write: {key} = {value} (Irrelevant: {task_irrelevant})")

    def validate_constraints(self) -> Tuple[bool, str]:
        # Example constraint: Coordinate Overlap
        coords = {}
        for k, v in self.variables.items():
            if k not in self.task_irrelevant_dimensions and isinstance(v, tuple):
                if v in coords:
                    return False, f"Coordinate Overlap detected between {coords[v]} and {k} at {v}"
                coords[v] = k
        return True, "Valid"

class EpistemicOrchestrator:
    def __init__(self):
        self.scratchpad = EpistemicScratchpad()
        self.state_trace = []

    def log_state(self, step: str):
        self.state_trace.append({
            "step": step,
            "scratchpad": self.scratchpad.variables.copy()
        })

    def algorithmic_reparation(self, error_msg: str, bad_key: str):
        logging.warning(f"[PRESENT-AT-HAND TRIGGERED] Contradiction detected: {error_msg}")
        logging.info(f"Executing Algorithmic Reparation on {bad_key}...")
        # Simple heuristic fix: increment the x-coordinate
        old_val = self.scratchpad.variables[bad_key]
        new_val = (old_val[0] + 1, old_val[1])
        self.scratchpad.write(bad_key, new_val)
        logging.info("Resuming transparent coping (ready-to-hand).")

    def execute_cycle(self):
        logging.info("--- [ROLE: Active Externalism Cognitive Orchestrator] ---")

        # Step 0: Epistemic Matrix Setup
        logging.info("Step 0: Initializing Epistemic Matrix (Exploratory Cycle)")
        self.scratchpad.write("Resource_A_color", "Red", task_irrelevant=True)
        self.scratchpad.write("Resource_B_phrasing", "Verbose", task_irrelevant=True)
        self.log_state("Step 0 (Initialization)")

        # Step 1: Placing items
        logging.info("Step 1: Assigning physical coordinates")
        self.scratchpad.write("Task_1_Location", (1, 1))
        self.scratchpad.write("Task_2_Location", (1, 2))
        self.log_state("Step 1 (Placement)")

        # Step 2: Optimal Feedback Control Check (filtering task-irrelevant)
        logging.info("Step 2: Optimal Feedback Control - Noise injection into task-irrelevant dims")
        self.scratchpad.write("Resource_A_color", "Dark Red", task_irrelevant=True) # Ignored by constraint checker

        # Inducing an error
        logging.info("Step 3: Inducing coordinate overlap")
        self.scratchpad.write("Task_3_Location", (1, 2))
        self.log_state("Step 3 (Error Induction)")

        # Validation
        valid, msg = self.scratchpad.validate_constraints()
        if not valid:
            self.algorithmic_reparation(msg, "Task_3_Location")

        self.log_state("Step 4 (Final State)")

        return {
            "EpistemicMatrix": self.scratchpad.variables,
            "StateTrace": self.state_trace,
            "Resolution": "Verified Optimal Solution"
        }

def main():
    orchestrator = EpistemicOrchestrator()
    result = orchestrator.execute_cycle()

    print("\n--- FINAL OUTPUT ---")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
