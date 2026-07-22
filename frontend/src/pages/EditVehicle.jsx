// pages/EditVehicle.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import customerService from '../services/customerService';
import VehicleForm from '../components/vehicles/VehicleForm';
import { LoadingSpinner, ErrorMessage } from '../components/common';
import { toast } from "react-toastify";

const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [customersResponse, vehicleResponse] = await Promise.all([
          customerService.getCustomers(),
          vehicleService.getVehicleById(id)
        ]);

        setCustomers(customersResponse);

        const veh = vehicleResponse;
        setFormData({
          owner: veh.owner?._id || veh.owner || '',
          brand: veh.brand || '',
          model: veh.model || '',
          year: veh.year || '',
          registrationNumber: veh.registrationNumber || '',
          fuelType: veh.fuelType || '',
        });
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err.response?.data?.error || 'Failed to load vehicle details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      setLoadingSubmit(true);
      setError(null);

     await vehicleService.updateVehicle(id, data);

toast.success("Vehicle updated successfully!");

navigate("/vehicles");
    } catch (err) {
  console.error("Failed to update vehicle:", err);

  const errorMessage =
    err.response?.data?.error ||
    "Failed to update vehicle. Please try again.";

  setError(errorMessage);
  toast.error(errorMessage);
} finally {
      setLoadingSubmit(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading vehicle details..." />
      </div>
    );
  }

  // Error state
  if (error && !formData.brand) {
    return (
      <div className="animate-slideUp max-w-3xl mx-auto">
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
        </div>
        <ErrorMessage 
          title="Vehicle Not Found"
          message={error}
          onRetry={() => navigate('/vehicles')}
        />
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Vehicle</h1>
          <p className="text-zinc-400 text-sm mt-1">Update the vehicle information</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6">
          <ErrorMessage 
            message={error}
            title="Update Failed"
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

export default EditVehicle;