// components/common/ErrorMessage.jsx
import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start gap-4">
      <div className="flex-shrink-0 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-600 hover:text-red-700 font-medium text-sm whitespace-nowrap"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;