"""
Choreographs the 5 nodes: THINK, WRITE, CODE, EVALUATE, RE-FORGE using LangGraph.
"""
import copy
from typing import Dict, Any, Literal
from langgraph.graph import StateGraph, START, END
from state import HarnessState
from schemas import LINGUISTIC_SCAFFOLD_TEMPLATE

def think_node(state: HarnessState) -> HarnessState:
    """Planner Agent: Analyzes vulnerabilities and drafts plan."""
    print(f"--- [Node: THINK] ---")
    state["vulnerabilities"] = ["Data race condition", "Unbounded recursive depth"]
    state["implementation_plan"] = ["1. Apply locks", "2. Implement depth counter"]
    print(f"Vulnerabilities found: {state['vulnerabilities']}")
    return state

def write_node(state: HarnessState) -> HarnessState:
    """Architect Agent: Translates plan into Linguistic Scaffold."""
    print(f"--- [Node: WRITE] ---")
    state["linguistic_scaffold"] = copy.deepcopy(LINGUISTIC_SCAFFOLD_TEMPLATE)
    state["linguistic_scaffold"]["api_contract"]["invariants"] = ["No data races", "Depth < 10"]
    print("Linguistic Scaffold established.")
    return state

def code_node(state: HarnessState) -> HarnessState:
    """Coder Agent: Synthesizes code adhering to Scaffold and memory."""
    print(f"--- [Node: CODE] ---")
    memories = " | ".join(state.get("episodic_memory", []))
    print(f"Applying Episodic Memories: {memories}")

    current_iter = state.get("current_iteration", 0)
    # Simulate flawed code generation on first iteration
    if current_iter == 0:
        state["synthesized_code"] = "def process(): return depth > 10 # BUG"
    else:
        state["synthesized_code"] = "def process(): return depth < 10 # FIXED"

    print(f"Synthesized Code: {state['synthesized_code']}")
    return state

def evaluate_node(state: HarnessState) -> HarnessState:
    """Sandbox Executor + Critic: Evaluates code. Triggers Reflexion-Helix on fail."""
    print(f"--- [Node: EVALUATE] ---")
    if "BUG" in state["synthesized_code"]:
        print("Evaluation FAILED. Triggering Reflexion-Helix.")
        state["execution_status"] = "failed"
        reflection = "Critique: Depth logic is inverted. Synthesized code checked for depth > 10 instead of depth < 10."
        if "episodic_memory" not in state:
            state["episodic_memory"] = []
        state["episodic_memory"].append(reflection)

        # Increment iteration to simulate the loop
        state["current_iteration"] = state.get("current_iteration", 0) + 1
    else:
        print("Evaluation PASSED. Triggering Voyager-Helix.")
        state["execution_status"] = "passed"
    return state

def re_forge_node(state: HarnessState) -> HarnessState:
    """Skill Library Integration: Compiles clean reusable function block."""
    print(f"--- [Node: RE-FORGE] ---")
    primitive = {
        "id": "SKILL-001",
        "code": state["synthesized_code"],
        "signature": "c2pa-signed-hash-abc123xyz"
    }
    if "skill_library" not in state:
        state["skill_library"] = []
    state["skill_library"].append(primitive)
    print(f"Skill Committed to Library: {primitive}")
    return state

def route_evaluation(state: HarnessState) -> Literal["CODE", "RE-FORGE", "__end__"]:
    """Routes based on execution status."""
    if state["execution_status"] == "passed":
        return "RE-FORGE"
    elif state.get("current_iteration", 0) < 3:
        return "CODE"
    else:
        return END

# Build the LangGraph
builder = StateGraph(HarnessState)

# Add nodes
builder.add_node("THINK", think_node)
builder.add_node("WRITE", write_node)
builder.add_node("CODE", code_node)
builder.add_node("EVALUATE", evaluate_node)
builder.add_node("RE-FORGE", re_forge_node)

# Add edges
builder.add_edge(START, "THINK")
builder.add_edge("THINK", "WRITE")
builder.add_edge("WRITE", "CODE")
builder.add_edge("CODE", "EVALUATE")
builder.add_conditional_edges("EVALUATE", route_evaluation)
builder.add_edge("RE-FORGE", END)

# Compile the graph
dual_helix_app = builder.compile()

if __name__ == "__main__":
    initial_state = {
        "request": "Refactor recursive sorting algorithm.",
        "vulnerabilities": [],
        "implementation_plan": [],
        "linguistic_scaffold": {},
        "synthesized_code": "",
        "execution_status": "pending",
        "episodic_memory": [],
        "skill_library": [],
        "current_iteration": 0
    }

    print("Starting Dual-Helix Harness LangGraph execution...")
    # Typically would be `dual_helix_app.invoke(initial_state)` but this is a structural demo
    final_state = dual_helix_app.invoke(initial_state)
    print("\nExecution Complete.")
