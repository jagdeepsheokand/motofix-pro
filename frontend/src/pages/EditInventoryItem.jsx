// pages/EditInventoryItem.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import inventoryService from '../services/inventoryService';
import InventoryForm from '../components/inventory/inventoryForm';
import { LoadingSpinner, ErrorMessage } from '../components/common';
import { toast } from 'react-toastify';
const EditInventoryItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsFetching(true);
        setError(null);
        
        const item = await inventoryService.getInventoryItem(id);
        setInitialData(item);
      } catch (err) {
        console.error('Error fetching inventory item:', err);
        setError('Failed to load inventory item. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await inventoryService.updateInventoryItem(id, formData);
      navigate('/inventory');
    } catch (err) {
      console.error('Error updating inventory item:', err);
      setError(err.response?.data?.message || 'Failed to update inventory item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  const handleRetry = async () => {
    try {
      setIsFetching(true);
      setError(null);
      
      const item = await inventoryService.getInventoryItem(id);
      setInitialData(item);
    } catch (err) {
      console.error('Error fetching inventory item:', err);
      setError('Failed to load inventory item. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading inventory item..." />
      </div>
    );
  }

  // Error state
  if (error && !initialData) {
    return (
      <div className="animate-slideUp max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/inventory')}
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 mb-4 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Inventory
          </button>
        </div>
        <ErrorMessage 
          title="Error loading inventory item"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="animate-slideUp max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/inventory')}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 mb-4 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Inventory
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Inventory Item</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Update details for <span className="text-orange-400">{initialData?.partName || 'inventory item'}</span>
          </p>
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

      <div className="card card-glass rounded-2xl p-6 md:p-8">
        <InventoryForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          buttonText="Update Item"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default EditInventoryItem;