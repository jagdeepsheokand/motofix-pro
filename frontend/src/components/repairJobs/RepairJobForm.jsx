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

  // Populate form for Edit mode
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

  // Only for Create mode
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
      estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : 0,
      totalPartsCost: formData.totalPartsCost ? Number(formData.totalPartsCost) : 0,
      totalLaborCost: formData.totalLaborCost ? Number(formData.totalLaborCost) : 0,
      amountPaid: formData.amountPaid ? Number(formData.amountPaid) : 0,
    };

    onSubmit(payload);
  };

  // Get customer name for display
  const getCustomerName = () => {
    if (initialData.customer?.name) return initialData.customer.name;
    if (initialData.vehicle?.owner?.name) return initialData.vehicle.owner.name;
    
    const selectedVehicle = vehicles.find(v => v._id === formData.vehicle);
    return selectedVehicle?.owner?.name || "Customer will be auto-filled";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle - Read Only in Edit Mode */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle <span className="text-red-500">*</span>
          </label>
          
          {isEditMode ? (
            <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
              {initialData.vehicle?.brand} {initialData.vehicle?.model} 
              {' '}({initialData.vehicle?.registrationNumber})
            </div>
          ) : (
            <select
              name="vehicle"
              value={formData.vehicle}
              onChange={handleVehicleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.registrationNumber} - {vehicle.brand} {vehicle.model}
                </option>
              ))}
            </select>
          )}
          {errors.vehicle && <p className="text-red-500 text-sm mt-1">{errors.vehicle}</p>}
        </div>

        {/* Customer Name - Read Only */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
            {getCustomerName()}
          </div>
        </div>

        {/* Customer Complaint */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Complaint <span className="text-red-500">*</span>
          </label>
          <textarea
            name="customerComplaint"
            value={formData.customerComplaint}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the issue reported by the customer..."
            required
          />
          {errors.customerComplaint && <p className="text-red-500 text-sm mt-1">{errors.customerComplaint}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="PENDING">Pending</option>
            <option value="DIAGNOSIS">Diagnosis</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Estimated Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
          <input
            type="number"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleChange}
            min="0"
            step="0.5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Arrival Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Estimated Delivery Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Date</label>
          <input
            type="date"
            name="estimatedDeliveryDate"
            value={formData.estimatedDeliveryDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Diagnostic Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic Notes</label>
          <textarea
            name="diagnosticNotes"
            value={formData.diagnosticNotes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Initial diagnostic observations..."
          />
        </div>

        {/* Cost fields - Only in Edit Mode */}
        {isEditMode && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Parts Cost (₹)</label>
              <input
                type="number"
                name="totalPartsCost"
                value={formData.totalPartsCost}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Labor Cost (₹)</label>
              <input
                type="number"
                name="totalLaborCost"
                value={formData.totalLaborCost}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
              <input
                type="number"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}
      </div>

      <div className="pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Saving...' : isEditMode ? 'Update Repair Job' : 'Create Repair Job'}
        </button>
      </div>
    </form>
  );
};

export default RepairJobForm;