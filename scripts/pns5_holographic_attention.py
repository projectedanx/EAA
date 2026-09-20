import torch
import torch.nn as nn
import torch.fft

class CircularConvolutionAttention(nn.Module):
    """
    Implements a Paraconsistent Non-Separable (PNS5) attention mechanism
    replacing standard linear value accumulation with FFT-optimized
    powered circular convolution in the frequency domain.
    """
    def __init__(self, d_model: int):
        super().__init__()
        self.d_model = d_model

    def forward(self, Q: torch.Tensor, K: torch.Tensor, V: torch.Tensor, mask: torch.Tensor = None) -> torch.Tensor:
        """
        Forward pass for the Holographic Convolution Attention.

        Args:
            Q (torch.Tensor): Queries of shape (batch, seq_len, d_model)
            K (torch.Tensor): Keys of shape (batch, seq_len, d_model)
            V (torch.Tensor): Values of shape (batch, seq_len, d_model)
            mask (torch.Tensor, optional): Attention mask

        Returns:
            torch.Tensor: The convoluted output of shape (batch, seq_len, d_model)
        """
        # 1. Compute standard attention scores
        d_k = Q.size(-1)
        scores = torch.matmul(Q, K.transpose(-2, -1)) / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))

        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)

        attn_weights = torch.softmax(scores, dim=-1) # Shape: (batch, seq_len, seq_len)

        # 2. Map V to the Fourier domain (along the feature dimension)
        # We use rfft since V is real-valued
        F_V = torch.fft.rfft(V, dim=-1) # Shape: (batch, seq_len, d_model // 2 + 1)

        # Transform F_V into polar coordinates (magnitude and phase)
        # to apply attention weights as exponents: (r * e^{i\theta})^w = r^w * e^{iw\theta}
        mag = torch.abs(F_V) + 1e-8 # add epsilon to avoid zero magnitude log issues if needed
        phase = torch.angle(F_V)

        # We need to compute for each output token i:
        # Output_i = prod_j (F_V_j)^{attn_{i,j}}

        # Log magnitude: sum_j attn_{i,j} * log(mag_j)
        # Phase: sum_j attn_{i,j} * phase_j

        log_mag = torch.log(mag)

        # Matrix multiplication to compute the weighted sums over sequence length
        # attn_weights is (batch, seq_i, seq_j)
        # log_mag is (batch, seq_j, features)
        out_log_mag = torch.bmm(attn_weights, log_mag)
        out_phase = torch.bmm(attn_weights, phase)

        # Convert back to complex representation
        out_mag = torch.exp(out_log_mag)

        # Reconstruct complex tensor: mag * (cos(phase) + i*sin(phase))
        F_out = torch.polar(out_mag, out_phase)

        # 3. Inverse FFT back to the time domain
        # specify n=d_model to ensure correct output size in case d_model is odd
        out = torch.fft.irfft(F_out, n=self.d_model, dim=-1)

        return out

if __name__ == "__main__":
    # Simple test
    batch_size = 2
    seq_len = 4
    d_model = 16

    layer = CircularConvolutionAttention(d_model)
    Q = torch.randn(batch_size, seq_len, d_model)
    K = torch.randn(batch_size, seq_len, d_model)
    V = torch.randn(batch_size, seq_len, d_model)

    out = layer(Q, K, V)
    print(f"Input shape: {Q.shape}")
    print(f"Output shape: {out.shape}")
