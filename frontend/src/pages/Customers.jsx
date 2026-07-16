import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../services/customerService';
import CustomerTable from '../components/customer/CustomerTable';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    navigate(`/customers/edit/${id}`); // ← Navigate to edit page
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerService.deleteCustomer(id);
      fetchCustomers(); // Refresh list
    } catch (err) {
      alert('Failed to delete customer');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <button
          onClick={() => navigate('/customers/new')} // ← Navigate to create page
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          + Add Customer
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={fetchCustomers} className="underline hover:no-underline">Retry</button>
        </div>
      )}

      {!loading && !error && customers.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">👥</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first customer</p>
          <button
            onClick={() => navigate('/customers/new')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Add Your First Customer
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && customers.length > 0 && (
        <CustomerTable 
          customers={customers} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
};

export default CustomersPage;