import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "../../feature/roleSlice";
import authReducer from "../../feature/authSlice";
import userReducer from "../../feature/userSlice";
import leadReducer from "../../feature/leadSlice";
import domainReducer from "../../feature/domainSlice";
import campaignReducer from "../../feature/campaignSlice";
import productReducer from "../../feature/productSlice";
import productCategoryReducer from "../../feature/productCategorySlice";
import blogReducer from "../../feature/blogSlice";
import blogCategoryReducer from "../../feature/blogCategorySlice";
import seoReducer from "../../feature/seoSlice";

// Safe persistence loader
export const loadState = () => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined")
      return undefined;
    const data = localStorage.getItem("appState");
    if (!data) return undefined;
    return JSON.parse(data);
  } catch {
    return undefined;
  }
};

// Safe persistence saver
export const saveState = () => {
  // Persistence hook if needed
};

export const createStore = (preloadedState) =>
  configureStore({
    reducer: {
      roles: roleReducer,
      auth: authReducer,
      users: userReducer,
      leads: leadReducer,
      domain: domainReducer,
      campaigns: campaignReducer,
      products: productReducer,
      productCategories: productCategoryReducer,
      categories: productCategoryReducer,
      blogs: blogReducer,
      blogCategories: blogCategoryReducer,
      seo: seoReducer,
    },
    preloadedState: preloadedState !== undefined ? preloadedState : loadState(),
    devTools: import.meta.env?.DEV,
  });

export const store = createStore();

export default store;
