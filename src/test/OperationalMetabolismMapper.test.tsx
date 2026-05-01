import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import OperationalMetabolismMapper from '../../components/OperationalMetabolismMapper';
import React from 'react';

describe('OperationalMetabolismMapper', () => {
    beforeEach(() => {
        render(<OperationalMetabolismMapper />);
    });

    it('renders the initial state correctly', () => {
        expect(screen.getByText('Operational Metabolism Mapper')).toBeDefined();

        // Use initial state shown in the component
        const vectorAInput = screen.getByTestId('vector-a-input') as HTMLInputElement;
        const vectorBInput = screen.getByTestId('vector-b-input') as HTMLInputElement;

        expect(vectorAInput.value).toBe('0.9, 0.1, 0.0');
        expect(vectorBInput.value).toBe('0.8, 0.2, 0.0');
    });

    it('calculates CFDI and Topological Strain correctly for paraconsistent tension (betti_1 > 0)', () => {
        // Based on CoC Sim Test 1
        const vectorAInput = screen.getByTestId('vector-a-input');
        const vectorBInput = screen.getByTestId('vector-b-input');

        fireEvent.change(vectorAInput, { target: { value: '1.0, 0.0, 0.0' } });
        fireEvent.change(vectorBInput, { target: { value: '0.0, 1.0, 0.0' } });

        const topologicalStrain = screen.getByTestId('topological-strain');
        const cfdiValue = screen.getByTestId('cfdi-value');

        expect(topologicalStrain.textContent).toBe('1.0000');

        expect(cfdiValue.textContent).toContain('1.0000e-6');

        // Assert Paraconsistent State is shown
        expect(screen.getByText(/Paraconsistent State Stable/)).toBeDefined();
        // Since Betti Loop appears in two places, we check for presence using getAllByText
        expect(screen.getAllByText(/Betti Loop/).length).toBeGreaterThan(0);
    });

    it('detects Resolution Collapse for contradictory vectors', () => {
        // Based on CoC Sim Test 2
        const vectorAInput = screen.getByTestId('vector-a-input');
        const vectorBInput = screen.getByTestId('vector-b-input');
        const epsilonInput = screen.getByTestId('epsilon-input');

        fireEvent.change(vectorAInput, { target: { value: '1.0, 0.0, 0.0' } });
        fireEvent.change(vectorBInput, { target: { value: '-1.0, 0.0, 0.0' } });
        fireEvent.change(epsilonInput, { target: { value: '0.0001' } }); // 1e-4

        const cfdiValue = screen.getByTestId('cfdi-value');

        // Expected CFDI: 0.002 = 2.0000e-3
        expect(cfdiValue.textContent).toContain('2.0000e-3');

        // Assert Resolution Collapse is detected
        expect(screen.getByText('Resolution Collapse Detected.')).toBeDefined();
    });

    it('detects Harmonic State for highly aligned vectors', () => {
        const vectorAInput = screen.getByTestId('vector-a-input');
        const vectorBInput = screen.getByTestId('vector-b-input');

        fireEvent.change(vectorAInput, { target: { value: '1.0, 0.0, 0.0' } });
        fireEvent.change(vectorBInput, { target: { value: '0.99, 0.0, 0.0' } });

        // Assert Harmonic State is shown
        expect(screen.getByText('Harmonic State.')).toBeDefined();
    });
});
