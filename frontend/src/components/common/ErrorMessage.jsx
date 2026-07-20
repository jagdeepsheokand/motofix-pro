// src/components/common/ErrorMessage.jsx
import React from 'react';

const ErrorMessage = ({ 
  message, 
  onRetry, 
  title = 'Error',
  icon = true,
  className = '' 
}) => {
  return (
    <div className={`card card-glass rounded-2xl p-6 border-red-500/20 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-red-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1">
          {title && (
            <h4 className="text-sm font-semibold text-red-400 mb-1">{title}</h4>
          )}
          <p className="text-sm text-zinc-300">{message}</p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-shrink-0 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl font-medium text-sm transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;