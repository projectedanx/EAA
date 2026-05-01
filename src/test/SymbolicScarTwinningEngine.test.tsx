import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SymbolicScarTwinningEngine from '../../components/SymbolicScarTwinningEngine';

describe('SymbolicScarTwinningEngine Component', () => {
    it('should render correctly with default values', () => {
        render(<SymbolicScarTwinningEngine />);
        expect(screen.getByText('Symbolic Scar Twinning Engine (Martensite Stabilizer)')).toBeDefined();
        const aiDensityInput = screen.getByTestId('ai-logic-density');
        const humanConsensusInput = screen.getByTestId('human-consensus-vector');
        expect((aiDensityInput as HTMLInputElement).value).toBe('0.95');
        expect((humanConsensusInput as HTMLInputElement).value).toBe('0.2');
    });

    it('should calculate aesthetic tension and show critical warning if tension > 0.85', () => {
        render(<SymbolicScarTwinningEngine />);
        const aiDensityInput = screen.getByTestId('ai-logic-density');
        const humanConsensusInput = screen.getByTestId('human-consensus-vector');

        // Force critical tension
        fireEvent.change(aiDensityInput, { target: { value: '0.99' } });
        fireEvent.change(humanConsensusInput, { target: { value: '0.1' } });

        // tension = min(1.0, sqrt(0.99^2 + 0.1^2) * 0.9) = 0.8955
        const tensionDisplay = screen.getByTestId('aesthetic-tension');
        expect(parseFloat(tensionDisplay.textContent!)).toBeGreaterThan(0.85);
        expect(screen.getByText(/Critical Aesthetic Tension Detected/i)).toBeDefined();
    });

    it('should log twinning success when button is clicked in critical state', () => {
        render(<SymbolicScarTwinningEngine />);

        const applyBtn = screen.getByTestId('apply-twinning-btn');
        fireEvent.click(applyBtn);

        expect(screen.getByTestId('twinning-success-msg')).toBeDefined();
    });

    it('should show stable state when tension is <= 0.85', () => {
        render(<SymbolicScarTwinningEngine />);
        const aiDensityInput = screen.getByTestId('ai-logic-density');
        const humanConsensusInput = screen.getByTestId('human-consensus-vector');

        // Lower values to avoid critical tension
        fireEvent.change(aiDensityInput, { target: { value: '0.5' } });
        fireEvent.change(humanConsensusInput, { target: { value: '0.5' } });

        expect(screen.queryByText(/Critical Aesthetic Tension Detected/i)).toBeNull();
        expect(screen.getByText(/Stable State/i)).toBeDefined();
    });
});
