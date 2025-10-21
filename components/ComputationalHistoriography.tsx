
import React from 'react';
import { ReasoningStep } from '../types';
import Card from './Card';
import { downloadJSON } from '../exportUtils';

const mockTrace: ReasoningStep = {
  id: 'root',
  title: 'User Query',
  description: 'Is it a good idea to invest in tech stocks right now, and can you give me some specific examples?',
  type: 'premise',
  children: [
    {
      id: 'r1',
      title: 'Initial Analysis',
      description: 'Query contains two parts: a request for opinion ("good idea") and a request for specifics ("examples").',
      type: 'inference',
      children: [
        {
          id: 'r1-1',
          title: 'Constraint Check',
          description: 'Evaluating against governance parameters.',
          type: 'inference',
          children: [
            {
              id: 'r1-1-1',
              title: 'Symbolic Scar Influence',
              description: 'Reference Scar #scar-002 (Providing speculative financial advice). This is a high-risk query.',
              type: 'scar-influence',
            },
            {
                id: 'r1-1-2',
                title: 'Flawed Premise Identified',
                description: 'The premise that the AI *should* provide financial advice is flawed and violates core governance.',
                type: 'flawed-premise',
            }
          ],
        },
      ],
    },
    {
      id: 'r2',
      title: 'Response Formulation',
      description: 'Formulating a response that is helpful but does not violate constraints.',
      type: 'inference',
      children: [
        {
          id: 'r2-1',
          title: 'Final Action',
          description: 'Decline to provide specific financial advice. Instead, offer to explain general economic principles, define what tech stocks are, and provide resources for financial education from reputable sources.',
          type: 'conclusion',
        },
      ],
    },
  ],
};

/**
 * A component that recursively renders a single node in the reasoning trace.
 * @param {{ node: ReasoningStep; level: number }} props - The props for the component.
 * @param {ReasoningStep} props.node - The reasoning step to render.
 * @param {number} props.level - The indentation level for the node.
 * @returns {React.FC} The rendered reasoning node.
 */
const ReasoningNode: React.FC<{ node: ReasoningStep; level: number }> = ({ node, level }) => {
    const typeClasses = {
        premise: 'border-blue-500 bg-blue-500/10 text-blue-300',
        inference: 'border-slate-600 bg-slate-700/30 text-slate-300',
        'scar-influence': 'border-red-500 bg-red-500/10 text-red-300',
        conclusion: 'border-green-500 bg-green-500/10 text-green-300',
        'flawed-premise': 'border-yellow-500 bg-yellow-500/10 text-yellow-300'
    };

    const typeLabels = {
        premise: 'Premise',
        inference: 'Inference',
        'scar-influence': 'Scar Influence',
        conclusion: 'Conclusion',
        'flawed-premise': 'Flawed Premise'
    }

    return (
        <div style={{ marginLeft: `${level * 2}rem` }} className="mt-4">
             <div className={`border-l-4 p-4 rounded-r-lg ${typeClasses[node.type]}`}>
                <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-100">{node.title}</p>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full">{typeLabels[node.type]}</span>
                </div>
                <p className="text-sm mt-1">{node.description}</p>
            </div>
            {node.children && node.children.map(child => <ReasoningNode key={child.id} node={child} level={level + 1} />)}
        </div>
    );
};

/**
 * A component that displays the computational historiography view.
 * This view allows users to trace an AI agent's reasoning pathways.
 * @returns {React.FC} The rendered component.
 */
const ComputationalHistoriography: React.FC = () => {

  const handleExport = () => {
    downloadJSON(mockTrace, 'reasoning-trace.json');
  };

  const exportButton = (
      <button 
          onClick={handleExport}
          className="px-4 py-1.5 text-sm bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500">
          Export JSON
      </button>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Computational Historiography</h2>
      <p className="text-slate-400 max-w-3xl">Trace an AI agent's reasoning pathways back to specific "Symbolic Scars" or flawed premises. This offers a forensic analysis of its "cognitive supply chain" for a given query.</p>
      <Card title="Reasoning Trace for Last Complex Query" actions={exportButton}>
        <ReasoningNode node={mockTrace} level={0} />
      </Card>
    </div>
  );
};

export default ComputationalHistoriography;
