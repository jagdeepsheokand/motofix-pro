// components/inventory/InventoryTable.jsx
import React from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon 
} from '@heroicons/react/24/outline';

const InventoryTable = ({ 
  inventoryItems, 
  onEdit, 
  onDelete,
  onAdjustStock  // ✅ Added onAdjustStock prop
}) => {
  // Helper function to format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Handle empty state
  if (!inventoryItems || inventoryItems.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-500 text-lg">No inventory items found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Part Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Selling Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventoryItems.map((item) => {
              const isLowStock = item.quantity <= item.minimumStock;
              
              return (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.partName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {item.category || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={isLowStock ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.sellingPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.minimumStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isLowStock ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-1 flex-wrap">
                      {/* ✅ Add Stock Button */}
                      <button
                        onClick={() => onAdjustStock(item, 'increase')}
                        className="text-green-600 hover:text-green-900 transition-colors p-1.5 rounded hover:bg-green-50"
                        title="Add Stock"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      
                      {/* ✅ Remove Stock Button */}
                      <button
                        onClick={() => onAdjustStock(item, 'decrease')}
                        className="text-orange-600 hover:text-orange-900 transition-colors p-1.5 rounded hover:bg-orange-50"
                        title="Remove Stock"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(item._id)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1.5 rounded hover:bg-blue-50"
                        title="Edit Item"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(item._id)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1.5 rounded hover:bg-red-50"
                        title="Delete Item"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer with total count */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {inventoryItems.length} item{inventoryItems.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default InventoryTable;