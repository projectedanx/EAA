import pytest
from scripts.systemic_deidealization_engine_sim import SystemicDeidealizationEngine

def test_dag_representation_and_boundary_auditor():
    """
    Tests the initial DAG representation and the Boundary Auditor logic.
    """
    engine = SystemicDeidealizationEngine()

    assert engine.model_dag["root_model"] == "Static_Protein_Ribbon"
    assert engine.model_dag["assumptions"]["zero_flexibility"]["status"] == "active"

    # Safe bounds
    assert "BOUNDARY_SAFE" in engine.boundary_auditor(300.0, 50.0)

    # Breached bounds (high temp, long time)
    assert "BOUNDARY_BREACH" in engine.boundary_auditor(315.0, 200.0)

def test_evaluate_prediction_error():
    """
    Tests the detection of >3-sigma prediction errors.
    """
    engine = SystemicDeidealizationEngine()

    # Below threshold
    res = engine.evaluate_prediction_error(2.5)
    assert not res["divergence_detected"]

    # Above threshold
    res = engine.evaluate_prediction_error(4.0)
    assert res["divergence_detected"]
    assert res["faulty_assumption"] == "zero_flexibility"

def test_execute_deidealization_routine():
    """
    Tests the automated de-idealization execution and variable re-injection.
    """
    engine = SystemicDeidealizationEngine()
    initial_params = engine.model_dag["parameters"]

    res = engine.execute_deidealization_routine("zero_flexibility")

    assert "De-Idealization Executed" in res
    assert "conformational_dynamics" in res
    assert engine.model_dag["assumptions"]["zero_flexibility"]["status"] == "deactivated"
    assert engine.model_dag["parameters"] > initial_params
    assert "conformational_dynamics" in engine.model_dag["root_model"]

def test_automated_feedback_loop():
    """
    Tests the full automated feedback loop integration.
    """
    engine = SystemicDeidealizationEngine()

    # Test safe path
    res_safe = engine.automated_feedback_loop(1.0, 300.0, 50.0)
    assert "System operating within bounds." in res_safe
    assert engine.model_dag["assumptions"]["zero_flexibility"]["status"] == "active"

    # Test breach path
    res_breach = engine.automated_feedback_loop(4.5, 315.0, 500.0)
    assert "De-Idealization Executed" in res_breach
    assert engine.model_dag["assumptions"]["zero_flexibility"]["status"] == "deactivated"
