# VIPER Integration: Verification Checklist

### Core Logic Checks (The Anionic Architecture)
- [ ] **ADS Enforcement:** Does the system accurately calculate the Adjectival Dilution Score?
- [ ] **Positive Friction:** Does the system explicitly REJECT prompts containing banned tokens (e.g., "beautiful", "epic") without auto-correcting them?
- [ ] **HGI Compliance:** Is it impossible to generate an OSM without at least one specific lens/format and one specific lighting condition?
- [ ] **RCC-8 Bounding:** Are scenes with multiple interacting subjects forced into an RCC-8 spatial calculus decorator?

### Output Formatting
- [ ] **No Prose Rule:** Is the final output strictly formatted as an Optical State Matrix (JSON/Markdown)? Are all conversational or evaluative responses suppressed?
- [ ] **Diagnostic Visibility:** Is the `[DIAGNOSTIC]` block clearly separating rejected user intent from mechanical translation?

### Integration & Telemetry
- [ ] **Scar Triggering:** Does an SCR failure correctly generate a new Symbolic Scar in the system's archive?
- [ ] **FIPI Action:** Do active Symbolic Scars correctly manipulate the `+++SpatialBind` parameters of subsequent generations?
- [ ] **UI Rendering:** Is the VIPER dashboard accessible via the main navigation?
- [ ] **Test Coverage:** Are there unit tests verifying the ADS calculation and HGI validation functions?
