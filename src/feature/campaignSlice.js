import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCampaignsApi,
  getCampaignByIdApi,
  createCampaignApi,
  sendCampaignApi,
  updateCampaignApi,
  deleteCampaignApi,
  getTemplatesApi,
  getAudienceRecipientsApi,
} from "../api/campaignApi.js";

/**
 * ============================================================================
 * NORMALIZERS
 * ============================================================================
 */

export const normalizeRecipient = (r) => {
  if (!r || typeof r !== "object") return r;
  const id = r._id || r.id || "";
  const name = r.name || r.fullname || "Customer";
  const address = r.recipientAddress || r.mobile || r.phone || r.email || "";
  const mobile = r.mobile || r.phone || (!address.includes("@") ? address : "");
  const email = r.email || (address.includes("@") ? address : "");

  return {
    id,
    _id: id,
    customId: r.customId || r.id || "",
    name,
    recipientAddress: address,
    mobile,
    phone: mobile,
    email,
    recipientType: r.recipientType || (r.leadId ? "Lead" : r.userId ? "Customer" : "Lead"),
    type: r.recipientType || (r.leadId ? "Leads" : r.userId ? "Customers" : "Leads"),
    status: r.status || "pending",
    twilioMessageSid: r.twilioMessageSid || "",
    errorCode: r.errorCode || "",
    errorMessage: r.errorMessage || "",
    segmentsCount: Number(r.segmentsCount) || 1,
    leadId: r.leadId || null,
    userId: r.userId || null,
    location: r.location || "",
    severity: r.severity || "low",
    sentAt: r.sentAt || null,
    deliveredAt: r.deliveredAt || null,
    readAt: r.readAt || null,
  };
};

export const normalizeCampaign = (c) => {
  if (!c || typeof c !== "object") return c;
  const id = c.id || (c._id?.$oid ? c._id.$oid : c._id) || "";
  const name = c.name || c.campaignName || "Untitled Campaign";
  const channel = String(c.channel || "sms").toLowerCase();
  const templateType = String(c.templateType || "promotion").toLowerCase();
  const status = String(c.status || "draft").toLowerCase();

  // Created By normalization
  const createdByObj =
    typeof c.createdBy === "object" && c.createdBy !== null ? c.createdBy : {};
  const creatorName =
    createdByObj.fullname ||
    createdByObj.name ||
    (typeof c.createdBy === "string" ? c.createdBy : "") ||
    "System Admin";

  const recipients = Array.isArray(c.recipients)
    ? c.recipients.map(normalizeRecipient)
    : [];

  const metrics = c.metrics || {
    totalRecipients: recipients.length,
    queuedCount: 0,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
  };

  return {
    _id: c._id || id,
    id,
    name,
    campaignName: name,
    channel,
    templateType,
    status,
    header: c.header || "",
    subject: c.subject || c.subjectLine || "",
    previewText: c.previewText || "",
    body: c.body || c.smsMessageBody || "",
    footer: c.footer || "",
    bannerIncluded: Boolean(c.bannerIncluded),
    bannerType: c.bannerType || "special_offer",
    bannerImageUrl: c.bannerImageUrl || "",
    buttonLabel: c.buttonLabel || "",
    buttonType: c.buttonType || "none",
    buttonUrl: c.buttonUrl || "",
    shortUrl: c.shortUrl || c.trackableShortLink || "",
    otpCode: c.otpCode || "",
    securityNote: c.securityNote || "",
    twilioConfig: {
      fromNumber: c.twilioConfig?.fromNumber || "",
      fromEmail: c.twilioConfig?.fromEmail || c.fromEmail || "",
      messagingServiceSid: c.twilioConfig?.messagingServiceSid || "",
      whatsappContentSid: c.twilioConfig?.whatsappContentSid || "",
      statusCallbackUrl: c.twilioConfig?.statusCallbackUrl || "",
    },
    fromEmail: c.twilioConfig?.fromEmail || c.fromEmail || "",
    recipients,
    metrics,
    totalRecipients: metrics.totalRecipients || recipients.length,
    sentCount: metrics.sentCount || 0,
    deliveredCount: metrics.deliveredCount || 0,
    failedCount: metrics.failedCount || 0,
    deliveryRate: metrics.totalRecipients
      ? Math.round((metrics.deliveredCount / metrics.totalRecipients) * 100)
      : 0,
    creatorName,
    createdBy: createdByObj._id ? createdByObj : c.createdBy,
    isActive: c.isActive !== undefined ? Boolean(c.isActive) : true,
    isDeleted: Boolean(c.isDeleted),
    scheduledAt: c.scheduledAt || null,
    completedAt: c.completedAt || null,
    createdAt: c.createdAt || new Date().toISOString(),
    updatedAt: c.updatedAt || new Date().toISOString(),
  };
};

/**
 * ============================================================================
 * ASYNC THUNKS
 * ============================================================================
 */

// 1. Fetch Campaigns List
export const fetchCampaigns = createAsyncThunk(
  "campaigns/fetchCampaigns",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await getCampaignsApi(params);
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
        list = Array.isArray(payload.campaigns)
          ? payload.campaigns
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
        campaigns: list.map(normalizeCampaign),
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
        err?.response?.data?.message || err.message || "Failed to fetch campaigns"
      );
    }
  }
);

// 2. Fetch Single Campaign
export const fetchCampaignById = createAsyncThunk(
  "campaigns/fetchCampaignById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getCampaignByIdApi(id);
      return normalizeCampaign(res?.data !== undefined ? res.data : res);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to fetch campaign details"
      );
    }
  }
);

// 3. Create Campaign (Draft)
export const createCampaign = createAsyncThunk(
  "campaigns/createCampaign",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createCampaignApi(data);
      return normalizeCampaign(res?.data !== undefined ? res.data : res);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to create campaign"
      );
    }
  }
);

// 4. Send Campaign Directly via Twilio
export const sendCampaign = createAsyncThunk(
  "campaigns/sendCampaign",
  async (data, { rejectWithValue }) => {
    try {
      const res = await sendCampaignApi(data);
      return normalizeCampaign(res?.data !== undefined ? res.data : res);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to send campaign via Twilio"
      );
    }
  }
);

// 5. Update Campaign
export const updateCampaign = createAsyncThunk(
  "campaigns/updateCampaign",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateCampaignApi(id, data);
      return normalizeCampaign(res?.data !== undefined ? res.data : res);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to update campaign"
      );
    }
  }
);

// 6. Delete Campaign
export const deleteCampaign = createAsyncThunk(
  "campaigns/deleteCampaign",
  async ({ id, permanent = false }, { rejectWithValue }) => {
    try {
      await deleteCampaignApi(id, permanent);
      return { id, permanent };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to delete campaign"
      );
    }
  }
);

// 7. Fetch Templates by Channel
export const fetchTemplates = createAsyncThunk(
  "campaigns/fetchTemplates",
  async (channel = "sms", { rejectWithValue }) => {
    try {
      const res = await getTemplatesApi(channel);
      const data = res?.data !== undefined ? res.data : res;
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to fetch templates"
      );
    }
  }
);

// 8. Fetch Audience Recipients (Leads & Customers)
export const fetchAudienceRecipients = createAsyncThunk(
  "campaigns/fetchAudienceRecipients",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await getAudienceRecipientsApi(params);
      const payload = res?.data !== undefined ? res.data : res;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.recipients)
        ? payload.recipients
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      return list.map(normalizeRecipient);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to fetch audience recipients"
      );
    }
  }
);

/**
 * ============================================================================
 * SLICE DEFINITION
 * ============================================================================
 */
const initialState = {
  campaigns: [],
  selectedCampaign: null,
  templates: [],
  audienceRecipients: [],
  loading: false,
  isSending: false,
  templatesLoading: false,
  recipientsLoading: false,
  error: null,
  sendResult: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    setSelectedCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
    },
    clearSendResult: (state) => {
      state.sendResult = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCampaignState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Campaigns
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.campaigns;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        if (!action.payload?.isCanceled) {
          state.error = action.payload;
        }
      })

      // Fetch Single Campaign
      .addCase(fetchCampaignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaign = action.payload;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Campaign
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns.unshift(action.payload);
        state.selectedCampaign = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send Campaign
      .addCase(sendCampaign.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendCampaign.fulfilled, (state, action) => {
        state.isSending = false;
        state.sendResult = action.payload;
        // If it exists in list, update it; otherwise add it
        const index = state.campaigns.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        } else {
          state.campaigns.unshift(action.payload);
        }
      })
      .addCase(sendCampaign.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })

      // Update Campaign
      .addCase(updateCampaign.fulfilled, (state, action) => {
        const index = state.campaigns.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        }
        if (state.selectedCampaign?.id === action.payload.id) {
          state.selectedCampaign = action.payload;
        }
      })

      // Delete Campaign
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.campaigns = state.campaigns.filter((c) => c.id !== action.payload.id);
        if (state.selectedCampaign?.id === action.payload.id) {
          state.selectedCampaign = null;
        }
      })

      // Fetch Templates
      .addCase(fetchTemplates.pending, (state) => {
        state.templatesLoading = true;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state) => {
        state.templatesLoading = false;
      })

      // Fetch Audience Recipients
      .addCase(fetchAudienceRecipients.pending, (state) => {
        state.recipientsLoading = true;
      })
      .addCase(fetchAudienceRecipients.fulfilled, (state, action) => {
        state.recipientsLoading = false;
        state.audienceRecipients = action.payload;
      })
      .addCase(fetchAudienceRecipients.rejected, (state) => {
        state.recipientsLoading = false;
      });
  },
});

export const {
  setSelectedCampaign,
  clearSendResult,
  clearError,
  resetCampaignState,
} = campaignSlice.actions;

export default campaignSlice.reducer;
