import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= GET ALL BLOG CATEGORIES =================
export const getBlogCategories = () =>
  handleRequest(() =>
    axiosInstance.get("/blog-categories").catch((err) => {
      // Fallback to /blogs/categories if /blog-categories gateway route differs
      if (err.response?.status === 404) {
        return axiosInstance.get("/blogs/categories");
      }
      throw err;
    })
  );

// ================= GET BLOG CATEGORY BY ID =================
export const getBlogCategoryById = (id) =>
  handleRequest(() => axiosInstance.get(`/blog-categories/${id}`));

// ================= CREATE BLOG CATEGORY =================
export const createBlogCategory = (data) =>
  handleRequest(() => axiosInstance.post("/blog-categories", data));

// ================= UPDATE BLOG CATEGORY =================
export const updateBlogCategory = (id, data) =>
  handleRequest(() => axiosInstance.put(`/blog-categories/${id}`, data));

// ================= DELETE BLOG CATEGORY =================
export const deleteBlogCategory = (id) =>
  handleRequest(() => axiosInstance.delete(`/blog-categories/${id}`));
