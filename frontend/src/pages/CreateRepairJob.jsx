// pages/CreateRepairJob.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RepairJobForm from '../components/repairJobs/RepairJobForm';
import repairJobService from '../services/repairJobService';
import vehicleService from '../services/vehicleService';
import { LoadingSpinner, ErrorMessage } from '../components/common';

const CreateRepairJob = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);
      setError("");
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
      setError("Failed to load vehicles. Please try again.");
    } finally {
      setLoadingVehicles(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError("");

    try {
      await repairJobService.createRepairJob(formData);
      navigate("/repair-jobs");
    } catch (err) {
      console.error("Create error:", err);
      setError(err.response?.data?.message || "Failed to create repair job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Empty state when no vehicles exist
  if (!loadingVehicles && vehicles.length === 0) {
    return (
      <div className="animate-slideUp max-w-2xl mx-auto">
        <div className="card card-glass rounded-2xl p-12 text-center border border-dashed border-slate-700/50">
          <div className="text-5xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold text-white mb-3">No Vehicles Found</h2>
          <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto">
            You need to create at least one vehicle before creating a repair job.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/vehicles/new')}
              className="btn-primary px-6 py-3 rounded-xl text-sm"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New Vehicle
              </span>
            </button>
            <button
              onClick={fetchVehicles}
              className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slideUp max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/repair-jobs')}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 mb-4 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Repair Jobs
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create New Repair Job</h1>
          <p className="text-zinc-400 text-sm mt-1">Fill in the details below</p>
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

      {loadingVehicles ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading available vehicles..." />
        </div>
      ) : (
        <div className="card card-glass rounded-2xl p-6 md:p-8">
          <RepairJobForm
            onSubmit={handleSubmit}
            loading={submitting}
            vehicles={vehicles}
            isEditMode={false}
          />
        </div>
      )}
    </div>
  );
};

export default CreateRepairJob;