
import React from 'react';

/**
 * BarChartIcon component renders an SVG icon.
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Optional CSS class names to apply to the SVG element.
 * @returns {React.ReactElement} The SVG icon element.
 */
const BarChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);
export default BarChartIcon;
