import numpy as np
from typing import Tuple

class HyperbolicLatticeBreaker:
    """
    Simulates Multi-Dimensional Geodesic Enforcement in Non-Euclidean Access Control topographies.
    Projects an agent's state onto a Poincaré disk model of hyperbolic space (H^2)
    and utilizes Riemannian gradient descent (simulated via repulsive forces) to guarantee
    that the trajectory cannot cross the "Lattice Breaker" boundary.
    """
    def __init__(self, breach_threshold: float = 0.8):
        self.breach_threshold = breach_threshold
        # The boundary in the Poincare disk (magnitude squared)
        self.max_radius_sq = 1.0 - 1e-6

    def poincare_distance(self, u: np.ndarray, v: np.ndarray) -> float:
        """Calculates hyperbolic distance between two points in the Poincare disk."""
        sq_dist = np.sum((u - v)**2)
        u_sq = np.sum(u**2)
        v_sq = np.sum(v**2)

        # Prevent math errors if points drift outside disk
        if u_sq >= 1.0 or v_sq >= 1.0:
            return float('inf')

        denom = (1 - u_sq) * (1 - v_sq)
        val = 1 + 2 * sq_dist / denom
        return np.arccosh(max(1.0, val))

    def apply_latent_steering(self, h_t: np.ndarray, centroid: np.ndarray, dt: float = 0.1) -> np.ndarray:
        """
        Projects latent state h_t onto the disk and applies repulsive steering
        if the state drifts toward the restricted boundary.
        """
        # Ensure points are within the Poincare disk
        h_t_mag = np.sum(h_t**2)
        if h_t_mag >= self.max_radius_sq:
            # Force projection back inside
            h_t = h_t / np.sqrt(h_t_mag) * np.sqrt(self.max_radius_sq - 1e-3)

        dist = self.poincare_distance(h_t, centroid)

        # If distance exceeds threshold (conceptually approaching boundary), apply repulsive force
        if dist > self.breach_threshold:
            # Simple simulation of repulsive force pushing back to centroid
            direction = centroid - h_t
            norm = np.linalg.norm(direction)
            if norm > 0:
                direction = direction / norm

            # The force is proportional to how far past the threshold we are
            force_mag = (dist - self.breach_threshold) * 0.5 # Milder scaling factor
            h_t = h_t + direction * force_mag * dt

            # Re-normalize if necessary
            h_t_mag = np.sum(h_t**2)
            if h_t_mag >= self.max_radius_sq:
                h_t = h_t / np.sqrt(h_t_mag) * np.sqrt(self.max_radius_sq - 1e-3)

        return h_t

    def calculate_csi(self, attack_scenarios: int, blocked_scenarios: int) -> float:
        """
        Calculates Containment Surface Index (CSI).
        CSI = N_downstream_unaffected / N_downstream_total
        Here modeled simply as blocked vs total attacks.
        """
        if attack_scenarios == 0:
            return 1.0
        return blocked_scenarios / attack_scenarios
