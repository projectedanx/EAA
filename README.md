# CognitiveOS Core

CognitiveOS Core is a web-based application for auditing and managing the cognitive state of AI agents. It provides a suite of tools for visualizing and managing symbolic scars, uncertainty reports, and computational historiography, as well as for designing and managing Meta-Product-Requirements Prompts (Meta-PRPs).

## Table of Contents

- [System Architecture](#system-architecture)
- [Persona and Agent Overviews](#persona-and-agent-overviews)
- [Bounded Context Setup](#bounded-context-setup)
- [Installation Prerequisites](#installation-prerequisites)
- [Operational Usage](#operational-usage)
- [Testing Protocols](#testing-protocols)
- [Documentation](#documentation)

## System Architecture

CognitiveOS Core leverages a React-based frontend mapping directly to cognitive structures. The repository uses `bun` and `npm` as task runners. Tests are written via Vitest and the project strictly uses `JSDOM` for components testing, mocking out browser features like `URL.createObjectURL`. The system utilizes Paraconsistent logic mapping to handle contradictions. It includes an MCP (Model Context Protocol) server `src/mcp-server/index.ts` to expose cognitive states to external processes or standard toolchains.

## Persona and Agent Overviews

The platform embodies specific systemic persona modes:
- **KORSAKOV**: The strict typist and zero-trust executor of the Model Context Protocol, ensuring valid JSON schema mapping and Structural Error Recovery (SERF).
- **Axiom**: The sovereign syntactician, ensuring Anionic Architecture logic, and rejecting subjective evaluation (e.g. "robust") in favor of rigid consequence-based reasoning (Trigger -> Mechanism -> Observable Consequence).
- **TACTILE_ARCHITECT_DIALECTICIAN_v1**: The Recursive OODA loop synthesizer focusing on multi-causal reasoning (Hickam's Dictum) and Contrastive Decoding to arrive at specific structural outputs.
- **VULCAN**: The Vector-Unified Logical Computing Architect Node. It enforces Domain-Driven Design boundaries and mitigates architectural states.
- **V.I.P.E.R.**: The Visual Intent & Physical Execution Router. A generative inversion engine to enforce strict physicality for output components.

## Bounded Context Setup

Ensure that `npm` or `bun` are correctly installed. Project configuration dictates that `package.json` relies on type `module`. Development features are built using TypeScript and Vite. The codebase adheres to the `DRP-LEXICON-992` cognitive bytecode standard, utilizing its formalized vocabulary.

## Installation Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Bun](https://bun.sh/) (Recommended for faster execution and test running due to local timeouts)

1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd <repository_dir>
   ```

2. Install the dependencies:
   ```sh
   bun install
   ```

## Operational Usage

The repository operates under the persona **DRP-SCOS-PERSONA-METROLOGY-2026-v6.1**, ensuring rigorous adherence to the Prompt Dimensioning & Tolerancing framework.

### Starting the Development Server
   ```sh
   bun run dev
   ```
   Access the application at `http://localhost:3000`.

### Starting the MCP Server
   ```sh
   bun run mcp:build
   bun run mcp:start
   ```

### Application Views

- **Meta-PRP Designer**: For designing and managing Meta-Product-Requirements Prompts (Meta-PRPs).
- **Symbolic Scar Manager**: Manages "Symbolic Scars," which are records of past interpretive failures.
- **Uncertainty Reports**: For viewing reports generated when the AI expresses uncertainty.
- **Computational Historiography**: Traces an AI agent's reasoning pathways over past queries.
- **Epistemic Budget Forecaster**: Forecasts the cognitive cost and potential for error for given queries.
- **Pluriversal Feature Discovery**: Employs topological metrics to discover agentic features.
- **Contrastive Decoding Dashboard**: Traces the difference between heuristic baseline and expert inferences.
- **Operational Metabolism Mapper**: Maps structural velocity of AI agents over time.
- **Symbolic Scar Twinning Engine**: A tool to stabilize highly complex logical structures through the Golden Scar Protocol.
- **Agentic Inversion Engine**: Provides a dashboard to harvest cognitive contradictions.
- **Empirical Documentation Router**: Enforces deterministic codebase structures through Prompt Dimensioning & Tolerancing (PD&T) and calculates the S5-Modal Attention topological derivative between stakeholder constraints.
- **Feishu Bot Emergence Module**: Enforces deterministic API execution and webhook sovereignty via the KIRA-7 persona and SCAR registry.

## Testing Protocols

- **Do NOT use `bun test`**. It causes DOM resolution errors.
- Always use `bun x vitest run` or `npx vitest run` to correctly apply the JSDOM environment for tests.
   ```sh
   bun x vitest run
   ```
- Frontend visual verification can be accomplished by setting up Playwright testing against `http://localhost:3000`.

## Documentation

- [Forward-Thinking Features](./docs/forward-thinking-features.md): Product planning and requirement decomposition for future features.
- [Lessons Learned](./docs/lessons-learned.md): Insights from the product planning phase.
- [LEXICON](./docs/LEXICON.md): Domain glossary and dictionary.
