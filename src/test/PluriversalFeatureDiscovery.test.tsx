import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PluriversalFeatureDiscovery from '../../components/PluriversalFeatureDiscovery';

describe('PluriversalFeatureDiscovery', () => {
  it('renders correctly', () => {
    render(<PluriversalFeatureDiscovery />);
    expect(screen.getByText('Pluriversal Feature Discovery')).toBeInTheDocument();
  });

  it('calculates relational vector correctly and simulates pass', () => {
    render(<PluriversalFeatureDiscovery />);

    // Check initial calculations
    // z0 = [1.0, 0.0, 0.0]
    // z' = [0.95, 1.0, 1.2]
    // dz = [-0.05, 1.0, 1.2]

    expect(screen.getByTestId('delta-z-display')).toHaveTextContent('[-0.05, 1.00, 1.20]');

    // beta1 = (|-.05| + 1 + 1.2) / 3 = 2.25 / 3 = 0.75
    // beta0 = 1 - |-0.05| = 0.95
    expect(screen.getByTestId('beta1-display')).toHaveTextContent('0.750');
    expect(screen.getByTestId('beta0-display')).toHaveTextContent('0.950');

    // exhaust CSD budget
    const csdSpentInput = screen.getByTestId('csd-spent');
    fireEvent.change(csdSpentInput, { target: { value: '100' } });

    // run sim
    const runBtn = screen.getByTestId('run-sim-btn');
    fireEvent.click(runBtn);

    expect(screen.getByTestId('sim-status')).toHaveTextContent('CoC Simulation Passed');
  });

  it('simulates failure when beta1 is too low', () => {
    render(<PluriversalFeatureDiscovery />);

    // Set z' to be very close to z0 (low novelty)
    const zPrimeInput = screen.getByTestId('zprime-input');
    fireEvent.change(zPrimeInput, { target: { value: '1.0, 0.1, 0.1' } });

    const runBtn = screen.getByTestId('run-sim-btn');
    fireEvent.click(runBtn);

    expect(screen.getByTestId('sim-status')).toHaveTextContent('Simulation Failed: Topological Novelty');
  });

  it('activates phantom dimension when PO is checked', () => {
    render(<PluriversalFeatureDiscovery />);

    const phantomCheckbox = screen.getByTestId('phantom-checkbox');
    fireEvent.click(phantomCheckbox);

    // dz initially [-0.05, 1.0, 1.2]
    // with H_k = [0, 0, 1] added, it becomes [-0.05, 1.0, 2.2]
    expect(screen.getByTestId('delta-z-display')).toHaveTextContent('[-0.05, 1.00, 2.20]');
  });
});
