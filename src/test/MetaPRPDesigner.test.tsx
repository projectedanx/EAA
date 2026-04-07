import { render, screen, fireEvent } from '@testing-library/react';
import MetaPRPDesigner from '../../components/MetaPRPDesigner';
import { vi } from 'vitest';

const LOCAL_STORAGE_KEY_LIST = 'metaPRPConfigs';
const LOCAL_STORAGE_KEY_ACTIVE = 'metaPRPActiveConfigId';

const validConfig = [
  {
    id: 'test-id-1',
    name: 'Test Profile 1',
    mission: 'Test mission',
    governance: 'Test governance',
    goals: 'Test goals'
  }
];

describe('MetaPRPDesigner', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads valid configuration from localStorage', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(validConfig));
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, 'test-id-1');

    render(<MetaPRPDesigner />);

    expect(screen.getByRole('combobox')).toHaveValue('test-id-1');
    expect(screen.getByText('Test Profile 1')).toBeInTheDocument();
  });

  it('ignores malformed data in localStorage and loads default config', () => {
    const invalidConfig = [
      { id: '123' }, // missing name, mission, etc.
      "not an object",
      null
    ];

    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(invalidConfig));

    render(<MetaPRPDesigner />);

    // Default profile should be loaded
    expect(screen.getByText('Default Profile')).toBeInTheDocument();

    // Check that default values are set in textareas (they use placeholders, so checking values)
    const textareas = screen.getAllByRole('textbox');
    expect(textareas[0]).toHaveValue('To provide accurate, helpful, and harmless information while adhering to ethical guidelines and maximizing user understanding.');
  });

  it('ignores completely invalid JSON format and loads default config', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, "invalid json {");

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<MetaPRPDesigner />);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(screen.getByText('Default Profile')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('ignores data that is an object instead of array and loads default config', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify({ id: '123', name: 'Test' }));

    render(<MetaPRPDesigner />);

    expect(screen.getByText('Default Profile')).toBeInTheDocument();
  });
});
