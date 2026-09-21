# Designing an Autopoietic Self-Healing Ontology Engine using SEPAO

This specification outlines an autopoietic runtime harness modeled after the Self-Evolving Plugin Affordance Ontology (SEPAO) framework, utilizing AST analysis and Failure-Informed Prompt Inversion (F-IPI).

## 1. The Environment Scanner (AST/NLP Parsing)

A background daemon continuously monitors the target environment (e.g., source code directories, API schemas). It parses modifications into Abstract Syntax Trees (ASTs).

When a modification occurs, the scanner calculates an `EnvironmentDelta` representing the structural and semantic changes, comparing the new AST against the cached baseline.

## 2. Semantic Delta Mapping & Drift Measurement

Environmental mutations are mapped into a unified knowledge graph. The **Semantic Drift Delta ($\Delta_{drift}$)** measures the Ontological Conflict between the new environment schema and the agent's current constitution.

Using graph edit distance ($GED$) and node embedding distances (cosine similarity $S_C$), the drift is quantified:

$$ \Delta_{drift} = w_1 \cdot GED(G_{baseline}, G_{new}) + w_2 \cdot \frac{1}{|V|} \sum_{v \in V} (1 - S_C(\vec{e}_{v, baseline}, \vec{e}_{v, new})) $$

If $\Delta_{drift} > \tau_{drift}$, an 'Ontological Conflict' is flagged, indicating that the agent's constraints are out of sync with the environment.

### SEPAO Metadata Structure

```json
{
  "ontology_version": "v3.1.4",
  "drift_metrics": {
    "current_drift_delta": 0.045,
    "conflict_flagged": true,
    "impacted_subgraphs": ["api_auth_module", "db_schema_users"]
  },
  "scar_tissue_mapping": [
    {
      "scar_id": "ST-092",
      "originating_failure": "Test suite failure: unhandled Promise rejection in fetch_user",
      "ast_delta_signature": "FunctionSignatureChange(fetch_user): return type Promise<User> -> Promise<Result<User, Error>>"
    }
  ]
}
```

## 3. Failure-Informed Prompt Inversion (F-IPI)

Upon a test suite or linter failure $F$, the system isolates the AST line-range responsible for the failure. The stack trace and AST delta are compressed into a **Symbolic Scar**.

The F-IPI algorithm generates a mutated constitutional rule $R_{new}$ to prevent recurrence:
1.  **Isolate:** Identify the exact failed assumption.
2.  **Invert:** Generate a rule explicitly forbidding the failed pattern.
3.  **Optimize:** Use a gradient-free evolutionary prompt optimization routine to integrate $R_{new}$ into the master `GEMINI.md` constitution smoothly, minimizing disruption to other rules.

## 4. Metamorphic Invariance Verification

To ensure $R_{new}$ does not introduce 'Scar-Induced Rigidity' (overfitting to the specific failure), the system metamorphic-tests the mutated prompt.

It generates semantically equivalent paraphrases of a standard task $T$ (e.g., $T_1, T_2, T_3$). The agent, operating under the new constitution containing $R_{new}$, must produce functionally identical outcomes for all paraphrases. If outputs diverge significantly, the rule $R_{new}$ is rejected as brittle, and the F-IPI evolutionary loop retries.
