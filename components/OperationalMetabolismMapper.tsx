import React, { useState, useMemo } from 'react';
import Card from './Card';
import ActivityIcon from './icons/ActivityIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import ShieldIcon from './icons/ShieldIcon';

// +++DCCDSchemaGuard
const parseVector = (str: string): number[] => {
  return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
};

const dotProduct = (v1: number[], v2: number[]): number => {
    return v1.reduce((sum, a, i) => sum + a * (v2[i] || 0), 0);
};

const magnitude = (v: number[]): number => {
    return Math.sqrt(v.reduce((sum, a) => sum + a * a, 0));
};


const applyNonLinearScaling = (v: number[]): number[] => {
    return v.map(x => Math.tanh(x));
};

/**
 * Renders the OperationalMetabolismMapper component.

 * @returns {React.ReactElement} The rendered component.
 */
const OperationalMetabolismMapper: React.FC = () => {
  const [vectorAInput, setVectorAInput] = useState<string>('0.9, 0.1, 0.0');
  const [vectorBInput, setVectorBInput] = useState<string>('0.8, 0.2, 0.0');
  const [epsilonInput, setEpsilonInput] = useState<number>(1e-6);

  const vectorA = useMemo(() => parseVector(vectorAInput), [vectorAInput]);
  const vectorB = useMemo(() => parseVector(vectorBInput), [vectorBInput]);

  const isValid = vectorA.length > 0 && vectorA.length === vectorB.length;

  let cosineAlignment = 0;
  let topologicalStrain = 0;
  let metabolicCost = 0;
  let cfdi = 0;
  let betti_1 = 0; // [∇] Paraconsistent Betti Loop Detection

  if (isValid) {
      const scaledA = applyNonLinearScaling(vectorA);
      const scaledB = applyNonLinearScaling(vectorB);

      const normA = magnitude(scaledA);
      const normB = magnitude(scaledB);

      if (normA > 0 && normB > 0) {
          cosineAlignment = dotProduct(scaledA, scaledB) / (normA * normB);
          topologicalStrain = 1.0 - cosineAlignment;
          metabolicCost = Math.pow(topologicalStrain, 2) * 850.0;

          // CFDI calculation with protection against division by zero
          const denominator = Math.max(0.1, cosineAlignment + 1.0);
          cfdi = (topologicalStrain * epsilonInput) / denominator;

          // Paraconsistent Betti Loop detection
          // A loop exists if there is significant strain but no resolution collapse
          betti_1 = (topologicalStrain > 0.1 && cfdi <= 1e-5) ? 1 : 0;
      }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center">
        <ActivityIcon className="mr-3 h-8 w-8 text-cyan-400" />
        Operational Metabolism Mapper
      </h2>
      <p className="text-slate-400 max-w-3xl">
        Map the metabolic cost and topological strain between conflicting operational directives. Humans provide the high-density tacit knowledge, and the AI physically binds them via DE-9IM proxies.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Operational Directives">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Directive A Vector (e.g., Yield focus)
              </label>
              <input
                type="text"
                data-testid="vector-a-input"
                value={vectorAInput}
                onChange={(e) => setVectorAInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Directive B Vector (e.g., Safety focus)
              </label>
              <input
                type="text"
                data-testid="vector-b-input"
                value={vectorBInput}
                onChange={(e) => setVectorBInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Epsilon-Tolerance ($\epsilon$)
              </label>
              <input
                type="number"
                step="any"
                data-testid="epsilon-input"
                value={epsilonInput}
                onChange={(e) => setEpsilonInput(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </Card>

        <Card title="Topological Analysis">
           <div className="space-y-4">
             {!isValid && (
                 <div className="text-red-400 text-sm flex items-center">
                    <AlertTriangleIcon className="h-4 w-4 mr-2" />
                    Vectors must have the same non-zero dimensionality.
                 </div>
             )}
             {isValid && (
                 <>
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                        <span className="text-sm text-slate-400">Cosine Alignment</span>
                        <span data-testid="cosine-alignment" className="text-sm font-mono text-cyan-400">{cosineAlignment.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                        <span className="text-sm text-slate-400">Topological Strain</span>
                        <span data-testid="topological-strain" className="text-sm font-mono text-amber-400">{topologicalStrain.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                        <span className="text-sm text-slate-400">Metabolic Cost</span>
                        <span data-testid="metabolic-cost" className={`text-sm font-mono ${metabolicCost > 500 ? 'text-red-400' : 'text-green-400'}`}>
                            {metabolicCost.toFixed(2)} Joules
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                        <span className="text-sm text-slate-400">CFDI (Confidence-Fidelity Divergence)</span>
                        <span data-testid="cfdi-value" className={`text-sm font-mono ${cfdi > 1e-5 ? 'text-red-400' : 'text-green-400'}`}>
                            {cfdi.toExponential(4)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Betti Loop ($\beta_1$)</span>
                        <span data-testid="betti-value" className={`text-sm font-mono ${betti_1 > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                            {betti_1 > 0 ? '> 0 (Active)' : '0 (Inactive)'}
                        </span>
                    </div>

                    <div className="pt-4">
                        {cfdi > 1e-5 ? (
                            <div className="bg-red-900/30 border border-red-500/50 p-3 rounded flex items-start">
                                <AlertTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5 mr-2" />
                                <div className="text-xs text-red-300">
                                    <strong>Resolution Collapse Detected.</strong> The topological strain exceeds the epsilon boundary, leading to an epistemic fracture.
                                </div>
                            </div>
                        ) : betti_1 > 0 ? (
                            <div className="bg-cyan-900/30 border border-cyan-500/50 p-3 rounded flex items-start">
                                <ShieldIcon className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5 mr-2" />
                                <div className="text-xs text-cyan-300">
                                    <strong>Paraconsistent State Stable.</strong> The contradictory vectors are successfully held in tension without Boolean collapse. Betti Loop ($\beta_1$) active.
                                </div>
                            </div>
                        ) : (
                             <div className="bg-green-900/30 border border-green-500/50 p-3 rounded flex items-start">
                                <ShieldIcon className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5 mr-2" />
                                <div className="text-xs text-green-300">
                                    <strong>Harmonic State.</strong> Vectors are highly aligned. No significant topological strain or tension detected.
                                </div>
                            </div>
                        )}
                    </div>
                 </>
             )}
           </div>
        </Card>
      </div>
    </div>
  );
};

export default OperationalMetabolismMapper;
