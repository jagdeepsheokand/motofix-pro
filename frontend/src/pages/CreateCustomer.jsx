import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../services/customerService';
import CustomerForm from '../components/customer/CustomerForm';

const CreateCustomer = () => {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await customerService.createCustomer(formData);
      navigate('/customers', { replace: true }); // Go back to list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create customer. Please try again.');
      console.error('Create customer error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate('/customers')}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
        >
          ← Back to Customers
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Add New Customer</h1>
        <p className="text-gray-600 mt-1">Enter the details of the new customer</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <CustomerForm 
          onSubmit={handleSubmit} 
          loading={loading}
          submitButtonText="Create Customer"
        />
      </div>
    </div>
  );
};

export default CreateCustomer;