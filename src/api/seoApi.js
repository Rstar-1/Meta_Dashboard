import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= GET ALL SEO RECORDS =================
export const getSEORecords = (query = {}) =>
  handleRequest(() => axiosInstance.get("/seo", { params: query }));

// ================= GET SEO RECORD BY ROUTE =================
export const getSEORecordByRoute = (route) =>
  handleRequest(() => axiosInstance.get("/seo/route", { params: { route } }));

// ================= GET SEO RECORD BY ID =================
export const getSEORecordById = (id) =>
  handleRequest(() => axiosInstance.get(`/seo/${id}`));

// ================= CREATE SEO RECORD =================
export const createSEORecord = (data) =>
  handleRequest(() => axiosInstance.post("/seo", data));

// ================= UPDATE SEO RECORD =================
export const updateSEORecord = (id, data) =>
  handleRequest(() => axiosInstance.put(`/seo/${id}`, data));

// ================= DELETE SEO RECORD =================
export const deleteSEORecord = (id) =>
  handleRequest(() => axiosInstance.delete(`/seo/${id}`));


