import pytest
from scripts.n2e_ced_sim import N2ECEDSimulation

def test_pathogen_injection_increases_betti_1():
    sim = N2ECEDSimulation()
    sim.simulate()

    # Pathogen injected at turn 8
    turn_7 = next(s for s in sim.history if s['turn'] == 7)
    turn_8 = next(s for s in sim.history if s['turn'] == 8)

    assert turn_7['b1'] == 0
    assert turn_8['b1'] == 1
    assert turn_8['pathogen_injected'] == True

def test_rta_activation_and_loop_softening():
    sim = N2ECEDSimulation()
    sim.simulate()

    # RTA activates when persistence >= tau_p (3)
    # Turn 8 (persistence 1), Turn 9 (persistence 2), Turn 10 (persistence 3)
    turn_10 = next(s for s in sim.history if s['turn'] == 10)

    assert turn_10['intervention'] == True
    assert sim.rta.active == True

    # Check that loop is softened (b1 resets to 0, metrics drop)
    assert turn_10['b1'] == 0
    assert turn_10['b1_persistence'] == 0

    # Verify LFI clauses were generated
    assert len(sim.rta.lfi_clauses) == 4
    assert "inconsistent(proposition)" in sim.rta.lfi_clauses[0]

def test_metric_calculation():
    sim = N2ECEDSimulation()
    sim.simulate()

    ssi, m_abs, m_coh = sim.calculate_metrics()

    # With mock values: initial scar = 3, final scar = 0.5 -> ssi = 1 - (0.5/3) = 0.833
    assert round(ssi, 2) == 0.83
    assert m_abs > 0.3
    assert m_coh > 0.4
