import React from 'react';

interface CardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  actions?: React.ReactNode;
}

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