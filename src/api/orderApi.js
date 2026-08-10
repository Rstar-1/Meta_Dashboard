import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= GET ALL ORDERS =================
export const getOrders = (params) =>
  handleRequest(() => axiosInstance.get("/orders", { params }));

// ================= CREATE ORDER =================
export const createOrder = (data) =>
  handleRequest(() => axiosInstance.post("/orders", data));

// ================= UPDATE ORDER =================
export const updateOrder = (id, data) =>
  handleRequest(() => axiosInstance.put(`/orders/${id}`, data));

// ================= DELETE ORDER =================
export const deleteOrder = (id) =>
  handleRequest(() => axiosInstance.delete(`/orders/${id}`));
