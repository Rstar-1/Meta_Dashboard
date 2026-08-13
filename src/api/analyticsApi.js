import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

export const getArticlesAnalytics = (params) =>
  handleRequest(() => axiosInstance.get("/v1/analytics/articles", { params }));

export const getProductsAnalytics = (params) =>
  handleRequest(() => axiosInstance.get("/v1/analytics/products", { params }));

export const getOrdersAnalytics = (params) =>
  handleRequest(() => axiosInstance.get("/v1/analytics/orders", { params }));

export const getPaymentsAnalytics = (params) =>
  handleRequest(() => axiosInstance.get("/v1/analytics/payments", { params }));

export const getUsersAnalytics = (params) =>
  handleRequest(() => axiosInstance.get("/v1/analytics/users", { params }));

export const getLeadsAnalytics = (params) =>
  handleRequest(() => axiosInstance.get("/v1/analytics/leads", { params }));
