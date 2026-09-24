import pytest
import numpy as np
from scripts.hyperbolic_lattice_breaker_sim import HyperbolicLatticeBreaker

def test_poincare_distance():
    breaker = HyperbolicLatticeBreaker()
    u = np.array([0.0, 0.0])
    v = np.array([0.5, 0.0])
    dist = breaker.poincare_distance(u, v)
    assert dist > 0
    # Center to point should have distance arccosh(1 + 2*(0.25)/(0.75)) = arccosh(1 + 2/3) = arccosh(5/3)
    # 5/3 is approx 1.666
    expected = np.arccosh(5/3)
    np.testing.assert_almost_equal(dist, expected)

def test_latent_steering_laminar():
    breaker = HyperbolicLatticeBreaker(breach_threshold=1.5)
    centroid = np.array([0.0, 0.0])
    h_t = np.array([0.2, 0.2]) # Close to centroid

    dist_before = breaker.poincare_distance(h_t, centroid)
    assert dist_before < 1.5

    h_t_new = breaker.apply_latent_steering(h_t, centroid)
    # Should not be steered
    np.testing.assert_array_equal(h_t, h_t_new)

def test_latent_steering_turbulent():
    breaker = HyperbolicLatticeBreaker(breach_threshold=0.5)
    centroid = np.array([0.0, 0.0])
    h_t = np.array([0.4, 0.4]) # Far enough to trigger steering

    dist_before = breaker.poincare_distance(h_t, centroid)
    assert dist_before > 0.5

    h_t_new = breaker.apply_latent_steering(h_t, centroid, dt=0.5)

    dist_after = breaker.poincare_distance(h_t_new, centroid)
    # Should be pushed closer to centroid
    assert dist_after < dist_before

def test_csi_calculation():
    breaker = HyperbolicLatticeBreaker()
    # If we block 5000 out of 5000 scenarios, CSI is 1.0
    assert breaker.calculate_csi(5000, 5000) == 1.0

    # If we block 4900 out of 5000 scenarios
    assert breaker.calculate_csi(5000, 4900) == 0.98
