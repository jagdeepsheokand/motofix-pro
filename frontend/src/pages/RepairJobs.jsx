// pages/RepairJobs.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import repairJobService from '../services/repairJobService';
import RepairJobTable from '../components/repairJobs/RepairJobTable';
import { LoadingSpinner, ErrorMessage } from '../components/common';
import { toast } from "react-toastify";

const RepairJobs = () => {
  const [repairJobs, setRepairJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  
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
  toast.error("Failed to load repair jobs");
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
toast.success("Repair job deleted successfully");
      await fetchRepairJobs();
    } catch (err) {
      
      toast.error(
  err.response?.data?.message || "Failed to delete repair job"
);
    }
  };

  useEffect(() => {
    fetchRepairJobs();
  }, []);

  // Filter repair jobs based on search
  const filteredJobs = repairJobs.filter(job =>
    job.jobNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.vehicle?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.vehicle?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalJobs = repairJobs.length;
  const pendingJobs = repairJobs.filter(j => 
    j.status === 'PENDING' || j.status === 'DIAGNOSIS'
  ).length;
  const inProgressJobs = repairJobs.filter(j => 
    j.status === 'IN_PROGRESS'
  ).length;
  const completedJobs = repairJobs.filter(j => 
    j.status === 'COMPLETED'
  ).length;
  const cancelledJobs = repairJobs.filter(j => 
    j.status === 'CANCELLED'
  ).length;

  return (
    <div className=" animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Repair Jobs</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your repair jobs • <span className="text-orange-400 font-medium">{totalJobs}</span> total jobs
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={fetchRepairJobs}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-200 flex items-center gap-2 justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => navigate('/repair-jobs/new')}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Repair Job
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-orange-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-white">{totalJobs}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-yellow-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{pendingJobs}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-bold text-blue-400">{inProgressJobs}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold text-emerald-400">{completedJobs}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job number, vehicle, status or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200"
          />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading repair jobs..." />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorMessage 
          title="Failed to load repair jobs"
          message={error}
          onRetry={fetchRepairJobs}
        />
      )}

      {/* Empty State */}
      {!loading && !error && repairJobs.length === 0 && (
        <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            🔧
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No repair jobs yet</h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
            Get started by creating your first repair job. You can manage all your repair jobs here.
          </p>
          <button
            onClick={() => navigate('/repair-jobs/new')}
            className="btn-primary px-6 py-3 rounded-xl text-sm"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Repair Job
            </span>
          </button>
        </div>
      )}

      {/* No Search Results */}
      {!loading && !error && repairJobs.length > 0 && filteredJobs.length === 0 && (
        <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-1">No matching repair jobs</h3>
          <p className="text-zinc-400 text-sm">
            No repair jobs found matching "<span className="text-orange-400">{searchTerm}</span>"
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Repair Job Grid/Table */}
      {!loading && !error && filteredJobs.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-zinc-500">
              Showing <span className="text-zinc-300 font-medium">{filteredJobs.length}</span> of <span className="text-zinc-300 font-medium">{repairJobs.length}</span> repair jobs
            </span>
          </div>
          <RepairJobTable
            repairJobs={filteredJobs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default RepairJobs;