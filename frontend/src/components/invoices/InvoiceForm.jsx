// components/invoices/InvoiceForm.jsx
import React, { useState, useEffect } from 'react';

const InvoiceForm = ({
  repairJobs = [],
  inventoryItems = [],
  initialData = {},
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    repairJob: '',
    parts: [{ partName: '', quantity: 1 }],
    laborCharge: 0,
    tax: 0,
    discount: 0,
    paymentStatus: 'Pending',
    notes: '',
  });

  const isEditing = !!initialData._id;

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        repairJob: initialData.repairJob?._id || initialData.repairJob || '',
        parts: initialData.parts?.length > 0 
          ? initialData.parts.map(p => ({
              partName: p.partName || '',
              quantity: p.quantity || 1,
            }))
          : [{ partName: '', quantity: 1 }],
        laborCharge: initialData.laborCharge || 0,
        tax: initialData.tax || 0,
        discount: initialData.discount || 0,
        paymentStatus: initialData.paymentStatus || 'Pending',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...formData.parts];
    updatedParts[index] = {
      ...updatedParts[index],
      [field]: field === 'quantity' ? Number(value) || 1 : value
    };
    setFormData(prev => ({ ...prev, parts: updatedParts }));
  };

  const addPart = () => {
    setFormData(prev => ({
      ...prev,
      parts: [...prev.parts, { partName: '', quantity: 1 }]
    }));
  };

  const removePart = (index) => {
    if (formData.parts.length === 1) return;
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanParts = formData.parts.filter(p => p.partName?.trim());
    onSubmit({ ...formData, parts: cleanParts });
  };

  const isFormValid = repairJobs.length > 0 && inventoryItems.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Repair Job */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Repair Job</h3>
        {repairJobs.length === 0 ? (
          <p className="text-amber-600">No repair jobs available for invoicing.</p>
        ) : (
          <select
            name="repairJob"
            value={formData.repairJob}
            onChange={handleChange}
            required
            disabled={isEditing || loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select a repair job</option>
            {repairJobs.map(job => (
              <option key={job._id} value={job._id}>
                {job.jobNumber} — {job.customer?.name} ({job.vehicle?.registrationNumber})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Parts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Parts Used</h3>
          <button type="button" onClick={addPart} disabled={loading} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            + Add Part
          </button>
        </div>

        {inventoryItems.length === 0 ? (
          <p className="text-amber-600">No inventory items available.</p>
        ) : (
          <div className="space-y-4">
            {formData.parts.map((part, index) => (
              <div key={index} className="flex gap-4 items-end border border-gray-200 p-4 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Part Name</label>
                  <select
                    value={part.partName}
                    onChange={(e) => handlePartChange(index, 'partName', e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select part from inventory</option>
                    {inventoryItems.map(item => (
                      <option key={item._id} value={item.partName}>
                        {item.partName} - ₹{item.sellingPrice}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={part.quantity}
                    onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {formData.parts.length > 1 && (
                  <button type="button" onClick={() => removePart(index)} disabled={loading} className="text-red-600 hover:text-red-700 pb-3">✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rest of form (Charges, Payment, Notes) with disabled state */}
      {/* ... (same as before but with disabled={loading} on all inputs) */}

      <div className="flex justify-end gap-4 pt-6 border-t">
        <button type="button" onClick={onCancel} disabled={loading} className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
        >
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isEditing ? 'Update Invoice' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;