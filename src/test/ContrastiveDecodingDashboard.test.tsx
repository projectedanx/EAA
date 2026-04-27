import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContrastiveDecodingDashboard from '../../components/ContrastiveDecodingDashboard';

describe('ContrastiveDecodingDashboard', () => {
  it('renders the component correctly', () => {
    render(<ContrastiveDecodingDashboard />);
    expect(screen.getByText('Contrastive Decoding Telemetry')).toBeInTheDocument();
    expect(screen.getByText('Alpha (α) Penalty Factor')).toBeInTheDocument();
  });

  it('calculates the contrastive delta correctly', () => {
    render(<ContrastiveDecodingDashboard />);

    // Initial values: expert = -0.1, amateur = -1.5, alpha = 0.5
    // delta = -0.1 - (0.5 * -1.5) = -0.1 + 0.75 = 0.65
    expect(screen.getByTestId('contrastive-delta')).toHaveTextContent('0.6500');
    expect(screen.getByText('Strong Amateur Suppression Active')).toBeInTheDocument();

    // Change alpha
    const alphaSlider = screen.getByTestId('alpha-slider');
    fireEvent.change(alphaSlider, { target: { value: '0' } });

    // delta = -0.1 - (0 * -1.5) = -0.1
    expect(screen.getByTestId('contrastive-delta')).toHaveTextContent('-0.1000');
    expect(screen.queryByText('Strong Amateur Suppression Active')).not.toBeInTheDocument();
  });

  it('updates probabilities on simulation tick', () => {
    render(<ContrastiveDecodingDashboard />);

    const initialExpertProb = screen.getByTestId('expert-prob').textContent;
    const initialAmateurProb = screen.getByTestId('amateur-prob').textContent;

    // We can't guarantee exact values due to Math.random, but we can verify they change
    const simButton = screen.getByTestId('sim-tick-btn');
    fireEvent.click(simButton);

    const newExpertProb = screen.getByTestId('expert-prob').textContent;
    const newAmateurProb = screen.getByTestId('amateur-prob').textContent;

    // While mathematically possible for them to be equal, the chance is astronomically small
    expect(newExpertProb).not.toBe(initialExpertProb);
    expect(newAmateurProb).not.toBe(initialAmateurProb);
  });
});
