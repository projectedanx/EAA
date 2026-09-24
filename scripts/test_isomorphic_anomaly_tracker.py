import math
import pytest
from scripts.isomorphic_anomaly_tracker_sim import IsomorphicAnomalyTracker

def test_calculate_bic():
    """
    Tests the Bayesian Information Criterion (BIC) calculation for competing models.
    """
    tracker = IsomorphicAnomalyTracker()
    n = 100

    # Test valid inputs
    bic = tracker.calculate_bic(n, 5, 10.0)
    expected_bic = 100 * math.log(10.0 / 100) + 5 * math.log(100)
    assert math.isclose(bic, expected_bic, rel_tol=1e-5)

    # Test edge cases
    assert tracker.calculate_bic(0, 5, 10.0) == float('inf')
    assert tracker.calculate_bic(100, 5, 0.0) == float('inf')

def test_occam_loss_compiler():
    """
    Tests that the Occam-Loss Compiler correctly penalizes the parameter-heavy Geocentric model
    and favors the parsimonious Keplerian model.
    """
    tracker = IsomorphicAnomalyTracker()
    bics = tracker.occam_loss_compiler(500)

    assert "Geocentric_Epicycle" in bics
    assert "Keplerian_Ellipse" in bics

    # Due to the high parameter penalty (k=25 vs k=6) across 500 observations,
    # Keplerian_Ellipse should have a significantly lower (better) BIC.
    assert bics["Keplerian_Ellipse"] < bics["Geocentric_Epicycle"]

def test_simulate_model_breaking():
    """
    Tests the Galileo-type Model Breaking simulation via Modus Tollens.
    """
    tracker = IsomorphicAnomalyTracker()
    assert tracker.active_frame == "Geocentric"

    # Without anomaly
    result = tracker.simulate_model_breaking(venusian_phases_observed=False)
    assert "Geocentric" in result
    assert tracker.active_frame == "Geocentric"
    assert len(tracker.anomalies_detected) == 0

    # With Venusian phases (Modus Tollens trigger)
    result = tracker.simulate_model_breaking(venusian_phases_observed=True)
    assert "Modus Tollens Falsification triggered" in result
    assert "Heliocentric" in result
    assert tracker.active_frame == "Heliocentric"
    assert len(tracker.anomalies_detected) == 1
    assert "Venusian Full Phase detected" in tracker.anomalies_detected[0]
