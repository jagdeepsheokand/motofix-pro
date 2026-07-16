import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import customerService from '../services/customerService';
import CustomerForm from '../components/customer/CustomerForm';

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
      navigate('/customers', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update customer. Please try again.');
      console.error('Update customer error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !customer) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/customers')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate('/customers')}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
        >
          ← Back to Customers
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Customer</h1>
        <p className="text-gray-600 mt-1">Update customer information</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
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