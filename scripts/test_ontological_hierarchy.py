import pytest
from ontological_hierarchy_verifier_sim import OntologyHierarchyVerifier

def test_ontology_hierarchy_init():
    verifier = OntologyHierarchyVerifier()
    assert len(verifier.hierarchy) == 24
    assert verifier.hierarchy["L0"] == "Teleology"
    assert verifier.hierarchy["L11"] == "Autopoietic Evolution"

def test_validate_payload_valid_l0():
    verifier = OntologyHierarchyVerifier()
    payload = {"mythopoeic_alignment": True, "objective": "Ritual"}
    res = verifier.validate_payload("L0", payload)
    assert res["is_valid"] is True
    assert res["layer"] == "L0"
    assert "perfectly aligns" in res["validation_notes"][0]

def test_validate_payload_invalid_l0():
    verifier = OntologyHierarchyVerifier()
    payload = {"objective": "Ritual"}
    res = verifier.validate_payload("L0", payload)
    assert res["is_valid"] is False
    assert "missing mythopoeic_alignment" in res["validation_notes"][0]

def test_validate_payload_valid_l5():
    verifier = OntologyHierarchyVerifier()
    payload = {"execution_team": ["Planner", "Linguist", "Crone"]}
    res = verifier.validate_payload("L5", payload)
    assert res["is_valid"] is True

def test_validate_payload_invalid_layer():
    verifier = OntologyHierarchyVerifier()
    with pytest.raises(ValueError) as excinfo:
        verifier.validate_payload("L99", {})
    assert "Invalid Ontology Layer: L99" in str(excinfo.value)
