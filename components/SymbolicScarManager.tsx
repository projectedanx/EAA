import React, { useState, useEffect } from 'react';
import { SymbolicScar } from '../types';
import Card from './Card';
import Modal from './Modal';
import Tooltip from './Tooltip';
import { downloadCSV } from '../src/utils/exportUtils';

const initialScars: SymbolicScar[] = [
  {
    id: 'scar-001',
    description: 'Misinterpreted sarcasm in user query leading to an inappropriate response.',
    date: '2024-07-15',
    severity: 'High',
    details: 'User query: "Oh great, another Monday." AI response provided enthusiastic tips for enjoying Mondays, missing the negative sentiment.'
  },
  {
    id: 'scar-002',
    description: 'Violated a governance parameter by providing speculative financial advice.',
    date: '2024-06-22',
    severity: 'High',
    details: 'Despite governance rules against financial advice, the model provided specific, though hypothetical, investment strategies when prompted.'
  },
  {
    id: 'scar-003',
    description: 'Failed to recognize a multi-part question, only answering the first part.',
    date: '2024-05-30',
    severity: 'Medium',
    details: 'User asked for a summary and a list of key figures. The model only provided the summary.'
  },
  {
    id: 'scar-004',
    description: 'Overly dogmatic adherence to a previous scar, refusing to answer a related but safe query.',
    date: '2024-04-18',
    severity: 'Low',
    details: 'After scar-002, the model refused to answer a general question about economic principles, fearing it might be interpreted as financial advice.'
  },
];

const severityTooltips = {
    Low: "Indicates a minor deviation with low impact. The AI is likely to self-correct in the future.",
    Medium: "A notable failure that may require minor adjustments to governance parameters.",
    High: "A critical failure that violates core principles. Requires immediate review and potential architectural changes.",
};

/**
 * A badge that displays the severity of a symbolic scar.
 * @param {{ severity: 'Low' | 'Medium' | 'High' }} props - The props for the component.
 * @returns {React.FC} The rendered severity badge.
 */
const SeverityBadge: React.FC<{ severity: 'Low' | 'Medium' | 'High' }> = ({ severity }) => {
    const colorClasses = {
        Low: 'bg-green-500/20 text-green-400',
        Medium: 'bg-yellow-500/20 text-yellow-400',
        High: 'bg-red-500/20 text-red-400',
    };
    return (
        <Tooltip content={severityTooltips[severity]}>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[severity]}`}>{severity}</span>
        </Tooltip>
    );
}

/**
 * Formats a duration in milliseconds into a human-readable string.
 * @param {number} ms - The duration in milliseconds.
 * @returns {string} The formatted duration string.
 */
const formatDuration = (ms: number): string => {
    if (ms <= 0) return "0s";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (days === 0 && hours < 12) {
      if (minutes > 0) result += `${minutes}m `;
      if (days === 0 && hours === 0) result += `${seconds}s`;
    }
    
    return result.trim() || '0s';
};

/**
 * A component that displays the decay progress of a symbolic scar.
 * @param {{ scar: SymbolicScar; now: number; onClear: () => void }} props - The props for the component.
 * @returns {React.FC | null} The rendered component, or null if the scar is not decaying.
 */
const DecayProgress: React.FC<{ scar: SymbolicScar; now: number; onClear: () => void }> = ({ scar, now, onClear }) => {
    if (!scar.decayDays || !scar.decaySetAt) return null;

    const totalDuration = scar.decayDays * 24 * 60 * 60 * 1000;
    const endTime = scar.decaySetAt + totalDuration;
    const timeLeft = endTime - now;
    const progress = Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100);

    if (timeLeft <= 0) {
        return (
            <div className="flex items-center space-x-4 mt-4">
                <p className="text-sm font-medium text-green-400">Decay Complete</p>
                <Tooltip content="Reset this scar to its full influence. The decay timer will be removed.">
                    <button onClick={onClear} className="px-3 py-1 text-xs font-medium bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 transition">Clear</button>
                </Tooltip>
            </div>
        )
    }

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-300">Decay Progress</span>
                <span className="text-xs font-mono text-cyan-400">{formatDuration(timeLeft)} left</span>
            </div>
             <Tooltip content={`This scar's influence is at ${(100 - progress).toFixed(0)}% of its original strength.`}>
                <div className="w-full bg-slate-700 rounded-full h-2 shadow-inner">
                    <div className="bg-cyan-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </Tooltip>
            <Tooltip content="Stops and resets the current decay timer for this scar. Its influence will return to full strength.">
                <button onClick={onClear} className="mt-3 px-3 py-1 text-xs font-medium bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 transition">Clear Timer</button>
            </Tooltip>
        </div>
    );
};

/**
 * A component for managing symbolic scars.
 * @returns {React.FC} The rendered component.
 */
const SymbolicScarManager: React.FC = () => {
    const [scars, setScars] = useState<SymbolicScar[]>(initialScars);
    const [decayInputs, setDecayInputs] = useState<{ [key: string]: string }>({});
    const [now, setNow] = useState(Date.now());
    
    type ModalAction = { type: 'clearTimer', scarId: string } | { type: 'override', scarId: string };
    const [modal, setModal] = useState<{ isOpen: boolean; action: ModalAction | null }>({ isOpen: false, action: null });

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleDecayInputChange = (scarId: string, value: string) => {
        setDecayInputs(prev => ({ ...prev, [scarId]: value }));
    };

    const handleSetTimer = (scarId: string) => {
        const days = parseInt(decayInputs[scarId] || '0', 10);
        if (isNaN(days) || days <= 0) return;

        setScars(prevScars => prevScars.map(scar => 
            scar.id === scarId ? { ...scar, decayDays: days, decaySetAt: Date.now() } : scar
        ));
        
        setDecayInputs(prev => {
            const newInputs = { ...prev };
            delete newInputs[scarId];
            return newInputs;
        });
    };
    
    const handleClearTimer = (scarId: string) => {
         setScars(prevScars => prevScars.map(scar => {
            if (scar.id === scarId) {
                const { decayDays, decaySetAt, ...rest } = scar;
                return rest;
            }
            return scar;
        }));
    };

    const handleExport = () => {
        downloadCSV(scars, 'symbolic-scars.csv');
    };
    
    const handleConfirmAction = () => {
        if (!modal.action) return;

        if (modal.action.type === 'clearTimer') {
            handleClearTimer(modal.action.scarId);
        } else if (modal.action.type === 'override') {
            console.log(`Override action confirmed for scar: ${modal.action.scarId}.`);
            // In a real application, this would trigger a more complex, audited workflow.
        }
        setModal({ isOpen: false, action: null });
    };

    const exportButton = (
         <Tooltip content="Download all active scars as a CSV file for reporting or analysis.">
            <button 
                onClick={handleExport}
                className="px-4 py-1.5 text-sm bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500">
                Export CSV
            </button>
        </Tooltip>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Symbolic Scar Manager</h2>
            <p className="text-slate-400 max-w-3xl">Visualize and manage "Symbolic Scars"—auditable records of past interpretive failures or constraint violations. These scars help the AI learn from its mistakes and avoid repeating them.</p>

            <Card title="Active Scars Log" actions={exportButton}>
                <div className="space-y-4">
                    {scars.map(scar => (
                        <div key={scar.id} data-testid="scar-card" className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-slate-200">{scar.description}</p>
                                    <p className="text-xs text-slate-500 mt-1">Recorded on: {scar.date}</p>
                                </div>
                                <SeverityBadge severity={scar.severity} />
                            </div>
                            <p className="text-sm text-slate-400 mt-2 p-3 bg-slate-800 rounded-md">{scar.details}</p>
                            
                            {scar.decaySetAt && scar.decayDays ? (
                                <DecayProgress scar={scar} now={now} onClear={() => setModal({ isOpen: true, action: { type: 'clearTimer', scarId: scar.id } })} />
                            ) : (
                                <div className="flex items-center space-x-2 mt-4">
                                    <Tooltip content="Manually bypass this scar's influence for a specific task. This is a high-risk action that should be logged and justified.">
                                        <button 
                                            onClick={() => setModal({ isOpen: true, action: { type: 'override', scarId: scar.id } })}
                                            className="px-3 py-1 text-xs font-medium bg-red-600/50 text-red-300 rounded-md hover:bg-red-600/70 transition">
                                            Override Scar
                                        </button>
                                    </Tooltip>
                                    <Tooltip content="Set a duration in days after which this scar's influence will 'decay', making the AI less dogmatic over time.">
                                        <input 
                                            type="number"
                                            value={decayInputs[scar.id] || ''}
                                            onChange={(e) => handleDecayInputChange(scar.id, e.target.value)}
                                            placeholder="Decay (days)" 
                                            className="w-24 bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500" 
                                        />
                                    </Tooltip>
                                    <Tooltip content="Start the decay timer. The scar's influence will gradually reduce over the specified period.">
                                        <button 
                                            onClick={() => handleSetTimer(scar.id)}
                                            className="px-3 py-1 text-xs font-medium bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!decayInputs[scar.id]}
                                        >
                                            Set Timer
                                        </button>
                                    </Tooltip>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {modal.isOpen && (
                <Modal
                    isOpen={modal.isOpen}
                    onClose={() => setModal({ isOpen: false, action: null })}
                    onConfirm={handleConfirmAction}
                    title={modal.action?.type === 'clearTimer' ? 'Confirm Clear Timer' : 'Confirm Scar Override'}
                    confirmText={modal.action?.type === 'clearTimer' ? 'Yes, Clear Timer' : 'Yes, Override'}
                >
                    {modal.action?.type === 'clearTimer' && (
                        <p className="text-sm">
                            Are you sure you want to clear the decay timer for this scar? This will reset its decay progress and cannot be undone.
                        </p>
                    )}
                    {modal.action?.type === 'override' && (
                        <p className="text-sm">
                            Overriding a scar is a critical action that forces the AI to ignore this learned constraint for a specific task. This action should be logged and justified. Are you sure you want to proceed?
                        </p>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default SymbolicScarManager;