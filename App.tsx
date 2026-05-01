
import React, { useState } from 'react';
import { View, CognitiveMode } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetaPRPDesigner from './components/MetaPRPDesigner';
import SymbolicScarManager from './components/SymbolicScarManager';
import UncertaintyReports from './components/UncertaintyReports';
import ComputationalHistoriography from './components/ComputationalHistoriography';
import EpistemicBudgetForecaster from './components/EpistemicBudgetForecaster';
import PluriversalFeatureDiscovery from './components/PluriversalFeatureDiscovery';
import ContrastiveDecodingDashboard from './components/ContrastiveDecodingDashboard';
import OperationalMetabolismMapper from './components/OperationalMetabolismMapper';
import SymbolicScarTwinningEngine from './components/SymbolicScarTwinningEngine';

/**
 * The main application component.
 * It manages the active view and cognitive mode, rendering the appropriate components.
 * @returns {React.FC} The rendered application.
 */
const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.DESIGNER);
  const [cognitiveMode, setCognitiveMode] = useState<CognitiveMode>(CognitiveMode.AUDIT);

  const renderView = () => {
    switch (activeView) {
      case View.DESIGNER:
        return <MetaPRPDesigner />;
      case View.SCARS:
        return <SymbolicScarManager />;
      case View.REPORTS:
        return <UncertaintyReports />;
      case View.HISTORIOGRAPHY:
        return <ComputationalHistoriography />;
      case View.FORECASTER:
        return <EpistemicBudgetForecaster />;
      case View.DISCOVERY:
        return <PluriversalFeatureDiscovery />;
      case View.TELEMETRY:
        return <ContrastiveDecodingDashboard />;
      case View.METABOLISM:
        return <OperationalMetabolismMapper />;
            case View.TWINNING_ENGINE:
        return <SymbolicScarTwinningEngine />;
      default:
        return <MetaPRPDesigner />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header cognitiveMode={cognitiveMode} setCognitiveMode={setCognitiveMode} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
