import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Tooltip from '../../components/Tooltip';

describe('Tooltip', () => {
  it('renders children correctly', () => {
    render(
      <Tooltip content="Tooltip Content">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('renders tooltip content with default position classes (top)', () => {
    render(
      <Tooltip content="Tooltip Content">
        <button>Hover me</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Tooltip Content');
    // Check for default position (top)
    expect(tooltip).toHaveClass('bottom-full left-1/2 -translate-x-1/2 mb-2');
  });

  it('applies correct classes for bottom position', () => {
    render(
      <Tooltip content="Tooltip Content" position="bottom">
        <button>Hover me</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('top-full left-1/2 -translate-x-1/2 mt-2');
  });

  it('applies correct classes for left position', () => {
    render(
      <Tooltip content="Tooltip Content" position="left">
        <button>Hover me</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('right-full top-1/2 -translate-y-1/2 mr-2');
  });

  it('applies correct classes for right position', () => {
    render(
      <Tooltip content="Tooltip Content" position="right">
        <button>Hover me</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('left-full top-1/2 -translate-y-1/2 ml-2');
  });

  it('contains classes for css hover interactions', () => {
    render(
      <Tooltip content="Tooltip Content">
        <button>Hover me</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole('tooltip');
    // Initially invisible
    expect(tooltip).toHaveClass('opacity-0');
    // Becomes visible on group hover
    expect(tooltip).toHaveClass('group-hover:opacity-100');
  });
});
