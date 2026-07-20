// src/components/invoices/InvoiceForm.jsx
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Repair Job */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Repair Job <span className="text-orange-400">*</span>
        </label>
        {repairJobs.length === 0 ? (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
            No repair jobs available for invoicing.
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <select
              name="repairJob"
              value={formData.repairJob}
              onChange={handleChange}
              required
              disabled={isEditing || loading}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white transition-all duration-200 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" className="bg-slate-800">Select a repair job</option>
              {repairJobs.map(job => (
                <option key={job._id} value={job._id} className="bg-slate-800">
                  {job.jobNumber} — {job.customer?.name} ({job.vehicle?.registrationNumber})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Parts */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-zinc-300">
            Parts Used
          </label>
          <button
            type="button"
            onClick={addPart}
            disabled={loading}
            className="text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Part
          </button>
        </div>

        {inventoryItems.length === 0 ? (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
            No inventory items available.
          </div>
        ) : (
          <div className="space-y-3">
            {formData.parts.map((part, index) => (
              <div key={index} className="flex gap-3 items-end bg-slate-800/30 border border-slate-700/30 p-4 rounded-xl">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Part Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <select
                      value={part.partName}
                      onChange={(e) => handlePartChange(index, 'partName', e.target.value)}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white transition-all duration-200 appearance-none disabled:opacity-50"
                      required
                    >
                      <option value="" className="bg-slate-800">Select part from inventory</option>
                      {inventoryItems.map(item => (
                        <option key={item._id} value={item.partName} className="bg-slate-800">
                          {item.partName} - ₹{item.sellingPrice}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={part.quantity}
                    onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white transition-all duration-200 disabled:opacity-50"
                    required
                  />
                </div>
                {formData.parts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePart(index)}
                    disabled={loading}
                    className="text-red-400 hover:text-red-300 transition-colors pb-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Labor Charge (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-zinc-500 font-medium">₹</span>
            </div>
            <input
              type="number"
              name="laborCharge"
              value={formData.laborCharge}
              onChange={handleChange}
              min="0"
              disabled={loading}
              className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200 disabled:opacity-50"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Tax (%)
          </label>
          <input
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
            min="0"
            max="100"
            disabled={loading}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200 disabled:opacity-50"
            placeholder="18"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Discount (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-zinc-500 font-medium">₹</span>
            </div>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              disabled={loading}
              className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200 disabled:opacity-50"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Payment Status <span className="text-orange-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            disabled={loading}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white transition-all duration-200 appearance-none disabled:opacity-50"
          >
            <option value="Pending" className="bg-slate-800">Pending</option>
            <option value="Partial" className="bg-slate-800">Partial</option>
            <option value="Paid" className="bg-slate-800">Paid</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Notes
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 flex items-start pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            disabled={loading}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200 resize-y disabled:opacity-50"
            placeholder="Additional notes about this invoice..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-700/30">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="btn-primary px-8 py-3 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="spinner spinner-sm"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {isEditing ? 'Update Invoice' : 'Create Invoice'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;