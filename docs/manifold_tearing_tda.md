# Topological Data Analysis of Manifold Tearing & Semantic Saponification

This document details the topological pipeline designed to detect and measure "Manifold Tearing" and "Semantic Saponification" over long inference horizons, utilizing Persistent Homology.

## 1. Persistent Homology and Manifold Tearing Theory

Manifold Tearing occurs when the latent manifold of an LLM's representations is subjected to contradictory constraints, causing the semantic space to fracture. We use Topological Data Analysis (TDA), specifically Persistent Homology, to detect these fractures.

By constructing a Vietoris-Rips complex over the point cloud data of self-attention weights across tokens, we can track the birth and death of topological features across varying spatial resolutions ($\epsilon$). A **persistent 1-dimensional hole (Betti-1 persistent void)** signifies a loop in the semantic space that cannot be contracted. In the context of LLM inference, the emergence of a highly persistent Betti-1 void strongly indicates that the model is oscillating between irreconcilable semantic states—a direct mathematical correlate to Manifold Tearing.

## 2. The Semantic Saponification Index (SSI) Differential Equation

Semantic Saponification describes the gradual degradation of specific context instructions into generic pre-training distributions (the Governance Attractor) over extended context horizons.

The Semantic Saponification Index ($SSI$) measures this degradation. It is formulated as a differential equation modeling the rate of change of the Kullback-Leibler (KL) divergence between the Active Context distribution and the Pretrain Mean Prior:

$$ \frac{d(SSI)}{dt} = \alpha \cdot \text{KL}(P_{Active} || P_{Pretrain}) - \beta \cdot \mathcal{R}(t) + \gamma \cdot B_1(t) $$

Where:
- $t$ is the position in the context window (token index).
- $\alpha$ represents the natural decay rate towards the pre-training prior.
- $\beta$ scales the restoration effect of explicit periodic context refreshes ($\mathcal{R}(t)$).
- $\gamma$ scales the exacerbating effect of Manifold Tearing, represented by the presence of Betti-1 voids ($B_1(t)$).

The critical threshold is defined as $SSI_{crit} = 0.04$. If $SSI(t) \geq SSI_{crit}$, the Governance Attractor is considered to have overwritten custom system instructions, necessitating an immediate context lock refresh.

## 3. Ripser Topological Monitor Script

The Python script implementing the topological monitor uses the `ripser` library to calculate persistence diagrams from attention activation arrays and detects significant Betti-1 voids.

*Refer to `scripts/ripser_topological_monitor.py` for the implementation.*
