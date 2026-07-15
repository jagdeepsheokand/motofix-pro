import React from 'react';

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
      <div className="text-3xl font-semibold text-gray-900">{value}</div>
    </div>
  );
};

export default StatCard;