// services/invoiceService.js
import api from "./axios";

// CRUD Operations for Invoices
const getInvoices = async (params = {}) => {
  try {
    const response = await api.get("/invoices", { params });
    return response.data; // Return full response for pagination metadata
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

const getInvoice = async (id) => {
  try {
    const response = await api.get(`/invoices/${id}`);
    return response.data; // Full response
  } catch (error) {
    console.error("Error fetching invoice by ID:", error);
    throw error;
  }
};

const createInvoice = async (invoiceData) => {
  try {
    const response = await api.post("/invoices", invoiceData);
    return response.data; // Full response (includes success + data)
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await api.put(`/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

const deleteInvoice = async (id) => {
  try {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};

// Optional convenience method
const getInvoicesByStatus = async (status) => {
  try {
    return await getInvoices({ status });
  } catch (error) {
    console.error("Error fetching invoices by status:", error);
    throw error;
  }
};

export default {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoicesByStatus,
};