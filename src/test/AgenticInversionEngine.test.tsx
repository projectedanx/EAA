import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AgenticInversionEngine from '../../components/AgenticInversionEngine';

describe('AgenticInversionEngine', () => {
  it('renders the component and allows calculating Z-Axis projection', () => {
    render(<AgenticInversionEngine />);

    // Verify initial render
    expect(screen.getByTestId('agentic-inversion-engine')).toBeInTheDocument();
    expect(screen.getByText('Awaiting paraconsistent input...')).toBeInTheDocument();

    // Verify default inputs
    const inputA = screen.getByTestId('input-val-a') as HTMLInputElement;
    const inputB = screen.getByTestId('input-val-b') as HTMLInputElement;

    expect(inputA.value).toBe('-1');
    expect(inputB.value).toBe('1');

    // Trigger calculation
    const calcButton = screen.getByTestId('btn-calculate');
    fireEvent.click(calcButton);

    // Verify results container is shown
    expect(screen.getByTestId('results-container')).toBeInTheDocument();

    // Verify specific math (based on -1 and 1)
    // baseWidth = 2, emergentZ = 2 * 1.618 = 3.236
    const emergentZSpan = screen.getByTestId('result-emergent-z');
    expect(emergentZSpan.textContent).toBe('3.236');

    // distance = sqrt(1^2 + 3.236^2) = sqrt(1 + 10.471696) = sqrt(11.471696) = 3.387
    const distSpan = screen.getByTestId('result-dist-emergent');
    expect(distSpan.textContent).toBe('3.387');
  });

  it('updates calculation when inputs change', () => {
    render(<AgenticInversionEngine />);

    const inputA = screen.getByTestId('input-val-a');
    const inputB = screen.getByTestId('input-val-b');
    const calcButton = screen.getByTestId('btn-calculate');

    // Change inputs to 0 and 10
    fireEvent.change(inputA, { target: { value: '0' } });
    fireEvent.change(inputB, { target: { value: '10' } });
    fireEvent.click(calcButton);

    // baseWidth = 10, emergentZ = 10 * 1.618 = 16.180
    const emergentZSpan = screen.getByTestId('result-emergent-z');
    expect(emergentZSpan.textContent).toBe('16.180');
  });
});
