import pytest
from .speculative_abstract_interpretation_sim import SpeculativeAbstractInterpretationEngine

def test_valid_prp():
    engine = SpeculativeAbstractInterpretationEngine()
    valid_prp = {
        "contains_cycles": False,
        "data_residency_eu": True,
        "types_resolved": True
    }
    assert engine.run_abstract_interpretation_sweep(valid_prp) is True

def test_cyclic_deadlock():
    engine = SpeculativeAbstractInterpretationEngine()
    invalid_prp = {
        "contains_cycles": True,
        "data_residency_eu": True,
        "types_resolved": True
    }
    assert engine.run_abstract_interpretation_sweep(invalid_prp) is False

def test_data_residency_violation():
    engine = SpeculativeAbstractInterpretationEngine()
    invalid_prp = {
        "contains_cycles": False,
        "data_residency_eu": False,
        "types_resolved": True
    }
    assert engine.run_abstract_interpretation_sweep(invalid_prp) is False

def test_type_resolution_violation():
    engine = SpeculativeAbstractInterpretationEngine()
    invalid_prp = {
        "contains_cycles": False,
        "data_residency_eu": True,
        "types_resolved": False
    }
    assert engine.run_abstract_interpretation_sweep(invalid_prp) is False
