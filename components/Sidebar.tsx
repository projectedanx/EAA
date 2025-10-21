
import React from 'react';
import { View } from '../types';
import BrainCircuitIcon from './icons/BrainCircuitIcon';
import FileTextIcon from './icons/FileTextIcon';
import ShieldIcon from './icons/ShieldIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import HistoryIcon from './icons/HistoryIcon';
import BarChartIcon from './icons/BarChartIcon';


interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

/**
 * A navigation item in the sidebar.
 * @param {object} props - The props for the component.
 * @param {View} props.view - The view that this item navigates to.
 * @param {View} props.activeView - The currently active view.
 * @param {(view: View) => void} props.setActiveView - A function to set the active view.
 * @param {React.ReactNode} props.icon - The icon for the navigation item.
 * @param {string} props.label - The label for the navigation item.
 * @returns {React.FC} The rendered navigation item.
 */
const NavItem: React.FC<{
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, setActiveView, icon, label }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-cyan-500/10 text-cyan-400'
          : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
};

/**
 * The sidebar component for the application.
 * @param {SidebarProps} props - The props for the component.
 * @returns {React.FC<SidebarProps>} The rendered sidebar component.
 */
const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex-shrink-0 p-4 flex flex-col">
      <div className="flex items-center mb-8 px-2">
        <BrainCircuitIcon className="h-8 w-8 text-cyan-400" />
        <h1 className="ml-2 text-xl font-bold text-white">CognitiveOS Core</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem
          view={View.DESIGNER}
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<FileTextIcon className="h-5 w-5" />}
          label="Meta-PRP Designer"
        />
        <NavItem
          view={View.SCARS}
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<ShieldIcon className="h-5 w-5" />}
          label="Symbolic Scar Manager"
        />
        <NavItem
          view={View.REPORTS}
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<AlertTriangleIcon className="h-5 w-5" />}
          label="Uncertainty Reports"
        />
        <NavItem
          view={View.HISTORIOGRAPHY}
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<HistoryIcon className="h-5 w-5" />}
          label="Computational Historiography"
        />
        <NavItem
          view={View.FORECASTER}
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<BarChartIcon className="h-5 w-5" />}
          label="Epistemic Forecaster"
        />
      </nav>
      <div className="mt-auto p-4 bg-slate-800 rounded-lg text-center text-xs">
          <p className="font-semibold text-slate-300">Epistemic Architect AI</p>
          <p className="text-slate-500 mt-1">&copy; 2024. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
