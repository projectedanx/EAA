import math
import json
from dataclasses import dataclass
from typing import List, Dict, Set, Optional

# VULCAN Chain-of-Code Simulation: Mereological Mandate & Shared Database Anathema
# +++DCCDSchemaGuard(schema=C4_Model_ADR_JSON, enforcement="draft_conditioned")

@dataclass
class Microservice:
    name: str
    bounded_context: str
    databases: Set[str]
    allowed_egress: Set[str]

@dataclass
class EvaluationResult:
    is_valid: bool
    betti_1_loops: int
    cfdi_score: float
    violations: List[str]
    scar_triggers: List[str]

class VulcanTopologicalSculptor:
    def __init__(self):
        # VULCAN's active Symbolic Scar Archive (STA)
        self.sta = {
            "SCAR-001": "Distributed Monolith",
            "SCAR-002": "Shared Database",
            "SCAR-003": "Nano-Service Hell"
        }
        self.cfd_threshold = 0.15

    def evaluate_architecture(self, services: List[Microservice]) -> EvaluationResult:
        violations = []
        scar_triggers = []
        cfdi_score = 0.0

        # 1. The Mereological Mandate Check
        # A microservice in context A cannot directly call a microservice in context B
        # without explicit asynchronous event routing (simplified here as blocked direct egress across contexts)
        for svc in services:
            for target_svc_name in svc.allowed_egress:
                target_svc = next((s for s in services if s.name == target_svc_name), None)
                if target_svc and target_svc.bounded_context != svc.bounded_context:
                    violations.append(f"Mereological Violation: {svc.name} ({svc.bounded_context}) directly calls {target_svc.name} ({target_svc.bounded_context}).")
                    cfdi_score += 0.08
                    scar_triggers.append("SCAR-001")

        # 2. The Shared Database Anathema
        # Two distinct bounded contexts cannot write to the same database.
        db_access_map: Dict[str, Set[str]] = {}
        for svc in services:
            for db in svc.databases:
                if db not in db_access_map:
                    db_access_map[db] = set()
                db_access_map[db].add(svc.bounded_context)

        for db, contexts in db_access_map.items():
            if len(contexts) > 1:
                violations.append(f"Shared Database Anathema: DB '{db}' is shared by contexts {contexts}")
                cfdi_score += 0.20 # Spikes CFDI past threshold
                scar_triggers.append("SCAR-002")

        # Calculate Betti-1 loops (topological strain) - simplified
        # If there are shared DBs across contexts, that creates an invalid topological loop.
        betti_1_loops = len([db for db, contexts in db_access_map.items() if len(contexts) > 1])

        is_valid = len(violations) == 0 and cfdi_score < self.cfd_threshold

        return EvaluationResult(
            is_valid=is_valid,
            betti_1_loops=betti_1_loops,
            cfdi_score=round(cfdi_score, 3),
            violations=violations,
            scar_triggers=list(set(scar_triggers))
        )

def run_simulation():
    print("+++ContextLock(anchor=\"DDD_BOUNDARIES_AND_TRADE_OFFS\", refresh_interval=2048)")
    print("Initiating VULCAN Topological Causal Sculpting...\n")

    vulcan = VulcanTopologicalSculptor()

    # Scenario 1: Flawed Architecture (Shared DB and direct cross-context calls)
    print("--- Evaluating Scenario 1: The Mudball ---")
    flawed_services = [
        Microservice("OrderService", "Orders", {"commerce_db"}, {"InventoryService"}),
        Microservice("InventoryService", "Inventory", {"commerce_db"}, set())
    ]
    res1 = vulcan.evaluate_architecture(flawed_services)
    print(json.dumps(res1.__dict__, indent=2))
    print(f"Halt on Divergence (CFDI > {vulcan.cfd_threshold}): {res1.cfdi_score >= vulcan.cfd_threshold}\n")


    # Scenario 2: Correct Architecture (Isolated DBs, no direct synchronous cross-context calls)
    print("--- Evaluating Scenario 2: Strict DDD Isolation ---")
    correct_services = [
        Microservice("OrderService", "Orders", {"orders_db"}, set()),
        Microservice("InventoryService", "Inventory", {"inventory_db"}, set())
    ]
    res2 = vulcan.evaluate_architecture(correct_services)
    print(json.dumps(res2.__dict__, indent=2))
    print(f"Halt on Divergence (CFDI > {vulcan.cfd_threshold}): {res2.cfdi_score >= vulcan.cfd_threshold}\n")

if __name__ == "__main__":
    run_simulation()
