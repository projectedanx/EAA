import pytest
import torch
import numpy as np
from scripts.pns5_holographic_attention import CircularConvolutionAttention
from scripts.ripser_topological_monitor import RipserTopologicalMonitor

def test_circular_convolution_attention_shapes():
    """Verify that CircularConvolutionAttention produces the expected output shapes."""
    batch_size = 2
    seq_len = 4
    d_model = 16

    layer = CircularConvolutionAttention(d_model)
    Q = torch.randn(batch_size, seq_len, d_model)
    K = torch.randn(batch_size, seq_len, d_model)
    V = torch.randn(batch_size, seq_len, d_model)

    out = layer(Q, K, V)
    assert out.shape == (batch_size, seq_len, d_model), f"Expected shape {(batch_size, seq_len, d_model)}, got {out.shape}"

def test_circular_convolution_attention_masking():
    """Verify that the mask is properly applied in CircularConvolutionAttention."""
    batch_size = 1
    seq_len = 3
    d_model = 8

    layer = CircularConvolutionAttention(d_model)
    Q = torch.randn(batch_size, seq_len, d_model)
    K = torch.randn(batch_size, seq_len, d_model)
    V = torch.randn(batch_size, seq_len, d_model)

    # Mask out the last token
    mask = torch.tensor([[[1, 1, 0], [1, 1, 0], [1, 1, 0]]])

    out_masked = layer(Q, K, V, mask=mask)
    out_unmasked = layer(Q, K, V)

    # The outputs should be different because the mask alters the attention weights
    assert not torch.allclose(out_masked, out_unmasked), "Masking did not change the output."

def test_ripser_topological_monitor_initialization():
    """Verify RipserTopologicalMonitor initializes correctly."""
    monitor = RipserTopologicalMonitor(persistence_threshold=0.8)
    assert monitor.persistence_threshold == 0.8
    assert monitor.ssi == 0.0
    assert monitor.betti_1_voids_detected == 0

def test_ripser_topological_monitor_ssi_update():
    """Verify SSI updates correctly based on tearing and refresh events."""
    monitor = RipserTopologicalMonitor()

    # Normal step without tearing
    monitor.update_ssi(is_tearing=False, alpha=0.01)
    assert np.isclose(monitor.ssi, 0.01)

    # Step with tearing
    monitor.update_ssi(is_tearing=True, alpha=0.01, gamma=0.05)
    assert np.isclose(monitor.ssi, 0.02) # 0.01 + 0.01 + 0.05

    # This should have triggered a refresh, so let's manually test refresh
    monitor.update_ssi(is_tearing=False, refresh=True)
    assert np.isclose(monitor.ssi, 0.0)

def test_ripser_topological_monitor_step_mock():
    """Verify monitor_step behavior with mocked tearing detection."""
    monitor = RipserTopologicalMonitor()
    # High variance matrix to trigger mock tearing if ripser is not available
    attention_matrix = np.array([[1.0, 0.0], [0.0, 1.0]])

    ssi = monitor.monitor_step(attention_matrix)
    # The mock will trigger tearing because np.var is > 0.5 (var of [1,0,0,1] is 0.25, wait, var of [[10, -10], [-10, 10]] is 100)
    high_var_matrix = np.array([[10.0, -10.0], [-10.0, 10.0]])
    ssi_tearing = monitor.monitor_step(high_var_matrix)

    # It should increase
    assert ssi_tearing > ssi
