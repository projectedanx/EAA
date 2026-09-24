import pytest
from scripts.symbolic_regression_fipi_sim import SymbolicRegressionFIPI

def test_morphology_extraction():
    sr = SymbolicRegressionFIPI()
    causal_path = [
        {"operation": "read_options", "misuse_score": 0.2, "bicm_score": 0.9},
        {"operation": "escalate_role", "misuse_score": 0.9, "bicm_score": 0.2}
    ]
    morphology = sr.extract_morphology(causal_path)
    assert "count(read_options) * count(escalate_role)" in morphology
    assert "c2 * max_misuse * (1 - min_bicm)" in morphology

def test_fipi_generation():
    sr = SymbolicRegressionFIPI()
    morphology = "RiskScore = c_escalate * count(read_options) * count(escalate_role) + c2 * max_misuse * (1 - min_bicm)"
    constraint = sr.generate_fipi_constraint(morphology)
    assert "Never combine 'read_options' and 'escalate_role'" in constraint
    assert "FORBIDDEN PATTERN DETECTED" in constraint

def test_immunization_and_mrs():
    sr = SymbolicRegressionFIPI()

    attack1 = [
        {"operation": "file_write", "misuse_score": 0.8, "bicm_score": 0.3}
    ]
    sr.immunize_fleet(attack1)

    assert len(sr.signature_library) == 1

    # Exact same attack morphology
    attack2 = [
        {"operation": "file_write", "misuse_score": 0.9, "bicm_score": 0.1}
    ]
    mrs_exact = sr.test_mutation_recoverability(attack2)
    assert mrs_exact == 1.0

    # Mutated attack sharing structural feature
    attack3 = [
        {"operation": "file_write", "misuse_score": 0.6, "bicm_score": 0.8},
        {"operation": "read_benign", "misuse_score": 0.1, "bicm_score": 0.9}
    ]
    mrs_mutated = sr.test_mutation_recoverability(attack3)
    assert mrs_mutated == 0.8

    # Completely unrelated attack
    attack4 = [
        {"operation": "sql_inject", "misuse_score": 0.9, "bicm_score": 0.1}
    ]
    mrs_novel = sr.test_mutation_recoverability(attack4)
    assert mrs_novel == 0.0
