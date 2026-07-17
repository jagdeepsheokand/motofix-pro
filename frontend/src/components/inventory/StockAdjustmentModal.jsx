// components/inventory/StockAdjustmentModal.jsx
import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import inventoryService from '../../services/inventoryService';

const StockAdjustmentModal = ({ 
  isOpen, 
  onClose, 
  item, 
  onSuccess,
  adjustmentType = 'increase'
}) => {
  const [adjustmentTypeState, setAdjustmentTypeState] = useState(adjustmentType);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setQuantity('');
      setError(null);
      setAdjustmentTypeState(adjustmentType);
    }
  }, [isOpen, adjustmentType]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (adjustmentTypeState === 'decrease' && qty > item.quantity) {
      setError(`Insufficient stock. Available: ${item.quantity}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (adjustmentTypeState === 'increase') {
        await inventoryService.increaseStock(item._id, qty);
      } else {
        await inventoryService.decreaseStock(item._id, qty);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error adjusting stock:', err);
      setError(err.response?.data?.message || 'Failed to adjust stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Adjust Stock
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Part Name</p>
              <p className="font-semibold text-gray-900">{item.partName}</p>
              <p className="text-sm text-gray-600 mt-1">SKU: {item.sku}</p>
              <p className="text-sm text-gray-600">
                Current Stock: <span className="font-bold text-blue-600">{item.quantity}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentTypeState('increase')}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      adjustmentTypeState === 'increase'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <PlusIcon className="h-5 w-5" />
                    Increase
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentTypeState('decrease')}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      adjustmentTypeState === 'decrease'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <MinusIcon className="h-5 w-5" />
                    Decrease
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quantity"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  After adjustment:
                  <span className="font-bold ml-1">
                    {adjustmentTypeState === 'increase' 
                      ? (item.quantity + (parseInt(quantity) || 0))
                      : (item.quantity - (parseInt(quantity) || 0))
                    }
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    adjustmentTypeState === 'increase'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Save ${adjustmentTypeState === 'increase' ? 'Increase' : 'Decrease'}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default StockAdjustmentModal;