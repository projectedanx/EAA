import React, { useState } from 'react';
import Card from './Card';
import Modal from './Modal';
import { downloadJSON } from '../src/utils/exportUtils';
import Settings2Icon from './icons/Settings2Icon';
import { useAgentConfigs } from '../src/hooks/useAgentConfigs';

/**
 * A component for designing and managing Meta-Product-Requirements Prompts (Meta-PRPs).
 * @returns {React.FC} The rendered component.
 */
const MetaPRPDesigner: React.FC = () => {
  const {
    configs,
    activeConfigId,
    activeConfig,
    setActiveConfigId,
    handleManualSave,
    handleConfigChange,
    addConfig,
    renameConfig,
    deleteActiveConfig,
  } = useAgentConfigs();

  const [modalState, setModalState] = useState<{ type: 'new' | 'rename' | 'delete' | null; isOpen: boolean; }>({ type: null, isOpen: false });
  const [configNameInput, setConfigNameInput] = useState('');

  /**\n * Exports the current configuration array to a JSON file.\n * @returns {void}\n */
const handleExport = () => {
    if (!activeConfig) return;
    const { id, ...exportData } = activeConfig;
    downloadJSON(exportData, `${activeConfig.name.toLowerCase().replace(/\s+/g, '-')}-config.json`);
  };

  /**\n * Opens a modal based on the specified type.\n * @param {'add' | 'rename'} type - The type of modal to open.\n * @returns {void}\n */
const handleModalOpen = (type: 'new' | 'rename' | 'delete') => {
    if (type === 'rename' && activeConfig) {
      setConfigNameInput(activeConfig.name);
    } else {
      setConfigNameInput('');
    }
    setModalState({ type, isOpen: true });
  }

  /**\n * Handles the confirmation action of the currently open modal.\n * @returns {void}\n */
const handleModalConfirm = () => {
    if (!modalState.type) return;

    switch (modalState.type) {
      case 'new':
        addConfig(configNameInput);
        break;
      case 'rename':
        renameConfig(configNameInput);
        break;
      case 'delete':
        deleteActiveConfig();
        break;
    }
    setModalState({ type: null, isOpen: false });
  };

  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Meta-Product-Requirements Prompts (Meta-PRPs) Designer</h2>
        <p className="text-slate-400 max-w-3xl">Define and customize the core operational parameters of your AI agent. These prompts act as a "Cognitive Operating System," guiding its mission, governance, and self-optimization goals.</p>
        
        <Card title={
          <span className="flex items-center">
            <Settings2Icon className="h-5 w-5 mr-2" />
            <span>Configuration Manager</span>
          </span>
        }>
            <div className="flex flex-wrap items-center gap-4">
                <label htmlFor="config-selector" className="font-semibold text-white">Active Profile:</label>
                <select
                    id="config-selector"
                    value={activeConfigId || ''}
                    onChange={(e) => setActiveConfigId(e.target.value)}
                    className="flex-grow md:flex-grow-0 min-w-[200px] bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    {configs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex-grow flex justify-start md:justify-end items-center gap-2">
                    <button onClick={() => handleModalOpen('new')} className="px-4 py-2 text-sm bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition">New</button>
                    <button onClick={() => handleModalOpen('rename')} className="px-4 py-2 text-sm bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition">Rename</button>
                    <button 
                        onClick={() => handleModalOpen('delete')}
                        disabled={configs.length <= 1}
                        className="px-4 py-2 text-sm bg-red-800 text-white font-semibold rounded-lg hover:bg-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Core Mission" className="lg:col-span-1">
                <textarea
                    value={activeConfig?.mission || ''}
                    onChange={(e) => handleConfigChange('mission', e.target.value)}
                    rows={8}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-sm text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    placeholder="Define the AI's primary purpose..."
                />
            </Card>

            <Card title="Governance Parameters" className="lg:col-span-1">
                <textarea
                    value={activeConfig?.governance || ''}
                    onChange={(e) => handleConfigChange('governance', e.target.value)}
                    rows={8}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-sm text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    placeholder="Set the rules and constraints..."
                />
            </Card>

            <Card title="Self-Optimization Goals" className="lg:col-span-1">
                <textarea
                    value={activeConfig?.goals || ''}
                    onChange={(e) => handleConfigChange('goals', e.target.value)}
                    rows={8}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-sm text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    placeholder="Define measurable improvement targets..."
                />
            </Card>
        </div>
        <div className="flex justify-end pt-4 space-x-4">
            <button 
                onClick={handleExport}
                className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500">
                Export Profile (JSON)
            </button>
            <button 
                onClick={handleManualSave}
                className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500">
                Save All Profiles
            </button>
        </div>

        {modalState.isOpen && (
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ type: null, isOpen: false })}
                onConfirm={handleModalConfirm}
                title={
                    modalState.type === 'new' ? 'Create New Profile' :
                    modalState.type === 'rename' ? 'Rename Profile' : 'Confirm Deletion'
                }
                confirmText={
                    modalState.type === 'delete' ? 'Delete' : 'Save'
                }
            >
                {modalState.type === 'delete' && (
                    <p>Are you sure you want to delete the "{activeConfig?.name}" profile? This action cannot be undone.</p>
                )}
                {(modalState.type === 'new' || modalState.type === 'rename') && (
                    <div>
                        <label htmlFor="configName" className="block text-sm font-medium text-slate-300 mb-2">Profile Name</label>
                        <input
                            type="text"
                            id="configName"
                            value={configNameInput}
                            onChange={(e) => setConfigNameInput(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500"
                            placeholder="Enter a name for the profile..."
                            autoFocus
                        />
                    </div>
                )}
            </Modal>
        )}
    </div>
  );
};

export default MetaPRPDesigner;
