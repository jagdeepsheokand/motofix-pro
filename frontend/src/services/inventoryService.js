// services/inventoryService.js
import api from "./axios";

// CRUD Operations
const getInventoryItems = async (params = {}) => {
  try {
    // Axios automatically converts params to query string
    const response = await api.get("/inventory", { params });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw error;
  }
};

const getInventoryItem = async (id) => {
  try {
    const response = await api.get(`/inventory/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching inventory item by ID:", error);
    throw error;
  }
};

const createInventoryItem = async (inventoryData) => {
  try {
    const response = await api.post("/inventory", inventoryData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating inventory item:", error);
    throw error;
  }
};

const updateInventoryItem = async (id, inventoryData) => {
  try {
    const response = await api.put(`/inventory/${id}`, inventoryData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
};

const deleteInventoryItem = async (id) => {
  try {
    const response = await api.delete(`/inventory/${id}`);
    return response.data.message;
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    throw error;
  }
};

// Stock Management Methods
const getLowStockItems = async () => {
  try {
    const response = await api.get("/inventory/low-stock");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    throw error;
  }
};

const increaseStock = async (id, quantity) => {
  try {
    const response = await api.post(`/inventory/${id}/increase`, { quantity });
    return response.data.data;
  } catch (error) {
    console.error("Error increasing stock:", error);
    throw error;
  }
};

const decreaseStock = async (id, quantity) => {
  try {
    const response = await api.post(`/inventory/${id}/decrease`, { quantity });
    return response.data.data;
  } catch (error) {
    console.error("Error decreasing stock:", error);
    throw error;
  }
};

const adjustStock = async (id, adjustmentData) => {
  try {
    const { quantityChange } = adjustmentData;
    
    if (quantityChange === 0) {
      throw new Error("Quantity change must be non-zero");
    }
    
    // Convenience wrapper - delegates to increase/decrease methods
    if (quantityChange > 0) {
      return await increaseStock(id, quantityChange);
    } else {
      return await decreaseStock(id, Math.abs(quantityChange));
    }
  } catch (error) {
    console.error("Error adjusting stock:", error);
    throw error;
  }
};

export default {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  increaseStock,
  decreaseStock,
  adjustStock,
};