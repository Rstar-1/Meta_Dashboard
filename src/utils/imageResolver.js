import { config } from "../config/env";

export const resolveProductImage = (path) => {
  return resolveImagePath(path) || "/sobo_logo.webp";
};

export const resolveImagePath = (path) => {
  if (!path) return "";
  if (Array.isArray(path)) {
    path = path[0] || "";
  }
  if (path && typeof path === "object") {
    path = path.url || path.path || path.preview || path.src || "";
  }
  if (typeof path !== "string" || !path.trim()) {
    return "";
  }
  if (
    path.startsWith("data:") ||
    path.startsWith("blob:") ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("/src/")
  ) {
    return path;
  }
  const cleanImageUrl = (config.imageUrl || "http://localhost:3000").replace(/['"]/g, "").replace(/\/+$/, "");
  if (path.startsWith("/uploads/")) {
    return `${cleanImageUrl}${path}`;
  }
  if (path.startsWith("uploads/")) {
    return `${cleanImageUrl}/${path}`;
  }
  if (path.startsWith("/")) {
    return path;
  }
  if (path.includes(".")) {
    return `${cleanImageUrl}/uploads/${path}`;
  }
  return path;
};
