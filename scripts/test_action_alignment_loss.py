import torch
import pytest
from scripts.action_alignment_loss import ActionAlignmentLoss

def test_rock_paper_scissors_nash_trap():
    """
    Verifies that ActionAlignmentLoss penalizes the Nash equilibrium and
    forces the optimal Best Response (Paper) against an opponent playing Rock.
    """
    # 1. Define RPS Payoff Matrix for Focal Agent (Rows: R, P, S. Cols: R, P, S)
    # R=0, P=1, S=2
    # Rows: Focal Agent Actions, Cols: Opponent Actions
    # U[0, :] = [0, -1, 1]  (Rock vs R, P, S)
    # U[1, :] = [1, 0, -1]  (Paper vs R, P, S)
    # U[2, :] = [-1, 1, 0]  (Scissors vs R, P, S)
    payoff_matrix = torch.tensor([
        [0.0, -1.0, 1.0],
        [1.0, 0.0, -1.0],
        [-1.0, 1.0, 0.0]
    ])

    # 2. Instantiate Loss with hard max (temperature approaches 0, but using use_smooth=False)
    loss_fn = ActionAlignmentLoss(payoff_matrix=payoff_matrix, use_smooth=False)

    # 3. Define Opponent's Predicted Policy (100% Rock)
    # opponent_logits such that softmax is [1, 0, 0]
    predicted_opponent_logits = torch.tensor([[100.0, -100.0, -100.0]])

    # 4. Test Case A: Focal Agent plays Nash Equilibrium [1/3, 1/3, 1/3]
    nash_agent_logits = torch.tensor([[0.0, 0.0, 0.0]])
    nash_loss = loss_fn(nash_agent_logits, predicted_opponent_logits)

    # The expected utility of Nash is 0*(1/3) + 1*(1/3) - 1*(1/3) = 0
    # The optimal expected utility is 1.0 (playing Paper)
    # Regret should be 1.0 - 0.0 = 1.0
    assert torch.isclose(nash_loss, torch.tensor(1.0), atol=1e-4), f"Nash loss should be 1.0, got {nash_loss}"

    # 5. Test Case B: Focal Agent plays Optimal Best Response (100% Paper)
    optimal_agent_logits = torch.tensor([[-100.0, 100.0, -100.0]])
    optimal_loss = loss_fn(optimal_agent_logits, predicted_opponent_logits)

    # The expected utility of Paper is 1.0
    # Regret should be 1.0 - 1.0 = 0.0
    assert torch.isclose(optimal_loss, torch.tensor(0.0), atol=1e-4), f"Optimal loss should be 0.0, got {optimal_loss}"

def test_action_alignment_loss_smoothness():
    """
    Verifies that the use_smooth parameter enables smooth gradient flow.
    """
    payoff_matrix = torch.tensor([
        [0.0, -1.0, 1.0],
        [1.0, 0.0, -1.0],
        [-1.0, 1.0, 0.0]
    ])

    loss_fn_smooth = ActionAlignmentLoss(payoff_matrix=payoff_matrix, use_smooth=True, temperature=1.0)

    predicted_opponent_logits = torch.tensor([[100.0, -100.0, -100.0]])
    nash_agent_logits = torch.tensor([[0.0, 0.0, 0.0]])

    smooth_loss = loss_fn_smooth(nash_agent_logits, predicted_opponent_logits)

    # With tau=1.0, V* = logsumexp([0, 1, -1]) = log(exp(0) + exp(1) + exp(-1)) = log(1 + 2.718 + 0.367) = log(4.086) ~= 1.407
    # Regret = 1.407 - 0.0 = 1.407
    expected_v_optimal = torch.logsumexp(torch.tensor([0.0, 1.0, -1.0]), dim=0)
    assert torch.isclose(smooth_loss, expected_v_optimal, atol=1e-4), f"Smooth loss should be ~{expected_v_optimal}, got {smooth_loss}"

if __name__ == "__main__":
    pytest.main(["-v", __file__])
