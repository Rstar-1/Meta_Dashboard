import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= GET ALL ROLES =================
export const getRoles = () =>
  handleRequest(() => axiosInstance.get("/roles"));

// ================= GET ROLE BY ID =================
export const getRoleById = (id) =>
  handleRequest(() => axiosInstance.get(`/roles/${id}`));

// ================= CREATE ROLE =================
export const createRole = (data) =>
  handleRequest(() => axiosInstance.post("/roles", data));

// ================= UPDATE ROLE =================
export const updateRole = (id, data) =>
  handleRequest(() => axiosInstance.put(`/roles/${id}`, data));

// ================= DELETE ROLE =================
export const deleteRole = (id) =>
  handleRequest(() => axiosInstance.delete(`/roles/${id}`));
