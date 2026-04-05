import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Header from '../../components/Header';
import { CognitiveMode } from '../../types';

describe('Header Component', () => {
  it('renders correctly with the initial cognitive mode', () => {
    render(<Header cognitiveMode={CognitiveMode.EXPLORATORY} setCognitiveMode={vi.fn()} />);

    expect(screen.getByText('Epistemic Audit System')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: CognitiveMode.EXPLORATORY })).toBeInTheDocument();
  });

  it('opens the dropdown when the button is clicked', () => {
    render(<Header cognitiveMode={CognitiveMode.CREATIVE} setCognitiveMode={vi.fn()} />);

    const button = screen.getByRole('button', { name: CognitiveMode.CREATIVE });
    fireEvent.click(button);

    expect(screen.getByRole('list')).toBeInTheDocument();

    // Check if all modes are present in the dropdown
    Object.values(CognitiveMode).forEach(mode => {
      const elements = screen.getAllByText(mode);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('calls setCognitiveMode and closes the dropdown when a mode is selected', () => {
    const setCognitiveModeMock = vi.fn();
    render(<Header cognitiveMode={CognitiveMode.EXPLORATORY} setCognitiveMode={setCognitiveModeMock} />);

    const button = screen.getByRole('button', { name: CognitiveMode.EXPLORATORY });
    fireEvent.click(button);

    // Find the buttons in the list.
    const auditOption = screen.getAllByText(CognitiveMode.AUDIT).find(
      (el) => el.tagName.toLowerCase() === 'button' && el.closest('li')
    );

    if (auditOption) {
      fireEvent.click(auditOption);
    } else {
      throw new Error('Audit option not found');
    }

    expect(setCognitiveModeMock).toHaveBeenCalledWith(CognitiveMode.AUDIT);

    // The dropdown list should no longer be in the document
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside of it', () => {
    render(<Header cognitiveMode={CognitiveMode.CREATIVE} setCognitiveMode={vi.fn()} />);

    const button = screen.getByRole('button', { name: CognitiveMode.CREATIVE });
    fireEvent.click(button);

    // Dropdown should be open
    expect(screen.getByRole('list')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);

    // Dropdown should be closed
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
