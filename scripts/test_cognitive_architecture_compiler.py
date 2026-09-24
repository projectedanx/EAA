import pytest
from scripts.cognitive_architecture_compiler_sim import CognitiveArchitectureCompiler

def test_evaluate_fictive_utility():
    """
    Tests the retrieval of computational utility from the Fictive Principles ontology.
    """
    compiler = CognitiveArchitectureCompiler()

    assert compiler.evaluate_fictive_utility("Point_Mass") == 0.85
    assert compiler.evaluate_fictive_utility("Ideal_Gas") == 0.95
    assert compiler.evaluate_fictive_utility("Non_Existent_Principle") == 0.0

def test_calculate_grasping_metric():
    """
    Tests the calculation of the Grasping Metric ensuring correct weights and bounds.
    """
    compiler = CognitiveArchitectureCompiler()

    # Weights: var(0.2), causal(0.4), transfer(0.4)
    # Perfect score
    assert compiler.calculate_grasping_metric(1.0, 1.0, 1.0) == 1.0

    # Zero score
    assert compiler.calculate_grasping_metric(0.0, 0.0, 0.0) == 0.0

    # Partial score: (0.2 * 0.5) + (0.4 * 0.8) + (0.4 * 0.4) = 0.10 + 0.32 + 0.16 = 0.58
    assert abs(compiler.calculate_grasping_metric(0.5, 0.8, 0.4) - 0.58) < 1e-5

    # Out of bounds clamping (if implemented in function logic, though types imply floats 0-1)
    assert compiler.calculate_grasping_metric(2.0, 2.0, 2.0) == 1.0
    assert compiler.calculate_grasping_metric(-1.0, -1.0, -1.0) == 0.0

def test_simulate_astrophysical_trajectory():
    """
    Tests the astrophysical trajectory simulation, verifying that a high understanding
    score is achieved despite the presence of non-factive elements and GR defeaters.
    """
    compiler = CognitiveArchitectureCompiler()
    report = compiler.simulate_astrophysical_trajectory()

    assert report["applied_framework"] == "Newtonian_Gravitation"
    assert "Point_Mass" in report["fictive_principles_used"]
    assert len(report["encountered_defeaters"]) > 0
    assert report["factive_status"] == "Strictly_False"

    # The calculated score in the simulation code is based on [0.95, 0.90, 0.85]
    # (0.2*0.95) + (0.4*0.90) + (0.4*0.85) = 0.19 + 0.36 + 0.34 = 0.89
    assert abs(report["understanding_score"] - 0.89) < 1e-5
