import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ComputationalHistoriography from '../../components/ComputationalHistoriography';
import * as exportUtils from '../utils/exportUtils';

vi.mock('../utils/exportUtils', () => ({
  downloadJSON: vi.fn(),
}));

describe('ComputationalHistoriography', () => {
  it('renders the component and reasoning nodes', () => {
    render(<ComputationalHistoriography />);

    // Verify main headings
    expect(screen.getByText('Computational Historiography')).toBeInTheDocument();
    expect(screen.getByText('Reasoning Trace for Last Complex Query')).toBeInTheDocument();

    // Verify some reasoning nodes are rendered based on the mock data
    expect(screen.getByText('User Query')).toBeInTheDocument();
    expect(screen.getByText('Initial Analysis')).toBeInTheDocument();
    expect(screen.getByText('Constraint Check')).toBeInTheDocument();
    expect(screen.getByText('Final Action')).toBeInTheDocument();
  });

  it('calls downloadJSON when Export JSON button is clicked', () => {
    render(<ComputationalHistoriography />);

    const exportButton = screen.getByRole('button', { name: 'Export JSON' });
    fireEvent.click(exportButton);

    expect(exportUtils.downloadJSON).toHaveBeenCalledTimes(1);
    expect(exportUtils.downloadJSON).toHaveBeenCalledWith(
      expect.any(Object), // the mock trace
      'reasoning-trace.json'
    );
  });
});
