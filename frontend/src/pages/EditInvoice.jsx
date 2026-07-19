// pages/EditInvoice.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import invoiceService from '../services/invoiceService';
import repairJobService from '../services/repairJobService';
import inventoryService from '../services/inventoryService';
import InvoiceForm from '../components/invoices/InvoiceForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

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
    return <LoadingSpinner />;
  }

  if (error && !invoice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Invoice</h1>
          <p className="text-gray-600 mt-2">
            Invoice #{invoice?.invoiceNumber || id}
          </p>
        </div>

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={fetchData}
            className="mb-6"
          />
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
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
    </div>
  );
};

export default EditInvoice;