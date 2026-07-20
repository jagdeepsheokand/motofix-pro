// src/components/customer/CustomerForm.jsx
import React, { useState, useEffect } from 'react';

const CustomerForm = ({ 
  initialValues = {}, 
  onSubmit, 
  loading = false, 
  submitButtonText = "Save Customer" 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  // Populate form when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        name: initialValues.name || '',
        phone: initialValues.phone || '',
        email: initialValues.email || '',
        address: initialValues.address || '',
      });
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Phone - Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Name <span className="text-orange-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-200 text-white placeholder-zinc-500 ${
                errors.name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-orange-500/50'
              }`}
              placeholder="John Doe"
              required
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
              <span>⚠️</span> {errors.name}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Phone <span className="text-orange-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-200 text-white placeholder-zinc-500 ${
                errors.phone ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-orange-500/50'
              }`}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
          {errors.phone && (
            <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
              <span>⚠️</span> {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-200 text-white placeholder-zinc-500 ${
              errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-orange-500/50'
            }`}
            placeholder="john.doe@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            <span>⚠️</span> {errors.email}
          </p>
        )}
      </div>

      {/* Address Field */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Address
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 flex items-start pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 text-white placeholder-zinc-500 resize-y"
            placeholder="123 Main Street, City, State, ZIP"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-slate-700/30">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8 py-3 rounded-xl text-sm flex items-center gap-2"
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
              {submitButtonText}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;