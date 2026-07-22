// src/components/inventory/InventoryForm.jsx
import React, { useState, useEffect } from 'react';

const InventoryForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  isLoading = false,
  buttonText = "Create Item",
  cancelText = "Cancel",
  error = null
}) => {
  const [formData, setFormData] = useState({
    partName: '',
    sku: '',
    category: '',
    description: '',
    quantity: '',
    minimumStock: '',
    purchasePrice: '',
    sellingPrice: '',
    supplier: '',
    location: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        partName: initialData.partName || '',
        sku: initialData.sku || '',
        category: initialData.category || '',
        description: initialData.description || '',
        quantity: initialData.quantity?.toString() || '',
        minimumStock: initialData.minimumStock?.toString() || '',
        purchasePrice: initialData.purchasePrice?.toString() || '',
        sellingPrice: initialData.sellingPrice?.toString() || '',
        supplier: initialData.supplier || '',
        location: initialData.location || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const fieldError = validateField(name, formData[name]);
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };

  const validateField = (name, value) => {
    const requiredFields = ['partName', 'sku', 'category', 'quantity', 'minimumStock', 'purchasePrice', 'sellingPrice'];
    
    if (requiredFields.includes(name) && !value.toString().trim()) {
      return `${name.replace(/([A-Z])/g, ' $1').trim()} is required`;
    }

    if (['quantity', 'minimumStock', 'purchasePrice', 'sellingPrice'].includes(name)) {
      const numValue = parseFloat(value);
      if (value && (isNaN(numValue) || numValue < 0)) {
        return `${name.replace(/([A-Z])/g, ' $1').trim()} must be a positive number`;
      }
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['partName', 'sku', 'category', 'quantity', 'minimumStock', 'purchasePrice', 'sellingPrice'];
    
    requiredFields.forEach(field => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.focus();
        }
      }
      return;
    }

    const submissionData = {
      partName: formData.partName.trim(),
      sku: formData.sku.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      supplier: formData.supplier.trim(),
      location: formData.location.trim(),
      quantity: parseInt(formData.quantity) || 0,
      minimumStock: parseInt(formData.minimumStock) || 0,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0
    };

    onSubmit(submissionData);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const hasError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  const renderField = (label, name, type = "text", placeholder = "", required = false) => {
    const isTextarea = type === "textarea";
    const isNumber = type === "number";
    
    let step = "1";
    if (isNumber) {
      if (name === 'purchasePrice' || name === 'sellingPrice') {
        step = "0.01";
      } else {
        step = "1";
      }
    }
    
    const iconMap = {
      partName: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      sku: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      category: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      quantity: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
 
      supplier: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      location: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    };

    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-zinc-300 mb-1.5">
          {label} {required && <span className="text-orange-400">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-zinc-500">{iconMap[name]}</span>
          </div>
          {isTextarea ? (
            <textarea
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="3"
              className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200 resize-y ${
                hasError(name) ? 'border-red-500/50' : 'border-slate-700/50'
              }`}
              placeholder={placeholder}
              disabled={isLoading}
            />
          ) : (
            <input
              type={isNumber ? "number" : "text"}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              step={step}
              min="0"
              className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200 ${
                hasError(name) ? 'border-red-500/50' : 'border-slate-700/50'
              }`}
              placeholder={placeholder}
              disabled={isLoading}
            />
          )}
        </div>
        {hasError(name) && (
          <p className="mt-1 text-sm text-red-400">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          {renderField("Part Name", "partName", "text", "Enter part name", true)}
          {renderField("SKU", "sku", "text", "Enter SKU (e.g., BRK-001)", true)}
          {renderField("Category", "category", "text", "Enter category (e.g., Brake Parts)", true)}
          {renderField("Description", "description", "textarea", "Enter part description", false)}
        </div>

        <div>
          {renderField("Quantity", "quantity", "number", "Enter quantity in stock", true)}
          {renderField("Minimum Stock", "minimumStock", "number", "Enter minimum stock level", true)}
          {renderField("Purchase Price (₹)", "purchasePrice", "number", "Enter purchase price", true)}
          {renderField("Selling Price (₹)", "sellingPrice", "number", "Enter selling price", true)}
          {renderField("Supplier", "supplier", "text", "Enter supplier name", false)}
          {renderField("Location", "location", "text", "Enter storage location (e.g., Shelf A-1)", false)}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-700/30">
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-200"
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary px-6 py-3 rounded-xl text-sm flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="spinner spinner-sm"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {buttonText}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;