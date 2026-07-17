import api from "./axios";

const getVehicles = async () => {
  try {
    const response = await api.get("/vehicles");
    return response.data.data || [];        // ← Extract .data (matches your customer pattern)
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};

const getVehicleById = async (id) => {
  try {
    const response = await api.get(`/vehicles/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    throw error;
  }
};

const createVehicle = async (vehicleData) => {
  try {
    const response = await api.post("/vehicles", vehicleData);
    return response.data.data;              // ← Extract .data
  } catch (error) {
    console.error("Error creating vehicle:", error);
    throw error;
  }
};

const updateVehicle = async (id, vehicleData) => {
  try {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data.data;              // ← Extract .data
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
};

const deleteVehicle = async (id) => {
  try {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;                   // Delete usually returns success message
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
};

export default {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};