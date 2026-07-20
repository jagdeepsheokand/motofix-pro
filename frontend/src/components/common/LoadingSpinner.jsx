// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : ''} ${className}`}>
      <div className={`${spinnerSize} rounded-full border-orange-500/20 border-t-orange-500 animate-spin`}></div>
      {text && (
        <p className="mt-4 text-sm font-medium text-zinc-400 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;