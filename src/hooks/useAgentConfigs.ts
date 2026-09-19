import { logger } from "../utils/logger";
import { useState, useEffect, useRef, useMemo } from 'react';
import { AgentConfig } from '../types';

export const LOCAL_STORAGE_KEY_LIST = 'metaPRPConfigs';
export const LOCAL_STORAGE_KEY_ACTIVE = 'metaPRPActiveConfigId';

export const DEFAULT_CONFIG: Omit<AgentConfig, 'id' | 'name'> = {
  mission: 'To provide accurate, helpful, and harmless information while adhering to ethical guidelines and maximizing user understanding.',
  governance: '- Prioritize user safety above all.\n- Avoid generating biased or discriminatory content.\n- Self-correct when an error is identified.\n- Adhere to the principle of least harm in ambiguous situations.',
  goals: '- Improve response relevance by 15% quarterly.\n- Reduce instances of justified uncertainty by 10%.\n- Optimize epistemic budget for complex queries.',
};

/**
 * Custom hook for managing agent configurations using local storage.
 * It provides state for multiple configs and the active config ID, along with methods to manipulate them.
 * @returns {Object} An object containing the current configurations, active config, and methods to update them.
 */
export function useAgentConfigs() {
  const [configs, setConfigs] = useState<AgentConfig[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);

  const stateRef = useRef({ configs, activeConfigId });

  useEffect(() => {
    stateRef.current = { configs, activeConfigId };
  }, [configs, activeConfigId]);

  useEffect(() => {
    let loadedConfigs: AgentConfig[] = [];
    try {
      const savedConfigsRaw = localStorage.getItem(LOCAL_STORAGE_KEY_LIST);
      if (savedConfigsRaw) {
        const parsed = JSON.parse(savedConfigsRaw);
        if (Array.isArray(parsed)) {
          loadedConfigs = parsed.filter((item: unknown) => {
            if (!item || typeof item !== 'object') return false;
            const obj = item as Record<string, unknown>;
            return typeof obj.id === 'string' &&
              typeof obj.name === 'string' &&
              typeof obj.mission === 'string' &&
              typeof obj.governance === 'string' &&
              typeof obj.goals === 'string';
          }) as AgentConfig[];
        }
      }
    } catch (e) {
      logger.warn("Error parsing configurations from local storage", e);
    }

    if (loadedConfigs.length === 0) {
      const defaultConfig: AgentConfig = {
        id: Date.now().toString(),
        name: 'Default Profile',
        ...DEFAULT_CONFIG,
      };
      loadedConfigs.push(defaultConfig);
    }
    setConfigs(loadedConfigs);

    const savedActiveId = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVE);
    if (savedActiveId && loadedConfigs.some(c => c.id === savedActiveId)) {
      setActiveConfigId(savedActiveId);
    } else {
      setActiveConfigId(loadedConfigs[0].id);
    }

    let lastSavedConfigsRef: AgentConfig[] | null = null;
    let lastSavedConfigsString: string | null = null;
    let lastSavedActiveId: string | null = null;

    const intervalId = setInterval(() => {
      const currentConfigs = stateRef.current.configs;
      const currentActiveId = stateRef.current.activeConfigId;

      if (currentConfigs.length > 0 && currentConfigs !== lastSavedConfigsRef) {
        const configsString = JSON.stringify(currentConfigs);
        if (configsString !== lastSavedConfigsString) {
          localStorage.setItem(LOCAL_STORAGE_KEY_LIST, configsString);
          lastSavedConfigsString = configsString;
        }
        lastSavedConfigsRef = currentConfigs;
      }
      if (currentActiveId && currentActiveId !== lastSavedActiveId) {
        localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, currentActiveId);
        lastSavedActiveId = currentActiveId;
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const activeConfig = useMemo(() => {
    return configs.find(c => c.id === activeConfigId);
  }, [configs, activeConfigId]);

  /**\n * Manually saves the current configurations to local storage.\n * @returns {void}\n */
const handleManualSave = () => {
    if (configs.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(configs));
    }
    if (activeConfigId) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, activeConfigId);
    }
  };

  /**\n * Handles changes to a specific field in the active configuration.\n * @param {keyof Omit<AgentConfig, 'id' | 'name'>} field - The field to update.\n * @param {string} value - The new value.\n * @returns {void}\n */
const handleConfigChange = (field: keyof Omit<AgentConfig, 'id' | 'name'>, value: string) => {
    if (!activeConfigId) return;
    setConfigs(prev => prev.map(c => c.id === activeConfigId ? { ...c, [field]: value } : c));
  };

  /**\n * Adds a new configuration with default values and sets it as active.\n * @param {string} name - The name for the new profile.\n * @returns {void}\n */
const addConfig = (name: string) => {
    const newConfig: AgentConfig = {
      id: Date.now().toString(),
      name: name || 'Untitled Profile',
      ...DEFAULT_CONFIG,
    };
    setConfigs(prev => [...prev, newConfig]);
    setActiveConfigId(newConfig.id);
  };

  /**\n * Renames the active configuration.\n * @param {string} newName - The new name for the profile.\n * @returns {void}\n */
const renameConfig = (newName: string) => {
      if (!activeConfigId || !newName) return;
      setConfigs(prev => prev.map(c => c.id === activeConfigId ? { ...c, name: newName } : c));
  };

  /**\n * Deletes the active configuration and sets another one as active.\n * @returns {void}\n */
const deleteActiveConfig = () => {
      if (!activeConfigId || configs.length <= 1) return;
      const newConfigs = configs.filter(c => c.id !== activeConfigId);
      setConfigs(newConfigs);
      setActiveConfigId(newConfigs[0]?.id || null);
  };

  return {
    configs,
    activeConfigId,
    activeConfig,
    setActiveConfigId,
    handleManualSave,
    handleConfigChange,
    addConfig,
    renameConfig,
    deleteActiveConfig,
  };
}
