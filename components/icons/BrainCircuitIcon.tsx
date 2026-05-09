
import React from 'react';

/**
 * BrainCircuitIcon component renders an SVG icon.
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Optional CSS class names to apply to the SVG element.
 * @returns {React.ReactElement} The SVG icon element.
 */
const BrainCircuitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 5a3 3 0 1 0-5.993.131" />
    <path d="M12 5a3 3 0 0 0-5.993.131" />
    <path d="M15 5a3 3 0 1 0-5.993.131" />
    <path d="M15 5a3 3 0 0 0-5.993.131" />
    <path d="M12 19a3 3 0 1 0-5.993-.131" />
    <path d="M12 19a3 3 0 0 0-5.993-.131" />
    <path d="M15 19a3 3 0 1 0-5.993-.131" />
    <path d="M15 19a3 3 0 0 0-5.993-.131" />
    <path d="M21 12a3 3 0 1 0-.131-5.993" />
    <path d="M21 12a3 3 0 0 0-.131-5.993" />
    <path d="M3 12a3 3 0 1 0 .131 5.993" />
    <path d="M3 12a3 3 0 0 0 .131 5.993" />
    <path d="M12 12a3 3 0 1 0-5.993.131" />
    <path d="M12 12a3 3 0 0 0-5.993.131" />
    <path d="M12 8V5" />
    <path d="M12 19v-3" />
    <path d="M15 12h3" />
    <path d="M6 12H3" />
    <path d="M9 15.5 6.5 14" />
    <path d="M15 15.5 17.5 14" />
    <path d="M9 8.5 6.5 10" />
    <path d="M15 8.5 17.5 10" />
  </svg>
);
export default BrainCircuitIcon;
