// components/customer/CustomerTable.jsx
import React from 'react';

const CustomerTable = ({ customers, onEdit, onDelete }) => {
  if (!customers || customers.length === 0) return null;

  return (
    <div>
      {/* Desktop Grid View - Cards in a grid */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div
            key={customer._id}
            className="group bg-slate-800/30 border border-slate-700/30 rounded-xl p-5 hover:border-orange-500/30 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 hover:translate-y-[-2px]"
          >
            {/* Header with Avatar and Name */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center text-orange-400 font-semibold text-lg border border-orange-500/20">
                  {customer.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors duration-200">
                    {customer.name}
                  </h3>
                  <p className="text-sm text-zinc-400">{customer.phone}</p>
                </div>
              </div>
              
              {/* Status Badge */}
              {customer.status && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  customer.status === 'active' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                }`}>
                  {customer.status}
                </span>
              )}
            </div>

            {/* Customer Details */}
            <div className="space-y-2 text-sm">
              {customer.email && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-zinc-300 truncate">{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-zinc-300">{customer.address}</span>
                </div>
              )}
              {customer.vehicleCount > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <span className="text-orange-400 font-medium">{customer.vehicleCount} vehicle{customer.vehicleCount > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-700/30">
              <button
                onClick={() => onEdit(customer._id)}
                className="px-4 py-2 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => onDelete(customer._id)}
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
        {customers.map((customer) => (
          <div key={customer._id} className="p-4 hover:bg-slate-800/20 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center text-orange-400 font-semibold text-base flex-shrink-0 border border-orange-500/20">
                  {customer.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white truncate">{customer.name}</p>
                    {customer.status === 'active' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-zinc-400">{customer.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => onEdit(customer._id)}
                  className="p-2.5 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                  aria-label="Edit customer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(customer._id)}
                  className="p-2.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  aria-label="Delete customer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile details - show additional info */}
            {(customer.email || customer.address || customer.vehicleCount > 0) && (
              <div className="mt-3 pt-3 border-t border-slate-700/30 space-y-1.5">
                {customer.email && (
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-zinc-400 truncate">{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-zinc-400 truncate">{customer.address}</span>
                  </div>
                )}
                {customer.vehicleCount > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <span className="text-orange-400 font-medium">{customer.vehicleCount} vehicle{customer.vehicleCount > 1 ? 's' : ''}</span>
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
            Showing <span className="text-zinc-300 font-medium">{customers.length}</span> customers
          </span>
          <span className="text-zinc-600">
            Total: {customers.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;