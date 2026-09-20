import pytest
from .chrono_topological_tracking_sim import ChronoTopologicalTracker

def test_chrono_tracker_initialization():
    tracker = ChronoTopologicalTracker()
    assert tracker.b0_components == 1
    assert tracker.b1_loops == 0
    assert len(tracker.timeline_data) == 0

def test_detect_semantic_fragmentation():
    tracker = ChronoTopologicalTracker()
    tracker.ingest_canvas_state(nodes=25, edges=20, disjoint_clusters=4, conflicting_edges=0)

    assert tracker.b0_components == 4
    assert tracker.detect_interpretive_fracture() is True

def test_detect_logical_contradiction():
    tracker = ChronoTopologicalTracker()
    tracker.ingest_canvas_state(nodes=10, edges=9, disjoint_clusters=1, conflicting_edges=1)

    assert tracker.b1_loops == 1
    assert tracker.detect_interpretive_fracture() is True

def test_healthy_canvas():
    tracker = ChronoTopologicalTracker()
    tracker.ingest_canvas_state(nodes=15, edges=14, disjoint_clusters=1, conflicting_edges=0)

    assert tracker.detect_interpretive_fracture() is False
