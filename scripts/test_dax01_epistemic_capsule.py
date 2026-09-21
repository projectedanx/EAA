import pytest
import json
from scripts.dax01_epistemic_capsule_sim import DAX01Agent, DCCDSchemaGuard, EpistemicMirrorTrap, SaponificationError

def test_dccd_schema_guard_valid_code():
    guard = DCCDSchemaGuard(ssi_threshold=0.5)
    draft = {
        "code_block": "curl -X GET /api/v1/test",
        "empathy_layer": "Got it."
    }
    assert guard.validate_code_pass(draft) is True

def test_dccd_schema_guard_invalid_code():
    guard = DCCDSchemaGuard(ssi_threshold=0.5)
    draft = {
        "code_block": "This is just text",
        "empathy_layer": "Got it."
    }
    assert guard.validate_code_pass(draft) is False

def test_dccd_schema_guard_extrude_failure():
    guard = DCCDSchemaGuard(ssi_threshold=0.5)
    draft = {
        "code_block": "Just words",
        "empathy_layer": "Got it."
    }
    with pytest.raises(SaponificationError):
        guard.extrude_payload(draft)

def test_dccd_ssi_calculation():
    guard = DCCDSchemaGuard()
    # 5 words prose, 5 words code. SSI = 5/10 = 0.5
    ssi = guard.calculate_ssi("This is short prose.", "curl -X GET /api/v1/test")
    assert ssi == 0.5

def test_petzold_sequence():
    agent = DAX01Agent()
    signal = {
        "endpoint": "/api/v2/auth",
        "mental_model": "token-only auth via header",
        "fsi_score": 0.85,
        "is_user_error": False,
        "cfdi_score": 0.73
    }

    response = agent.petzold_sequence(signal)

    assert response["acknowledgment"] is not None
    assert response["root_cause"] is not None
    assert response["fix"] is not None
    assert response["scar_id"].startswith("VSA_HV_")

    # Check if friction topography is logged
    report_json = agent.topography_mapper.generate_report()
    report = json.loads(report_json)

    assert report["total_friction_events"] == 1
    assert report["critical_nodes"][0]["endpoint"] == "/api/v2/auth"
    assert report["critical_nodes"][0]["cfdi_score"] == 0.73

def test_epistemic_mirror_trap_simulation():
    agent = DAX01Agent()
    # Simulating a signal that might cause an Epistemic Mirror Trap
    signal = {
        "endpoint": "/api/v2/auth",
        "mental_model": "token-only auth via header",
        "fsi_score": 0.95, # high frustration
        "is_user_error": False,
        "cfdi_score": 0.73
    }

    # In our simulation, we manually check this inside petzold_sequence
    # To truly test raising it, we'd need to mock or alter the draft inside the method
    # For now, this is just to ensure it's imported and defined correctly
    assert issubclass(EpistemicMirrorTrap, Exception)
