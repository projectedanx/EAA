import pytest
from scripts.sepao_ast_fipi_scanner import SEPAOASTScanner

def test_ast_parsing_and_hashing():
    scanner = SEPAOASTScanner()
    code = """
def my_func(a, b):
    return a + b
"""
    hashes = scanner.parse_and_hash_functions(code)
    assert "my_func" in hashes
    assert len(hashes["my_func"]) > 0

def test_calculate_drift():
    scanner = SEPAOASTScanner(drift_threshold=0.4)

    code_v1 = "def f1(): pass\ndef f2(): pass"
    code_v2 = "def f1(): pass\ndef f2(x): pass" # f2 changed signature

    scanner.monitor_environment(code_v1, "test_module")
    result = scanner.monitor_environment(code_v2, "test_module")

    # 2 total functions. 1 changed. Drift = 1/2 = 0.5
    assert result["drift"] == 0.5
    assert result["status"] == "conflict_flagged"

def test_execute_fipi():
    scanner = SEPAOASTScanner()

    trace = "TypeError: unsupported operand type(s) for +: 'int' and 'str'"
    context = "FunctionSignatureChange(calculate_sum)"

    rule = scanner.execute_fipi(trace, context)

    assert "ASSERT" in rule
    assert "FunctionSignatureChange" in rule
    assert len(scanner.scar_registry) == 1
    assert scanner.scar_registry[0]["scar_id"] == "ST-001"
