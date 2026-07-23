// pages/CreateInventoryItem.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import inventoryService from '../services/inventoryService';
import InventoryForm from '../components/inventory/inventoryForm';
import { ErrorMessage } from '../components/common';

const CreateInventoryItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await inventoryService.createInventoryItem(formData);
      navigate('/inventory');
    } catch (err) {
      console.error('Error creating inventory item:', err);
      setError(err.response?.data?.message || 'Failed to create inventory item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

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
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Inventory Item</h1>
          <p className="text-zinc-400 text-sm mt-1">Add a new part or accessory to your inventory</p>
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

      <div className="card card-glass rounded-2xl p-6 md:p-8">
        <InventoryForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          buttonText="Create Item"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default CreateInventoryItem;