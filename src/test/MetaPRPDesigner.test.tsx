import { render, screen, fireEvent } from '@testing-library/react';
import MetaPRPDesigner from '../../components/MetaPRPDesigner';
import { vi } from 'vitest';
import { downloadJSON } from '../utils/exportUtils';

vi.mock('../utils/exportUtils', () => ({
  downloadJSON: vi.fn(),
}));

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

  it('can create a new profile', async () => {
    render(<MetaPRPDesigner />);

    // Default profile is loaded
    expect(screen.getByText('Default Profile')).toBeInTheDocument();

    // Click New
    fireEvent.click(screen.getByRole('button', { name: /New/i }));

    // Modal opens
    expect(screen.getByText('Create New Profile')).toBeInTheDocument();

    // Enter new name
    const input = screen.getByPlaceholderText(/Enter a name/i);
    fireEvent.change(input, { target: { value: 'My Custom Profile' } });

    // Save
    const modalSaveBtns = screen.getAllByRole('button', { name: /Save/i });
    fireEvent.click(modalSaveBtns[modalSaveBtns.length - 1]); // click the one in the modal

    // New profile should be selected
    const select = screen.getByRole('combobox');
    expect(select).toHaveTextContent('My Custom Profile');
  });

  it('can rename the active profile', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(validConfig));
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, 'test-id-1');

    render(<MetaPRPDesigner />);

    // Click Rename
    fireEvent.click(screen.getByRole('button', { name: /Rename/i }));

    // Modal opens
    expect(screen.getByText('Rename Profile')).toBeInTheDocument();

    // Input should have current name
    const input = screen.getByRole('textbox', { name: /Profile Name/i });
    fireEvent.change(input, { target: { value: 'Renamed Profile 1' } });

    // Save
    const modalSaveBtns2 = screen.getAllByRole('button', { name: /Save/i });
    fireEvent.click(modalSaveBtns2[modalSaveBtns2.length - 1]);

    // Name is updated
    const select = screen.getByRole('combobox');
    expect(select).toHaveTextContent('Renamed Profile 1');
  });

  it('can delete the active profile', async () => {
    const twoConfigs = [
      ...validConfig,
      { id: 'test-id-2', name: 'Profile 2', mission: '', governance: '', goals: '' }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(twoConfigs));
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, 'test-id-1');

    render(<MetaPRPDesigner />);

    // Click Delete
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    // Modal opens
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();

    // Confirm delete
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[1]); // The second one is inside the modal

    // 'test-id-1' is gone, 'test-id-2' is active
    const select = screen.getByRole('combobox');
    expect(select).not.toHaveTextContent('Test Profile 1');
    expect(select).toHaveTextContent('Profile 2');
  });

  it('disables delete button when there is only one profile', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(validConfig));
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, 'test-id-1');

    render(<MetaPRPDesigner />);

    const deleteBtn = screen.getByRole('button', { name: /Delete/i });
    expect(deleteBtn).toBeDisabled();
  });


  it('can modify textareas for mission, governance, and goals', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(validConfig));
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, 'test-id-1');

    render(<MetaPRPDesigner />);

    // Test changing Mission
    const textareas = screen.getAllByRole('textbox'); // Should be 3 textareas: Mission, Governance, Goals
    expect(textareas).toHaveLength(3);

    fireEvent.change(textareas[0], { target: { value: 'Updated Mission' } });
    expect(textareas[0]).toHaveValue('Updated Mission');

    // Test changing Governance
    fireEvent.change(textareas[1], { target: { value: 'Updated Governance' } });
    expect(textareas[1]).toHaveValue('Updated Governance');

    // Test changing Goals
    fireEvent.change(textareas[2], { target: { value: 'Updated Goals' } });
    expect(textareas[2]).toHaveValue('Updated Goals');
  });

  it('can export the active profile to JSON', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(validConfig));
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, 'test-id-1');

    render(<MetaPRPDesigner />);

    const exportBtn = screen.getByRole('button', { name: /Export Profile/i });
    fireEvent.click(exportBtn);

    expect(downloadJSON).toHaveBeenCalledWith(
      {
        name: 'Test Profile 1',
        mission: 'Test mission',
        governance: 'Test governance',
        goals: 'Test goals'
      },
      'test-profile-1-config.json'
    );
  });

  it('can save profiles manually to localStorage', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(validConfig));
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, 'test-id-1');

    render(<MetaPRPDesigner />);

    // Change a field
    const textareas = screen.getAllByRole('textbox');
    fireEvent.change(textareas[0], { target: { value: 'Mission to Save' } });

    // Click manual save
    const saveAllBtn = screen.getByRole('button', { name: /Save All Profiles/i });
    fireEvent.click(saveAllBtn);

    const savedConfig = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_LIST) || '[]');
    expect(savedConfig[0].mission).toBe('Mission to Save');
  });

  it('can change the active profile from the select dropdown', async () => {
    const twoConfigs = [
      ...validConfig,
      { id: 'test-id-2', name: 'Profile 2', mission: 'M2', governance: 'G2', goals: 'G2' }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(twoConfigs));
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, 'test-id-1');

    render(<MetaPRPDesigner />);

    const textareas = screen.getAllByRole('textbox');
    expect(textareas[0]).toHaveValue('Test mission');

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'test-id-2' } });

    expect(textareas[0]).toHaveValue('M2');
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
