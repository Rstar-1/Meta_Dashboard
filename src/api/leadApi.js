import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= GET ALL LEADS =================
export const getLeads = (query = {}) =>
  handleRequest(() => axiosInstance.get("/leads", { params: query }));

// ================= GET LEAD BY ID =================
export const getLeadById = (id) =>
  handleRequest(() => axiosInstance.get(`/leads/${id}`));

// ================= CREATE LEAD =================
export const createLead = (data) =>
  handleRequest(() => axiosInstance.post("/leads", data));

// ================= UPDATE LEAD =================
export const updateLead = (id, data) =>
  handleRequest(() => axiosInstance.put(`/leads/${id}`, data));

// ================= DELETE LEAD =================
export const deleteLead = (id) =>
  handleRequest(() => axiosInstance.delete(`/leads/${id}`));
