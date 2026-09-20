"""
Mechanistic Lookback Circuit Distillation Loss

This module provides the composite loss formulation to transfer the causal belief-tracking
"lookback circuit" from a teacher model to a student model via Centered Kernel Alignment (CKA).
"""
import torch
import torch.nn as nn

class CircuitDistillationCKALoss(nn.Module):
    """
    Computes a composite loss function combining task loss (e.g., Cross-Entropy)
    with a CKA-based representational similarity loss to align specific
    attention heads between a teacher and a student model.
    """
    def __init__(self, lambda_cka: float = 1.0):
        """
        Initializes the CircuitDistillationCKALoss module.

        Args:
            lambda_cka (float, optional): Weighting parameter for the CKA loss term. Defaults to 1.0.

        Returns:
            None
        """
        super().__init__()
        self.lambda_cka = lambda_cka
        # We assume the task loss is provided externally, or we could include CrossEntropy here.
        self.task_loss_fn = nn.CrossEntropyLoss()

    def linear_cka(self, features_s: torch.Tensor, features_t: torch.Tensor) -> torch.Tensor:
        """
        Computes the Linear Centered Kernel Alignment (CKA) between student and teacher features.

        Args:
            features_s (torch.Tensor): Activation tensor from a student circuit head (batch, dim).
            features_t (torch.Tensor): Activation tensor from a teacher circuit head (batch, dim).

        Returns:
            torch.Tensor: Scalar linear CKA similarity score (between 0 and 1).
        """
        # Center features
        # Shape: (batch_size, dim) -> center across batch
        s_centered = features_s - features_s.mean(dim=0, keepdim=True)
        t_centered = features_t - features_t.mean(dim=0, keepdim=True)

        # Compute dot products
        # HS = X X^T
        dot_s = torch.mm(s_centered, s_centered.t())
        dot_t = torch.mm(t_centered, t_centered.t())

        # Compute Frobenius norms
        norm_s = torch.norm(dot_s, p='fro')
        norm_t = torch.norm(dot_t, p='fro')

        if norm_s == 0 or norm_t == 0:
            return torch.tensor(0.0, device=features_s.device)

        # Compute Hilbert-Schmidt Independence Criterion (HSIC)
        hsic = torch.sum(dot_s * dot_t)

        # Compute CKA = HSIC / (norm(X) * norm(Y))
        cka = hsic / (norm_s * norm_t)
        return cka

    def forward(
        self,
        student_logits: torch.Tensor,
        targets: torch.Tensor,
        student_circuit_activations: list[torch.Tensor],
        teacher_circuit_activations: list[torch.Tensor]
    ) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Computes the total loss.

        L_total = L_task + lambda * sum(1 - CKA(s_head, t_head))

        Args:
            student_logits (torch.Tensor): The output logits from the student model (batch, num_classes).
            targets (torch.Tensor): The ground truth target labels (batch,).
            student_circuit_activations (list[torch.Tensor]): List of activation tensors from the student.
            teacher_circuit_activations (list[torch.Tensor]): List of activation tensors from the teacher.

        Returns:
            tuple: (total_loss, task_loss, cka_penalty) - scalar tensors.
        """
        # Calculate standard task loss (e.g. Cross-Entropy)
        l_task = self.task_loss_fn(student_logits, targets)

        # Calculate CKA penalty
        l_cka = torch.tensor(0.0, device=student_logits.device)

        if len(student_circuit_activations) != len(teacher_circuit_activations):
            raise ValueError("Student and teacher activation lists must have the same length.")

        for s_act, t_act in zip(student_circuit_activations, teacher_circuit_activations):
            # Flatten to (batch, -1) in case they are structured as (batch, seq, dim)
            s_flat = s_act.reshape(s_act.shape[0], -1)
            t_flat = t_act.reshape(t_act.shape[0], -1)

            cka_sim = self.linear_cka(s_flat, t_flat)
            # We want to minimize the difference, so we penalize (1 - CKA)
            l_cka = l_cka + (1.0 - cka_sim)

        l_total = l_task + (self.lambda_cka * l_cka)

        return l_total, l_task, l_cka
