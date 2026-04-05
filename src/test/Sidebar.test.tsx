import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../../components/Sidebar';
import { View } from '../../types';

describe('Sidebar Component', () => {
  it('renders the sidebar and static content correctly', () => {
    const mockSetActiveView = vi.fn();
    render(<Sidebar activeView={View.DESIGNER} setActiveView={mockSetActiveView} />);

    // Verify static content
    expect(screen.getByText('CognitiveOS Core')).toBeInTheDocument();
    expect(screen.getByText('Epistemic Architect AI')).toBeInTheDocument();
  });

  it('applies the correct active styling to the active NavItem', () => {
    const mockSetActiveView = vi.fn();
    render(<Sidebar activeView={View.SCARS} setActiveView={mockSetActiveView} />);

    // The active item should have the specific active classes
    const activeItem = screen.getByText('Symbolic Scar Manager').closest('button');
    expect(activeItem).toHaveClass('bg-cyan-500/10');
    expect(activeItem).toHaveClass('text-cyan-400');

    // An inactive item should NOT have the active classes
    const inactiveItem = screen.getByText('Meta-PRP Designer').closest('button');
    expect(inactiveItem).not.toHaveClass('bg-cyan-500/10');
    expect(inactiveItem).toHaveClass('text-slate-400');
  });

  it('calls setActiveView with the correct View when a NavItem is clicked', () => {
    const mockSetActiveView = vi.fn();
    render(<Sidebar activeView={View.DESIGNER} setActiveView={mockSetActiveView} />);

    // Click on a different NavItem
    const reportsItem = screen.getByText('Uncertainty Reports');
    fireEvent.click(reportsItem);

    // Verify the mock function was called correctly
    expect(mockSetActiveView).toHaveBeenCalledTimes(1);
    expect(mockSetActiveView).toHaveBeenCalledWith(View.REPORTS);
  });
});
