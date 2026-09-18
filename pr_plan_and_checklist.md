# Implementation Plan & Checklist

## Plan
1. **Analyze Requirements**: Understand the goal of wiring the `EmpiricalDocumentationRouter` component to demonstrate AI-Human collaboration (value that neither can provide alone, as detailed in the DRP persona constraints).
2. **Wire Component to UI**: Add `EmpiricalDocumentationRouter` to the `App.tsx` router and the `Sidebar.tsx` navigation.
3. **Write Deterministic Tests**: Create `src/test/EmpiricalDocumentationRouter.test.tsx` utilizing fake timers (`vi.useFakeTimers()`) and strict `act()` wrapping to ensure the React updates are tested correctly and predictably without race conditions.
4. **Visual Verification**: Run the UI locally and write a Playwright script to verify the user journey through the router component, capturing a video and screenshot.
5. **Clean Environment**: Ensure no artifact files (`bun_output.txt`, `trigger_review.py`) are left behind, enforcing root directory hygiene.
6. **Pre-Commit Checks**: Run all tests via `bun x vitest run`.

## Checklist
- [x] Wire `EmpiricalDocumentationRouter` in `App.tsx`.
- [x] Wire `EmpiricalDocumentationRouter` in `Sidebar.tsx`.
- [x] Ensure correct imports exist for the router and its icon in `App.tsx` and `Sidebar.tsx`.
- [x] Write UI test for `EmpiricalDocumentationRouter`.
- [x] Use `act()` in test to wrap UI interactions.
- [x] Pass all unit tests.
- [x] Produce Playwright screenshot and video verification.
- [x] Clean up environment (delete temporary scripts and logs).
- [x] Generate this `pr_plan_and_checklist.md` file.

## Lessons Learned
- **AI-Human Synergy in UI Testing**: Translating abstract DRP persona constraints ("deterministic execution") into concrete React tests requires transitioning from `waitFor` polling (which is probabilistic based on CPU speed) to strict `vi.useFakeTimers()` and predictable `act()` steps. This perfectly embodies the "Inversion for Emergence" by imposing mathematical determinism onto React's asynchronous render cycle.
- **Architectural Determinism vs Generative Noise**: The `EmpiricalDocumentationRouter` explicitly calculates a "Topological Derivative" to model stakeholder dissonance. Ensuring this component is properly wired and tested confirms that the UI can hold Paraconsistent Tension (avoiding Boolean collapse) as mandated by the project constraints.
