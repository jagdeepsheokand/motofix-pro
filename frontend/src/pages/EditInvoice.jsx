// pages/EditInvoice.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import invoiceService from '../services/invoiceService';
import repairJobService from '../services/repairJobService';
import inventoryService from '../services/inventoryService';
import InvoiceForm from '../components/invoices/InvoiceForm';
import { LoadingSpinner, ErrorMessage } from '../components/common';

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [repairJobs, setRepairJobs] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [invoiceResult, repairResult, inventoryResult] = await Promise.all([
        invoiceService.getInvoice(id),
        repairJobService.getRepairJobs(),
        inventoryService.getInventoryItems()
      ]);

      setInvoice(invoiceResult.data || invoiceResult);
      setRepairJobs(repairResult.data || repairResult || []);
      setInventoryItems(inventoryResult.data || inventoryResult || []);

    } catch (err) {
      console.error('Failed to fetch invoice data:', err);
      setError('Failed to load invoice details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      const result = await invoiceService.updateInvoice(id, formData);

      if (result.success) {
        navigate('/invoices');
      } else {
        setError(result.message || 'Failed to update invoice');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update invoice';
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
        <LoadingSpinner size="lg" text="Loading invoice details..." />
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div className="animate-slideUp max-w-4xl mx-auto">
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
        </div>
        <ErrorMessage 
          message={error} 
          onRetry={fetchData}
        />
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Invoice</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Invoice #<span className="text-orange-400">{invoice?.invoiceNumber || id}</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage 
            message={error} 
            onRetry={fetchData}
          />
        </div>
      )}

      <div className="card card-glass rounded-2xl p-6 md:p-8">
        <InvoiceForm
          repairJobs={repairJobs}
          inventoryItems={inventoryItems}
          initialData={invoice}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />
      </div>
    </div>
  );
};

export default EditInvoice;