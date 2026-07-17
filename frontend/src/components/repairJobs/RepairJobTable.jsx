// components/repairJobs/RepairJobTable.jsx
import React from 'react';

const RepairJobTable = ({ repairJobs, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', emoji: '🟡' },
      DIAGNOSIS: { color: 'bg-blue-100 text-blue-800', emoji: '🔵' },
      IN_PROGRESS: { color: 'bg-orange-100 text-orange-800', emoji: '🟠' },
      COMPLETED: { color: 'bg-green-100 text-green-800', emoji: '🟢' },
      CANCELLED: { color: 'bg-red-100 text-red-800', emoji: '🔴' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', emoji: '⚪' };

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <span>{config.emoji}</span>
        {status}
      </span>
    );
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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Job No.</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vehicle</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Arrival Date</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Cost</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {repairJobs.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                No repair jobs found.
              </td>
            </tr>
          ) : (
            repairJobs.map((job) => {
              const totalCost = getTotalCost(job);

              return (
                <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {job.jobNumber || '—'}
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {job.vehicle?.brand} {job.vehicle?.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {job.vehicle?.registrationNumber || '—'}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {job.customer?.name || job.vehicle?.owner?.name || '—'}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(job.status)}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(job.arrivalDate)}
                  </td>

                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    {formatCurrency(totalCost)}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => onEdit(job._id)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(job._id)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RepairJobTable;