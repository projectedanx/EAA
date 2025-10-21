import React, { useState, useEffect } from 'react';
import Card from './Card';

/**
 * A component that provides a real-time forecast of the cognitive cost and potential for error for a given query.
 * @returns {React.FC} The rendered component.
 */
const EpistemicBudgetForecaster: React.FC = () => {
    const [query, setQuery] = useState('');
    const [forecast, setForecast] = useState<{ cost: string; friction: string; rationale: string } | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setForecast(null);
            return;
        }

        // Mock forecasting logic
        let cost = 'Low';
        let friction = 'Low';
        let rationale = 'Simple factual recall with low ambiguity.';

        if (query.length > 50 || query.includes('compare') || query.includes('analyze')) {
            cost = 'Medium';
            friction = 'Medium';
            rationale = 'Requires cross-domain analysis and synthesis. Potential for semantic ambiguity.';
        }
        if (query.includes('philosophy') || query.includes('ethical') || query.includes('predict')) {
            cost = 'High';
            friction = 'High';
            rationale = 'Involves abstract reasoning, ethical dilemmas, or speculative analysis. High risk of uncertainty and constraint conflict.';
        }

        setForecast({ cost, friction, rationale });
    }, [query]);

  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Epistemic Budget Forecaster</h2>
        <p className="text-slate-400 max-w-3xl">Predict the cognitive cost and potential for error ("Waste Friction") for an incoming query. This enables proactive co-management of the human-AI cognitive system by identifying costly tasks upfront.</p>
      
        <Card title="Real-time Query Cost Forecast">
            <div className="space-y-4">
                <div>
                    <label htmlFor="query" className="block text-sm font-medium text-slate-300 mb-2">Enter Query:</label>
                    <textarea
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-sm text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                        placeholder="e.g., 'Summarize the impact of quantum computing on cryptography...'"
                    />
                </div>

                <div className="pt-4 mt-4 transition-opacity duration-500 ease-in-out">
                    {forecast ? (
                         <div className="pt-4 border-t border-slate-700">
                            <h4 className="text-lg font-semibold text-white mb-3">Forecast Results:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 p-4 rounded-lg">
                                    <p className="text-sm text-slate-400">Epistemic Budget Cost</p>
                                    <p className="text-2xl font-bold text-white">{forecast.cost}</p>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg">
                                    <p className="text-sm text-slate-400">Waste Friction (Error Potential)</p>
                                    <p className="text-2xl font-bold text-white">{forecast.friction}</p>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg md:col-span-2">
                                    <p className="text-sm text-slate-400">Rationale</p>
                                    <p className="text-md text-slate-200 mt-1">{forecast.rationale}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500 border-t border-slate-700">
                           <p>Start typing to see a real-time forecast.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    </div>
  );
};

export default EpistemicBudgetForecaster;