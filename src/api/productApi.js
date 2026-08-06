import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= GET ALL PRODUCTS =================
export const getProducts = (params) =>
  handleRequest(() => axiosInstance.get("/products", { params }));

// ================= GET PRODUCT BY ID =================
export const getProductById = (id) =>
  handleRequest(() => axiosInstance.get(`/products/${id}`));

// ================= CREATE PRODUCT =================
export const createProduct = (data) =>
  handleRequest(() => axiosInstance.post("/products", data));

// ================= UPDATE PRODUCT =================
export const updateProduct = (id, data) =>
  handleRequest(() => axiosInstance.put(`/products/${id}`, data));

// ================= DELETE PRODUCT =================
export const deleteProduct = (id) =>
  handleRequest(() => axiosInstance.delete(`/products/${id}`));

// ================= CREATE PRODUCT REVIEW =================
export const createProductReview = (id, reviewData) =>
  handleRequest(() => axiosInstance.post(`/products/${id}/reviews`, reviewData));
