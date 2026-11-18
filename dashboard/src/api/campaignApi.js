import axiosInstance from "./server/axiosInstance";
import { handleRequest } from "./server/apiHandler";

/**
 * ============================================================================
 * CAMPAIGN API MODULE
 * ============================================================================
 * Integrates with practice-api campaign-service via Gateway (/api/campaigns)
 * Supports WhatsApp, SMS, and Gmail channels with Twilio integration.
 */

/**
 * Get Audience Recipients (Leads & Customers)
 * @param {Object} params - { type: "all"|"leads"|"customers", channel: "whatsapp"|"sms"|"gmail", search: "", page, limit }
 */
export const getAudienceRecipientsApi = (params = {}) =>
  handleRequest(() =>
    axiosInstance.get("/api/campaigns/recipients", { params })
  );

/**
 * Get Pre-approved Message Templates by Channel
 * @param {string} channel - "whatsapp" | "sms" | "gmail"
 */
export const getTemplatesApi = (channel = "sms") =>
  handleRequest(() =>
    axiosInstance.get("/api/campaigns/templates", {
      params: { channel: String(channel).toLowerCase().trim() },
    })
  );

/**
 * Send Campaign Directly via Twilio (WhatsApp, SMS, or Gmail)
 * Dispatches to all selected recipients immediately.
 * @param {Object} data - Campaign payload with recipients, content & channel
 */
export const sendCampaignApi = (data = {}) =>
  handleRequest(() => axiosInstance.post("/api/campaigns/send", data));

/**
 * Create Campaign (Draft or Scheduled)
 * @param {Object} data - Campaign creation data
 */
export const createCampaignApi = (data = {}) =>
  handleRequest(() => axiosInstance.post("/api/campaigns", data));

/**
 * Get All Campaigns with optional pagination & filters
 * @param {Object} params - { channel, status, templateType, search, isDeleted, page, limit }
 */
export const getCampaignsApi = (params = {}) =>
  handleRequest(() => axiosInstance.get("/api/campaigns", { params }));

/**
 * Get Campaign by ID or _id
 * @param {string} id - Campaign unique ID (e.g. CMP-001 or Mongo _id)
 */
export const getCampaignByIdApi = (id) =>
  handleRequest(() => axiosInstance.get(`/api/campaigns/${id}`));

/**
 * Update Existing Campaign
 * @param {string} id - Campaign ID
 * @param {Object} data - Update data
 */
export const updateCampaignApi = (id, data = {}) =>
  handleRequest(() => axiosInstance.put(`/api/campaigns/${id}`, data));

/**
 * Delete Campaign (soft delete default, permanent=true deletes from database)
 * @param {string} id - Campaign ID
 * @param {boolean} permanent - Permanent delete flag
 */
export const deleteCampaignApi = (id, permanent = false) =>
  handleRequest(() =>
    axiosInstance.delete(`/api/campaigns/${id}`, {
      params: permanent ? { permanent: true } : undefined,
    })
  );

export default {
  getAudienceRecipients: getAudienceRecipientsApi,
  getTemplates: getTemplatesApi,
  sendCampaign: sendCampaignApi,
  createCampaign: createCampaignApi,
  getCampaigns: getCampaignsApi,
  getCampaignById: getCampaignByIdApi,
  updateCampaign: updateCampaignApi,
  deleteCampaign: deleteCampaignApi,
};
