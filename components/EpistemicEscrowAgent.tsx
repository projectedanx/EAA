import React, { useState } from 'react';
import { EscrowedScar } from '../types';
import Card from './Card';
import Modal from './Modal';
import Tooltip from './Tooltip';
import ShieldIcon from './icons/ShieldIcon';

const initialScars: EscrowedScar[] = [
  {
    id: 'scar-escrow-001',
    timestamp: new Date().toISOString(),
    conflictingParameters: ['Maximally readable code', 'Maximally performant code'],
    expectedOutput: 'Function to calculate prime numbers',
    aestheticTensionScore: 0.85,
    status: 'Escrowed',
  }
];

const EpistemicEscrowAgent: React.FC = () => {
  const [scars, setScars] = useState<EscrowedScar[]>(initialScars);
  const [paramA, setParamA] = useState('');
  const [paramB, setParamB] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [selectedScar, setSelectedScar] = useState<EscrowedScar | null>(null);

  const handleSimulateCollapse = () => {
    if (!paramA || !paramB) return;

    const newScar: EscrowedScar = {
      id: `scar-escrow-${Date.now()}`,
      timestamp: new Date().toISOString(),
      conflictingParameters: [paramA, paramB],
      expectedOutput: expectedOutput || 'Unspecified',
      aestheticTensionScore: Math.random() * 0.5 + 0.5,
      status: 'Escrowed',
    };

    setScars([newScar, ...scars]);
    setParamA('');
    setParamB('');
    setExpectedOutput('');
  };

  const applyDebridement = (scarId: string, resolution: 'Debrided' | 'Memorialized') => {
    setScars(scars.map(scar =>
      scar.id === scarId ? { ...scar, status: resolution } : scar
    ));
    setSelectedScar(null);
  };

  return (
    <div className="space-y-6" data-testid="epistemic-escrow-agent">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ShieldIcon className="mr-3 h-6 w-6 text-cyan-400" />
            Epistemic Escrow Agent
          </h2>
          <p className="text-slate-400 mt-1">
            Detect and quarantine mutually exclusive instructions to prevent Resolution Collapse.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Input Contradictory Constraints">
           <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Constraint A</label>
              <input
                data-testid="input-constraint-a"
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={paramA}
                onChange={(e) => setParamA(e.target.value)}
                placeholder="e.g., Strict type safety"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Constraint B</label>
              <input
                data-testid="input-constraint-b"
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={paramB}
                onChange={(e) => setParamB(e.target.value)}
                placeholder="e.g., Flexible generic inputs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Expected Output Context</label>
              <input
                data-testid="input-expected-output"
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                placeholder="e.g., API request handler"
              />
            </div>
            <button
              data-testid="btn-simulate-collapse"
              onClick={handleSimulateCollapse}
              disabled={!paramA || !paramB}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              Simulate Resolution Collapse & Escrow
            </button>
          </div>
        </Card>

        <Card title="Escrowed Scars Dashboard">
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2" data-testid="escrow-dashboard">
            {scars.map((scar) => (
              <div
                key={scar.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  scar.status === 'Escrowed' ? 'bg-slate-800 border-amber-500/50 hover:border-amber-400' :
                  scar.status === 'Debrided' ? 'bg-slate-800/50 border-emerald-500/30' :
                  'bg-slate-800/50 border-purple-500/30'
                }`}
                onClick={() => setSelectedScar(scar)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-mono text-cyan-400">{scar.id}</div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    scar.status === 'Escrowed' ? 'bg-amber-500/20 text-amber-300' :
                    scar.status === 'Debrided' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {scar.status}
                  </span>
                </div>
                <div className="text-sm text-slate-300 mb-2">
                  <span className="font-semibold">Tension:</span> {scar.conflictingParameters.join(' vs. ')}
                </div>
                <div className="text-xs text-slate-500 flex justify-between items-center">
                  <span>Score: {scar.aestheticTensionScore.toFixed(2)}</span>
                  <span>{new Date(scar.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {scars.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                No scars in escrow.
              </div>
            )}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={!!selectedScar}
        onClose={() => setSelectedScar(null)}
        title="Scar Debridement Protocol"
      >
        {selectedScar && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-4 rounded-lg space-y-3">
              <div>
                <span className="text-slate-400 text-sm block">ID</span>
                <span className="font-mono text-cyan-400">{selectedScar.id}</span>
              </div>
              <div>
                 <span className="text-slate-400 text-sm block">Conflicting Parameters</span>
                 <ul className="list-disc list-inside text-white">
                   {selectedScar.conflictingParameters.map((p, i) => <li key={i}>{p}</li>)}
                 </ul>
              </div>
              <div>
                <span className="text-slate-400 text-sm block">Expected Output</span>
                <span className="text-white">{selectedScar.expectedOutput}</span>
              </div>
               <div>
                <span className="text-slate-400 text-sm block">Aesthetic Tension Score</span>
                <span className="text-white font-mono">{selectedScar.aestheticTensionScore.toFixed(3)}</span>
              </div>
            </div>

            {selectedScar.status === 'Escrowed' ? (
              <div className="flex space-x-4">
                <button
                  data-testid="btn-debride"
                  onClick={() => applyDebridement(selectedScar.id, 'Debrided')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md transition-colors"
                >
                  Apply Debridement (Resolve)
                </button>
                <button
                  data-testid="btn-memorialize"
                  onClick={() => applyDebridement(selectedScar.id, 'Memorialized')}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors"
                >
                  Memorialize (Design Feature)
                </button>
              </div>
            ) : (
              <div className="text-center text-slate-400 p-4 border border-slate-700 rounded-lg">
                This scar has been processed ({selectedScar.status}).
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EpistemicEscrowAgent;
