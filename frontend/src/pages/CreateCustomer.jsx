// pages/CreateCustomer.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../services/customerService';
import CustomerForm from '../components/customer/CustomerForm';
import { ErrorMessage } from '../components/common';

const CreateCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await customerService.createCustomer(formData);
      navigate('/customers', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create customer. Please try again.');
      console.error('Create customer error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slideUp max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/customers')}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 mb-4 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Customers
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Add New Customer</h1>
          <p className="text-zinc-400 text-sm mt-1">Enter the details of the new customer</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6">
          <ErrorMessage 
            message={error}
            title="Creation Failed"
          />
        </div>
      )}

      {/* Form */}
      <div className="card card-glass rounded-2xl p-6 md:p-8">
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