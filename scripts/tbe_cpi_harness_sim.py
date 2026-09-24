import numpy as np
import logging
from typing import List, Dict, Tuple, Any, Optional

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

class Action:
    """
    Represents a causal action in the discrete state space.
    """
    def __init__(self, name: str, preconditions: Dict[str, int], effects: Dict[str, int]):
        """
        Initializes an Action.

        Args:
            name (str): The name of the action.
            preconditions (Dict[str, int]): Preconditions required for the action to fire.
            effects (Dict[str, int]): Deterministic changes applied to the subsequent state.
        """
        self.name = name
        self.preconditions = preconditions
        self.effects = effects

class SystemAssuranceAgent:
    """
    System Assurance Agent (SAA) that calculates Chronotopological Drift
    and Causal Path Integrity (CPI).
    """
    def __init__(self, cpi_threshold: float = 0.95):
        """
        Initializes the SAA.

        Args:
            cpi_threshold (float): The hard constraint for CPI.
        """
        self.cpi_threshold = cpi_threshold

    def check_preconditions(self, state: Dict[str, int], action: Action) -> bool:
        """
        Checks if the state satisfies the action's preconditions.

        Args:
            state (Dict[str, int]): The current state.
            action (Action): The action to evaluate.

        Returns:
            bool: True if preconditions are met, False otherwise.
        """
        for k, v in action.preconditions.items():
            if state.get(k) != v:
                return False
        return True

    def check_effects(self, next_state: Dict[str, int], action: Action) -> bool:
        """
        Checks if the next state reflects the action's effects.

        Args:
            next_state (Dict[str, int]): The subsequent state.
            action (Action): The executed action.

        Returns:
            bool: True if effects are present, False otherwise.
        """
        for k, v in action.effects.items():
            if next_state.get(k) != v:
                return False
        return True

    def check_frame_operator(self, state: Dict[str, int], next_state: Dict[str, int], action: Action) -> bool:
        """
        Checks the Frame Operator: unmodified fluents must remain invariant.

        Args:
            state (Dict[str, int]): The current state.
            next_state (Dict[str, int]): The subsequent state.
            action (Action): The executed action.

        Returns:
            bool: True if frame operator holds, False otherwise.
        """
        all_keys = set(state.keys()).union(set(next_state.keys()))
        for k in all_keys:
            if k not in action.effects:
                if state.get(k) != next_state.get(k):
                    return False
        return True

    def calculate_cpi(self, trace: List[Tuple[Dict[str, int], Action, Dict[str, int]]]) -> float:
        """
        Calculates the Causal Path Integrity (CPI) score over a discrete trace.

        Args:
            trace (List[Tuple[Dict[str, int], Action, Dict[str, int]]]): A list of
                (state_k, action_k, state_k+1) transitions.

        Returns:
            float: The CPI score.
        """
        if not trace:
            return 1.0

        valid_transitions = 0
        for s_k, a_k, s_k_plus_1 in trace:
            pre_met = self.check_preconditions(s_k, a_k)
            eff_met = self.check_effects(s_k_plus_1, a_k)
            frame_met = self.check_frame_operator(s_k, s_k_plus_1, a_k)

            if pre_met and eff_met and frame_met:
                valid_transitions += 1

        return valid_transitions / len(trace)

    def evaluate_trace(self, trace: List[Tuple[Dict[str, int], Action, Dict[str, int]]]) -> Dict[str, Any]:
        """
        Evaluates the trace against the CPI constraint.

        Args:
            trace (List[Tuple[Dict[str, int], Action, Dict[str, int]]]): A list of transitions.

        Returns:
            Dict[str, Any]: Evaluation result containing status and CPI score.
        """
        cpi_score = self.calculate_cpi(trace)

        result = {
            "cpi_score": cpi_score,
            "status": "Release State" if cpi_score >= self.cpi_threshold else "Epistemic Escrow / Reflexive Repair"
        }

        if cpi_score < self.cpi_threshold:
            logging.warning(f"CPI Constraint Violation: {cpi_score:.3f} < {self.cpi_threshold}. Triggering Escrow.")

        return result


class TemporalBlendingEngine:
    """
    Temporal Blending Engine (TBE) modeling continuous semantic trajectories
    and Epistemic Rheology.
    """
    def __init__(self, semantic_viscosity: float, constraint_force: float, spatial_resolution: float):
        """
        Initializes the TBE.

        Args:
            semantic_viscosity (float): Resistance of a concept to change (mu).
            constraint_force (float): Attractive force vector magnitude (||f_constraint||).
            spatial_resolution (float): Minimum distance between distinct causal states (delta).
        """
        self.mu = semantic_viscosity
        self.f_constraint = constraint_force
        self.delta = spatial_resolution

    def check_rheological_stability(self, dt: float) -> bool:
        """
        Checks if the continuous trajectory satisfies Lipschitz continuity bounds
        to prevent Chronotopological Drift.

        Args:
            dt (float): Step interval (Delta t).

        Returns:
            bool: True if stable, False if drift detected.
        """
        if self.mu <= 0:
            return False

        lipschitz_constant = self.f_constraint / self.mu
        max_displacement = lipschitz_constant * dt

        return max_displacement < self.delta

    def compute_parametric_tradeoff(self, verification_depth: float, tokens: int, temperature: float, variance: float, budget_threshold: float) -> Dict[str, Any]:
        """
        Optimizes the Tension Frontier between Creativity (Novelty) and Coherence (Grounding).

        Args:
            verification_depth (float): Depth of verification.
            tokens (int): Number of tokens.
            temperature (float): Model temperature.
            variance (float): Exploration variance.
            budget_threshold (float): Maximum allowed CSD budget.

        Returns:
            Dict[str, Any]: Parametric trade-off analysis.
        """
        cch = verification_depth * tokens
        csd = temperature * variance

        cpi_enforced = csd <= budget_threshold

        result = {
            "Cost_of_Coherence_Overhead": cch,
            "Cost_of_Structural_Discovery": csd,
            "Optimality_Frontier_Satisfied": cpi_enforced
        }

        if not cpi_enforced:
            logging.error(f"CSD Budget Exceeded ({csd:.2f} > {budget_threshold:.2f}). CPI constraint collapsing.")

        return result
