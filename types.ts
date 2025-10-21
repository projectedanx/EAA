export enum View {
  DESIGNER = 'DESIGNER',
  SCARS = 'SCARS',
  REPORTS = 'REPORTS',
  HISTORIOGRAPHY = 'HISTORIOGRAPHY',
  FORECASTER = 'FORECASTER',
}

export enum CognitiveMode {
  CREATIVE = 'High-Creative Drift Mode',
  AUDIT = 'Strict Audit Mode',
  EXPLORATORY = 'Exploratory Inference Mode',
}

export interface SymbolicScar {
  id: string;
  description: string;
  date: string;
  severity: 'Low' | 'Medium' | 'High';
  details: string;
  decayDays?: number;
  decaySetAt?: number; // unix timestamp in ms
}

export interface UncertaintyReport {
    id:string;
    query: string;
    uncertainty: number;
    reason: 'Data Scarcity' | 'Semantic Ambiguity' | 'High Computational Cost' | 'Constraint Conflict';
    timestamp: string;
}

export interface ReasoningStep {
    id: string;
    title: string;
    description: string;
    type: 'premise' | 'inference' | 'scar-influence' | 'conclusion' | 'flawed-premise';
    children?: ReasoningStep[];
}

export interface AgentConfig {
  id: string;
  name: string;
  mission: string;
  governance: string;
  goals: string;
}
