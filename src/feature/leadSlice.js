import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getLeadsApi,
  getLeadByIdApi,
  createLeadApi,
  updateLeadApi,
  updateLeadSeverityApi,
  updateLeadStatusApi,
  deleteLeadApi,
  restoreLeadApi,
  bulkDeleteLeadsApi,
} from "../api/leadApi.js";

/**
 * Normalizes lead document to match the Mongoose leadSchema:
 * { id: 'LED-001', name, mobile, email, location, description, severity: 'high'|'medium'|'low', isActive, isDeleted, createdBy, createdAt, updatedAt }
 */
export const normalizeLead = (l) => {
  if (!l || typeof l !== "object") return l;
  const id = l.id || (l._id?.$oid ? l._id.$oid : l._id) || "";
  const name = l.name || "";

  // Created By population handling
  const createdByObj =
    typeof l.createdBy === "object" && l.createdBy !== null ? l.createdBy : {};
  const creatorId =
    createdByObj._id ||
    createdByObj.id ||
    (typeof l.createdBy === "string" ? l.createdBy : "");
  const creatorName =
    createdByObj.fullname ||
    createdByObj.name ||
    createdByObj.username ||
    (typeof l.createdby === "string" ? l.createdby : "") ||
    (typeof l.creatorName === "string" ? l.creatorName : "") ||
    "Sales Rep";

  const creatorMobile =
    createdByObj.mobile ||
    createdByObj.phone ||
    createdByObj.email ||
    "";
  const creatorAvatar = createdByObj.avatar || createdByObj.image || "";

  const createdbyData = {
    _id: creatorId,
    id: creatorId,
    fullname: creatorName,
    name: creatorName,
    mobile: creatorMobile || createdByObj.email || "—",
    phone: creatorMobile || createdByObj.email || "—",
    email: createdByObj.email || "",
    avatar: creatorAvatar,
    image: creatorAvatar,
    toString() {
      return creatorName;
    },
    valueOf() {
      return creatorName;
    },
  };

  // Severity enum: ['high', 'medium', 'low'] default: 'low'
  const rawSev = String(l.severity || "low").toLowerCase().trim();
  const severity = ["high", "medium", "low"].includes(rawSev) ? rawSev : "low";
  const severityLabel =
    severity === "high" ? "High" : severity === "medium" ? "Medium" : "Low";

  const isActive = l.isActive !== undefined ? Boolean(l.isActive) : true;
  const isDeleted = Boolean(l.isDeleted);

  return {
    ...l,
    _id: l._id || id,
    id,
    name,
    mobile: l.mobile || "",
    email: l.email ? String(l.email).toLowerCase().trim() : "",
    location: l.location || "",
    description: l.description || "",
    severity,
    severityLabel,
    isActive,
    status: isActive ? "Active" : "Inactive",
    isDeleted,
    createdBy: createdByObj._id ? createdByObj : l.createdBy,
    createdby: createdbyData,
    creatorName,
    createdByName: creatorName,
    creatorMobile,
    creatorAvatar,
    contact: l.mobile
      ? `${l.mobile}${l.email ? ` • ${l.email}` : ""}`
      : l.email || "—",
    createdAt: l.createdAt?.$date || l.createdAt || new Date().toISOString(),
    updatedAt: l.updatedAt?.$date || l.updatedAt || new Date().toISOString(),
  };
};

// Async Thunks
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await getLeadsApi(params);
      const payload = res?.data !== undefined ? res.data : res;

      let list = [];
      let total = 0;
      let page = Number(params.page) || 1;
      let limit = Number(params.limit) || 10;
      let totalPages = 1;

      if (Array.isArray(payload)) {
        list = payload;
        total = payload.length;
        totalPages = Math.ceil(total / limit) || 1;
      } else if (payload && typeof payload === "object") {
        list = Array.isArray(payload.leads)
          ? payload.leads
          : Array.isArray(payload.data)
          ? payload.data
          : [];
        total = Number(payload.total ?? payload.pagination?.total ?? list.length);
        page = Number(payload.page ?? payload.pagination?.page ?? page);
        limit = Number(payload.limit ?? payload.pagination?.limit ?? limit);
        totalPages = Number(
          payload.totalPages ??
            payload.pagination?.totalPages ??
            (Math.ceil(total / limit) || 1)
        );
      }

      return {
        leads: list.map(normalizeLead),
        total,
        page,
        limit,
        totalPages,
        pagination: { total, page, limit, totalPages },
      };
    } catch (err) {
      if (err?.isCanceled || err?.name === "CanceledError") {
        return rejectWithValue({ isCanceled: true });
      }
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to fetch leads"
      );
    }
  }
);

export const fetchLeadById = createAsyncThunk(
  "leads/fetchLeadById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getLeadByIdApi(id);
      return normalizeLead(res?.data !== undefined ? res.data : res);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to fetch lead"
      );
    }
  }
);

export const createLead = createAsyncThunk(
  "leads/createLead",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createLeadApi(data);
      return normalizeLead(res?.data !== undefined ? res.data : res);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to create lead"
      );
    }
  }
);

export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateLeadApi(id, data);
      return normalizeLead(res?.data !== undefined ? res.data : res);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to update lead"
      );
    }
  }
);

export const changeLeadSeverity = createAsyncThunk(
  "leads/changeLeadSeverity",
  async ({ id, severity }, { rejectWithValue }) => {
    try {
      const res = await updateLeadSeverityApi(id, severity);
      return normalizeLead(res?.data !== undefined ? res.data : res);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to update severity"
      );
    }
  }
);

export const toggleLeadStatus = createAsyncThunk(
  "leads/toggleLeadStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const res = await updateLeadStatusApi(id, isActive);
      return normalizeLead(res?.data !== undefined ? res.data : res);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to update status"
      );
    }
  }
);

export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async ({ id, permanent = false }, { rejectWithValue }) => {
    try {
      await deleteLeadApi(id, permanent);
      return { id, permanent };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to delete lead"
      );
    }
  }
);

export const restoreLead = createAsyncThunk(
  "leads/restoreLead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await restoreLeadApi(id);
      return normalizeLead(res?.data !== undefined ? res.data : res);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to restore lead"
      );
    }
  }
);

export const bulkDeleteLeads = createAsyncThunk(
  "leads/bulkDeleteLeads",
  async ({ ids, permanent = false }, { rejectWithValue }) => {
    try {
      const res = await bulkDeleteLeadsApi({ ids, permanent });
      return { ids, permanent, res };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to bulk delete leads"
      );
    }
  }
);

const initialState = {
  leads: [],
  currentLead: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  pagination: null,
  loading: false,
  error: null,
  currentRequestId: null,
};

export const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    clearLeadError: (state) => {
      state.error = null;
    },
    setCurrentLead: (state, action) => {
      state.currentLead = action.payload;
    },
    setLeadsDirectly: (state, action) => {
      state.leads = Array.isArray(action.payload)
        ? action.payload.map(normalizeLead)
        : [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchLeads.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.loading = false;
          state.leads = action.payload.leads;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalPages = action.payload.totalPages;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.loading = false;
          if (!action.payload?.isCanceled) {
            state.error = action.payload;
          }
        }
      })

      // Create
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        const newLead = action.payload;
        const idx = state.leads.findIndex(
          (l) => l.id === newLead.id || (newLead._id && l._id === newLead._id)
        );
        if (idx !== -1) {
          state.leads[idx] = newLead;
        } else {
          state.leads.unshift(newLead);
          state.total += 1;
        }
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const idx = state.leads.findIndex(
          (l) => l.id === updated.id || (updated._id && l._id === updated._id)
        );
        if (idx !== -1) state.leads[idx] = updated;
        if (
          state.currentLead &&
          (state.currentLead.id === updated.id || state.currentLead._id === updated._id)
        ) {
          state.currentLead = updated;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change Severity
      .addCase(changeLeadSeverity.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.leads.findIndex(
          (l) => l.id === updated.id || (updated._id && l._id === updated._id)
        );
        if (idx !== -1) state.leads[idx] = updated;
      })

      // Toggle Status
      .addCase(toggleLeadStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.leads.findIndex(
          (l) => l.id === updated.id || (updated._id && l._id === updated._id)
        );
        if (idx !== -1) state.leads[idx] = updated;
      })

      // Restore Lead
      .addCase(restoreLead.fulfilled, (state, action) => {
        const restored = action.payload;
        const idx = state.leads.findIndex(
          (l) => l.id === restored.id || (restored._id && l._id === restored._id)
        );
        if (idx !== -1) {
          state.leads[idx] = restored;
        }
      })

      // Delete Lead
      .addCase(deleteLead.fulfilled, (state, action) => {
        const { id, permanent } = action.payload;
        const idx = state.leads.findIndex((l) => l.id === id || l._id === id);
        if (idx !== -1) {
          if (permanent || state.leads[idx].isDeleted) {
            state.leads.splice(idx, 1);
            state.total = Math.max(0, state.total - 1);
          } else {
            state.leads[idx].isDeleted = true;
          }
        }
      })

      // Bulk Delete
      .addCase(bulkDeleteLeads.fulfilled, (state, action) => {
        const { ids, permanent } = action.payload;
        const idSet = new Set(ids.map(String));
        if (permanent) {
          state.leads = state.leads.filter(
            (l) => !idSet.has(String(l.id)) && !idSet.has(String(l._id))
          );
        } else {
          state.leads = state.leads.map((l) =>
            idSet.has(String(l.id)) || idSet.has(String(l._id))
              ? { ...l, isDeleted: true }
              : l
          );
        }
      });
  },
});

export const { clearLeadError, setCurrentLead, setLeadsDirectly } = leadSlice.actions;

// Selectors
export const selectLeads = (state) => state.leads?.leads || [];
export const selectLeadsLoading = (state) => Boolean(state.leads?.loading);
export const selectLeadsError = (state) => state.leads?.error || null;
export const selectLeadsTotal = (state) => state.leads?.total || 0;
export const selectLeadsPage = (state) => state.leads?.page || 1;
export const selectLeadsLimit = (state) => state.leads?.limit || 10;
export const selectLeadsTotalPages = (state) => state.leads?.totalPages || 1;
export const selectLeadsPagination = (state) => state.leads?.pagination || null;
export const selectCurrentLead = (state) => state.leads?.currentLead || null;

// Unified useLeads Hook
export const useLeads = () => {
  const dispatch = useDispatch();
  const leads = useSelector(selectLeads);
  const loading = useSelector(selectLeadsLoading);
  const error = useSelector(selectLeadsError);
  const total = useSelector(selectLeadsTotal);
  const page = useSelector(selectLeadsPage);
  const limit = useSelector(selectLeadsLimit);
  const totalPages = useSelector(selectLeadsTotalPages);
  const pagination = useSelector(selectLeadsPagination);
  const currentLead = useSelector(selectCurrentLead);

  return {
    leads,
    currentLead,
    loading,
    error,
    total,
    page,
    limit,
    totalPages,
    pagination,
    getLeads: React.useCallback(
      (params) => dispatch(fetchLeads(params)),
      [dispatch]
    ),
    fetchLeads: React.useCallback(
      (params) => dispatch(fetchLeads(params)),
      [dispatch]
    ),
    getLeadById: React.useCallback(
      (id) => dispatch(fetchLeadById(id)),
      [dispatch]
    ),
    addLead: React.useCallback(
      (data) => dispatch(createLead(data)),
      [dispatch]
    ),
    createLead: React.useCallback(
      (data) => dispatch(createLead(data)),
      [dispatch]
    ),
    editLead: React.useCallback(
      (id, data) => dispatch(updateLead({ id, data })),
      [dispatch]
    ),
    updateLead: React.useCallback(
      (id, data) => dispatch(updateLead({ id, data })),
      [dispatch]
    ),
    setLeadSeverity: React.useCallback(
      (id, severity) => dispatch(changeLeadSeverity({ id, severity })),
      [dispatch]
    ),
    setLeadStatus: React.useCallback(
      (id, isActive) => dispatch(toggleLeadStatus({ id, isActive })),
      [dispatch]
    ),
    removeLead: React.useCallback(
      (id, permanent = false) => dispatch(deleteLead({ id, permanent })),
      [dispatch]
    ),
    deleteLead: React.useCallback(
      (id, permanent = false) => dispatch(deleteLead({ id, permanent })),
      [dispatch]
    ),
    restoreLead: React.useCallback(
      (id) => dispatch(restoreLead(id)),
      [dispatch]
    ),
    bulkRemoveLeads: React.useCallback(
      (ids, permanent = false) => dispatch(bulkDeleteLeads({ ids, permanent })),
      [dispatch]
    ),
    bulkDeleteLeads: React.useCallback(
      (ids, permanent = false) => dispatch(bulkDeleteLeads({ ids, permanent })),
      [dispatch]
    ),
    clearError: React.useCallback(
      () => dispatch(clearLeadError()),
      [dispatch]
    ),
    dispatch,
  };
};

export default leadSlice.reducer;
