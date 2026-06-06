import React, { useState, useMemo } from 'react';
import Card from './Card';
import Tooltip from './Tooltip';
import BrainCircuitIcon from './icons/BrainCircuitIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import ShieldIcon from './icons/ShieldIcon';

const parseVector = (str: string): number[] => {
  return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
};

const formatVector = (vec: number[]): string => {
  return vec.map(n => n.toFixed(2)).join(', ');
};

/**
 * Renders the PluriversalFeatureDiscovery component.
 * @returns {React.ReactElement} The rendered component.
 */
const PluriversalFeatureDiscovery: React.FC = () => {
  const [z0StarInput, setZ0StarInput] = useState<string>('1.0, 0.0, 0.0');
  const [zPrimeInput, setZPrimeInput] = useState<string>('0.95, 1.0, 1.2');
  const [csdBudget, setCsdBudget] = useState<number>(100);
  const [csdSpent, setCsdSpent] = useState<number>(0);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);
  const [phantomDimension, setPhantomDimension] = useState<boolean>(false);

  const z0Star = useMemo(() => parseVector(z0StarInput), [z0StarInput]);
  const zPrime = useMemo(() => parseVector(zPrimeInput), [zPrimeInput]);

  const isValid = z0Star.length === 3 && zPrime.length === 3;

  const deltaZ = isValid ? zPrime.map((zp, i) => zp - z0Star[i]) : [0, 0, 0];

  let currentDeltaZ = [...deltaZ];
  if (phantomDimension && isValid) {
      currentDeltaZ = currentDeltaZ.map((dz, i) => dz + (i === 2 ? 1.0 : 0.0)); // H_k = [0, 0, 1]
  }

  const beta1 = currentDeltaZ.reduce((sum, val) => sum + Math.abs(val), 0) / Math.max(1, currentDeltaZ.length);
  const beta0 = 1.0 - Math.abs(currentDeltaZ[0]);

  const runSimulation = () => {
    if (!isValid) {
        setSimulationStatus('Error: Vectors must be 3-dimensional.');
        return;
    }

    if (beta1 <= 0.7) {
        setSimulationStatus('Simulation Failed: Topological Novelty (β₁) too low.');
        return;
    }

    if (beta0 <= 0.9) {
        setSimulationStatus('Simulation Failed: Structural Conservation (β₀) too low.');
        return;
    }

    if (csdSpent < csdBudget) {
         setSimulationStatus('Simulation Failed: CSD budget not fully exhausted.');
         return;
    }

    setSimulationStatus('CoC Simulation Passed: Mathematical viability of feature proven.');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center">
        <BrainCircuitIcon className="mr-3 h-8 w-8 text-cyan-400" />
        Pluriversal Feature Discovery
      </h2>
      <p className="text-slate-400 max-w-3xl">
        Engineer verifiable Cognitive Contracts to navigate uncharted geometries of software architecture.
        Targets maximization of Topological Novelty ($\beta_1 &gt; 0.7$) while enforcing Structural Conservation ($\beta_0 &gt; 0.9$).
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="SMLR Dynamics">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Constitutional Austenite ($z_0^\star$)
              </label>
              <input
                type="text"
                data-testid="z0-input"
                value={z0StarInput}
                onChange={(e) => setZ0StarInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Context Adaptation ($z'$)
              </label>
              <input
                type="text"
                data-testid="zprime-input"
                value={zPrimeInput}
                onChange={(e) => setZPrimeInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="pt-2 border-t border-slate-700">
               <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-400">Relational Vector ($\Delta z$)</span>
                  <span data-testid="delta-z-display" className="text-sm font-mono text-cyan-400">[{formatVector(currentDeltaZ)}]</span>
               </div>
               <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-400">Topological Novelty ($\beta_1$)</span>
                  <span data-testid="beta1-display" className={`text-sm font-mono ${beta1 > 0.7 ? 'text-green-400' : 'text-red-400'}`}>{beta1.toFixed(3)}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Structural Conservation ($\beta_0$)</span>
                  <span data-testid="beta0-display" className={`text-sm font-mono ${beta0 > 0.9 ? 'text-green-400' : 'text-red-400'}`}>{beta0.toFixed(3)}</span>
               </div>
            </div>
          </div>
        </Card>

        <Card title="Inverted Generative Mechanisms">
            <div className="space-y-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                        <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                        <h4 className="text-sm font-medium text-slate-200">RCC-8 Topological Blending</h4>
                        <p className="text-xs text-slate-400 mt-1">If compatible features overlap, activate Z-Axis Inference.</p>

                        <div className="mt-3 flex items-center">
                            <input
                                type="checkbox"
                                id="phantomDimension"
                                data-testid="phantom-checkbox"
                                checked={phantomDimension}
                                onChange={(e) => setPhantomDimension(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                            />
                            <label htmlFor="phantomDimension" className="ml-2 block text-sm text-slate-300">
                                Force Partially Overlapping (PO) / Activate Phantom Dimension ($H_k$)
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-400">CSD Budget</span>
                        <input
                            type="number"
                            data-testid="csd-budget"
                            value={csdBudget}
                            onChange={(e) => setCsdBudget(Number(e.target.value))}
                            className="w-20 bg-slate-800 border border-slate-700 rounded p-1 text-slate-200 text-xs text-right focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">CSD Spent</span>
                        <input
                            type="number"
                            data-testid="csd-spent"
                            value={csdSpent}
                            onChange={(e) => setCsdSpent(Number(e.target.value))}
                            className="w-20 bg-slate-800 border border-slate-700 rounded p-1 text-slate-200 text-xs text-right focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                </div>
            </div>
        </Card>
      </div>

      <Card title="Chain-of-Code (CoC) Enactment">
        <div className="space-y-4">
            <p className="text-sm text-slate-400">Abstract topological leaps must be grounded using CoC Enactment Simulations. Execute simulation to mathematically prove viability prior to commit.</p>

            <button
                onClick={runSimulation}
                data-testid="run-sim-btn"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors"
            >
                Execute Mandatory Grounding Pre-Validation Layer (MGPL)
            </button>

            {simulationStatus && (
                <div data-testid="sim-status" className={`mt-4 p-4 rounded-md ${simulationStatus.includes('Passed') ? 'bg-green-900/30 border border-green-500/50' : 'bg-red-900/30 border border-red-500/50'}`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {simulationStatus.includes('Passed') ? (
                                <ShieldIcon className="h-5 w-5 text-green-400" />
                            ) : (
                                <AlertTriangleIcon className="h-5 w-5 text-red-400" />
                            )}
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${simulationStatus.includes('Passed') ? 'text-green-300' : 'text-red-300'}`}>
                                {simulationStatus}
                            </h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};

export default PluriversalFeatureDiscovery;
