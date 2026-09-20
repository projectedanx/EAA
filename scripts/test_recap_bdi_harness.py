import pytest
from scripts.recap_bdi_harness import ReCAPNode, BDISolverFilter

def test_recap_node_creation_and_hierarchy():
    root = ReCAPNode(desc="Make a Burger")
    assert root.desc == "Make a Burger"
    assert root.parent is None

    child = ReCAPNode(desc="Grill Patty", parent=root)
    root.add_child(child)

    assert len(root.children_list) == 1
    assert child.parent == root

def test_recap_node_subtasks_and_observations():
    node = ReCAPNode(desc="Prepare Ingredients")
    node.add_subtask("Chop onions")
    node.add_subtask("Slice tomatoes")

    assert len(node.subtask_list) == 2
    assert node.subtask_list[0] == "Chop onions"

    node.add_observation("Onions are chopped successfully.")
    assert len(node.obs_list) == 1
    assert node.obs_list[0] == "Onions are chopped successfully."

def test_recap_backtracking():
    root = ReCAPNode(desc="Root Goal")
    child = ReCAPNode(desc="Sub Goal", parent=root)

    backtracked = child.backtrack_to_parent()
    assert backtracked == root

    root_backtrack = root.backtrack_to_parent()
    assert root_backtrack is None

def test_bdi_solver_filter_valid_intentions():
    safety_constraints = ["Do not use blocked station", "Do not cut without board"]
    solver = BDISolverFilter(safety_constraints=safety_constraints)

    beliefs = {"station_1": "clear", "station_2": "blocked"}
    desires = "Cook soup"
    intentions = ["Move to station_1", "Turn on stove"]

    # Should pass because intentions don't contain the exact constraint strings
    assert solver.verify_intentions(beliefs, desires, intentions) is True

def test_bdi_solver_filter_invalid_intentions():
    safety_constraints = ["blocked station"]
    solver = BDISolverFilter(safety_constraints=safety_constraints)

    beliefs = {"station_2": "blocked"}
    desires = "Use station 2"
    intentions = ["Move to blocked station 2", "Turn on stove"]

    # Should fail because intention contains "blocked station" which matches safety constraint
    assert solver.verify_intentions(beliefs, desires, intentions) is False
