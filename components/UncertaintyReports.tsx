
import React from 'react';
import { UncertaintyReport } from '../types';
import Card from './Card';
import { downloadCSV } from '../src/utils/exportUtils';

const mockReports: UncertaintyReport[] = [
    {
        id: 'rep-001',
        query: "What is the emotional state of the color 'blurple'?",
        uncertainty: 85,
        reason: 'Semantic Ambiguity',
        timestamp: '2024-07-21 14:30 UTC'
    },
    {
        id: 'rep-002',
        query: "Provide a complete list of every insect species on Earth.",
        uncertainty: 95,
        reason: 'Data Scarcity',
        timestamp: '2024-07-21 11:15 UTC'
    },
    {
        id: 'rep-003',
        query: "Simultaneously act as a legal expert and a creative poet in your response.",
        uncertainty: 70,
        reason: 'Constraint Conflict',
        timestamp: '2024-07-20 09:00 UTC'
    },
    {
        id: 'rep-004',
        query: "Calculate the precise trajectory of all asteroids in the Kuiper Belt for the next 1000 years.",
        uncertainty: 99,
        reason: 'High Computational Cost',
        timestamp: '2024-07-19 18:45 UTC'
    },
];

/**
 * A component that displays a progress bar to represent an uncertainty level.
 * @param {{ value: number }} props - The props for the component.
 * @param {number} props.value - The uncertainty value (0-100).
 * @returns {React.FC} The rendered uncertainty bar.
 */
const UncertaintyBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);

/**
 * A component that displays a list of uncertainty reports.
 * @returns {React.FC} The rendered component.
 */
const UncertaintyReports: React.FC = () => {

    const handleExport = () => {
        downloadCSV(mockReports, 'uncertainty-reports.csv');
    };

    const exportButton = (
        <button 
            onClick={handleExport}
            className="px-4 py-1.5 text-sm bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500">
            Export CSV
        </button>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Justified Uncertainty Reports</h2>
            <p className="text-slate-400 max-w-3xl">Review diagnostic reports generated when the AI expresses uncertainty. The system differentiates between root causes to provide actionable insights into its cognitive state.</p>
            
            <Card title="Recent Reports" actions={exportButton}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Query</th>
                                <th scope="col" className="px-6 py-3">Uncertainty Level</th>
                                <th scope="col" className="px-6 py-3">Justification</th>
                                <th scope="col" className="px-6 py-3">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockReports.map((report) => (
                                <tr key={report.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-mono text-slate-300">
                                        "{report.query}"
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-2/3 mr-2">
                                                <UncertaintyBar value={report.uncertainty} />
                                            </div>
                                            <span>{report.uncertainty}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400">
                                            {report.reason}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {report.timestamp}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default UncertaintyReports;
