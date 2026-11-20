import React from "react";
import MainLayout from "../../components/layout/sections/MainLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";
import FilterForm from "../../components/forms/sections/FilterForm";
import Modal from "../../components/common/Modal";
import FormBuilder from "../../components/forms/FormBuilder";
import { getLeadFormFields, sanitizeCrudFormData } from "../../components/forms/sections/CrudForm";
import { showToast } from "../../components/common/Toast";
import {
    leadsSidebarData,
    leadsTableColumns,
    STATUS_OPTIONS,
    TABS,
} from "../../utils/apiData";
import { useCurrentUser } from "../../utils";
import { useLeads } from "../../feature/leadSlice";
import { getLeadsApi } from "../../api/leadApi";

const ITEMS_PER_PAGE = 5;

const SEVERITY_OPTIONS = [
    { label: "All Severities", value: "all" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
];

const Leads = () => {
    const { user: currentUser, isAdmin } = useCurrentUser();
    const {
        leads,
        total,
        loading,
        getLeads,
        addLead,
        editLead,
        removeLead,
        bulkRemoveLeads,
    } = useLeads();

    const [activeTab, setActiveTab] = React.useState("all");

    // Restrict trash tab to admin role only
    const visibleTabs = React.useMemo(() => {
        const raw = TABS.leads || TABS;
        return isAdmin ? raw : raw.filter((t) => (t?.value || "").toLowerCase() !== "trash");
    }, [isAdmin]);

    React.useEffect(() => {
        if (!isAdmin && activeTab === "trash") {
            setActiveTab("all");
        }
    }, [isAdmin, activeTab]);
    const [selectedCategory, setSelectedCategory] = React.useState("All Leads");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [severityFilter, setSeverityFilter] = React.useState("all");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [selectedLeadIds, setSelectedLeadIds] = React.useState([]);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingLead, setEditingLead] = React.useState(null);

    // Fetch leads according to Mongoose schema parameters (page, limit, isDeleted, search, isActive, severity)
    const fetchLeadData = React.useCallback(() => {
        const params = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            isDeleted: activeTab === "trash",
        };

        const trimmed = searchQuery.trim();
        if (trimmed) params.search = trimmed;

        if (statusFilter !== "all") {
            params.isActive = statusFilter === "Active";
        }

        if (severityFilter !== "all") {
            params.severity = severityFilter;
        }

        getLeads(params);
    }, [currentPage, activeTab, searchQuery, statusFilter, severityFilter, getLeads]);

    React.useEffect(() => {
        fetchLeadData();
    }, [fetchLeadData]);

    const [statusCounts, setStatusCounts] = React.useState({
        all: 0,
        active: 0,
        inactive: 0,
        high: 0,
        medium: 0,
        low: 0,
    });

    const fetchStatusCounts = React.useCallback(async () => {
        try {
            const [allRes, activeRes, inactiveRes, highRes, medRes, lowRes] = await Promise.all([
                getLeadsApi({ isDeleted: false, page: 1, limit: 1 }),
                getLeadsApi({ isDeleted: false, isActive: true, page: 1, limit: 1 }),
                getLeadsApi({ isDeleted: false, isActive: false, page: 1, limit: 1 }),
                getLeadsApi({ isDeleted: false, severity: "high", page: 1, limit: 1 }),
                getLeadsApi({ isDeleted: false, severity: "medium", page: 1, limit: 1 }),
                getLeadsApi({ isDeleted: false, severity: "low", page: 1, limit: 1 }),
            ]);

            const parseCount = (res) => {
                const p = res?.data !== undefined ? res.data : res;
                return Number(p?.pagination?.total ?? p?.total ?? (Array.isArray(p) ? p.length : 0)) || 0;
            };

            const allCount = parseCount(allRes);
            const activeCount = parseCount(activeRes);
            const inactiveCount = parseCount(inactiveRes);
            const highCount = parseCount(highRes);
            const medCount = parseCount(medRes);
            const lowCount = parseCount(lowRes);

            setStatusCounts({
                all: allCount || (activeCount + inactiveCount),
                active: activeCount,
                inactive: inactiveCount,
                high: highCount,
                medium: medCount,
                low: lowCount,
            });
        } catch {
            // Gracefully maintain existing counts
        }
    }, []);

    React.useEffect(() => {
        fetchStatusCounts();
    }, [fetchStatusCounts]);

    const handleSearchChange = React.useCallback((val) => {
        const next = typeof val === "string" ? val : (val?.target?.value ?? "");
        setSearchQuery(next);
        setCurrentPage(1);
        setSelectedLeadIds([]);
    }, []);

    const handleStatusFilterChange = React.useCallback((val) => {
        const next = typeof val === "string" ? val : (val?.value || val?.target?.value || "all");
        setStatusFilter(next);
        setSelectedCategory(next === "Active" ? "Active Leads" : next === "Inactive" ? "Inactive Leads" : "All Leads");
        setCurrentPage(1);
        setSelectedLeadIds([]);
    }, []);

    const handleSeverityFilterChange = React.useCallback((val) => {
        const next = typeof val === "string" ? val : (val?.value || val?.target?.value || "all");
        setSeverityFilter(next);
        setSelectedCategory(
            next === "high"
                ? "High Severity"
                : next === "medium"
                ? "Medium Severity"
                : next === "low"
                ? "Low Severity"
                : "All Leads"
        );
        setCurrentPage(1);
        setSelectedLeadIds([]);
    }, []);

    const handleClearFilters = React.useCallback(() => {
        setStatusFilter("all");
        setSeverityFilter("all");
        setSearchQuery("");
        setSelectedCategory("All Leads");
        setCurrentPage(1);
        setSelectedLeadIds([]);
        showToast("Lead filters reset", "info");
    }, []);

    // Sidebar navigation
    const handleSidebarItemClick = React.useCallback((name) => {
        setSelectedCategory(name);
        setCurrentPage(1);
        setSelectedLeadIds([]);

        const item = leadsSidebarData.items.find((i) => i.name === name);
        if (item?.status !== undefined) {
            setStatusFilter(item.status);
            setSeverityFilter("all");
        } else if (item?.severity !== undefined) {
            setSeverityFilter(item.severity);
            setStatusFilter("all");
        } else {
            setStatusFilter("all");
            setSeverityFilter("all");
        }
    }, []);

    const handleTabChange = React.useCallback((tabValue) => {
        setActiveTab(tabValue);
        setCurrentPage(1);
        setSelectedLeadIds([]);
        if (tabValue === "trash") {
            setSelectedCategory("Trash");
            setStatusFilter("all");
            setSeverityFilter("all");
        } else {
            setSelectedCategory("All Leads");
        }
    }, []);

    // Selection handlers for bulk operations
    const isAllSelected = React.useMemo(() => {
        if (!leads.length) return false;
        return leads.every((l) => {
            const id = l.id || l._id;
            return selectedLeadIds.includes(id) || (l._id && selectedLeadIds.includes(l._id));
        });
    }, [leads, selectedLeadIds]);

    const handleSelectAll = React.useCallback((checked) => {
        const next = typeof checked === "boolean" ? checked : !isAllSelected;
        if (next) {
            const allIds = leads.map((l) => l.id || l._id);
            setSelectedLeadIds(allIds);
        } else {
            setSelectedLeadIds([]);
        }
    }, [leads, isAllSelected]);

    const handleSelectRow = React.useCallback((id, row) => {
        const targetId = row?.id || id;
        setSelectedLeadIds((prev) => {
            const exists = prev.includes(targetId) || (row?._id && prev.includes(row._id));
            if (exists) {
                return prev.filter((x) => x !== targetId && x !== row?._id);
            }
            return [...prev, targetId];
        });
    }, []);

    // Actions
    const handleViewLead = React.useCallback((row) => {
        const sev = (row.severity || "low").toUpperCase();
        showToast(
            `Lead: ${row.name} (${row.mobile || "No phone"}) • ${row.location || "Direct"} • Severity: ${sev}`,
            "info"
        );
    }, []);

    const handleEditLead = React.useCallback((row) => {
        setEditingLead(row);
        setIsModalOpen(true);
    }, []);

    const handleDeleteLead = React.useCallback(async (row) => {
        const id = row.id || row._id;
        const name = row.name || "Lead";
        const isPermanent = activeTab === "trash";
        try {
            await removeLead(id, isPermanent);
            if (isPermanent) {
                showToast(`Lead "${name}" permanently removed!`, "success");
            } else {
                showToast(`Lead "${name}" moved to trash!`, "success");
            }
            fetchLeadData();
            fetchStatusCounts();
        } catch (err) {
            showToast(err?.message || "Failed to delete lead", "danger");
        }
    }, [activeTab, removeLead, fetchLeadData, fetchStatusCounts]);

    const handleBulkDelete = React.useCallback(async () => {
        if (!selectedLeadIds.length) return;
        const isPermanent = activeTab === "trash";
        try {
            await bulkRemoveLeads(selectedLeadIds, isPermanent);
            if (isPermanent) {
                showToast(`${selectedLeadIds.length} lead(s) permanently removed!`, "success");
            } else {
                showToast(`${selectedLeadIds.length} lead(s) moved to trash!`, "success");
            }
            setSelectedLeadIds([]);
            fetchLeadData();
            fetchStatusCounts();
        } catch (err) {
            showToast(err?.message || "Failed to bulk delete leads", "danger");
        }
    }, [selectedLeadIds, activeTab, bulkRemoveLeads, fetchLeadData, fetchStatusCounts]);

    // Modal Form Fields via generic CrudForm helper
    const formFields = React.useMemo(
        () => getLeadFormFields({ editingLead, userRole: currentUser }),
        [editingLead, currentUser]
    );

    // Form submission matching leadSchema
    const handleFormSubmit = React.useCallback(async (formData) => {
        if (!formData.name?.trim()) {
            showToast("Lead name is required", "warning");
            return;
        }

        if (!formData.mobile?.trim()) {
            showToast("Mobile number is required", "warning");
            return;
        }

        let activeCreatorId =
            currentUser?._id ||
            currentUser?.id ||
            currentUser?.userId;

        if (!activeCreatorId) {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                activeCreatorId =
                    storedUser?._id ||
                    storedUser?.id ||
                    storedUser?.userId;
            } catch { }
        }

        // Fallback to valid 24-char ObjectId if no session id exists
        if (!activeCreatorId || !String(activeCreatorId).match(/^[0-9a-fA-F]{24}$/)) {
            activeCreatorId = "64b0f0000000000000000001";
        }

        const sanitizedStatus = sanitizeCrudFormData(formData, {
            userRole: currentUser,
            isEditing: Boolean(editingLead),
        });

        const rawSev = String(formData.severity || "low").toLowerCase().trim();
        const severity = ["high", "medium", "low"].includes(rawSev) ? rawSev : "low";

        const payload = {
            name: formData.name.trim(),
            mobile: formData.mobile.trim(),
            email: formData.email ? formData.email.trim().toLowerCase() : "",
            location: formData.location ? formData.location.trim() : "",
            description: formData.description ? formData.description.trim() : "",
            severity,
            isActive: sanitizedStatus.isActive !== undefined ? Boolean(sanitizedStatus.isActive) : true,
        };

        try {
            if (editingLead) {
                const targetId = editingLead.id || editingLead._id;
                if (editingLead.createdBy) {
                    const existingCreator =
                        typeof editingLead.createdBy === "object"
                            ? (editingLead.createdBy._id || editingLead.createdBy.id)
                            : editingLead.createdBy;
                    payload.createdBy = existingCreator || activeCreatorId;
                } else {
                    payload.createdBy = activeCreatorId;
                }
                await editLead(targetId, payload);
                showToast(`Lead "${payload.name}" updated successfully!`, "success");
            } else {
                payload.createdBy = activeCreatorId;
                await addLead(payload);
                showToast(`Lead "${payload.name}" created successfully!`, "success");
            }
            setIsModalOpen(false);
            setEditingLead(null);
            fetchLeadData();
            fetchStatusCounts();
        } catch (err) {
            showToast(err?.message || "Failed to save lead", "danger");
        }
    }, [editingLead, editLead, addLead, fetchLeadData, fetchStatusCounts, currentUser]);

    // Sidebar items with dynamic total counts
    const sidebarItems = React.useMemo(() => {
        const totalAll = activeTab === "trash" ? total : (statusCounts.all || total);
        return leadsSidebarData.items.map((item) => {
            let countVal = 0;
            if (item.status === "all") {
                countVal = totalAll;
            } else if (item.status === "Active") {
                countVal = statusCounts.active;
            } else if (item.status === "Inactive") {
                countVal = statusCounts.inactive;
            } else if (item.severity === "high") {
                countVal = statusCounts.high;
            } else if (item.severity === "medium") {
                countVal = statusCounts.medium;
            } else if (item.severity === "low") {
                countVal = statusCounts.low;
            }

            return {
                ...item,
                icon: "CMS",
                count: countVal,
            };
        });
    }, [statusCounts, total, activeTab]);

    const filterInputsNode = React.useMemo(
        () => (
            <FilterForm
                fields={[
                    {
                        type: "select",
                        label: "Lead Status",
                        options: STATUS_OPTIONS,
                        value: statusFilter,
                        onChange: handleStatusFilterChange,
                    },
                    {
                        type: "select",
                        label: "Severity",
                        options: SEVERITY_OPTIONS,
                        value: severityFilter,
                        onChange: handleSeverityFilterChange,
                    },
                ]}
            />
        ),
        [statusFilter, severityFilter, handleStatusFilterChange, handleSeverityFilterChange]
    );

    const quickActionNode = React.useMemo(
        () => (
            <div className="flex-align gap-8">
                {selectedLeadIds.length > 0 && (
                    <Button
                        text={`Delete (${selectedLeadIds.length})`}
                        version="v2"
                        bg="danger"
                        variant="outline"
                        border="danger"
                        color="white"
                        icon="Trash"
                        onClick={handleBulkDelete}
                    />
                )}
                <Button
                    text="Add Lead"
                    version="v2"
                    bg="primary"
                    variant="outline"
                    border="primary"
                    color="white"
                    icon="Plus"
                    onClick={() => {
                        setEditingLead(null);
                        setIsModalOpen(true);
                    }}
                />
            </div>
        ),
        [selectedLeadIds, handleBulkDelete]
    );

    return (
        <MainLayout
            sidebarTitle={leadsSidebarData.title}
            sidebarItems={sidebarItems}
            selectedSidebarItem={selectedCategory}
            onSidebarItemClick={handleSidebarItemClick}
            headerIcon={<Icon name="CMS" width="18" height="18" />}
            headerTitle="Customer Leads"
            headerSub="Track prospective clients, contact information, severity level, and sales pipeline progress"
            quickAction={quickActionNode}
            showTabControls={true}
            tabs={visibleTabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            filterDescription="Filter leads by severity, active status, or keyword search"
            filterInputs={filterInputsNode}
            hasActiveFilters={
                statusFilter !== "all" ||
                severityFilter !== "all" ||
                Boolean(searchQuery.trim()) ||
                activeTab !== "all"
            }
            onClearAllFilters={handleClearFilters}
        >
            <div className="bg-white p-14 rounded-10">
                <Table
                    title="Sales Leads Pipeline"
                    subtitle={
                        activeTab === "trash"
                            ? "Archived sales leads in trash"
                            : "Track prospective clients, contact information, severity, and assigned team members"
                    }
                    data={leads}
                    columns={leadsTableColumns}
                    totalItems={total}
                    itemsPerPage={ITEMS_PER_PAGE}
                    page={currentPage}
                    onPageChange={(p) => {
                        setCurrentPage(p);
                        setSelectedLeadIds([]);
                    }}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Search by lead name, phone, email, or location..."
                    itemName="leads"
                    collapsible={true}
                    maxVisibleColumns={8}
                    minWidth="1050px"
                    loading={loading}
                    selectedRows={selectedLeadIds}
                    onSelectRow={handleSelectRow}
                    onSelectAll={handleSelectAll}
                    onView={handleViewLead}
                    onEdit={handleEditLead}
                    onDelete={handleDeleteLead}
                    viewTitle="View Lead Profile"
                    editTitle="Edit Lead"
                    deleteTitle={activeTab === "trash" ? "Permanently Delete Lead" : "Delete Lead"}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingLead(null);
                }}
                title={editingLead ? `Edit Lead: ${editingLead.name}` : "Add New Lead"}
                size="sm"
                type="sidebar"
                placement="right"
                footer={null}
            >
                <FormBuilder
                    key={editingLead ? (editingLead.id || editingLead._id) : "new-lead"}
                    fields={formFields}
                    submitType="json"
                    onSubmit={handleFormSubmit}
                    submitText={editingLead ? "Update Lead" : "Save Lead"}
                    col="1"
                />
            </Modal>
        </MainLayout>
    );
};

export default React.memo(Leads);
