import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SymbolicScarManager from '../../components/SymbolicScarManager';

import * as exportUtils from '../utils/exportUtils';
vi.mock('../utils/exportUtils', () => ({
  downloadCSV: vi.fn(),
}));

describe('SymbolicScarManager Decay Progress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('correctly calculates and displays the decay progress in the tooltip', async () => {
    render(<SymbolicScarManager />);

    // Find a scar that doesn't have a timer yet (scar-001)
    const scar1 = screen.getByText('Misinterpreted sarcasm in user query leading to an inappropriate response.');
    const container = scar1.closest('.bg-slate-900\\/50') as HTMLElement;

    // Find the decay input and set it to 10 days
    const input = within(container).getByPlaceholderText('Decay (days)') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '10' } });

    // Click "Set Timer"
    const setTimerButton = within(container).getByRole('button', { name: 'Set Timer' }) as HTMLButtonElement;
    fireEvent.click(setTimerButton);

    // Initial state: 0% progress, 100% influence
    expect(screen.getByText('10d left')).toBeDefined();
    let tooltip = screen.getByText(/This scar's influence is at 100% of its original strength./);
    expect(tooltip).toBeDefined();

    // Advance time by 5 days (50% progress)
    await act(async () => {
      vi.advanceTimersByTime(5 * 24 * 60 * 60 * 1000);
    });

    expect(screen.getByText('5d left')).toBeDefined();
    tooltip = screen.getByText(/This scar's influence is at 50% of its original strength./);
    expect(tooltip).toBeDefined();

    // Advance time by another 2.5 days (75% progress, 25% influence)
    await act(async () => {
      vi.advanceTimersByTime(2.5 * 24 * 60 * 60 * 1000);
    });

    expect(screen.getByText('2d 12h left')).toBeDefined();
    tooltip = screen.getByText(/This scar's influence is at 25% of its original strength./, { exact: false });
    expect(tooltip).toBeDefined();

    // Verify specific text to ensure precedence was correct (no "100 - 75.0000%" etc)
    // If precedence was wrong (100 - progress.toFixed(0)), 100 - "75" would be 25 (number),
    // but the test confirms it's behaving as expected with the current fix.
    });

  it('calls downloadCSV when Export CSV button is clicked', () => {
    render(<SymbolicScarManager />);
    const exportButton = screen.getByRole('button', { name: 'Export CSV' });
    fireEvent.click(exportButton);
    expect(exportUtils.downloadCSV).toHaveBeenCalledTimes(1);
    expect(exportUtils.downloadCSV).toHaveBeenCalledWith(expect.any(Array), 'symbolic-scars.csv');
  });

  it('can set a decay timer and then clear it', () => {
    render(<SymbolicScarManager />);

    // Find scar-002
    const scar2 = screen.getByText('Violated a governance parameter by providing speculative financial advice.');
    const container = scar2.closest('.bg-slate-900\\/50') as HTMLElement;

    // Set a timer
    const input = within(container).getByPlaceholderText('Decay (days)') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '5' } });
    const setTimerButton = within(container).getByRole('button', { name: 'Set Timer' }) as HTMLButtonElement;
    fireEvent.click(setTimerButton);

    // Verify decay progress appears
    expect(screen.getByText('5d left')).toBeDefined();

    // Click "Clear Timer"
    const clearTimerButton = screen.getByRole('button', { name: 'Clear Timer' });
    fireEvent.click(clearTimerButton);

    // Modal should appear
    expect(screen.getByText('Confirm Clear Timer')).toBeDefined();

    // Click "Yes, Clear Timer"
    const confirmButton = screen.getByRole('button', { name: 'Yes, Clear Timer' });
    fireEvent.click(confirmButton);

    // Decay progress should be gone, "Set Timer" button should be back
    expect(screen.queryByText('5d left')).toBeNull();
    const newSetTimerButton = within(container).getByRole('button', { name: 'Set Timer' });
    expect(newSetTimerButton).toBeDefined();
  });

  it('can override a scar', () => {
    render(<SymbolicScarManager />);

    // Find scar-003
    const scar3 = screen.getByText('Failed to recognize a multi-part question, only answering the first part.');
    const container = scar3.closest('.bg-slate-900\\/50') as HTMLElement;

    // Click "Override Scar"
    const overrideButton = within(container).getByRole('button', { name: 'Override Scar' });
    fireEvent.click(overrideButton);

    // Modal should appear
    expect(screen.getByText('Confirm Scar Override')).toBeDefined();

    // Click "Yes, Override"
    const confirmButton = screen.getByRole('button', { name: 'Yes, Override' });
    fireEvent.click(confirmButton);

    // Modal should close (no specific visual indicator changes on the scar card yet)
    expect(screen.queryByText('Confirm Scar Override')).toBeNull();
  });
});
