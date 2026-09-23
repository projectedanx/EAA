import pytest
from ala_guard_sim import AnomalyLearningAgent

def test_ala_threshold_dynamics():
    """
    Test the threshold dynamics math formula directly.
    d_theta/dt = -alpha * grad_fp + beta * grad_tp - eta * theta
    """
    agent = AnomalyLearningAgent(alpha=0.1, beta=0.2, eta=0.0, initial_theta=0.5)

    # Test FP impact (decreases theta based on the formula written)
    agent.update_threshold(grad_fp=1.0, grad_tp=0.0, dt=1.0)
    assert pytest.approx(agent.theta) == 0.4

    # Test TP impact (increases theta based on the formula written)
    agent.update_threshold(grad_fp=0.0, grad_tp=1.0, dt=1.0)
    assert pytest.approx(agent.theta) == 0.6

def test_laminar_pass():
    agent = AnomalyLearningAgent()
    # Tool not on watchlist, low entropy
    res = agent.evaluate_action(tool="edit_post", entropy_gradient=0.2)
    assert res["status"] == "ALLOWED"
    assert "Laminar" in res["reason"]

def test_watchlist_breach():
    agent = AnomalyLearningAgent()
    # Tool on watchlist, high risk score
    res = agent.evaluate_action(
        tool="Suspicious_Enumeration",
        entropy_gradient=0.1, # Gradient doesn't matter for watchlist
        s_neural=0.9, s_bicm=0.9, s_recon=0.9, f_symbolic=0.9
    )
    assert res["status"] == "HALTED"
    assert "Breach" in res["reason"]

def test_entropy_warning_passed():
    agent = AnomalyLearningAgent()
    # High entropy, but low risk score (passes audit)
    res = agent.evaluate_action(
        tool="rare_but_benign_tool",
        entropy_gradient=0.6,
        s_neural=0.1, s_bicm=0.1, s_recon=0.1, f_symbolic=0.1
    )
    assert res["status"] == "ALLOWED"
    assert "Heavy audit passed" in res["reason"]

def test_under_damped_drift():
    # Simulation: High FP, High Alpha -> theta drops to near zero
    agent = AnomalyLearningAgent(alpha=0.8, beta=0.1, eta=0.01, initial_theta=0.5)
    for _ in range(10):
        agent.update_threshold(grad_fp=1.0, grad_tp=0.0)
    assert agent.theta < 0.1

def test_over_damped_ossification():
    # Simulation: High TP, High Beta -> theta rises to max
    agent = AnomalyLearningAgent(alpha=0.1, beta=0.8, eta=0.01, initial_theta=0.5)
    for _ in range(10):
        agent.update_threshold(grad_fp=0.0, grad_tp=1.0)
    assert agent.theta > 0.9
