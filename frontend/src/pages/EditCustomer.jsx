// pages/EditCustomer.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import customerService from '../services/customerService';
import CustomerForm from '../components/customer/CustomerForm';
import { LoadingSpinner, ErrorMessage } from '../components/common';
import { toast } from "react-toastify";

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customer details
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const data = await customerService.getCustomerById(id);
        setCustomer(data);
      } catch (err) {
        setError('Failed to load customer details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError(null);

    try {
     await customerService.updateCustomer(id, formData);

  toast.success("Customer updated successfully!");

  navigate("/customers", { replace: true });
    } catch (err) {
       const errorMessage =
    err.response?.data?.message ||
    "Failed to update customer. Please try again.";

  setError(errorMessage);
  toast.error(errorMessage);

  console.error("Update customer error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading customer details..." />
      </div>
    );
  }

  // Error State (Customer not found)
  if (error && !customer) {
    return (
      <div className="animate-slideUp max-w-3xl mx-auto">
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
        </div>
        <ErrorMessage 
          title="Customer Not Found"
          message={error}
          onRetry={() => navigate('/customers')}
        />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Customer</h1>
          <p className="text-zinc-400 text-sm mt-1">Update customer information</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6">
          <ErrorMessage 
            message={error}
            title="Update Failed"
          />
        </div>
      )}

      {/* Form */}
      <div className="card card-glass rounded-2xl p-6 md:p-8">
        <CustomerForm 
          initialValues={customer}
          onSubmit={handleSubmit} 
          loading={saving}
          submitButtonText="Update Customer"
        />
      </div>
    </div>
  );
};

export default EditCustomer;