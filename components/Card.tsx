import React from 'react';

/**
 * @interface CardProps
 * @description The props for the Card component.
 */
interface CardProps {
  /** The title of the card. */
  title: React.ReactNode;
  /** The content of the card. */
  children: React.ReactNode;
  /** An optional CSS class to apply to the card. */
  className?: string;
  /** An optional CSS class to apply to the title. */
  titleClassName?: string;
  /** Optional action elements to display in the card header. */
  actions?: React.ReactNode;
}

/**
 * A reusable card component.
 * @param {CardProps} props - The props for the component.
 * @returns {React.FC<CardProps>} The rendered card component.
 */
const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', actions }) => {
  return (
    <div className={`bg-slate-800/70 border border-slate-700 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold text-white ${titleClassName}`}>{title}</h3>
        {actions && <div>{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Card;