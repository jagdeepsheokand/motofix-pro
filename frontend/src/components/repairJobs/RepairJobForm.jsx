// src/components/repairJobs/RepairJobForm.jsx
import React, { useState, useEffect } from 'react';

const initialFormState = {
  vehicle: '',
  customer: '',
  customerComplaint: '',
  diagnosticNotes: '',
  status: 'PENDING',
  estimatedHours: '',
  arrivalDate: '',
  estimatedDeliveryDate: '',
  totalPartsCost: '',
  totalLaborCost: '',
  amountPaid: '',
};

const RepairJobForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  vehicles = [],
  isEditMode = false
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        vehicle: initialData.vehicle?._id || initialData.vehicle || '',
        customer: initialData.customer?._id || initialData.customer || '',
        customerComplaint: initialData.customerComplaint || '',
        diagnosticNotes: initialData.diagnosticNotes || '',
        status: initialData.status || 'PENDING',
        estimatedHours: initialData.estimatedHours || '',
        arrivalDate: initialData.arrivalDate 
          ? new Date(initialData.arrivalDate).toISOString().split('T')[0] 
          : '',
        estimatedDeliveryDate: initialData.estimatedDeliveryDate 
          ? new Date(initialData.estimatedDeliveryDate).toISOString().split('T')[0] 
          : '',
        totalPartsCost: initialData.totalPartsCost || '',
        totalLaborCost: initialData.totalLaborCost || '',
        amountPaid: initialData.amountPaid || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    const selectedVehicle = vehicles.find(v => v._id === vehicleId);

    setFormData(prev => ({
      ...prev,
      vehicle: vehicleId,
      customer: selectedVehicle?.owner?._id || selectedVehicle?.owner || '',
    }));

    if (errors.vehicle) {
      setErrors(prev => ({ ...prev, vehicle: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vehicle) newErrors.vehicle = "Vehicle is required";
    if (!formData.customerComplaint?.trim()) newErrors.customerComplaint = "Customer complaint is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

  const payload = {
  ...formData,
  estimatedHours: Number(formData.estimatedHours) || 0,
  totalPartsCost: Number(formData.totalPartsCost) || 0,
  totalLaborCost: Number(formData.totalLaborCost) || 0,
  amountPaid: Number(formData.amountPaid) || 0,
};

if (isEditMode) {
  delete payload.vehicle;
  delete payload.customer;
}

onSubmit(payload);
  };

  const getCustomerName = () => {
    if (initialData.customer?.name) return initialData.customer.name;
    if (initialData.vehicle?.owner?.name) return initialData.vehicle.owner.name;
    
    const selectedVehicle = vehicles.find(v => v._id === formData.vehicle);
    return selectedVehicle?.owner?.name || "Customer will be auto-filled";
  };

  // Status options with colors
  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'yellow' },
    { value: 'DIAGNOSIS', label: 'Diagnosis', color: 'blue' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'orange' },
    { value: 'COMPLETED', label: 'Completed', color: 'green' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Vehicle - Read Only in Edit Mode */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Vehicle <span className="text-orange-400">*</span>
          </label>
          
          {isEditMode ? (
            <div className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white">
              {initialData.vehicle?.brand} {initialData.vehicle?.model} 
              {' '}({initialData.vehicle?.registrationNumber})
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleVehicleChange}
                className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white transition-all duration-200 appearance-none ${
                  errors.vehicle ? 'border-red-500/50' : 'border-slate-700/50'
                }`}
                required
              >
                <option value="" className="bg-slate-800">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id} className="bg-slate-800">
                    {vehicle.registrationNumber} - {vehicle.brand} {vehicle.model}
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
          {errors.vehicle && <p className="text-red-400 text-sm mt-1">{errors.vehicle}</p>}
        </div>

        {/* Customer Name - Read Only */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Customer</label>
          <div className="w-full px-4 py-3 bg-slate-800/30 border border-slate-700/50 rounded-xl text-zinc-400">
            {getCustomerName()}
          </div>
        </div>

        {/* Customer Complaint */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Customer Complaint <span className="text-orange-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <textarea
              name="customerComplaint"
              value={formData.customerComplaint}
              onChange={handleChange}
              rows={3}
              className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200 resize-y ${
                errors.customerComplaint ? 'border-red-500/50' : 'border-slate-700/50'
              }`}
              placeholder="Describe the issue reported by the customer..."
              required
            />
          </div>
          {errors.customerComplaint && <p className="text-red-400 text-sm mt-1">{errors.customerComplaint}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Status</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white transition-all duration-200 appearance-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-800">
                  {option.label}
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

        {/* Estimated Hours */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Estimated Hours</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <input
              type="number"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              min="0"
              step="0.5"
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200"
              placeholder="e.g. 4.5"
            />
          </div>
        </div>

        {/* Arrival Date */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Arrival Date</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Estimated Delivery Date */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Estimated Delivery Date</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              name="estimatedDeliveryDate"
              value={formData.estimatedDeliveryDate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Diagnostic Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Diagnostic Notes</label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <textarea
              name="diagnosticNotes"
              value={formData.diagnosticNotes}
              onChange={handleChange}
              rows={3}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200 resize-y"
              placeholder="Initial diagnostic observations..."
            />
          </div>
        </div>

        {/* Cost fields - Only in Edit Mode */}
        {isEditMode && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Total Parts Cost (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-zinc-500 font-medium">₹</span>
                </div>
                <input
                  type="number"
                  name="totalPartsCost"
                  value={formData.totalPartsCost}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Total Labor Cost (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-zinc-500 font-medium">₹</span>
                </div>
                <input
                  type="number"
                  name="totalLaborCost"
                  value={formData.totalLaborCost}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Amount Paid (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-zinc-500 font-medium">₹</span>
                </div>
                <input
                  type="number"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200"
                  placeholder="0"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-slate-700/30">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-10 py-3 rounded-xl text-sm flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="spinner spinner-sm"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {isEditMode ? 'Update Repair Job' : 'Create Repair Job'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default RepairJobForm;