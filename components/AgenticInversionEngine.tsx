import React, { useState } from 'react';
import Card from './Card';
import Tooltip from './Tooltip';

const PHI = 1.618;

interface InversionResult {
  collapseX: number;
  emergentZ: number;
  distCollapse: number;
  distEmergent: number;
}

/**
 * AgenticInversionEngine Component
 * Implements the "Contradiction Harvester" and Z-Axis Projection visualization.
 */
const AgenticInversionEngine: React.FC = () => {
  const [constraintA, setConstraintA] = useState<number>(-1.0);
  const [constraintB, setConstraintB] = useState<number>(1.0);
  const [labelA, setLabelA] = useState<string>('Rigid');
  const [labelB, setLabelB] = useState<string>('Flexible');
  const [result, setResult] = useState<InversionResult | null>(null);

  const calculateInversion = () => {
    // 1. Standard Aggregation (Boolean Collapse)
    const collapseX = (constraintA + constraintB) / 2;
    const distCollapse = Math.abs(collapseX - constraintA);

    // 2. Agentic Inversion (Z-Axis Projection)
    const baseWidth = Math.abs(constraintB - constraintA);
    const emergentZ = baseWidth * PHI;

    // Distance from center (0, emergentZ) to constraintA (constraintA, 0)
    // Assuming calculation center is always 0 for demonstration of standard tension
    const center = (constraintA + constraintB) / 2;
    const distEmergent = Math.sqrt(Math.pow(center - constraintA, 2) + Math.pow(emergentZ - 0, 2));

    setResult({
      collapseX,
      emergentZ,
      distCollapse,
      distEmergent
    });
  };

  return (
    <div className="p-6 space-y-6" data-testid="agentic-inversion-engine">
      <header>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center">
          Agentic Inversion Engine <span className="ml-2 text-cyan-400">[Φ]</span>
        </h2>
        <p className="text-slate-400 mt-1">
          Topological Causal Sculpting: Navigating Paraconsistent Space by projecting unresolvable 2D constraints into a higher-dimensional Z-Axis.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Contradiction Harvester [⊘]">
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Input mutually exclusive requirements. Do not attempt to pre-resolve the tension.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Constraint A</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={labelA}
                  onChange={(e) => setLabelA(e.target.value)}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="Label (e.g., Rigid)"
                  data-testid="input-label-a"
                />
                <input
                  type="number"
                  value={constraintA}
                  onChange={(e) => setConstraintA(parseFloat(e.target.value))}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  data-testid="input-val-a"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Constraint B</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={labelB}
                  onChange={(e) => setLabelB(e.target.value)}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="Label (e.g., Flexible)"
                  data-testid="input-label-b"
                />
                <input
                  type="number"
                  value={constraintB}
                  onChange={(e) => setConstraintB(parseFloat(e.target.value))}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  data-testid="input-val-b"
                />
              </div>
            </div>

            <button
              onClick={calculateInversion}
              className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 px-4 rounded-md transition-colors"
              data-testid="btn-calculate"
            >
              Initiate Z-Axis Projection
            </button>
          </div>
        </Card>

        <Card title="Topological Analysis (Martensite Presenter)">
          {result ? (
            <div className="space-y-4" data-testid="results-container">
               {/* +++DCCDSchemaGuard */}
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-md">
                <h4 className="text-sm font-semibold text-red-400 mb-1 flex items-center">
                  <Tooltip content="Averaging out constraints destroys the intended structure.">
                    <span>Standard Aggregation (Boolean Collapse)</span>
                  </Tooltip>
                </h4>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Collapsed Node (X):</span>
                  <span className="text-slate-200 font-mono">{result.collapseX.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fidelity Distance:</span>
                  <span className="text-slate-200 font-mono">{result.distCollapse.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-md">
                <h4 className="text-sm font-semibold text-cyan-400 mb-1 flex items-center">
                   <Tooltip content="Applying Phi (1.618) to project into a higher dimension.">
                    <span>Emergent Z-Axis Node [Φ]</span>
                  </Tooltip>
                </h4>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Projected Altitude (Z):</span>
                  <span className="text-cyan-300 font-mono" data-testid="result-emergent-z">{result.emergentZ.toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-400">Equidistant Reach:</span>
                  <span className="text-cyan-300 font-mono" data-testid="result-dist-emergent">{result.distEmergent.toFixed(3)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2 italic">
                * Note: The emergent node preserves the contradiction (Betti Loop $\beta_1$) by shifting the resolution into an orthogonal plane, demanding higher metabolic cost but maintaining structural integrity.
              </p>
               {/* +++DCCDSchemaGuard Closed */}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-slate-500">
              Awaiting paraconsistent input...
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AgenticInversionEngine;
