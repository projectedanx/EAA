import pytest
import torch
from scripts.circuit_distillation_cka import CircuitDistillationCKALoss

def test_cka_loss_initialization():
    loss_module = CircuitDistillationCKALoss(lambda_cka=0.5)
    assert loss_module.lambda_cka == 0.5
    assert isinstance(loss_module.task_loss_fn, torch.nn.CrossEntropyLoss)

def test_linear_cka_computation():
    loss_module = CircuitDistillationCKALoss()

    # Create random features for student and teacher
    batch_size = 4
    dim = 16
    torch.manual_seed(42)
    s_feat = torch.randn(batch_size, dim)
    t_feat = torch.randn(batch_size, dim)

    cka_sim = loss_module.linear_cka(s_feat, t_feat)

    # CKA should be between 0 and 1
    assert cka_sim.item() >= 0.0
    assert cka_sim.item() <= 1.0

def test_linear_cka_identical_features():
    loss_module = CircuitDistillationCKALoss()

    batch_size = 4
    dim = 16
    torch.manual_seed(42)
    feat = torch.randn(batch_size, dim)

    cka_sim = loss_module.linear_cka(feat, feat)

    # CKA of identical features should be approximately 1.0
    assert pytest.approx(cka_sim.item(), rel=1e-5) == 1.0

def test_forward_pass_shapes_and_values():
    loss_module = CircuitDistillationCKALoss(lambda_cka=1.0)

    batch_size = 2
    num_classes = 3
    dim = 8

    torch.manual_seed(42)
    student_logits = torch.randn(batch_size, num_classes)
    targets = torch.tensor([0, 2])

    s_act_1 = torch.randn(batch_size, dim)
    s_act_2 = torch.randn(batch_size, dim)
    t_act_1 = torch.randn(batch_size, dim)
    t_act_2 = torch.randn(batch_size, dim)

    total, task, cka = loss_module.forward(
        student_logits,
        targets,
        [s_act_1, s_act_2],
        [t_act_1, t_act_2]
    )

    assert total.ndim == 0 # Scalar tensor
    assert task.ndim == 0
    assert cka.ndim == 0

    # Total should equal task + lambda * cka
    assert pytest.approx(total.item(), rel=1e-5) == (task.item() + 1.0 * cka.item())

def test_forward_pass_mismatched_activations():
    loss_module = CircuitDistillationCKALoss()

    batch_size = 2
    num_classes = 3
    dim = 8

    student_logits = torch.randn(batch_size, num_classes)
    targets = torch.tensor([0, 2])

    s_act = torch.randn(batch_size, dim)

    with pytest.raises(ValueError, match="Student and teacher activation lists must have the same length."):
        loss_module.forward(student_logits, targets, [s_act], [])
