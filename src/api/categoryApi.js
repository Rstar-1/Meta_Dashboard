import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= GET ALL CATEGORIES =================
export const getCategories = () =>
  handleRequest(() => axiosInstance.get("/categories"));

// ================= CREATE CATEGORY =================
export const createCategory = (data) =>
  handleRequest(() => axiosInstance.post("/categories", data));

// ================= UPDATE CATEGORY =================
export const updateCategory = (id, data) =>
  handleRequest(() => axiosInstance.put(`/categories/${id}`, data));

// ================= DELETE CATEGORY =================
export const deleteCategory = (id) =>
  handleRequest(() => axiosInstance.delete(`/categories/${id}`));
