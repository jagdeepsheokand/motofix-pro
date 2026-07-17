// pages/CreateRepairJob.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RepairJobForm from '../components/repairJobs/RepairJobForm';
import repairJobService from '../services/repairJobService';
import vehicleService from '../services/vehicleService';

const CreateRepairJob = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Extracted for reusability and retry capability
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
      navigate("/repair-jobs");        // Clean navigation (no alert)
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
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Vehicles Found</h2>
          <p className="text-gray-600 mb-8">
            You need to create at least one vehicle before creating a repair job.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/vehicles/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create New Vehicle
            </button>
            <button
              onClick={fetchVehicles}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create New Repair Job</h1>
          <p className="text-gray-600 mt-1">Fill in the details below</p>
        </div>
        <button
          onClick={() => navigate('/repair-jobs')}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          ← Back to List
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loadingVehicles ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Loading available vehicles...</p>
        </div>
      ) : (
        <RepairJobForm
          onSubmit={handleSubmit}
          loading={submitting}
          vehicles={vehicles}
          isEditMode={false}
        />
      )}
    </div>
  );
};

export default CreateRepairJob;