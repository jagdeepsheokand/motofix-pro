// pages/CreateInvoice.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../services/invoiceService';
import repairJobService from '../services/repairJobService';
import inventoryService from '../services/inventoryService';
import InvoiceForm from '../components/invoices/InvoiceForm';
import { LoadingSpinner, ErrorMessage } from '../components/common';

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
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading data..." />
      </div>
    );
  }

  return (
    <div className="animate-slideUp max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/invoices')}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 mb-4 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Invoices
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create New Invoice</h1>
          <p className="text-zinc-400 text-sm mt-1">Generate invoice for a completed repair job</p>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage 
            message={error} 
            onRetry={fetchInitialData}
          />
        </div>
      )}

      <div className="card card-glass rounded-2xl p-6 md:p-8">
        <InvoiceForm
          repairJobs={repairJobs}
          inventoryItems={inventoryItems}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />
      </div>
    </div>
  );
};

export default CreateInvoice;