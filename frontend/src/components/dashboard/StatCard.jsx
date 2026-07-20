// components/dashboard/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="card card-glass rounded-2xl p-5 md:p-6 hover:border-orange-500/20 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white tracking-tight truncate">
            {value}
          </p>
        </div>
        {icon && (
          <div className="text-2xl md:text-3xl flex-shrink-0 ml-3 opacity-80 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
      </div>
      {/* Decorative bottom gradient line */}
      <div className="mt-3 h-0.5 w-12 bg-gradient-to-r from-orange-500/50 to-transparent rounded-full group-hover:w-full transition-all duration-500"></div>
    </div>
  );
};

export default StatCard;