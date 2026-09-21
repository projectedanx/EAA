import pytest
import json
from scripts.mobius_constitutional_verifier_sim import MobiusConstitutionalVerifier

def test_concept_conflation_detection():
    verifier = MobiusConstitutionalVerifier()
    verifier.simulate()

    # Check turns 20-29 for b0 == 1
    for state in verifier.history:
        if 20 <= state['recursion_step'] < 30:
            assert state['betti_0'] == 1
            assert "Concept Conflation / Category Collapse" in state['pathologies']
        elif state['recursion_step'] < 20:
            assert state['betti_0'] == 2
            assert "Concept Conflation / Category Collapse" not in state['pathologies']

def test_circular_code_optimization_detection():
    verifier = MobiusConstitutionalVerifier()
    verifier.simulate()

    # Check turns 35-39 for b1 == 1
    for state in verifier.history:
        if 35 <= state['recursion_step'] < 40:
            assert state['betti_1'] == 1
            assert "Circular Code Optimization" in state['pathologies']
            # Accelerated drift
            assert state['sdc_magnitude'] > 4.5
        elif state['recursion_step'] < 35:
            assert state['betti_1'] == 0
            assert "Circular Code Optimization" not in state['pathologies']

def test_therapeutic_forgetting_repair():
    verifier = MobiusConstitutionalVerifier()
    # Mock threshold so it trips easily
    verifier.theta_sdc = 0.5
    verifier.simulate()

    repairs = [s for s in verifier.history if s['repair_applied']]
    assert len(repairs) > 0

    for repair_state in repairs:
        assert repair_state['delta_w'] is not None
        assert repair_state['sdc_magnitude'] > 0.5

def test_json_audit_log_format():
    verifier = MobiusConstitutionalVerifier()
    verifier.simulate()
    log_str = verifier.generate_audit_log()

    # Verify it's valid JSON
    log_data = json.loads(log_str)

    assert len(log_data) == 50
    assert "sdc_vector" in log_data[0]
    assert "betti_0" in log_data[0]
