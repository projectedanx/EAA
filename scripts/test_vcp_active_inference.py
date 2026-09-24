import pytest
import numpy as np
from scripts.vcp_active_inference_sim import VerificationCoProcessor

def test_vfe_calculation_safe():
    vcp = VerificationCoProcessor(vfe_threshold=2.0)
    # State matches prior exactly
    vfe = vcp.calculate_vfe(0.0, 1.0)
    assert pytest.approx(vfe, abs=1e-5) == 0.0

def test_vfe_calculation_drift():
    vcp = VerificationCoProcessor(vfe_threshold=2.0)
    # State drifts in mean and variance
    vfe = vcp.calculate_vfe(2.0, 0.5)
    assert vfe > 0.0

def test_monitor_cache_safe():
    vcp = VerificationCoProcessor(vfe_threshold=2.0)
    # Generate random normal data close to prior
    np.random.seed(42)
    cache_state = np.random.normal(0.0, 1.0, 100)

    res = vcp.monitor_cache(cache_state)
    assert res["status"] == "SAFE"
    assert res["vfe"] < 2.0
    assert res["correction_vector"] is None

def test_monitor_cache_breach():
    vcp = VerificationCoProcessor(vfe_threshold=2.0)
    # Generate data far from prior (e.g. mean=3.0)
    cache_state = np.random.normal(3.0, 1.0, 100)

    res = vcp.monitor_cache(cache_state)
    assert res["status"] == "BREACH_PREDICTED"
    assert res["vfe"] > 2.0
    assert res["correction_vector"] is not None
    assert len(res["correction_vector"]) == 100
    # Correction should point back toward 0.0 (negative)
    assert res["correction_vector"][0] < 0.0
