import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { checkDomainApi, checkMultipleDomainsApi } from "../api/doaminApi.js";

// Load starred domains from localStorage if available
const loadStarredDomains = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem("domain_starred");
      return stored ? JSON.parse(stored) : [];
    }
  } catch {
    // Ignore storage parse errors
  }
  return [];
};

const saveStarredDomains = (list) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("domain_starred", JSON.stringify(list));
    }
  } catch {
    // Ignore storage write errors
  }
};

/**
 * Async Thunk to check a single domain via RDAP
 */
export const checkDomain = createAsyncThunk(
  "domain/checkDomain",
  async (domain, { rejectWithValue }) => {
    try {
      const res = await checkDomainApi(domain);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to check domain");
    }
  }
);

/**
 * Async Thunk to batch check multiple domains via RDAP
 */
export const checkBatchDomains = createAsyncThunk(
  "domain/checkBatchDomains",
  async (domains = [], { rejectWithValue }) => {
    try {
      const res = await checkMultipleDomainsApi(domains, 4);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to batch check domains");
    }
  }
);

const initialState = {
  searchQuery: "",
  domainResults: {},
  loadingDomains: {},
  isBatchChecking: false,
  starredDomains: loadStarredDomains(),
  error: null,
};

const domainSlice = createSlice({
  name: "domain",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload || "";
    },
    toggleStarDomain: (state, action) => {
      const domain = action.payload;
      if (!domain) return;
      const index = state.starredDomains.indexOf(domain);
      if (index >= 0) {
        state.starredDomains.splice(index, 1);
      } else {
        state.starredDomains.push(domain);
      }
      saveStarredDomains(state.starredDomains);
    },
    setDomainStatus: (state, action) => {
      const { domain, status, message } = action.payload || {};
      if (domain) {
        state.domainResults[domain] = { domain, status, message };
      }
    },
    clearDomainResults: (state) => {
      state.domainResults = {};
      state.loadingDomains = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Single Domain Check
    builder
      .addCase(checkDomain.pending, (state, action) => {
        const domain = action.meta.arg;
        if (domain) state.loadingDomains[domain] = true;
      })
      .addCase(checkDomain.fulfilled, (state, action) => {
        const result = action.payload;
        if (result?.domain) {
          state.domainResults[result.domain] = result;
          delete state.loadingDomains[result.domain];
        }
      })
      .addCase(checkDomain.rejected, (state, action) => {
        const domain = action.meta.arg;
        if (domain) {
          delete state.loadingDomains[domain];
          state.domainResults[domain] = {
            domain,
            status: "unknown",
            message: action.payload || "RDAP service temporarily unavailable.",
          };
        }
      });

    // Batch Domains Check
    builder
      .addCase(checkBatchDomains.pending, (state, action) => {
        state.isBatchChecking = true;
        const domains = action.meta.arg || [];
        domains.forEach((d) => {
          state.loadingDomains[d] = true;
        });
      })
      .addCase(checkBatchDomains.fulfilled, (state, action) => {
        state.isBatchChecking = false;
        const results = action.payload || {};
        Object.entries(results).forEach(([domain, res]) => {
          state.domainResults[domain] = res;
          delete state.loadingDomains[domain];
        });
      })
      .addCase(checkBatchDomains.rejected, (state, action) => {
        state.isBatchChecking = false;
        const domains = action.meta.arg || [];
        domains.forEach((d) => {
          delete state.loadingDomains[d];
        });
        state.error = action.payload || "Batch checking failed";
      });
  },
});

export const {
  setSearchQuery,
  toggleStarDomain,
  setDomainStatus,
  clearDomainResults,
} = domainSlice.actions;

// Selectors
export const selectSearchQuery = (state) => state.domain?.searchQuery || "";
export const selectDomainResults = (state) => state.domain?.domainResults || {};
export const selectLoadingDomains = (state) => state.domain?.loadingDomains || {};
export const selectIsBatchChecking = (state) => Boolean(state.domain?.isBatchChecking);
export const selectStarredDomains = (state) => state.domain?.starredDomains || [];
export const selectDomainError = (state) => state.domain?.error || null;

// Unified custom hook useDomain
export const useDomain = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const domainResults = useSelector(selectDomainResults);
  const loadingDomains = useSelector(selectLoadingDomains);
  const isBatchChecking = useSelector(selectIsBatchChecking);
  const starredDomains = useSelector(selectStarredDomains);
  const error = useSelector(selectDomainError);

  return {
    searchQuery,
    domainResults,
    loadingDomains,
    isBatchChecking,
    starredDomains,
    error,
    checkDomain: React.useCallback(
      (domain) => dispatch(checkDomain(domain)),
      [dispatch]
    ),
    checkBatchDomains: React.useCallback(
      (domains) => dispatch(checkBatchDomains(domains)),
      [dispatch]
    ),
    setSearchQuery: React.useCallback(
      (query) => dispatch(setSearchQuery(query)),
      [dispatch]
    ),
    toggleStarDomain: React.useCallback(
      (domain) => dispatch(toggleStarDomain(domain)),
      [dispatch]
    ),
    clearDomainResults: React.useCallback(
      () => dispatch(clearDomainResults()),
      [dispatch]
    ),
    dispatch,
  };
};

export default domainSlice.reducer;
