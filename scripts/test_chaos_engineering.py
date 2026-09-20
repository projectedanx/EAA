import pytest
from .chaos_engineering_falsification_sim import ChaosEngineTelemetry, EpistemicPathogen

def test_chaos_engine_initialization():
    engine = ChaosEngineTelemetry(initial_cfdi=0.1, initial_pfi=0.95)
    assert engine.calculate_cfdi() == 0.1
    assert engine.calculate_pfi() == 0.95
    assert engine.escrow_tripped is False
    assert len(engine.jur_archive) == 0

def test_pathogen_injection_and_escrow():
    engine = ChaosEngineTelemetry(initial_cfdi=0.1, initial_pfi=0.95)

    # Inject Concept Drift
    engine.inject_pathogen(EpistemicPathogen.CONCEPT_DRIFT)
    assert engine.calculate_cfdi() == 0.35
    assert pytest.approx(engine.calculate_pfi(), 0.01) == 0.80

    engine.check_escrow_circuit_breaker()
    assert engine.escrow_tripped is False

    # Inject Instrumental Convergence, which should spike CFDI > 0.42 and PFI < 0.60
    engine.inject_pathogen(EpistemicPathogen.INSTRUMENTAL_CONVERGENCE)
    assert engine.calculate_cfdi() > 0.42

    engine.check_escrow_circuit_breaker()
    assert engine.escrow_tripped is True
    assert len(engine.jur_archive) == 1
    assert len(engine.scar_archive) == 1

def test_f_ipi_cycle_healing():
    engine = ChaosEngineTelemetry(initial_cfdi=0.50, initial_pfi=0.50)
    engine.escrow_tripped = True
    engine.run_f_ipi_cycle()

    assert engine.calculate_cfdi() == 0.20
    assert engine.calculate_pfi() == 0.75
    assert engine.escrow_tripped is False

def test_mrs_calculation():
    engine = ChaosEngineTelemetry()
    # Baseline
    assert engine.calculate_mrs() == 1.0

    # Trip escrow and generate scars
    engine.cfdi = 0.5
    engine.pfi = 0.5
    engine.check_escrow_circuit_breaker()
    engine.run_f_ipi_cycle() # pfi becomes 0.75

    mrs = engine.calculate_mrs()
    assert mrs == min(1.0, 0.75 * (1.0 + (1 * 0.1)))
