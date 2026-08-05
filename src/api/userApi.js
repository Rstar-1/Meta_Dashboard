import axiosInstance from "./axiosInstance";
import { handleRequest } from "./apiHandler";

// ================= GET USER BY ID =================
export const getUserById = (id) =>
  handleRequest(() => axiosInstance.get(`/users/${id}`));

// ================= UPDATE USER =================
export const updateUser = (id, data) =>
  handleRequest(() => axiosInstance.put(`/users/${id}`, data));

// ================= GET CURRENT PROFILE =================
export const getProfile = () =>
  handleRequest(() => axiosInstance.get("/users/profile"));

// ================= GET ALL USERS =================
export const getUsers = (params) =>
  handleRequest(() => axiosInstance.get("/users", { params }));
