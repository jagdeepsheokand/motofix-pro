// pages/EditRepairJob.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RepairJobForm from '../components/repairJobs/RepairJobForm';
import repairJobService from '../services/repairJobService';
import vehicleService from '../services/vehicleService';

const EditRepairJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repairJob, setRepairJob] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch Repair Job by ID
  const fetchRepairJob = async () => {
    try {
      const data = await repairJobService.getRepairJobById(id);
      setRepairJob(data);
    } catch (err) {
      console.error("Failed to fetch repair job:", err);
      setError("Failed to load repair job details.");
    }
  };

  // Fetch Vehicles for dropdown
  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
      setError("Failed to load vehicles.");
    }
  };

  // Load data on mount
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

  // Handle form submission (Update)
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError("");

    try {
      await repairJobService.updateRepairJob(id, formData);
      
      // Success - navigate back to list
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
      <div className="p-6 max-w-4xl mx-auto text-center py-20">
        <p className="text-lg text-gray-600">Loading repair job details...</p>
      </div>
    );
  }

  if (error && !repairJob) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
        <button
          onClick={() => navigate('/repair-jobs')}
          className="mt-6 text-blue-600 hover:underline"
        >
          ← Back to Repair Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Repair Job</h1>
          <p className="text-gray-600 mt-1">
            Job Number: <span className="font-medium">{repairJob?.jobNumber}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/repair-jobs')}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          ← Back to List
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      <RepairJobForm
        initialData={repairJob}
        vehicles={vehicles}
        loading={submitting}
        isEditMode={true}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditRepairJob;