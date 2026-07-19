// pages/CreateInvoice.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../services/invoiceService';
import repairJobService from '../services/repairJobService';
import inventoryService from '../services/inventoryService';
import InvoiceForm from '../components/invoices/InvoiceForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const CreateInvoice = () => {
  const [repairJobs, setRepairJobs] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [repairResult, inventoryResult] = await Promise.all([
        repairJobService.getRepairJobs(),
        inventoryService.getInventoryItems()
      ]);

      setRepairJobs(repairResult.data || repairResult || []);
      setInventoryItems(inventoryResult.data || inventoryResult || []);

    } catch (err) {
      console.error('Failed to fetch initial data:', err);
      setError('Failed to load repair jobs or inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      const result = await invoiceService.createInvoice(formData);

      if (result.success) {
        navigate('/invoices');
      } else {
        setError(result.message || 'Failed to create invoice');
      }
    } catch (err) {
      // Show real backend validation messages
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create invoice';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/invoices');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
          <p className="text-gray-600 mt-2">Generate invoice for a completed repair job</p>
        </div>

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={fetchInitialData}
            className="mb-6"
          />
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <InvoiceForm
            repairJobs={repairJobs}
            inventoryItems={inventoryItems}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;