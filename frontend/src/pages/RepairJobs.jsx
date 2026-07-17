// pages/RepairJobs.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import repairJobService from '../services/repairJobService';
import RepairJobTable from '../components/repairJobs/RepairJobTable';

const RepairJobs = () => {
  const [repairJobs, setRepairJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const fetchRepairJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const jobs = await repairJobService.getRepairJobs();
      setRepairJobs(jobs);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load repair jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/repair-jobs/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this repair job?")) {
      return;
    }

    try {
      await repairJobService.deleteRepairJob(id);
      // alert("Repair job deleted successfully."); // Removed alert as per preference
      await fetchRepairJobs();        // Refresh list
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete repair job. Please try again.");
    }
  };

  useEffect(() => {
    fetchRepairJobs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Repair Jobs</h1>
        
        <div className="flex gap-3">
          <button
            onClick={fetchRepairJobs}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Refresh
          </button>
          
          <button
            onClick={() => navigate('/repair-jobs/new')}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2 font-medium"
          >
            + Create Repair Job
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">Loading repair jobs...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <RepairJobTable
          repairJobs={repairJobs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default RepairJobs;