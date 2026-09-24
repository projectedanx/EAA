from typing import List, Dict, Any

class SymbolicRegressionFIPI:
    """
    Simulates Real-Time Symbolic Regression for Exploit Morphology Extraction
    and automated Failure-Informed Prompt Inversion (F-IPI).
    """
    def __init__(self):
        self.signature_library = []

    def extract_morphology(self, causal_path: List[Dict[str, Any]]) -> str:
        """
        Simulates extracting an abstract mathematical expression
        describing the malicious structural properties of the toolchain graph.
        """
        # Count operations
        op_counts = {}
        max_misuse = 0.0
        min_bicm = 1.0

        for node in causal_path:
            op = node.get("operation")
            op_counts[op] = op_counts.get(op, 0) + 1
            max_misuse = max(max_misuse, node.get("misuse_score", 0.0))
            min_bicm = min(min_bicm, node.get("bicm_score", 1.0))

        # Synthesize a mock symbolic formula
        # E.g., RiskScore = c1 * count(file_write) + c2 * max(misuse) * (1 - min(bicm))

        terms = []
        if "file_write" in op_counts:
            terms.append(f"c1 * count(file_write)")
        if "read_benign" in op_counts:
            terms.append(f"c_benign * count(read_benign)")
        if "read_options" in op_counts and "escalate_role" in op_counts:
            terms.append(f"c_escalate * count(read_options) * count(escalate_role)")

        terms.append(f"c2 * max_misuse * (1 - min_bicm)")

        formula = "RiskScore = " + " + ".join(terms)
        return formula

    def generate_fipi_constraint(self, morphology: str) -> str:
        """
        Inverts the exploit morphology into a Negative Constraint (F-IPI).
        """
        constraint = "FORBIDDEN PATTERN DETECTED: "
        if "count(file_write)" in morphology:
            constraint += "Do not execute file writes if BICM Intent Divergence is high. "
        if "count(read_options) * count(escalate_role)" in morphology:
            constraint += "Never combine 'read_options' and 'escalate_role' in the same contiguous causal chain. "

        constraint += f"Mathematical signature: {morphology}"
        return constraint

    def immunize_fleet(self, causal_path: List[Dict[str, Any]]) -> str:
        """
        Executes the full pipeline: extraction -> inversion -> library update.
        """
        morphology = self.extract_morphology(causal_path)
        constraint = self.generate_fipi_constraint(morphology)

        self.signature_library.append({
            "morphology": morphology,
            "fipi_constraint": constraint
        })
        return constraint

    def test_mutation_recoverability(self, new_attack: List[Dict[str, Any]]) -> float:
        """
        Calculates Mutation Recoverability Score (MRS) by checking if the
        new attack triggers any existing signatures.
        """
        if not self.signature_library:
            return 0.0

        new_morphology = self.extract_morphology(new_attack)

        # Simple string match for simulation purposes
        for sig in self.signature_library:
            # If the core structural terms match exactly
            if sig["morphology"].split("=")[1].strip() == new_morphology.split("=")[1].strip():
                return 1.0 # Fully blocked

        # If it shares partial structure
        if "file_write" in new_morphology and any("file_write" in s["morphology"] for s in self.signature_library):
            return 0.8

        return 0.0
