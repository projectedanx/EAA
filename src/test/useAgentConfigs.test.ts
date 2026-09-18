import { renderHook, act } from '@testing-library/react';
import { useAgentConfigs, LOCAL_STORAGE_KEY_LIST, LOCAL_STORAGE_KEY_ACTIVE, DEFAULT_CONFIG } from '../hooks/useAgentConfigs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useAgentConfigs', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads default config when local storage is empty', () => {
    const { result } = renderHook(() => useAgentConfigs());

    expect(result.current.configs).toHaveLength(1);
    expect(result.current.configs[0].name).toBe('Default Profile');
    expect(result.current.activeConfigId).toBe(result.current.configs[0].id);
  });

  it('loads configs from local storage', () => {
    const mockConfigs = [
      { id: '1', name: 'Profile 1', mission: 'M1', governance: 'G1', goals: 'G1' },
      { id: '2', name: 'Profile 2', mission: 'M2', governance: 'G2', goals: 'G2' }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(mockConfigs));
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, '2');

    const { result } = renderHook(() => useAgentConfigs());

    expect(result.current.configs).toHaveLength(2);
    expect(result.current.configs[0].name).toBe('Profile 1');
    expect(result.current.activeConfigId).toBe('2');
    expect(result.current.activeConfig?.name).toBe('Profile 2');
  });

  it('handles manual saving', () => {
    const { result } = renderHook(() => useAgentConfigs());

    act(() => {
      result.current.addConfig('New Test Profile');
    });

    expect(localStorage.getItem(LOCAL_STORAGE_KEY_LIST)).toBeNull(); // Not saved yet (auto-save hasn't triggered)

    act(() => {
      result.current.handleManualSave();
    });

    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_LIST) || '[]');
    expect(saved).toHaveLength(2);
    expect(saved[1].name).toBe('New Test Profile');
  });

  it('handles auto saving via interval', () => {
    const { result } = renderHook(() => useAgentConfigs());

    act(() => {
      result.current.addConfig('Auto Save Profile');
    });

    expect(localStorage.getItem(LOCAL_STORAGE_KEY_LIST)).toBeNull();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_LIST) || '[]');
    expect(saved).toHaveLength(2);
    expect(saved[1].name).toBe('Auto Save Profile');
  });

  it('updates configuration fields correctly', () => {
      const { result } = renderHook(() => useAgentConfigs());

      act(() => {
          result.current.handleConfigChange('mission', 'Updated Mission');
      });

      expect(result.current.activeConfig?.mission).toBe('Updated Mission');
  });
});
