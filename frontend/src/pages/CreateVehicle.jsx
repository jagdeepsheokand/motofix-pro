// pages/CreateVehicle.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import customerService from '../services/customerService';
import VehicleForm from '../components/vehicles/VehicleForm';
import { LoadingSpinner, ErrorMessage } from '../components/common';

const CreateVehicle = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    owner: '',
    brand: '',
    model: '',
    year: '',
    registrationNumber: '',
    fuelType: '',
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const response = await customerService.getCustomers();
        setCustomers(response);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        setError('Failed to load customers. Please try again.');
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (data) => {
    try {
      setLoadingSubmit(true);
      setError(null);

      await vehicleService.createVehicle(data);

      navigate('/vehicles', { 
        state: { message: 'Vehicle created successfully!' } 
      });
    } catch (err) {
      console.error('Failed to create vehicle:', err);
      setError(err.response?.data?.error || 'Failed to create vehicle. Please try again.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Loading state while fetching customers
  if (loadingCustomers) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading customers..." />
      </div>
    );
  }

  return (
    <div className="animate-slideUp max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/vehicles')}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 mb-4 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Vehicles
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Add New Vehicle</h1>
          <p className="text-zinc-400 text-sm mt-1">Fill in the vehicle details below</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6">
          <ErrorMessage 
            message={error}
            title="Creation Failed"
          />
        </div>
      )}

      {/* Form */}
      <div className="card card-glass rounded-2xl p-6 md:p-8">
        <VehicleForm
          formData={formData}
          setFormData={setFormData}
          customers={customers}
          onSubmit={handleSubmit}
          loading={loadingSubmit}
        />
      </div>
    </div>
  );
};

export default CreateVehicle;