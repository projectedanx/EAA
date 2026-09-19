from typing import TypedDict, List, Dict, Any, Optional

class HarnessState(TypedDict):
    """
    State definition for the Hybrid Dual-Helix Harness.
    """
    request: str
    vulnerabilities: List[str]
    implementation_plan: List[str]
    linguistic_scaffold: Dict[str, Any]
    synthesized_code: str
    execution_status: str
    episodic_memory: List[str]
    skill_library: List[Dict[str, Any]]
    current_iteration: int
