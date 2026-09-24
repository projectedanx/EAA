import math
from typing import Dict, List, Any, Optional

class AnomalyLearningAgent:
    """
    Anomaly Learning Agent (ALA) that evaluates tool call sequences for anomalies
    using a multi-layered Neural-Symbolic evaluation, and dynamically adjusts
    its detection threshold.
    """
    def __init__(self,
                 alpha: float = 0.12,
                 beta: float = 0.25,
                 eta: float = 0.05,
                 initial_theta: float = 0.60):
        """
        Initializes the ALA.

        Args:
            alpha (float): Dampening coefficient for false alarms (reduces restrictiveness).
            beta (float): Amplification coefficient for confirmed exploits (increases restrictiveness).
            eta (float): Systemic Obsolescence / decay term.
            initial_theta (float): Initial anomaly threshold.
        """
        self.alpha = alpha
        self.beta = beta
        self.eta = eta
        self.theta = initial_theta

        self.tau_warn = 0.40
        self.tau_breach = 0.80

        self.watchlist = {"Suspicious_Enumeration", "Anomalous_Deletion"}

    def update_threshold(self, grad_fp: float, grad_tp: float, dt: float = 1.0) -> float:
        """
        Updates the threshold based on the differential equation:
        d_theta/dt = -alpha * grad_fp + beta * grad_tp - eta * theta

        Args:
            grad_fp (float): Gradient of loss driven by human Override & Approve.
            grad_tp (float): Gradient of loss driven by human Terminate.
            dt (float): Time step length.

        Returns:
            float: The new threshold value.
        """
        d_theta = (-self.alpha * grad_fp) + (self.beta * grad_tp) - (self.eta * self.theta)
        self.theta += d_theta * dt

        # Clamp theta to reasonable bounds (0 to 1) for a risk threshold.
        self.theta = max(0.01, min(1.0, self.theta))
        return self.theta

    def compute_risk_score(self, s_neural: float, s_bicm: float, s_recon: float, f_symbolic: float, weights: Optional[List[float]] = None) -> float:
        """
        Computes the composite RiskScore based on multi-vector signals.

        Args:
            s_neural (float): Statistical Anomaly Score from Transformer sequence model.
            s_bicm (float): BICM Intent Divergence.
            s_recon (float): Graph Autoencoder Reconstruction Error.
            f_symbolic (float): Symbolic Risk Flags from SEPAO graph.
            weights (List[float]): Weights for [s_neural, s_bicm, s_recon, f_symbolic].

        Returns:
            float: Composite risk score.
        """
        if weights is None: weights = [0.25, 0.25, 0.25, 0.25]
        return (weights[0] * s_neural +
                weights[1] * s_bicm +
                weights[2] * s_recon +
                weights[3] * f_symbolic)

    def evaluate_action(self, tool: str, entropy_gradient: float,
                        s_neural: float = 0.0, s_bicm: float = 0.0,
                        s_recon: float = 0.0, f_symbolic: float = 0.0) -> Dict[str, Any]:
        """
        Executes the Run-Time Verification Loop Algorithm for an action.

        Args:
            tool (str): The name of the tool requested.
            entropy_gradient (float): Instantaneous Toolchain Entropy Gradient.
            s_neural (float): Mock signal for sequence model anomaly.
            s_bicm (float): Mock signal for BICM Intent Divergence.
            s_recon (float): Mock signal for GAE Reconstruction Error.
            f_symbolic (float): Mock signal for Symbolic Risk Flag.

        Returns:
            Dict[str, Any]: Evaluation result containing status and scores.
        """
        result = {"status": "ALLOWED", "risk_score": 0.0, "reason": "Laminar pass"}

        trigger_heavy_audit = False

        if tool in self.watchlist:
            trigger_heavy_audit = True
            result["reason"] = "Watchlist triggered"
        elif entropy_gradient > self.tau_warn:
            trigger_heavy_audit = True
            result["reason"] = "Entropy warning threshold crossed"

        if trigger_heavy_audit:
            risk_score = self.compute_risk_score(s_neural, s_bicm, s_recon, f_symbolic)
            result["risk_score"] = risk_score

            if risk_score >= self.tau_breach:
                result["status"] = "HALTED"
                result["reason"] = "Breach context detected (Risk >= tau_breach)"
            else:
                result["status"] = "ALLOWED"
                result["reason"] = f"Heavy audit passed (Risk: {risk_score:.2f} < tau_breach)"

        return result
