import { config } from "../config/env";

export const resolveProductImage = () => {
  return "/sobo_logo.webp";
};

export const resolveImagePath = (path) => {
  if (!path) return "";
  if (path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/src/")) {
    return path;
  }
  const cleanImageUrl = (config.imageUrl || "http://localhost:3000").replace(/['"]/g, "");
  if (path.startsWith("/uploads/")) {
    return `${cleanImageUrl}${path}`;
  }
  if (path.startsWith("uploads/")) {
    return `${cleanImageUrl}/${path}`;
  }
  return "/sobo_logo.webp";
};
