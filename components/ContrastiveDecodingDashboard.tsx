import React, { useState, useEffect } from 'react';
import Card from './Card';
import ActivityIcon from './icons/ActivityIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

const ContrastiveDecodingDashboard: React.FC = () => {
  const [alpha, setAlpha] = useState<number>(0.5);
  const [expertLogProb, setExpertLogProb] = useState<number>(-0.1);
  const [amateurLogProb, setAmateurLogProb] = useState<number>(-1.5);
  const [delta, setDelta] = useState<number>(0);

  // Calculate Delta
  useEffect(() => {
    const newDelta = expertLogProb - (alpha * amateurLogProb);
    setDelta(newDelta);
  }, [alpha, expertLogProb, amateurLogProb]);

  // Simulation controls
  const runSimulationTick = () => {
    // Generate some random noise for the log probs to simulate real-time telemetry
    setExpertLogProb(prev => Math.min(0, prev + (Math.random() - 0.5) * 0.2));
    setAmateurLogProb(prev => Math.min(0, prev + (Math.random() - 0.5) * 0.4));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center">
        <ActivityIcon className="mr-3 h-8 w-8 text-cyan-400" />
        Contrastive Decoding Telemetry
      </h2>
      <p className="text-slate-400 max-w-3xl">
        Real-time visualization of the Contrastive Delta: <code className="text-cyan-300">log(Expert) - α * log(Amateur)</code>.
        Monitor the suppression of "Amateur Impulse" in favor of high-tension, multi-causal probability paths.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Telemetry Dashboard">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Alpha (α) Penalty Factor
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  data-testid="alpha-slider"
                  min="0"
                  max="1"
                  step="0.05"
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span data-testid="alpha-display" className="text-cyan-400 font-mono font-bold w-12">{alpha.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="text-xs text-slate-400 mb-1">Expert log(P)</div>
                <div data-testid="expert-prob" className="text-xl font-mono text-green-400">
                  {expertLogProb.toFixed(3)}
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="text-xs text-slate-400 mb-1">Amateur log(P)</div>
                <div data-testid="amateur-prob" className="text-xl font-mono text-amber-400">
                  {amateurLogProb.toFixed(3)}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-lg text-slate-300 font-semibold">Contrastive Delta</span>
                <span
                  data-testid="contrastive-delta"
                  className={`text-2xl font-mono font-bold ${delta > 0.5 ? 'text-purple-400' : 'text-slate-200'}`}
                >
                  {delta.toFixed(4)}
                </span>
              </div>
              {delta > 0.5 && (
                <div className="mt-2 text-xs text-purple-400 flex items-center">
                  <ActivityIcon className="h-4 w-4 mr-1" />
                  Strong Amateur Suppression Active
                </div>
              )}
            </div>

            <button
                onClick={runSimulationTick}
                data-testid="sim-tick-btn"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors"
            >
                Simulate Telemetry Tick
            </button>
          </div>
        </Card>

        <Card title="Interpretive Context">
          <div className="space-y-4">
             <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-white mb-2">Hickam's Dictum Enforcement</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  By applying an $\alpha$ penalty to the generic/amateur probability distribution, the agent is forced to reject simple (Occam's) solutions in favor of complex, multi-causal pathways.
                </p>
             </div>

             <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30 flex items-start">
                <AlertTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-red-300">Warning: Mode Collapse</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    If $\alpha$ &gt; 0.85, the agent may fall into an Epistemic Mirror Trap, generating highly novel but structurally incoherent outputs. Monitor the Phronesis Index closely.
                  </p>
                </div>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContrastiveDecodingDashboard;
