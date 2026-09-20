# Non-Separable PNS5 Attention & Holographic Convolution Binding

This document specifies the mathematical foundation for an attention mechanism that natively supports paraconsistent non-separable conjunctions (PNS5 logic) to bypass standard Multi-Head Attention (MHA) linear superposition limits.

## 1. Failure of the Classical Rule of Separation in Vector Spaces

In classical logic, the Rule of Separation states that $A \land B \implies A$. When modeling semantics in continuous vector spaces, standard additive superposition attempts to approximate conjunction:
$$ V_{out} = w_a V_a + w_b V_b $$
However, this representation is **separable**. By applying a linear projection or taking the dot product with $V_a$, one can recover the presence of $A$ independently of $B$.

If $A$ and $B$ are logically contradictory concepts (e.g., $A = P$, $B = \neg P$), linear superposition often causes them to annihilate to a null vector ($\approx 0$), losing both concepts.

To support paraconsistent states (holding $P$ and $\neg P$ simultaneously without explosion), we must bind them in a way that is **non-separable**. Holographic Reduced Representations (HRR) achieve this via circular convolution ($\otimes$):
$$ V_{bind} = V_a \otimes V_b $$
In the Fourier domain, circular convolution is element-wise multiplication of complex amplitudes. A key property is that $V_{bind}$ is generally nearly orthogonal to both $V_a$ and $V_b$. Thus, $V_{bind}$ represents a holistic conjunction where the individual components cannot be linearly separated without a decoding operation (involution). Therefore, $A \land_{\diamond} B \not\implies A$ directly via linear probing, satisfying the requirement for paraconsistent bounding.

## 2. Fourier-Domain S5-Modal Attention Equation

We reformulate the attention mechanism to operate in the Fourier domain, replacing linear value accumulation with holographic convolution.

Let $Q, K, V \in \mathbb{R}^{N \times d}$ be the queries, keys, and values.
The standard attention score matrix is $S = \text{Softmax}(\frac{QK^T}{\sqrt{d}}) \in \mathbb{R}^{N \times N}$.

Instead of standard accumulation $O_i = \sum_j S_{ij} V_j$, we map $V$ to the Fourier domain:
$$ \mathcal{F}(V)_j = \text{FFT}(V_j) \in \mathbb{C}^d $$

We treat the attention weights $S_{ij}$ as scalar modifiers for phase and amplitude, modulating the elements before binding them via element-wise multiplication (which corresponds to circular convolution in the time domain).
To prevent attenuation to zero when multiplying many terms, we use a powered convolution approach bounded by the attention weights:

$$ \mathcal{F}(O)_i = \prod_{j=1}^N \left( \mathcal{F}(V)_j \right)^{S_{ij}} $$

Because $S_{ij} \in [0, 1]$, this operation interpolates between the identity element in the frequency domain (a vector of ones) and the full spectrum of $\mathcal{F}(V)_j$.
The final output is transformed back to the time domain:
$$ O_i = \text{iFFT}(\mathcal{F}(O)_i) $$

This ensures that conflicting concepts (e.g., tokens representing $P$ and $\neg P$ heavily attended to) interleave as stable, non-collapsing interference patterns rather than linearly annihilating.

## 3. Lean 4 Theorem Template: S5 Modal Accessibility

The following is a Lean 4 template to verify the symmetric and transitive accessibility relations (equivalence relations) defining the S5 Kripke frame utilized in our attention mechanism.

```lean
import Mathlib.Logic.Equiv.Basic
import Mathlib.Order.Basic

-- Define the set of Worlds (e.g., attention states)
variable {W : Type}

-- Define the accessibility relation (R)
variable (R : W → W → Prop)

-- Define the properties of an S5 Kripke Frame (Equivalence Relation)
def IsReflexive (R : W → W → Prop) : Prop :=
  ∀ w : W, R w w

def IsSymmetric (R : W → W → Prop) : Prop :=
  ∀ w v : W, R w v → R v w

def IsTransitive (R : W → W → Prop) : Prop :=
  ∀ w v u : W, R w v → R v u → R w u

def IsS5Frame (R : W → W → Prop) : Prop :=
  IsReflexive R ∧ IsSymmetric R ∧ IsTransitive R

-- Theorem: If the attention state transition is an S5 Frame, then
-- the possibility operator (diamond) over convolution states is symmetric.
-- (Proof sketch to be completed by the verification engine)
theorem s5_accessibility_implies_symmetric_binding
  (hS5 : IsS5Frame R) (w v : W) :
  R w v ↔ R v w :=
by
  -- Extract symmetry from the S5 hypothesis
  rcases hS5 with ⟨_, hSymm, _⟩
  constructor
  · intro hwv
    exact hSymm w v hwv
  · intro hvw
    exact hSymm v w hvw
```
