import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import EmpiricalDocumentationRouter from '../../components/EmpiricalDocumentationRouter';

describe('EmpiricalDocumentationRouter', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('renders initial state correctly', () => {
        render(<EmpiricalDocumentationRouter />);

        expect(screen.getByText('EMPIRICAL DOCUMENTATION ROUTER')).toBeInTheDocument();
        expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
        expect(screen.getByText('High Reliability')).toBeInTheDocument();
        expect(screen.getByText('Awaiting constraints evaluation...')).toBeInTheDocument();
    });

    it('calculates topological derivative correctly and shows PARACONSISTENT_TENSION_MAINTAINED', async () => {
        const mockDate = 1000;
        const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => mockDate);

        render(<EmpiricalDocumentationRouter />);

        const button = screen.getByText('EXECUTE TOPOLOGICAL FIT PREDICTION');

        act(() => {
            fireEvent.click(button);
        });

        expect(screen.getByText('CALCULATING S5 DERIVATIVE...')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(800);
        });

        // Use standard testing instead of waitFor if we are advancing timers sequentially
        expect(screen.getByText('PARACONSISTENT_TENSION_MAINTAINED')).toBeInTheDocument();
        expect(screen.getByText('MAINTAINED (1)')).toBeInTheDocument();

        dateSpy.mockRestore();
    });

    it('calculates topological derivative correctly and shows RESOLUTION_COLLAPSE', async () => {
        const mockDate = 0;
        const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => mockDate);

        render(<EmpiricalDocumentationRouter />);

        const button = screen.getByText('EXECUTE TOPOLOGICAL FIT PREDICTION');

        act(() => {
            fireEvent.click(button);
        });

        expect(screen.getByText('CALCULATING S5 DERIVATIVE...')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(800);
        });

        expect(screen.getByText('RESOLUTION_COLLAPSE')).toBeInTheDocument();
        expect(screen.getByText('COLLAPSED (0)')).toBeInTheDocument();

        dateSpy.mockRestore();
    });
});
