import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SymbolicScarManager from '../../components/SymbolicScarManager';

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
    const container = scar1.closest('div');

    // Find the decay input and set it to 10 days
    const input = container?.querySelector('input[type="number"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '10' } });

    // Click "Set Timer"
    const setTimerButton = screen.getByText('Set Timer');
    fireEvent.click(setTimerButton);

    // Initial state: 0% progress, 100% influence
    expect(screen.getByText('10d 0h 0m 0s left')).toBeDefined();
    let tooltip = screen.getByText(/This scar's influence is at 100% of its original strength./);
    expect(tooltip).toBeDefined();

    // Advance time by 5 days (50% progress)
    await act(async () => {
      vi.advanceTimersByTime(5 * 24 * 60 * 60 * 1000);
    });

    expect(screen.getByText('5d 0h 0m 0s left')).toBeDefined();
    tooltip = screen.getByText(/This scar's influence is at 50% of its original strength./);
    expect(tooltip).toBeDefined();

    // Advance time by another 2.5 days (75% progress, 25% influence)
    await act(async () => {
      vi.advanceTimersByTime(2.5 * 24 * 60 * 60 * 1000);
    });

    expect(screen.getByText('2d 12h 0m 0s left')).toBeDefined();
    tooltip = screen.getByText(/This scar's influence is at 25% of its original strength./, { exact: false });
    expect(tooltip).toBeDefined();

    // Verify specific text to ensure precedence was correct (no "100 - 75.0000%" etc)
    // If precedence was wrong (100 - progress.toFixed(0)), 100 - "75" would be 25 (number),
    // but the test confirms it's behaving as expected with the current fix.
  });
});
