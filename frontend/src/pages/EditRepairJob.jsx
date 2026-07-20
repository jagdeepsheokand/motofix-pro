// pages/EditRepairJob.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RepairJobForm from '../components/repairJobs/RepairJobForm';
import repairJobService from '../services/repairJobService';
import vehicleService from '../services/vehicleService';
import { LoadingSpinner, ErrorMessage } from '../components/common';

const EditRepairJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repairJob, setRepairJob] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchRepairJob = async () => {
    try {
      const data = await repairJobService.getRepairJobById(id);
      setRepairJob(data);
    } catch (err) {
      console.error("Failed to fetch repair job:", err);
      setError("Failed to load repair job details.");
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
      setError("Failed to load vehicles.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      
      await Promise.all([
        fetchRepairJob(),
        fetchVehicles()
      ]);
      
      setLoading(false);
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError("");

    try {
      await repairJobService.updateRepairJob(id, formData);
      navigate("/repair-jobs");
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage = err.response?.data?.message || 
                          "Failed to update repair job. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading repair job details..." />
      </div>
    );
  }

  if (error && !repairJob) {
    return (
      <div className="animate-slideUp max-w-3xl mx-auto">
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
        </div>
        <ErrorMessage 
          title="Failed to load repair job"
          message={error}
          onRetry={() => navigate('/repair-jobs')}
        />
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Repair Job</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Job Number: <span className="text-orange-400 font-medium">{repairJob?.jobNumber}</span>
          </p>
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

      <div className="card card-glass rounded-2xl p-6 md:p-8">
        <RepairJobForm
          initialData={repairJob}
          vehicles={vehicles}
          loading={submitting}
          isEditMode={true}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default EditRepairJob;