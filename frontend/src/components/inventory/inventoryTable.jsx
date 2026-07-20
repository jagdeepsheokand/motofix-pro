// components/inventory/InventoryTable.jsx
import React from 'react';

const InventoryTable = ({ 
  inventoryItems, 
  onEdit, 
  onDelete,
  onAdjustStock
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!inventoryItems || inventoryItems.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-12 text-center">
        <div className="text-4xl mb-3">📦</div>
        <p className="text-zinc-400 text-sm">No inventory items found.</p>
      </div>
    );
  }

  // Helper function to get status config
  const getStatusConfig = (item) => {
    const isOutOfStock = item.quantity === 0;
    const isLowStock = item.quantity <= item.minimumStock;

    if (isOutOfStock) {
      return {
        label: 'Out of Stock',
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
        dot: '🔴'
      };
    } else if (isLowStock) {
      return {
        label: 'Low Stock',
        color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        dot: '🟡'
      };
    } else {
      return {
        label: 'In Stock',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dot: '🟢'
      };
    }
  };

  return (
    <div>
      {/* Desktop Grid View - Cards in a grid */}
      {/* FIXED: Added hidden md:grid to hide on mobile and show on desktop */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {inventoryItems.map((item) => {
          const statusConfig = getStatusConfig(item);
          const isLowStock = item.quantity <= item.minimumStock;
          const isOutOfStock = item.quantity === 0;

          return (
            <div
              key={item._id}
              className=" group bg-slate-800/30 border border-slate-700/30 rounded-xl p-5 hover:border-orange-500/30 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 hover:translate-y-[-2px]"
            >
              {/* Header with SKU and Status */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-orange-400">
                      {item.sku}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors duration-200">
                    {item.partName}
                  </h3>
                  {item.category && (
                    <p className="text-sm text-zinc-400">{item.category}</p>
                  )}
                </div>
                
                {/* Status Badge */}
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                  <span className="flex items-center gap-1">
                    <span>{statusConfig.dot}</span>
                    {statusConfig.label}
                  </span>
                </span>
              </div>

              {/* Item Details */}
              <div className="space-y-2 text-sm">
                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="text-zinc-300">
                    Quantity: <span className={`font-bold ${isOutOfStock ? 'text-red-400' : isLowStock ? 'text-yellow-400' : 'text-white'}`}>
                      {item.quantity}
                    </span>
                  </span>
                  {item.minimumStock && (
                    <span className="text-zinc-500 text-xs">
                      (Min: {item.minimumStock})
                    </span>
                  )}
                </div>

                {/* Price - REMOVED SVG DOLLAR SIGN */}
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-medium">
                    {formatCurrency(item.sellingPrice)}
                  </span>
                  {item.costPrice && (
                    <span className="text-zinc-500 text-xs">
                      Cost: {formatCurrency(item.costPrice)}
                    </span>
                  )}
                </div>

                {/* Supplier */}
                {item.supplier && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-zinc-400">{item.supplier}</span>
                  </div>
                )}

                {/* Description */}
                {item.description && (
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-700/30">
                    <svg className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span className="text-zinc-400 text-xs line-clamp-2">{item.description}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-700/30">
                <button
                  onClick={() => onAdjustStock(item, 'increase')}
                  className="px-4 py-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all duration-200 text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Stock
                </button>
                
                <button
                  onClick={() => onAdjustStock(item, 'decrease')}
                  className="px-4 py-2 rounded-lg text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-all duration-200 text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                  Remove Stock
                </button>
                
                <button
                  onClick={() => onEdit(item._id)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                  title="Edit Item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => onDelete(item._id)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  title="Delete Item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Card View - Optimized for touch */}
      <div className="md:hidden divide-y divide-slate-700/30">
        {inventoryItems.map((item) => {
          const statusConfig = getStatusConfig(item);
          const isLowStock = item.quantity <= item.minimumStock;
          const isOutOfStock = item.quantity === 0;

          return (
            <div key={item._id} className="p-4 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-medium text-orange-400">
                      {item.sku}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig.color}`}>
                      {statusConfig.dot} {statusConfig.label}
                    </span>
                  </div>
                  <p className="font-medium text-white truncate">{item.partName}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-zinc-400">
                      Qty: <span className={`font-bold ${isOutOfStock ? 'text-red-400' : isLowStock ? 'text-yellow-400' : 'text-white'}`}>
                        {item.quantity}
                      </span>
                    </span>
                    <span className="text-emerald-400 font-medium">
                      {formatCurrency(item.sellingPrice)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => onAdjustStock(item, 'increase')}
                    className="p-2.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all duration-200"
                    aria-label="Add stock"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onAdjustStock(item, 'decrease')}
                    className="p-2.5 rounded-lg text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-all duration-200"
                    aria-label="Remove stock"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onEdit(item._id)}
                    className="p-2.5 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                    aria-label="Edit item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="p-2.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    aria-label="Delete item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile details - show additional info */}
              {(item.category || item.supplier || item.description || item.minimumStock) && (
                <div className="mt-3 pt-3 border-t border-slate-700/30 space-y-1.5">
                  {item.category && (
                    <div className="flex items-center gap-2 text-xs">
                      <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-zinc-400">{item.category}</span>
                      {item.minimumStock && (
                        <span className="text-zinc-500">• Min: {item.minimumStock}</span>
                      )}
                    </div>
                  )}
                  {item.supplier && (
                    <div className="flex items-center gap-2 text-xs">
                      <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-zinc-400">{item.supplier}</span>
                    </div>
                  )}
                  {item.description && (
                    <div className="flex items-start gap-2 text-xs">
                      <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      <span className="text-zinc-400 line-clamp-2">{item.description}</span>
                    </div>
                  )}
                  {item.costPrice && (
                    <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-700/30">
                      <span className="text-zinc-400">Cost: {formatCurrency(item.costPrice)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-700/30 bg-slate-800/20 rounded-b-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <span className="text-zinc-500">
            Showing <span className="text-zinc-300 font-medium">{inventoryItems.length}</span> item{inventoryItems.length !== 1 ? "s" : ""}
          </span>
          <span className="text-zinc-600">
            Total: {inventoryItems.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;