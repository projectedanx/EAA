import ast
import json
import logging
import hashlib
from typing import Dict, Any, List

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

class SEPAOASTScanner:
    def __init__(self, drift_threshold: float = 0.05):
        self.drift_threshold = drift_threshold
        self.baseline_ast_signatures = {}
        self.scar_registry = []

    def _hash_ast_node(self, node: ast.AST) -> str:
        """Creates a simplistic hash of an AST node for structural comparison."""
        # For a production system, this would be a deep canonical hash.
        dump = ast.dump(node, annotate_fields=False)
        return hashlib.sha256(dump.encode('utf-8')).hexdigest()

    def parse_and_hash_functions(self, source_code: str) -> Dict[str, str]:
        """Parses source code and returns a dict of function names to their AST hashes."""
        try:
            tree = ast.parse(source_code)
        except SyntaxError as e:
            logging.error(f"Syntax error during AST parsing: {e}")
            return {}

        func_hashes = {}
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                func_hashes[node.name] = self._hash_ast_node(node)
        return func_hashes

    def calculate_drift(self, baseline_funcs: Dict[str, str], new_funcs: Dict[str, str]) -> float:
        """
        Calculates a simplified Semantic Drift Delta based on AST structure changes.
        Uses a naive Jaccard-like distance for demonstration.
        """
        all_funcs = set(baseline_funcs.keys()).union(set(new_funcs.keys()))
        if not all_funcs:
            return 0.0

        changed_or_missing = 0
        for func in all_funcs:
            if func not in baseline_funcs or func not in new_funcs:
                changed_or_missing += 1
            elif baseline_funcs[func] != new_funcs[func]:
                changed_or_missing += 1

        drift = changed_or_missing / len(all_funcs)
        return drift

    def monitor_environment(self, source_code: str, module_name: str) -> Dict[str, Any]:
        """Monitors an environment for drift."""
        new_signatures = self.parse_and_hash_functions(source_code)

        if module_name not in self.baseline_ast_signatures:
            logging.info(f"Establishing baseline for {module_name}")
            self.baseline_ast_signatures[module_name] = new_signatures
            return {"status": "baseline_established", "drift": 0.0}

        baseline = self.baseline_ast_signatures[module_name]
        drift_score = self.calculate_drift(baseline, new_signatures)

        conflict = drift_score > self.drift_threshold
        if conflict:
            logging.warning(f"Ontological Conflict detected in {module_name}! Drift: {drift_score:.3f}")

        # Update baseline (assuming auto-healing or tracking evolution)
        self.baseline_ast_signatures[module_name] = new_signatures

        return {
            "status": "conflict_flagged" if conflict else "stable",
            "drift": drift_score
        }

    def execute_fipi(self, failure_trace: str, ast_delta_context: str) -> str:
        """
        Executes Failure-Informed Prompt Inversion (F-IPI).
        Generates a new constitutional rule based on the failure.
        """
        logging.info("Executing Failure-Informed Prompt Inversion (F-IPI)...")

        # Simplified Mock Logic for F-IPI evolutionary generation
        scar_id = f"ST-{len(self.scar_registry) + 1:03d}"

        # 1. Isolate (Mock extraction)
        failed_assumption = "Unhandled exception" if "Exception" in failure_trace else "Unknown logic error"

        # 2. Invert
        new_rule = f"ASSERT: Must handle {failed_assumption} previously seen in {ast_delta_context}."

        scar_entry = {
            "scar_id": scar_id,
            "originating_failure": failure_trace,
            "ast_delta_signature": ast_delta_context,
            "generated_rule": new_rule
        }
        self.scar_registry.append(scar_entry)

        logging.info(f"Generated new constitutional rule: {new_rule}")
        return new_rule
