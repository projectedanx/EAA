import React, { useState } from 'react';
import Card from './Card';
import NetworkIcon from './icons/NetworkIcon';
import ShieldIcon from './icons/ShieldIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

const calculateAestheticTension = (aiLogicDensity: number, humanConsensusVector: number): number => {
    // Simulate topological divergence as described in docs
    const baseTension = Math.sqrt((aiLogicDensity ** 2) + (humanConsensusVector ** 2));
    return Math.min(1.0, baseTension * 0.9); // Scale to ensure it can hit > 0.85
};

const SymbolicScarTwinningEngine: React.FC = () => {
    const [aiLogicDensity, setAiLogicDensity] = useState<number>(0.95);
    const [humanConsensusVector, setHumanConsensusVector] = useState<number>(0.20);
    const [twinningLogged, setTwinningLogged] = useState<boolean>(false);

    const tension = calculateAestheticTension(aiLogicDensity, humanConsensusVector);
    const isCritical = tension > 0.85;

    let concessionWeight = 0;
    let stabilizedTension = tension;

    if (isCritical) {
        concessionWeight = (tension - 0.85) * 1.618;
        stabilizedTension = Math.max(0.85, tension - concessionWeight);
    }

    const handleApplyTwinning = () => {
        if (isCritical) {
            setTwinningLogged(true);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
                <NetworkIcon className="mr-3 h-8 w-8 text-cyan-400" />
                Symbolic Scar Twinning Engine (Martensite Stabilizer)
            </h2>
            <p className="text-slate-400 max-w-3xl">
                An automated stabilization system. When the "Aesthetic Tension" of a proposed solution reaches critical levels (&gt;0.85), this engine enforces "Self-Accommodating Twinning" (injecting nuance or concessions) to prevent legitimacy collapse.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Input Vectors">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                AI Logic Density (0.0 to 1.0)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={aiLogicDensity}
                                onChange={(e) => setAiLogicDensity(parseFloat(e.target.value) || 0)}
                                data-testid="ai-logic-density"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Human Consensus Vector (0.0 to 1.0)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={humanConsensusVector}
                                onChange={(e) => setHumanConsensusVector(parseFloat(e.target.value) || 0)}
                                data-testid="human-consensus-vector"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>
                </Card>

                <Card title="Stabilization Analysis">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                            <span className="text-sm text-slate-400">Aesthetic Tension (AT)</span>
                            <span data-testid="aesthetic-tension" className={`text-sm font-mono ${isCritical ? 'text-red-400' : 'text-green-400'}`}>
                                {tension.toFixed(4)}
                            </span>
                        </div>

                        {isCritical ? (
                            <>
                                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                    <span className="text-sm text-slate-400">Concession Weight</span>
                                    <span data-testid="concession-weight" className="text-sm font-mono text-amber-400">
                                        {concessionWeight.toFixed(4)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-sm text-slate-400">Stabilized Tension</span>
                                    <span data-testid="stabilized-tension" className="text-sm font-mono text-green-400">
                                        {stabilizedTension.toFixed(4)}
                                    </span>
                                </div>

                                <div className="bg-red-900/30 border border-red-500/50 p-3 rounded flex flex-col items-start space-y-3">
                                    <div className="flex items-start">
                                        <AlertTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5 mr-2" />
                                        <div className="text-xs text-red-300">
                                            <strong>Critical Aesthetic Tension Detected.</strong> The divergence between raw logic and social consensus is too high. Twinning required to prevent legitimacy collapse.
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleApplyTwinning}
                                        data-testid="apply-twinning-btn"
                                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-md transition"
                                    >
                                        Apply Twinning & Log Scar
                                    </button>
                                </div>

                                {twinningLogged && (
                                    <div data-testid="twinning-success-msg" className="bg-green-900/30 border border-green-500/50 p-3 rounded flex items-start mt-2">
                                        <ShieldIcon className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5 mr-2" />
                                        <div className="text-xs text-green-300">
                                            <strong>Twinning Applied.</strong> Concessions injected, logic softened, and Symbolic Scar logged to manager.
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-green-900/30 border border-green-500/50 p-3 rounded flex items-start">
                                <ShieldIcon className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5 mr-2" />
                                <div className="text-xs text-green-300">
                                    <strong>Stable State.</strong> Aesthetic tension is within acceptable bounds (&le;0.85). No twinning required.
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SymbolicScarTwinningEngine;
