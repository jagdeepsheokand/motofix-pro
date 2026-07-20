import React, { useState, useEffect } from 'react';
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md  mx-3 sm:mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-700/50">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Adjust Stock
            </h3>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6">
            {/* Item Info */}
            <div className="mb-5 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Part Name</p>
              <p className="font-semibold text-white mt-0.5">{item.partName}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                <p className="text-sm text-zinc-400">SKU: <span className="text-orange-400">{item.sku}</span></p>
                <p className="text-sm text-zinc-400">
                  Current Stock: <span className="font-bold text-blue-400">{item.quantity}</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Adjustment Type Toggle */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentTypeState('increase')}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      adjustmentTypeState === 'increase'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800/50 text-zinc-400 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Increase
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentTypeState('decrease')}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      adjustmentTypeState === 'decrease'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-slate-800/50 text-zinc-400 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                    Decrease
                  </button>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Quantity <span className="text-orange-400">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200"
                  placeholder="Enter quantity"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* Preview */}
              <div className="mb-5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-400">
                  After adjustment:
                  <span className="font-bold ml-1">
                    {adjustmentTypeState === 'increase' 
                      ? (item.quantity + (parseInt(quantity) || 0))
                      : (item.quantity - (parseInt(quantity) || 0))
                    }
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    adjustmentTypeState === 'increase'
                      ? 'btn-primary'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner spinner-sm"></div>
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