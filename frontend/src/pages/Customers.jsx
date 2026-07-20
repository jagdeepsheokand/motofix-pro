// pages/Customers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../services/customerService';
import CustomerTable from '../components/customer/CustomerTable';
import { LoadingSpinner, ErrorMessage } from '../components/common';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/customers/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerService.deleteCustomer(id);
      fetchCustomers();
    } catch (err) {
      alert('Failed to delete customer');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status !== 'inactive').length;
  const newCustomers = customers.filter(c => {
    const created = new Date(c.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return created > thirtyDaysAgo;
  }).length;

  return (
    <div className="animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Customers</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your customer base • <span className="text-orange-400 font-medium">{totalCustomers}</span> total customers
          </p>
        </div>
        <button
          onClick={() => navigate('/customers/new')}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-orange-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-white">{totalCustomers}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{activeCustomers}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-orange-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">New (30d)</p>
          <p className="text-2xl font-bold text-orange-400">{newCustomers}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Vehicles</p>
          <p className="text-2xl font-bold text-blue-400">
            {customers.reduce((acc, c) => acc + (c.vehicleCount || 0), 0)}
          </p>
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
            placeholder="Search customers by name, phone or email..."
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

      {/* Loading State */}
      {loading && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading customers..." />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorMessage 
          title="Failed to load customers"
          message={error}
          onRetry={fetchCustomers}
        />
      )}

      {/* Empty State */}
      {!loading && !error && customers.length === 0 && (
        <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            👥
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No customers yet</h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
            Get started by adding your first customer. You can manage all your customer relationships here.
          </p>
          <button
            onClick={() => navigate('/customers/new')}
            className="btn-primary px-6 py-3 rounded-xl text-sm"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Customer
            </span>
          </button>
        </div>
      )}

      {/* No Search Results */}
      {!loading && !error && customers.length > 0 && filteredCustomers.length === 0 && (
        <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-1">No matching customers</h3>
          <p className="text-zinc-400 text-sm">
            No customers found matching "<span className="text-orange-400">{searchTerm}</span>"
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Customer Grid/Table */}
      {!loading && !error && filteredCustomers.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-zinc-500">
              Showing <span className="text-zinc-300 font-medium">{filteredCustomers.length}</span> of <span className="text-zinc-300 font-medium">{customers.length}</span> customers
            </span>
          </div>
          <CustomerTable 
            customers={filteredCustomers} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </>
      )}
    </div>
  );
};

export default CustomersPage;