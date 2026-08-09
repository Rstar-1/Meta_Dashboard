import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= GET ALL BLOGS =================
export const getBlogs = (params = {}) =>
  handleRequest(() => axiosInstance.get("/blogs", { params }));

// ================= GET BLOG BY SLUG =================
export const getBlogBySlug = (slug) =>
  handleRequest(() => axiosInstance.get(`/blogs/slug/${slug}`));

// ================= GET BLOG BY ID =================
export const getBlogById = (id) =>
  handleRequest(() => axiosInstance.get(`/blogs/${id}`));

// ================= CREATE BLOG =================
export const createBlog = (data) =>
  handleRequest(() => axiosInstance.post("/blogs", data));

// ================= UPDATE BLOG =================
export const updateBlog = (id, data) =>
  handleRequest(() => axiosInstance.put(`/blogs/${id}`, data));

// ================= DELETE BLOG =================
export const deleteBlog = (id) =>
  handleRequest(() => axiosInstance.delete(`/blogs/${id}`));

// ================= ADD REVIEW TO BLOG =================
export const createBlogReview = (blogId, data) =>
  handleRequest(() => axiosInstance.post(`/blogs/${blogId}/reviews`, data));

// ================= DELETE REVIEW FROM BLOG =================
export const deleteBlogReview = (blogId, reviewId) =>
  handleRequest(() => axiosInstance.delete(`/blogs/${blogId}/reviews/${reviewId}`));
