import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= PAYMENTS =================
export const getPayments = (params) =>
  handleRequest(() => axiosInstance.get("/payments", { params }));

// ================= INTEGRATIONS =================
export const getIntegrations = () =>
  handleRequest(() => axiosInstance.get("/payment-integrations"));

export const getIntegrationById = (id) =>
  handleRequest(() => axiosInstance.get(`/payment-integrations/${id}`));

export const createIntegration = (data) =>
  handleRequest(() => axiosInstance.post("/payment-integrations", data));

export const updateIntegration = (id, data) =>
  handleRequest(() => axiosInstance.put(`/payment-integrations/${id}`, data));

export const deleteIntegration = (id) =>
  handleRequest(() => axiosInstance.delete(`/payment-integrations/${id}`));

export const updateIntegrationStatus = (id, status) =>
  handleRequest(() => axiosInstance.patch(`/payment-integrations/${id}/status`, { status }));
