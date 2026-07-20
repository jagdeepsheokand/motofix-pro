// components/invoices/InvoiceTable.jsx
import React from 'react';

const InvoiceTable = ({ invoices, onView, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!invoices || invoices.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-12 text-center">
        <div className="text-4xl mb-3">📄</div>
        <p className="text-zinc-400 text-sm">No invoices found.</p>
      </div>
    );
  }

  // Helper function to get status config
  const getStatusConfig = (status) => {
    const statusConfig = {
      Paid: { 
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dot: '🟢',
        label: 'Paid'
      },
      Partial: { 
        color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        dot: '🟡',
        label: 'Partial'
      },
      Pending: { 
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
        dot: '🔴',
        label: 'Pending'
      },
      Unpaid: { 
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
        dot: '🔴',
        label: 'Unpaid'
      },
    };

    return statusConfig[status] || { 
      color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
      dot: '⚪',
      label: status || 'Unknown'
    };
  };

  return (
    <div>
      {/* Desktop Grid View - Cards in a grid */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {invoices.map((invoice) => {
          const statusConfig = getStatusConfig(invoice.paymentStatus);

          return (
            <div
              key={invoice._id}
              className="group bg-slate-800/30 border border-slate-700/30 rounded-xl p-5 hover:border-orange-500/30 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 hover:translate-y-[-2px]"
            >
              {/* Header with Invoice Number and Status */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-orange-400">
                      {invoice.invoiceNumber || 'N/A'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors duration-200">
                    {invoice.customer?.name || 'No customer'}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {invoice.vehicle?.registrationNumber || 'No vehicle'}
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

              {/* Invoice Details */}
              <div className="space-y-2 text-sm">
                {/* Repair Job */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-zinc-400">
                    Repair Job: <span className="text-zinc-300">{invoice.repairJob?.jobNumber || 'N/A'}</span>
                  </span>
                </div>

                {/* Total Amount */}
                <div className="flex items-center gap-2">
                 
                  <span className="text-emerald-400 font-bold text-base">
                    {formatCurrency(invoice.total || 0)}
                  </span>
                </div>

                {/* Created Date */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-700/30">
                  <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-zinc-400 text-xs">
                    {invoice.createdAt
                      ? new Date(invoice.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Buttons - View, Edit, Delete */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-700/30">
                {/* View Button */}
                <button
                  onClick={() => onView(invoice._id)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z" />
                  </svg>
                  View
                </button>
                
                {/* Edit Button */}
                <button
                  onClick={() => onEdit(invoice._id)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200 text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                
                {/* Delete Button */}
                <button
                  onClick={() => onDelete(invoice._id)}
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
        {invoices.map((invoice) => {
          const statusConfig = getStatusConfig(invoice.paymentStatus);

          return (
            <div key={invoice._id} className="p-4 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-medium text-orange-400">
                      {invoice.invoiceNumber || 'N/A'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig.color}`}>
                      {statusConfig.dot} {statusConfig.label}
                    </span>
                  </div>
                  <p className="font-medium text-white truncate">{invoice.customer?.name || 'No customer'}</p>
                  <p className="text-sm text-zinc-400">{invoice.vehicle?.registrationNumber || 'No vehicle'}</p>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  {/* View Button - Mobile */}
                  <button
                    onClick={() => onView(invoice._id)}
                    className="p-2.5 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                    aria-label="View invoice"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z" />
                    </svg>
                  </button>
                  
                  {/* Edit Button - Mobile */}
                  <button
                    onClick={() => onEdit(invoice._id)}
                    className="p-2.5 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                    aria-label="Edit invoice"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  {/* Delete Button - Mobile */}
                  <button
                    onClick={() => onDelete(invoice._id)}
                    className="p-2.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    aria-label="Delete invoice"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile details - show additional info */}
              <div className="mt-3 pt-3 border-t border-slate-700/30 space-y-1.5">
                {/* Repair Job */}
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-zinc-400">
                    Job: <span className="text-zinc-300">{invoice.repairJob?.jobNumber || 'N/A'}</span>
                  </span>
                </div>

                {/* Total Amount */}
                <div className="flex items-center gap-2 text-xs">
                  
                  <span className="text-emerald-400 font-bold">
                    {formatCurrency(invoice.total || 0)}
                  </span>
                </div>

                {/* Created Date */}
                {invoice.createdAt && (
                  <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-700/30">
                    <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-zinc-400">
                      {new Date(invoice.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
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
            Showing <span className="text-zinc-300 font-medium">{invoices.length}</span> invoice{invoices.length !== 1 ? "s" : ""}
          </span>
          <span className="text-zinc-600">
            Total: {invoices.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;