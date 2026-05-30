import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import EmpiricalDocumentationRouter from '../../components/EmpiricalDocumentationRouter';

describe('EmpiricalDocumentationRouter Component', () => {
    it('renders the core PD&T specification UI', () => {
        render(<EmpiricalDocumentationRouter />);

        expect(screen.getByText('EMPIRICAL DOCUMENTATION ROUTER')).toBeInTheDocument();
        expect(screen.getByText(/DRP-ID: DRP-SCOS-PERSONA-METROLOGY-2026-v6.1/)).toBeInTheDocument();
        expect(screen.getByText('STAKEHOLDER CONSTRAINTS')).toBeInTheDocument();
        expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
        expect(screen.getByText('High Reliability')).toBeInTheDocument();
    });

    it('simulates the S5 topological derivative and updates the UI', async () => {
        render(<EmpiricalDocumentationRouter />);

        expect(screen.getByText('Awaiting constraints evaluation...')).toBeInTheDocument();

        const button = screen.getByText('EXECUTE TOPOLOGICAL FIT PREDICTION');
        fireEvent.click(button);

        expect(screen.getByText('CALCULATING S5 DERIVATIVE...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Awaiting constraints evaluation...')).not.toBeInTheDocument();
            expect(screen.getByText('Topological Tension:')).toBeInTheDocument();
            expect(screen.getByText(/Betti Loop/)).toBeInTheDocument();
            expect(screen.getByText('CFDI Score:')).toBeInTheDocument();
            expect(screen.getByText('EXECUTE TOPOLOGICAL FIT PREDICTION')).toBeInTheDocument(); // Button should revert
        }, { timeout: 1500 });
    });
});
