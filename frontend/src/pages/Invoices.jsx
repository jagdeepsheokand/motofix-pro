// pages/Invoices.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import invoiceService from '../services/invoiceService';
import InvoiceTable from '../components/invoices/InvoiceTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
  });

  const navigate = useNavigate();

  const fetchInvoices = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await invoiceService.getInvoices({ 
        page, 
        limit: 20 
      });

      if (result.success) {
        setInvoices(result.data || []);
        setPagination({
          total: result.total || 0,
          pages: result.pages || 1,
          currentPage: page,
        });
      } else {
        setError(result.message || 'Failed to fetch invoices');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching invoices');
      console.error('Fetch invoices error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await invoiceService.deleteInvoice(id);
      
      if (result.success) {
        const nextPage =
    invoices.length === 1 && pagination.currentPage > 1
    ? pagination.currentPage - 1
    : pagination.currentPage;

fetchInvoices(nextPage);
      } else {
        alert(result.message || 'Failed to delete invoice');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error deleting invoice');
    }
  };

  // ✅ Updated Edit Handler - Consistent with project convention
  const handleEdit = (id) => {
    navigate(`/invoices/edit/${id}`);
  };

  const handlePageChange = (newPage) => {
    fetchInvoices(newPage);
  };

  if (loading && invoices.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage repair job invoices</p>
        </div>
        
        <Link
          to="/invoices/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <span>New Invoice</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => fetchInvoices()} />}

      <InvoiceTable 
        invoices={invoices}
        onDelete={handleDelete}
        onEdit={handleEdit}           // ← Now correctly wired
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  page === pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}

      {!loading && invoices.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 text-lg">No invoices found yet</p>
          <Link
            to="/invoices/new"
            className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium"
          >
            Create your first invoice →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Invoices;