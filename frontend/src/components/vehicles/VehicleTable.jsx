// components/vehicles/VehicleTable.jsx
import React from 'react';

const VehicleTable = ({ vehicles, onEdit, onDelete }) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-12 text-center">
        <div className="text-4xl mb-3">🏍️</div>
        <p className="text-zinc-400 text-sm">No vehicles found.</p>
      </div>
    );
  }

  // Helper function to get fuel type color
  const getFuelTypeColor = (fuelType) => {
    const colors = {
      'Electric': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      'Hybrid': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      'Diesel': 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      'Petrol': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      'CNG': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    };
    return colors[fuelType] || 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      'inactive': 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
      'maintenance': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      'repair': 'bg-red-500/10 text-red-400 border border-red-500/20',
    };
    return colors[status] || 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
  };

  return (
    <div>
      {/* Desktop Grid View - Cards in a grid */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            className="group bg-slate-800/30 border border-slate-700/30 rounded-xl p-5 hover:border-orange-500/30 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 hover:translate-y-[-2px]"
          >
            {/* Header with Avatar and Vehicle Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center text-orange-400 font-semibold text-lg border border-orange-500/20">
                  {vehicle.brand?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors duration-200">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-sm text-zinc-400">{vehicle.owner?.name || 'No owner'}</p>
                </div>
              </div>
              
              {/* Status Badge */}
              {vehicle.status && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="space-y-2 text-sm">
              {/* Registration Number */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-zinc-300 font-mono">{vehicle.registrationNumber || 'N/A'}</span>
              </div>

              {/* Year and Fuel Type */}
              <div className="flex items-center gap-4">
                {vehicle.year && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-zinc-300">{vehicle.year}</span>
                  </div>
                )}
                
                {vehicle.fuelType && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getFuelTypeColor(vehicle.fuelType)}`}>
                    {vehicle.fuelType}
                  </span>
                )}
              </div>

              {/* Owner Phone */}
              {vehicle.owner?.phone && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-zinc-300">{vehicle.owner.phone}</span>
                </div>
              )}

              {/* VIN if available */}
              {vehicle.vin && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0h4" />
                  </svg>
                  <span className="text-zinc-400 text-xs font-mono">VIN: {vehicle.vin}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-700/30">
              <button
                onClick={() => onEdit(vehicle._id)}
                className="px-4 py-2 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => onDelete(vehicle._id)}
                className="px-4 py-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Card View - Optimized for touch */}
      <div className="md:hidden divide-y divide-slate-700/30">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="p-4 hover:bg-slate-800/20 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center text-orange-400 font-semibold text-base flex-shrink-0 border border-orange-500/20">
                  {vehicle.brand?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white truncate">{vehicle.brand} {vehicle.model}</p>
                    {vehicle.status === 'active' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-zinc-400">{vehicle.owner?.name || 'No owner'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => onEdit(vehicle._id)}
                  className="p-2.5 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                  aria-label="Edit vehicle"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(vehicle._id)}
                  className="p-2.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  aria-label="Delete vehicle"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile details - show additional info */}
            {(vehicle.registrationNumber || vehicle.fuelType || vehicle.year || vehicle.owner?.phone) && (
              <div className="mt-3 pt-3 border-t border-slate-700/30 space-y-1.5">
                {vehicle.registrationNumber && (
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-zinc-400 font-mono">{vehicle.registrationNumber}</span>
                  </div>
                )}
                {(vehicle.fuelType || vehicle.year) && (
                  <div className="flex items-center gap-3 text-xs">
                    {vehicle.year && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-zinc-400">{vehicle.year}</span>
                      </div>
                    )}
                    {vehicle.fuelType && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getFuelTypeColor(vehicle.fuelType)}`}>
                        {vehicle.fuelType}
                      </span>
                    )}
                  </div>
                )}
                {vehicle.owner?.phone && (
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-zinc-400">{vehicle.owner.phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-700/30 bg-slate-800/20 rounded-b-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <span className="text-zinc-500">
            Showing <span className="text-zinc-300 font-medium">{vehicles.length}</span> vehicles
          </span>
          <span className="text-zinc-600">
            Total: {vehicles.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VehicleTable;