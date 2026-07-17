// components/inventory/InventoryForm.jsx
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
  // Form state
  const [formData, setFormData] = useState({
    partName: '',
    sku: '',
    category: '',
    description: '',
    quantity: '',
    minimumStock: '',
    costPrice: '',
    sellingPrice: '',
    supplier: '',
    location: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        partName: initialData.partName || '',
        sku: initialData.sku || '',
        category: initialData.category || '',
        description: initialData.description || '',
        quantity: initialData.quantity?.toString() || '',
        minimumStock: initialData.minimumStock?.toString() || '',
        costPrice: initialData.costPrice?.toString() || '',
        sellingPrice: initialData.sellingPrice?.toString() || '',
        supplier: initialData.supplier || '',
        location: initialData.location || ''
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field on blur
    const fieldError = validateField(name, formData[name]);
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };

  // Validate a single field
  const validateField = (name, value) => {
    const requiredFields = ['partName', 'sku', 'category', 'quantity', 'minimumStock', 'costPrice', 'sellingPrice'];
    
    if (requiredFields.includes(name) && !value.toString().trim()) {
      return `${name.replace(/([A-Z])/g, ' $1').trim()} is required`;
    }

    // Numeric validations
    if (['quantity', 'minimumStock', 'costPrice', 'sellingPrice'].includes(name)) {
      const numValue = parseFloat(value);
      if (value && (isNaN(numValue) || numValue < 0)) {
        return `${name.replace(/([A-Z])/g, ' $1').trim()} must be a positive number`;
      }
    }

    return '';
  };

  // Validate entire form - returns errors object
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['partName', 'sku', 'category', 'quantity', 'minimumStock', 'costPrice', 'sellingPrice'];
    
    requiredFields.forEach(field => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form and get errors
    const newErrors = validateForm();
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.focus();
        }
      }
      return;
    }

    // Prepare submission data - convert numeric strings to numbers and trim text
    const submissionData = {
      partName: formData.partName.trim(),
      sku: formData.sku.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      supplier: formData.supplier.trim(),
      location: formData.location.trim(),
      quantity: parseInt(formData.quantity) || 0,
      minimumStock: parseInt(formData.minimumStock) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0
    };

    // Call parent's onSubmit handler
    onSubmit(submissionData);
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Helper to determine if field has error
  const hasError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  // Input field renderer with label and error
  const renderField = (label, name, type = "text", placeholder = "", required = false) => {
    const isTextarea = type === "textarea";
    const isNumber = type === "number";
    
    // Determine step attribute for number inputs
    let step = "1";
    if (isNumber) {
      if (name === 'costPrice' || name === 'sellingPrice') {
        step = "0.01"; // Currency fields can have decimals
      } else {
        step = "1"; // Quantity fields are integers
      }
    }
    
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
              ${hasError(name) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500'}`}
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
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
              ${hasError(name) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            placeholder={placeholder}
            disabled={isLoading}
          />
        )}
        {hasError(name) && (
          <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      {/* Form Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div>
          {renderField("Part Name", "partName", "text", "Enter part name", true)}
          {renderField("SKU", "sku", "text", "Enter SKU (e.g., BRK-001)", true)}
          {renderField("Category", "category", "text", "Enter category (e.g., Brake Parts)", true)}
          {renderField("Description", "description", "textarea", "Enter part description", false)}
        </div>

        {/* Right Column */}
        <div>
          {renderField("Quantity", "quantity", "number", "Enter quantity in stock", true)}
          {renderField("Minimum Stock", "minimumStock", "number", "Enter minimum stock level", true)}
          {renderField("Cost Price (₹)", "costPrice", "number", "Enter cost price", true)}
          {renderField("Selling Price (₹)", "sellingPrice", "number", "Enter selling price", true)}
          {renderField("Supplier", "supplier", "text", "Enter supplier name", false)}
          {renderField("Location", "location", "text", "Enter storage location (e.g., Shelf A-1)", false)}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;