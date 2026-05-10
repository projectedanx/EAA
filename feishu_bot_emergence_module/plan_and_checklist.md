# [FRONTMATTER]
Topic: Feishu Bot Emergence Checklist
Author: KIRA-7 / Axiom
Phase: THINK | WRITE
---

# KIRA-7 Implementation Plan and Checklist

This checklist guarantees a rigorous, zero-entropy execution of the Feishu bot integrations, enforcing the SCAR registry invariants and the Petzold Loop structure.

## Phase 1: Contextual Grounding & Requirement Gate
- [ ] **Rule 4 Gate Verification:** Has the explicit event trigger, required permission scopes, app type, and deployment environment been confirmed? (If NO: STOP. Output Requirements Capture form).
- [ ] **SCAR Registry Load:** Have SCAR-001 through SCAR-007 been explicitly reviewed against the current integration goal?
- [ ] **Scope Declaration Block:** Is the exact list of required Feishu Developer Console scopes documented?

## Phase 2: Webhook Sovereignty (Zero-Trust Ingress)
- [ ] **SCAR-002 Compliance:** Does the ingress route immediately detect and echo the `url_verification` challenge payload?
- [ ] **SCAR-003 Compliance:** Is AES-256-CBC decryption implemented *before* attempting to parse the full payload as JSON?
- [ ] **SCAR-004 Compliance:** Is the `X-Lark-Signature` verified using `SHA256(timestamp + nonce + encrypt_key + raw_body)`? (Must use raw string/buffer, not parsed JSON).
- [ ] **Replay Attack Prevention:** Is timestamp freshness verified (rejecting requests where `|now - ts| > 300` seconds)?
- [ ] **Synchronous ACK / Asynchronous Dispatch:** Does the endpoint return a 200 OK immediately after verification, pushing the actual workload to a background task or message queue?

## Phase 3: Token Primacy (SagaRecovery)
- [ ] **SCAR-001 Compliance:** Is a robust token caching mechanism (e.g., Redis, in-memory Map) implemented?
- [ ] **TTL Safety Margin:** Is the cache TTL set to at least 100 seconds *less* than the actual 7200-second expiration (e.g., 6900s or 7000s)?
- [ ] **Locking Mechanism:** In multi-threaded or multi-instance environments, is a mutex or distributed lock used to prevent token refresh stampedes?

## Phase 4: Schema-Bounded Execution (DCCDSchemaGuard)
- [ ] **SCAR-005 Compliance:** Are all Feishu Adaptive Message Cards structurally wrapped in `msg_type: "interactive"`?
- [ ] **DCCDSchemaGuard Application:** Has the card structure passed through a strict Draft-Conditioned Constrained Decoding pass to verify `Feishu_Card_JSON_v2` compliance before output?
- [ ] **Null Value Handling:** Are all explicitly `null` or `undefined` properties stripped before serialization to prevent API 400 Bad Request errors?

## Phase 5: Chain-of-Code Validation
- [ ] **Simulation Execution:** Has the `feishu_ingress_sim.py` simulation been executed locally to mathematically prove the ingress sovereignty without timeout compromises?
- [ ] **Test Coverage:** Are all critical paths (verification failure, valid event dispatch, token refresh) covered by the appropriate test runner (`vitest`) without DOM resolution errors?

## Phase 6: Petzold Loop Transition
- [ ] **THINK Phase Completed:** High-entropy reasoning and constraint mapping finished.
- [ ] **WRITE Phase Completed:** Architecture drafted.
- [ ] **CODE Phase Engaged:** Personality suspended. Sterile, PEP-8/ESLint compliant code generated.
- [ ] **IMMUNE REVIEW Completed:** Output verified against SCAR Registry.
