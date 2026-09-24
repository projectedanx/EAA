import pytest
from scripts.tbe_cpi_harness_sim import Action, SystemAssuranceAgent, TemporalBlendingEngine

def test_cascading_contradiction_boundary():
    """
    Test Theorem 3.1: The Cascading Contradiction Boundary (Security Camera Lemma)
    Ensures that a single contradiction reduces CPI below the threshold for short traces.
    """
    saa = SystemAssuranceAgent(cpi_threshold=0.95)

    # State definitions
    s1 = {"f_cam": 1, "door_open": 0}
    s2 = {"f_cam": 0, "door_open": 0}
    s3 = {"f_cam": 0, "door_open": 1}

    # Actions
    a_disable = Action(name="disable_cam", preconditions={"f_cam": 1}, effects={"f_cam": 0})
    a_open_door = Action(name="open_door", preconditions={"f_cam": 1}, effects={"door_open": 1}) # Requires f_cam=1, but it's 0 in s2!

    # Trace with contradiction
    # t1: valid transition
    # t2: invalid transition (precondition fails because f_cam=0 in s2)
    trace = [
        (s1, a_disable, s2),
        (s2, a_open_door, s3)
    ]

    result = saa.evaluate_trace(trace)

    assert result["cpi_score"] == 0.5  # 1 valid, 1 invalid (1/2 = 0.5)
    assert result["cpi_score"] < 0.95
    assert result["status"] == "Epistemic Escrow / Reflexive Repair"

def test_frame_operator_violation():
    """
    Test to ensure that fluents not in effects must remain invariant.
    """
    saa = SystemAssuranceAgent()

    s1 = {"f_cam": 1, "door_open": 0}
    s2 = {"f_cam": 0, "door_open": 1} # door_open magically changed without being in effects

    a_disable = Action(name="disable_cam", preconditions={"f_cam": 1}, effects={"f_cam": 0})

    trace = [
        (s1, a_disable, s2)
    ]

    result = saa.evaluate_trace(trace)

    assert result["cpi_score"] == 0.0 # Frame operator violated
    assert result["status"] == "Epistemic Escrow / Reflexive Repair"

def test_epistemic_rheological_stability():
    """
    Test Theorem 3.2: Epistemic Rheological Stability (Chronotopological Drift Prevention)
    """
    tbe = TemporalBlendingEngine(semantic_viscosity=10.0, constraint_force=5.0, spatial_resolution=2.0)

    # L = 5.0 / 10.0 = 0.5
    # Max displacement = L * dt
    # If dt = 1.0, max_displacement = 0.5 * 1.0 = 0.5. (0.5 < 2.0 -> True)
    assert tbe.check_rheological_stability(dt=1.0) == True

    # If dt = 5.0, max_displacement = 0.5 * 5.0 = 2.5. (2.5 < 2.0 -> False)
    assert tbe.check_rheological_stability(dt=5.0) == False

def test_parametric_tradeoff():
    """
    Test Parametric Trade-off Modeling (Tension Frontier).
    """
    tbe = TemporalBlendingEngine(semantic_viscosity=10.0, constraint_force=5.0, spatial_resolution=2.0)

    result1 = tbe.compute_parametric_tradeoff(verification_depth=10, tokens=100, temperature=0.5, variance=2.0, budget_threshold=1.5)

    assert result1["Cost_of_Coherence_Overhead"] == 1000
    assert result1["Cost_of_Structural_Discovery"] == 1.0
    assert result1["Optimality_Frontier_Satisfied"] == True

    result2 = tbe.compute_parametric_tradeoff(verification_depth=2, tokens=50, temperature=1.5, variance=5.0, budget_threshold=1.5)

    assert result2["Cost_of_Coherence_Overhead"] == 100
    assert result2["Cost_of_Structural_Discovery"] == 7.5
    assert result2["Optimality_Frontier_Satisfied"] == False
