import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UncertaintyReports from '../../components/UncertaintyReports';
import * as exportUtils from '../../exportUtils';

// Mock the downloadCSV function
vi.mock('../../exportUtils', () => ({
  downloadCSV: vi.fn(),
  downloadJSON: vi.fn(),
  escapeCSV: vi.fn(),
}));

describe('UncertaintyReports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<UncertaintyReports />);

    expect(screen.getByText('Justified Uncertainty Reports')).toBeInTheDocument();
    expect(screen.getByText(/Review diagnostic reports generated when the AI expresses uncertainty/i)).toBeInTheDocument();
    expect(screen.getByText('Recent Reports')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
  });

  it('renders all mock reports in the table', () => {
    render(<UncertaintyReports />);

    const queries = [
      "What is the emotional state of the color 'blurple'?",
      "Provide a complete list of every insect species on Earth.",
      "Simultaneously act as a legal expert and a creative poet in your response.",
      "Calculate the precise trajectory of all asteroids in the Kuiper Belt for the next 1000 years."
    ];

    queries.forEach(query => {
      expect(screen.getByText(new RegExp(query, 'i'))).toBeInTheDocument();
    });

    const reasons = ['Semantic Ambiguity', 'Data Scarcity', 'Constraint Conflict', 'High Computational Cost'];
    reasons.forEach(reason => {
      expect(screen.getByText(reason)).toBeInTheDocument();
    });

    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('99%')).toBeInTheDocument();
  });

  it('calls downloadCSV when the Export CSV button is clicked', () => {
    render(<UncertaintyReports />);

    const exportButton = screen.getByRole('button', { name: /Export CSV/i });
    fireEvent.click(exportButton);

    expect(exportUtils.downloadCSV).toHaveBeenCalledTimes(1);
    expect(exportUtils.downloadCSV).toHaveBeenCalledWith(
      expect.any(Array),
      'uncertainty-reports.csv'
    );

    // Verify it passes the expected data (matching mockReports in the component)
    const passedData = vi.mocked(exportUtils.downloadCSV).mock.calls[0][0];
    expect(passedData).toHaveLength(4);
    expect(passedData[0].query).toBe("What is the emotional state of the color 'blurple'?");
  });
});
