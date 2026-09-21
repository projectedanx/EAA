import pytest
import numpy as np
from scripts.gudhi_latent_concept_verification import LatentConceptVerificationHarness

def test_analyze_barcodes_detects_anomalies():
    harness = LatentConceptVerificationHarness(beta1_threshold=0.5, beta2_threshold=0.6)

    # Mock persistence data: (dimension, (birth, death))
    mock_persistence = [
        (0, (0.0, float('inf'))),
        (0, (0.0, 0.2)),
        (1, (0.1, 0.8)),  # Persistence 0.7 > 0.5 (Beta-1 anomaly)
        (1, (0.2, 0.4)),  # Persistence 0.2
        (2, (0.3, 1.0)),  # Persistence 0.7 > 0.6 (Beta-2 anomaly)
        (2, (0.5, 0.8))   # Persistence 0.3
    ]

    result = harness.analyze_barcodes(mock_persistence)

    assert result["b1_anomalies_count"] == 1
    assert result["b2_anomalies_count"] == 1

    max_p = result["max_persistence_vector"]
    assert np.isclose(max_p[1], 0.7)  # Max Betti-1
    assert np.isclose(max_p[2], 0.7)  # Max Betti-2

def test_update_scts_calculates_dis():
    harness = LatentConceptVerificationHarness()

    # Force previous state
    harness.previous_max_persistence = np.array([1.0, 0.5, 0.0])

    # New state implies a shift
    current = np.array([1.0, 1.5, 0.0]) # delta_scts = 1.0

    # dis = (0.3 * 1.0) + (0.7 * 0.0) = 0.3
    dis1 = harness.update_scts(current)
    assert np.isclose(dis1, 0.3)

    # Another shift
    current2 = np.array([1.0, 2.5, 0.0]) # delta_scts = 1.0
    # dis = (0.3 * 1.0) + (0.7 * 0.3) = 0.3 + 0.21 = 0.51
    dis2 = harness.update_scts(current2)
    assert np.isclose(dis2, 0.51)

def test_monitor_activations_fallback():
    # In an environment without GUDHI, we use variance fallback
    harness = LatentConceptVerificationHarness()

    # High variance triggers escrow
    high_var_cloud = np.array([[0.0, 10.0], [-10.0, 0.0]])
    assert harness.monitor_activations(high_var_cloud) == True

    # Low variance does not trigger
    harness.dis = 0.0 # reset
    low_var_cloud = np.array([[0.1, 0.1], [0.1, 0.1]])
    assert harness.monitor_activations(low_var_cloud) == False
