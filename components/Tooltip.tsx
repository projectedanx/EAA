import React from 'react';

/**
 * @interface TooltipProps
 * @description The props for the Tooltip component.
 */
interface TooltipProps {
  /** The text to display in the tooltip. */
  content: string;
  /** The element to which the tooltip is attached. */
  children: React.ReactNode;
  /** The position of the tooltip relative to the child element. */
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * A reusable tooltip component.
 * @param {TooltipProps} props - The props for the component.
 * @returns {React.FC<TooltipProps>} The rendered tooltip component.
 */
const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group flex items-center">
      {children}
      <div
        className={`absolute ${positionClasses[position]} w-max max-w-xs p-2 text-xs text-white bg-slate-900 border border-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10`}
        role="tooltip"
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
