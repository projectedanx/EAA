"""
JSON schemas (tool registry) and the Linguistic Scaffold for the Dual-Helix Harness.
"""
import json

TOOL_REGISTRY_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Dual-Helix Tool Registry",
    "type": "object",
    "properties": {
        "tools": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "description": {"type": "string"},
                    "parameters": {"type": "object"}
                },
                "required": ["name", "description", "parameters"]
            }
        }
    }
}

LINGUISTIC_SCAFFOLD_TEMPLATE = {
    "api_contract": {
        "inputs": {},
        "outputs": {},
        "invariants": []
    },
    "style_guide_adherence": True,
    "cognitive_contract": "Strict adherence to GEMINI.md guidelines."
}
