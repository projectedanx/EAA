
import React from 'react';

/**
 * HistoryIcon component renders an SVG icon.
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Optional CSS class names to apply to the SVG element.
 * @returns {React.ReactElement} The SVG icon element.
 */
const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);
export default HistoryIcon;
