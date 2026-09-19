import sys
from dataclasses import dataclass
from enum import Flag, auto
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

class Rules(Flag):
    NONE = 0
    BLOCK_WRITE_SYS = auto()
    BLOCK_EXEC_GIT = auto()
    BLOCK_NET_OUT = auto()

class Labels(Flag):
    NONE = 0
    FS_READ = auto()
    DB_SENSITIVE = auto()
    NET_TAINT = auto()

@dataclass
class PolicyDomain:
    domain_id: int
    parent_domain_id: int
    inherited_rules: Rules
    inherited_labels: Labels
    local_rules: Rules
    active_labels: Labels

class ActPlaneSimulator:
    def __init__(self):
        self.domain_registry = {}
        self.pid_domain_map = {}

    def register_domain(self, domain: PolicyDomain):
        self.domain_registry[domain.domain_id] = domain
        logging.info(f"Registered Domain {domain.domain_id} (Parent: {domain.parent_domain_id})")

    def bind_pid_to_domain(self, pid: int, domain_id: int):
        if domain_id in self.domain_registry:
            self.pid_domain_map[pid] = domain_id
            logging.info(f"Bound PID {pid} to Domain {domain_id}")
        else:
            logging.error(f"Cannot bind PID {pid} to unknown Domain {domain_id}")

    def hook_syscall(self, pid: int, operation: str, target: str):
        domain_id = self.pid_domain_map.get(pid)
        if domain_id is None:
            logging.warning(f"Unmonitored process space for PID {pid}")
            return 0  # Allowed

        domain = self.domain_registry[domain_id]
        active_rules = domain.inherited_rules | domain.local_rules

        # Simulate monotonic label accumulation (IFC)
        if operation == "read":
            if "sensitive" in target:
                domain.active_labels |= Labels.DB_SENSITIVE
                logging.info(f"PID {pid} acquired DB_SENSITIVE label from {target}")
            elif "/usr/bin" in target or "/etc" in target:
                domain.active_labels |= Labels.FS_READ
                logging.info(f"PID {pid} acquired FS_READ label from {target}")

        # Simulate LSM Hooks
        if operation == "write":
            if "/usr/bin" in target and Rules.BLOCK_WRITE_SYS in active_rules:
                logging.error(f"ActPlane Domain Intercept: Blocked write by PID {pid} to {target} (EPERM)")
                return -1 # EPERM

        if operation == "execute":
            if "git" in target and Rules.BLOCK_EXEC_GIT in active_rules:
                logging.error(f"ActPlane Domain Intercept: Blocked exec by PID {pid} of {target} (EPERM)")
                return -1

        if operation == "connect":
            if Rules.BLOCK_NET_OUT in active_rules and (domain.active_labels & Labels.DB_SENSITIVE):
                logging.error(f"ActPlane Domain Intercept: Blocked outbound network by PID {pid} due to DB_SENSITIVE taint (EPERM)")
                return -1

        logging.info(f"Syscall Allowed: PID {pid} {operation} {target}")
        return 0

    def submit_runtime_delta(self, pid: int, new_local_rules: Rules):
        """ Simulates Authority Checker for runtime deltas """
        domain_id = self.pid_domain_map.get(pid)
        if domain_id is None:
            return False

        domain = self.domain_registry[domain_id]

        # In a real system, the Authority checker verifies that new rules don't mask inherited rules.
        # Here we just apply them for the simulation.
        logging.info(f"PID {pid} in Domain {domain_id} submitting runtime delta: {new_local_rules}")
        domain.local_rules |= new_local_rules
        return True

    def clear_labels(self, pid: int):
        """Simulates a failed declassification attempt"""
        domain_id = self.pid_domain_map.get(pid)
        if domain_id is None:
             return False

        domain = self.domain_registry[domain_id]

        # Child lacks privilege to clear inherited labels, they just fail silently
        logging.warning(f"PID {pid} attempted to declassify labels. Silently failing due to privilege scoping.")
        # We purposely do not clear active_labels here to simulate the silent failure

def main():
    sim = ActPlaneSimulator()

    # Step 1: Initialization
    root_domain = PolicyDomain(
        domain_id=0,
        parent_domain_id=0,
        inherited_rules=Rules.BLOCK_WRITE_SYS | Rules.BLOCK_EXEC_GIT,
        inherited_labels=Labels.NONE,
        local_rules=Rules.NONE,
        active_labels=Labels.NONE
    )
    sim.register_domain(root_domain)

    # Step 2: Agent Starts
    child_domain = PolicyDomain(
        domain_id=1,
        parent_domain_id=0,
        inherited_rules=root_domain.inherited_rules,
        inherited_labels=root_domain.inherited_labels,
        local_rules=Rules.NONE,
        active_labels=Labels.NONE
    )
    sim.register_domain(child_domain)

    agent_pid = 2048
    sim.bind_pid_to_domain(agent_pid, child_domain.domain_id)

    print("\n--- Testing ActPlane Hooks ---")

    # Step 3: Blocked Write (Rule violation)
    sim.hook_syscall(agent_pid, "write", "/usr/bin/python")

    # Step 4: Add runtime rule
    sim.submit_runtime_delta(agent_pid, Rules.BLOCK_NET_OUT)

    # Step 5: Acquire taint via read
    sim.hook_syscall(agent_pid, "read", "/workspace/db_sensitive.env")

    # Step 6: Blocked network due to taint
    sim.hook_syscall(agent_pid, "connect", "tcp://evil.com:80")

    # Step 7: Attempt declassification (fails)
    sim.clear_labels(agent_pid)

    # Step 8: Network still blocked after attempted declassification
    sim.hook_syscall(agent_pid, "connect", "tcp://evil.com:80")

    # Step 9: Allowed operation
    sim.hook_syscall(agent_pid, "write", "/workspace/tmp/log.txt")

if __name__ == "__main__":
    main()
