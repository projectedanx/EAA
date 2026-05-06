# CognitiveOS Core

CognitiveOS Core is a web-based application for auditing and managing the cognitive state of AI agents. It provides a suite of tools for visualizing and managing symbolic scars, uncertainty reports, and computational historiography, as well as for designing and managing Meta-Product-Requirements Prompts (Meta-PRPs).

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Types](#types)


## Documentation

- [Forward-Thinking Features](./docs/forward-thinking-features.md): Product planning and requirement decomposition for future features.
- [Lessons Learned](./docs/lessons-learned.md): Insights from the product planning phase.

## Features

- **Meta-PRP Designer**: A tool for designing and managing Meta-Product-Requirements Prompts (Meta-PRPs).
- **Symbolic Scar Manager**: A tool for managing "Symbolic Scars," which are records of past interpretive failures.
- **Uncertainty Reports**: A tool for viewing reports generated when the AI expresses uncertainty.
- **Computational Historiography**: A tool for tracing an AI agent's reasoning pathways.
- **Epistemic Budget Forecaster**: A tool for forecasting the cognitive cost and potential for error for a given query.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/cognitive-os-core.git
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

## Usage

Once the development server is running, you can access the application at `http://localhost:3000`.

The application is divided into five main views:

- **Meta-PRP Designer**: This view allows you to design and manage Meta-Product-Requirements Prompts (Meta-PRPs). You can create, rename, and delete profiles, as well as edit the core mission, governance parameters, and self-optimization goals for each profile.
- **Symbolic Scar Manager**: This view allows you to manage "Symbolic Scars," which are records of past interpretive failures. You can view a list of active scars, set decay timers, and override scars.
- **Uncertainty Reports**: This view allows you to view reports generated when the AI expresses uncertainty. You can view a list of recent reports, including the query that triggered the uncertainty, the uncertainty level, the reason for the uncertainty, and the timestamp of the report.
- **Computational Historiography**: This view allows you to trace an AI agent's reasoning pathways. You can view a reasoning trace for the last complex query, including the premise, inferences, scar influences, and conclusion.
- **Epistemic Budget Forecaster**: This view allows you to forecast the cognitive cost and potential for error for a given query. You can enter a query and view the forecasted epistemic budget cost, waste friction, and rationale.

## Components

The application is built using [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/). The following is a list of the main components:

- `App.tsx`: The main application component.
- `Card.tsx`: A reusable card component.
- `ComputationalHistoriography.tsx`: A component that displays the computational historiography view.
- `EpistemicBudgetForecaster.tsx`: A component that provides a real-time forecast of the cognitive cost and potential for error for a given query.
- `Header.tsx`: The header component for the application.
- `MetaPRPDesigner.tsx`: A component for designing and managing Meta-Product-Requirements Prompts (Meta-PRPs).
- `Modal.tsx`: A reusable modal component.
- `Sidebar.tsx`: The sidebar component for the application.
- `SymbolicScarManager.tsx`: A component for managing symbolic scars.
- `Tooltip.tsx`: A reusable tooltip component.
- `UncertaintyReports.tsx`: A component that displays a list of uncertainty reports.

## Types

The application uses the following types:

- `View`: An enum that defines the different views available in the application.
- `CognitiveMode`: An enum that defines the different cognitive modes for the AI.
- `SymbolicScar`: An interface that represents a "Symbolic Scar," a record of a past interpretive failure.
- `UncertaintyReport`: An interface that represents a report generated when the AI expresses uncertainty.
- `ReasoningStep`: An interface that represents a single step in an AI's reasoning process.
- `AgentConfig`: An interface that represents the configuration for an AI agent.

### VULCAN: Bounded Context Topographer
CognitiveOS Core now integrates the **VULCAN persona (Vector-Unified Logical Computing Architect Node)**. VULCAN serves as a Tier-3 sovereign architectural gatekeeper. It evaluates the system's topological intent to enforce strict Domain-Driven Design (DDD) mereological boundaries, proactively mitigating known architectural failure states via Failure-Informed Prompt Inversion (FIPI).
