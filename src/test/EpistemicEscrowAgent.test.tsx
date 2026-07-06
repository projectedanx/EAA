import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EpistemicEscrowAgent from '../../components/EpistemicEscrowAgent';

describe('EpistemicEscrowAgent', () => {
  it('renders the component with initial escrowed scars', () => {
    render(<EpistemicEscrowAgent />);

    expect(screen.getByTestId('epistemic-escrow-agent')).toBeInTheDocument();

    // Check initial scar
    const dashboard = screen.getByTestId('escrow-dashboard');
    expect(within(dashboard).getByText('scar-escrow-001')).toBeInTheDocument();
    expect(within(dashboard).getByText(/Maximally readable code vs\. Maximally performant code/)).toBeInTheDocument();
  });

  it('generates a new escrowed scar upon simulating resolution collapse', () => {
    render(<EpistemicEscrowAgent />);

    const inputA = screen.getByTestId('input-constraint-a');
    const inputB = screen.getByTestId('input-constraint-b');
    const inputExpected = screen.getByTestId('input-expected-output');
    const simulateBtn = screen.getByTestId('btn-simulate-collapse');

    // Button should be disabled initially
    expect(simulateBtn).toBeDisabled();

    // Fill inputs
    fireEvent.change(inputA, { target: { value: 'Strict type safety' } });
    fireEvent.change(inputB, { target: { value: 'Any user input' } });
    fireEvent.change(inputExpected, { target: { value: 'JSON parser' } });

    // Button should be enabled now
    expect(simulateBtn).not.toBeDisabled();

    // Trigger simulation
    fireEvent.click(simulateBtn);

    // Verify new scar appears in the dashboard
    const dashboard = screen.getByTestId('escrow-dashboard');
    expect(within(dashboard).getByText(/Strict type safety vs\. Any user input/)).toBeInTheDocument();

    // Inputs should be cleared
    expect((inputA as HTMLInputElement).value).toBe('');
    expect((inputB as HTMLInputElement).value).toBe('');
    expect((inputExpected as HTMLInputElement).value).toBe('');
  });

  it('allows applying debridement protocols to an escrowed scar', () => {
    render(<EpistemicEscrowAgent />);

    const dashboard = screen.getByTestId('escrow-dashboard');

    // Click on the initial scar to open the modal
    const initialScarIdElement = within(dashboard).getByText('scar-escrow-001');
    fireEvent.click(initialScarIdElement);

    // Debride button should be visible in the modal
    const debrideBtn = screen.getByTestId('btn-debride');
    expect(debrideBtn).toBeInTheDocument();

    // Apply debridement
    fireEvent.click(debrideBtn);

    // Check that status is updated to 'Debrided' in the dashboard
    // The initial status 'Escrowed' was there, now we expect 'Debrided' for this scar
    expect(within(dashboard).getByText('Debrided')).toBeInTheDocument();
  });
});
