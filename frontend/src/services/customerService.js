import api from "./axios";

const getCustomers = async () => {
  try {
    const response = await api.get("/customers");
    return response.data.data || [];        // ← Extract .data
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};
const getCustomerById = async (id) => {
  try {
    const response = await api.get(`/customers/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    throw error;
  }
};

const createCustomer = async (customerData) => {
  try {
    const response = await api.post("/customers", customerData);
    return response.data.data;              // ← Extract .data
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

const updateCustomer = async (id, customerData) => {
  try {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data.data;              // ← Extract .data
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

const deleteCustomer = async (id) => {
  try {
    const response = await api.delete(`/customers/${id}`);
    return response.data;                   // Delete usually returns success message
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

export default {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById
};