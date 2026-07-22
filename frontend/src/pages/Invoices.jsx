// pages/Invoices.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import invoiceService from '../services/invoiceService';
import InvoiceTable from '../components/invoices/InvoiceTable';
import { LoadingSpinner, ErrorMessage } from '../components/common';
import { toast } from "react-toastify";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
          total: result.pagination?.total || 0,
          pages: result.pagination?.pages || 1,
          currentPage: page,
        });
      } else {
        toast.error(result.message || "Failed to fetch invoices");
        setError(result.message || "Failed to fetch invoices");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching invoices');
      console.error('Fetch invoices error:', err);
      toast.error("Failed to load invoices");
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
        await fetchInvoices(nextPage);
        toast.success("Invoice deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete invoice");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Error deleting invoice"
      );
    }
  };

  const handleEdit = (id) => {
    navigate(`/invoices/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/invoices/${id}`);
  };

  const handlePageChange = (newPage) => {
    fetchInvoices(newPage);
  };

  // Filter invoices based on search
  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vehicle?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.paymentStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalInvoices = invoices.length;
  
  const paidInvoices = invoices.filter(i => {
    const status = i.paymentStatus?.toLowerCase() || '';
    return status === 'paid';
  }).length;
  
  const unpaidInvoices = invoices.filter(i => {
    const status = i.paymentStatus?.toLowerCase() || '';
    return status === 'unpaid' || status === 'pending' || status === 'partial';
  }).length;

  const totalUnpaidAmount = invoices
    .filter(i => {
      const status = i.paymentStatus?.toLowerCase() || '';
      return status === 'unpaid' || status === 'pending' || status === 'partial';
    })
    .reduce((sum, i) => sum + (i.total || i.totalAmount || 0), 0);

  if (loading && invoices.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading invoices..." />
      </div>
    );
  }

  return (
    <div className="animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Invoices</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage repair job invoices • <span className="text-orange-400 font-medium">{totalInvoices}</span> total invoices
          </p>
        </div>
        <Link
          to="/invoices/new"
          className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Invoice
        </Link>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-orange-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Invoices</p>
          <p className="text-2xl font-bold text-white">{totalInvoices}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Paid</p>
          <p className="text-2xl font-bold text-emerald-400">{paidInvoices}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-yellow-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Unpaid</p>
          <p className="text-2xl font-bold text-yellow-400">{unpaidInvoices}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Unpaid</p>
          <p className="text-2xl font-bold text-red-400">₹{totalUnpaidAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice number, customer, vehicle or status..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200"
          />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => fetchInvoices()}
          className="mb-6"
        />
      )}

      {/* Empty State */}
      {!loading && !error && invoices.length === 0 && (
        <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            📄
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No invoices yet</h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
            Create your first invoice for a completed repair job.
          </p>
          <Link
            to="/invoices/new"
            className="btn-primary px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Invoice
          </Link>
        </div>
      )}

      {/* No Search Results */}
      {!loading && !error && invoices.length > 0 && filteredInvoices.length === 0 && (
        <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-1">No matching invoices</h3>
          <p className="text-zinc-400 text-sm">
            No invoices found matching "<span className="text-orange-400">{searchTerm}</span>"
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Invoice Grid/Table */}
      {!loading && !error && filteredInvoices.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-zinc-500">
              Showing <span className="text-zinc-300 font-medium">{filteredInvoices.length}</span> of <span className="text-zinc-300 font-medium">{invoices.length}</span> invoices
            </span>
          </div>
          <InvoiceTable 
            invoices={filteredInvoices}
            onView={handleView}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  page === pagination.currentPage
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-slate-800/50 text-zinc-400 hover:text-white border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Invoices;