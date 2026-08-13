import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= GET TOTAL LEADS =================
export const getDashboardTotalLeads = () =>
  handleRequest(() => axiosInstance.get("/v1/dashboard/leads/total"));

// ================= GET WEEKLY EARNINGS =================
export const getDashboardWeeklyEarnings = () =>
  handleRequest(() => axiosInstance.get("/v1/dashboard/earnings/weekly"));

// ================= GET WEEKLY LEADS =================
export const getDashboardWeeklyLeads = () =>
  handleRequest(() => axiosInstance.get("/v1/dashboard/leads/weekly"));

// ================= GET TOP PRODUCTS =================
export const getDashboardTopProducts = () =>
  handleRequest(() => axiosInstance.get("/v1/dashboard/products/top"));

// ================= GET YEARLY REVENUE =================
export const getDashboardYearlyRevenue = (year) =>
  handleRequest(() => axiosInstance.get("/v1/dashboard/revenue/yearly", { params: { year } }));

// ================= GET BEST SELLER =================
export const getDashboardBestSeller = () =>
  handleRequest(() => axiosInstance.get("/v1/dashboard/best-seller"));

// ================= GET ORDER STATUS STATS =================
export const getDashboardOrderStatusStats = () =>
  handleRequest(() => axiosInstance.get("/v1/dashboard/orders/status"));
