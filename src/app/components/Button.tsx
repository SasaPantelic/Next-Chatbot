import React from 'react';

const Button = ({ 
  children,
  className,
  text, onClick, type = 'button', size = 'medium', color = 'red', rounded = 'md' }) => {
  const sizes = {
    small: 'py-1 px-3 text-xs',
    medium: 'py-2 px-4 text-sm',
    large: 'py-3 px-5 text-lg',
  };

  const colors = {
    blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    gray: 'bg-gray-500 hover:bg-gray-600 text-white',
    green: 'bg-green-500 hover:bg-green-600 text-white',
    red: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${sizes[size]} ${colors[color]} ${roundedStyles[rounded]} font-medium transition duration-300 ease-in-out ${className}`}
    >
      {children || text}
    </button>
  );
};

export default Button;