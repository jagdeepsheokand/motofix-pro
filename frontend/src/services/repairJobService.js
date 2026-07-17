import api from "./axios";

const getRepairJobs = async () => {
  try {
    const response = await api.get("/repair-jobs");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching repair jobs:", error);
    throw error;
  }
};

const getRepairJobById = async (id) => {
  try {
    const response = await api.get(`/repair-jobs/${id}`);
    return response.data.data ;
  } catch (error) {
    console.error("Error fetching repair job by ID:", error);
    throw error;
  }
};

const createRepairJob = async (repairJobData) => {
  try {
    const response = await api.post("/repair-jobs", repairJobData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating repair job:", error);
    throw error;
  }
};

const updateRepairJob = async (id, repairJobData) => {
  try {
    const response = await api.put(`/repair-jobs/${id}`, repairJobData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating repair job:", error);
    throw error;
  }
};

const deleteRepairJob = async (id) => {
  try {
    const response = await api.delete(`/repair-jobs/${id}`);
    return response.data.message;
  } catch (error) {
    console.error("Error deleting repair job:", error);
    throw error;
  }
};

export default {
  getRepairJobs,
  getRepairJobById,
  createRepairJob,
  updateRepairJob,
  deleteRepairJob,
};