// components/repairJobs/RepairJobTable.jsx
import React from 'react';

const RepairJobTable = ({ repairJobs, onEdit, onDelete }) => {
  if (!repairJobs || repairJobs.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-12 text-center">
        <div className="text-4xl mb-3">🔧</div>
        <p className="text-zinc-400 text-sm">No repair jobs found.</p>
      </div>
    );
  }

  // Helper function to get status badge config
  const getStatusConfig = (status) => {
    const statusConfig = {
      PENDING: { 
        color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        dot: '🟡',
        label: 'Pending'
      },
      DIAGNOSIS: { 
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        dot: '🔵',
        label: 'Diagnosis'
      },
      IN_PROGRESS: { 
        color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        dot: '🟠',
        label: 'In Progress'
      },
      COMPLETED: { 
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dot: '🟢',
        label: 'Completed'
      },
      CANCELLED: { 
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
        dot: '🔴',
        label: 'Cancelled'
      },
    };

    return statusConfig[status] || { 
      color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
      dot: '⚪',
      label: status || 'Unknown'
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '₹0';
  };

  const getTotalCost = (job) => {
    if (job.totalCost !== undefined) return job.totalCost;
    return (job.totalLaborCost || 0) + (job.totalPartsCost || 0);
  };

  return (
    <div>
      {/* Desktop Grid View - Cards in a grid */}
      <div className=" md:grid hidden grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {repairJobs.map((job) => {
          const totalCost = getTotalCost(job);
          const statusConfig = getStatusConfig(job.status);

          return (
            <div
              key={job._id}
              className="group bg-slate-800/30 border border-slate-700/30 rounded-xl p-5 hover:border-orange-500/30 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 hover:translate-y-[-2px]"
            >
              {/* Header with Job Number and Status */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-orange-400">
                      {job.jobNumber || '—'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors duration-200">
                    {job.vehicle?.brand} {job.vehicle?.model}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {job.vehicle?.registrationNumber || 'No registration'}
                  </p>
                </div>
                
                {/* Status Badge */}
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                  <span className="flex items-center gap-1">
                    <span>{statusConfig.dot}</span>
                    {statusConfig.label}
                  </span>
                </span>
              </div>

              {/* Job Details */}
              <div className="space-y-2 text-sm">
                {/* Customer */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-zinc-300">
                    {job.customer?.name || job.vehicle?.owner?.name || '—'}
                  </span>
                </div>

                {/* Arrival Date */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-zinc-400">{formatDate(job.arrivalDate)}</span>
                </div>

                {/* Description (if available) */}
                {job.description && (
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span className="text-zinc-400 line-clamp-2">{job.description}</span>
                  </div>
                )}

                {/* Total Cost */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-700/30">
               
                  <span className="text-emerald-400 font-bold text-base">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-700/30">
                <button
                  onClick={() => onEdit(job._id)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200 text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(job._id)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Card View - Optimized for touch */}
      <div className="md:hidden divide-y divide-slate-700/30">
        {repairJobs.map((job) => {
          const totalCost = getTotalCost(job);
          const statusConfig = getStatusConfig(job.status);

          return (
            <div key={job._id} className="p-4 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-medium text-orange-400">
                      {job.jobNumber || '—'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                      {statusConfig.dot} {statusConfig.label}
                    </span>
                  </div>
                  <p className="font-medium text-white truncate">
                    {job.vehicle?.brand} {job.vehicle?.model}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {job.vehicle?.registrationNumber || 'No registration'}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => onEdit(job._id)}
                    className="p-2.5 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                    aria-label="Edit repair job"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(job._id)}
                    className="p-2.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    aria-label="Delete repair job"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile details - show additional info */}
              <div className="mt-3 pt-3 border-t border-slate-700/30 space-y-1.5">
                {/* Customer */}
                {(job.customer?.name || job.vehicle?.owner?.name) && (
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-zinc-400">{job.customer?.name || job.vehicle?.owner?.name}</span>
                  </div>
                )}

                {/* Arrival Date */}
                {job.arrivalDate && (
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-zinc-400">{formatDate(job.arrivalDate)}</span>
                  </div>
                )}

                {/* Total Cost */}
                <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-700/30">
                 
                  <span className="text-emerald-400 font-bold">
                    {formatCurrency(totalCost)}
                  </span>
                </div>

                {/* Description (if available) */}
                {job.description && (
                  <div className="flex items-start gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span className="text-zinc-400 line-clamp-2">{job.description}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-700/30 bg-slate-800/20 rounded-b-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <span className="text-zinc-500">
            Showing <span className="text-zinc-300 font-medium">{repairJobs.length}</span> repair jobs
          </span>
          <span className="text-zinc-600">
            Total: {repairJobs.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RepairJobTable;