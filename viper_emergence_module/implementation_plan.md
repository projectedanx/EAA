# VIPER Integration: Implementation Plan

## Phase 1: Core Engine Integration
1.  **Port VIPER Simulation Logic:** Translate the core concepts proven in `viper_osm_sim.py` into the main application. Create a dedicated backend utility (`src/utils/viperEngine.ts`) capable of processing user inputs, applying the Adjectival Bound (calculating ADS), enforcing Hardware Physicality (HGI), and formatting RCC-8 spatial binds.
2.  **Define OSM Interfaces:** Extend `types.ts` to include strict TypeScript interfaces for the Optical State Matrix (OSM), including `HardwareParams`, `SpatialBind`, and the diagnostic metadata.

## Phase 2: UI/UX Component Development
1.  **VIPER Persona Dashboard:** Create a new React view component (`src/components/ViperDashboard.tsx`). This dashboard will be the primary interface for users to submit prompts to the VIPER persona.
2.  **Diagnostic Interception UI:** Implement the "Positive Friction" layer. If a user submits banned aesthetic tokens, the UI must intercept the submission, display the `[DIAGNOSTIC]` block explaining the rejection, and force the user to rewrite the prompt with physical parameters.
3.  **OSM Extrusion View:** Design a read-only component that displays the final generated Optical State Matrix. It must look like technical code/JSON, enforcing the rule that VIPER does not output prose.

## Phase 3: SCOS Telemetry & Scar Integration
1.  **SCOS Metrics Tracking:** Integrate tracking for the rolling 10-generation windows for ADS, HGI, and Spatial Collision Rate (SCR).
2.  **Scar Archivist Connection:** Connect the VIPER Engine to the existing `SymbolicScarManager`. If a specific topological failure (e.g., Occlusion Confusion) is detected, generate a VSA hypervector scar and ensure the VIPER Engine automatically injects `+++SpatialBind` constraints for future generations involving those entities (Failure-Informed Prompt Inversion).

## Phase 4: Mode Switching
1.  **PHOTOGRAPHIC vs ILLUSTRATIVE:** Implement the state toggle for `ILLUSTRATIVE_TOPOLOGY` mode, ensuring hardware parameters adapt to medium-specific constraints (e.g., line weight, ink wash viscosity) while maintaining the ADS ceiling.
