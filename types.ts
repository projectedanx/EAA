/**
 * @enum {string}
 * @description Defines the different views available in the application.
 */
export enum View {
  /** The view for designing Meta-Product-Requirements Prompts. */
  DESIGNER = 'DESIGNER',
  /** The view for managing Symbolic Scars. */
  SCARS = 'SCARS',
  /** The view for displaying Uncertainty Reports. */
  REPORTS = 'REPORTS',
  HISTORIOGRAPHY = 'HISTORIOGRAPHY',
  /** The view for the Epistemic Budget Forecaster. */
  FORECASTER = 'FORECASTER',
  DISCOVERY = 'DISCOVERY',
  TELEMETRY = 'TELEMETRY',
}

/**
 * @enum {string}
 * @description Defines the different cognitive modes for the AI.
 */
export enum CognitiveMode {
  /** A mode for high-creative drift. */
  CREATIVE = 'High-Creative Drift Mode',
  /** A mode for strict auditing. */
  AUDIT = 'Strict Audit Mode',
  /** A mode for exploratory inference. */
  EXPLORATORY = 'Exploratory Inference Mode',
}

/**
 * @interface SymbolicScar
 * @description Represents a "Symbolic Scar," a record of a past interpretive failure.
 */
export interface SymbolicScar {
  /** The unique identifier for the scar. */
  id: string;
  /** A brief description of the failure. */
  description: string;
  /** The date the scar was recorded. */
  date: string;
  /** The severity of the failure. */
  severity: 'Low' | 'Medium' | 'High';
  /** Detailed information about the failure. */
  details: string;
  /** The number of days after which the scar's influence will decay. */
  decayDays?: number;
  /** The timestamp (in ms) when the decay was set. */
  decaySetAt?: number;
}

/**
 * @interface UncertaintyReport
 * @description Represents a report generated when the AI expresses uncertainty.
 */
export interface UncertaintyReport {
    /** The unique identifier for the report. */
    id:string;
    /** The user query that triggered the uncertainty. */
    query: string;
    /** The level of uncertainty, as a percentage. */
    uncertainty: number;
    /** The reason for the uncertainty. */
    reason: 'Data Scarcity' | 'Semantic Ambiguity' | 'High Computational Cost' | 'Constraint Conflict';
    /** The timestamp of the report. */
    timestamp: string;
}

/**
 * @interface ReasoningStep
 * @description Represents a single step in an AI's reasoning process.
 */
export interface ReasoningStep {
    /** The unique identifier for the reasoning step. */
    id: string;
    /** The title of the reasoning step. */
    title: string;
    /** A description of the reasoning step. */
    description: string;
    /** The type of the reasoning step. */
    type: 'premise' | 'inference' | 'scar-influence' | 'conclusion' | 'flawed-premise';
    /** Any child reasoning steps. */
    children?: ReasoningStep[];
}

/**
 * @interface AgentConfig
 * @description Represents the configuration for an AI agent.
 */
export interface AgentConfig {
  /** The unique identifier for the agent configuration. */
  id: string;
  /** The name of the agent configuration. */
  name: string;
  /** The core mission of the agent. */
  mission: string;
  /** The governance parameters for the agent. */
  governance: string;
  /** The self-optimization goals for the agent. */
  goals: string;
}
