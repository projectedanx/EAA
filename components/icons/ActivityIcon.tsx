import React from 'react';

/**
 * ActivityIcon component renders an SVG icon.
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Optional CSS class names to apply to the SVG element.
 * @returns {React.ReactElement} The SVG icon element.
 */
const ActivityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export default ActivityIcon;
