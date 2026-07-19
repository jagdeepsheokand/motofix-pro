// components/invoices/InvoiceTable.jsx
import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const getStatusBadge = (status) => {
  const statusConfig = {
    Paid: { 
      color: 'bg-green-100 text-green-800', 
      label: 'Paid' 
    },
    Partial: { 
      color: 'bg-yellow-100 text-yellow-800', 
      label: 'Partial' 
    },
    Pending: { 
      color: 'bg-red-100 text-red-800', 
      label: 'Pending' 
    },
  };

  const config = statusConfig[status] || { 
    color: 'bg-gray-100 text-gray-800', 
    label: status || 'Unknown' 
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const InvoiceTable = ({ invoices, onEdit, onDelete }) => {
  if (!invoices || invoices.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Repair Job
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {invoice.invoiceNumber || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                  {invoice.repairJob?.jobNumber || 'N/A'}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.customer?.name || 'N/A'}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                  {invoice.vehicle?.registrationNumber || 'N/A'}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatCurrency(invoice.total?? 0)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {getStatusBadge(invoice.paymentStatus)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                  {invoice.createdAt
                    ? new Date(invoice.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(invoice._id)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      title="Edit Invoice"
                      aria-label={`Edit invoice ${invoice.invoiceNumber || invoice._id}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(invoice._id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Delete Invoice"
                      aria-label={`Delete invoice ${invoice.invoiceNumber || invoice._id}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.595 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.595-1.858L5 7m5-4v6m4-6v6m1-10V9a1 1 0 00-1 1v1M12 4v6m2-3v6" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;