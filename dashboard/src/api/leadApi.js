import axiosInstance from "./server/axiosInstance";
import { handleRequest } from "./server/apiHandler";

/**
 * Lead API Module
 * Mapped to Mongoose Lead schema:
 * { id, name, mobile, email, location, description, severity, isActive, isDeleted, createdBy, createdAt, updatedAt }
 */

// Fetch all leads with query params (page, limit, search, severity, isActive, isDeleted)
export const getLeadsApi = (params = {}) =>
  handleRequest(() => axiosInstance.get("/api/leads", { params }));

// Fetch single lead by ID or _id
export const getLeadByIdApi = (id) =>
  handleRequest(() => axiosInstance.get(`/api/leads/${id}`));

// Create new lead (id is auto-generated as LED-001 by pre-validate hook if omitted)
export const createLeadApi = (data) =>
  handleRequest(() => axiosInstance.post("/api/leads", data));

// Update existing lead by ID
export const updateLeadApi = (id, data) =>
  handleRequest(() => axiosInstance.put(`/api/leads/${id}`, data));

// Update severity ('high' | 'medium' | 'low')
export const updateLeadSeverityApi = (id, severity) =>
  handleRequest(() =>
    axiosInstance.patch(`/api/leads/${id}/severity`, {
      severity: String(severity).toLowerCase().trim(),
    })
  );

// Toggle or set isActive status
export const updateLeadStatusApi = (id, isActive) =>
  handleRequest(() =>
    axiosInstance.patch(`/api/leads/${id}/status`, {
      isActive: Boolean(isActive),
    })
  );

// Delete lead (soft delete default, permanent=true deletes from database)
export const deleteLeadApi = (id, permanent = false) =>
  handleRequest(() =>
    axiosInstance.delete(`/api/leads/${id}`, {
      params: permanent ? { permanent: true } : undefined,
    })
  );

// Restore a soft-deleted lead from trash
export const restoreLeadApi = (id) =>
  handleRequest(() => axiosInstance.patch(`/api/leads/${id}/restore`));

// Bulk delete leads
export const bulkDeleteLeadsApi = (data) =>
  handleRequest(() => axiosInstance.post("/api/leads/bulk-delete", data));

export default {
  getLeads: getLeadsApi,
  getLeadById: getLeadByIdApi,
  createLead: createLeadApi,
  updateLead: updateLeadApi,
  updateLeadSeverity: updateLeadSeverityApi,
  updateLeadStatus: updateLeadStatusApi,
  deleteLead: deleteLeadApi,
  restoreLead: restoreLeadApi,
  bulkDeleteLeads: bulkDeleteLeadsApi,
};
