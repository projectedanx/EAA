import React from 'react';

/**
 * TestTubeIcon component renders an SVG icon.
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Optional CSS class names to apply to the SVG element.
 * @returns {React.ReactElement} The SVG icon element.
 */
const TestTubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2" />
    <path d="M8.5 2h7" />
    <path d="M14.5 16h-5" />
  </svg>
);

export default TestTubeIcon;
