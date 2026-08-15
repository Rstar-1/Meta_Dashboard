import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { CrudModal, DeleteModal } from "../../components/common/Modal";
import { getRoles, createRole, updateRole, deleteRole } from "../../api/roleApi";
import { rolesTableColumns, rolesModalFields, rolesSidebarData } from "../../utils/apiData";

const MOCK_ROLES = [
  { _id: "role-01", name: "admin", permissions: ["all"], createdAt: "2026-05-04T06:08:01.018Z" },
  { _id: "role-02", name: "vendor", permissions: ["read:products", "write:products", "read:orders"], createdAt: "2026-05-04T06:03:18.348Z" },
  { _id: "role-03", name: "user", permissions: ["read:products"], createdAt: "2026-08-03T06:00:59.252Z" }
];

const Role = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSidebar, setSelectedSidebar] = useState("All Roles");

  // Modal control states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [currentRole, setCurrentRole] = useState(null);

  // Form states
  const [roleForm, setRoleForm] = useState({ name: "", permissions: [] });

  const fetchRolesList = async () => {
    try {
      const res = await getRoles();
      const rolesData = res?.data || res;
      if (rolesData && Array.isArray(rolesData)) {
        setRoles(rolesData);
      } else {
        setRoles(MOCK_ROLES);
      }
    } catch (err) {
      console.warn("Using mock roles data due to API error:", err);
      setRoles(MOCK_ROLES);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRolesList();
  }, []);

  const handleAddClick = () => {
    setModalMode("create");
    setCurrentRole(null);
    setRoleForm({ name: "", permissions: [] });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (role) => {
    setModalMode("edit");
    setCurrentRole(role);
    setRoleForm({
      name: role.name,
      permissions: Array.isArray(role.permissions)
        ? role.permissions
        : typeof role.permissions === "string"
          ? role.permissions.split(",").map(p => p.trim()).filter(Boolean)
          : []
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (role) => {
    setCurrentRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    const permissionArray = typeof formData.permissions === "string"
      ? formData.permissions.split(",").map(p => p.trim().toLowerCase()).filter(Boolean)
      : Array.isArray(formData.permissions)
        ? formData.permissions
        : [];

    const payload = {
      name: formData.name,
      permissions: permissionArray
    };

    const getRoleId = (r) => typeof r?._id === "object" && r?._id?.$oid ? r._id.$oid : r?._id;
    const currentId = getRoleId(currentRole);

    try {
      if (modalMode === "create") {
        await createRole(payload);
        alert("Role created successfully!");
      } else {
        await updateRole(currentId, payload);
        alert("Role updated successfully!");
      }
      setIsAddModalOpen(false);
      fetchRolesList();
    } catch (err) {
      console.warn("Simulating action on state due to API error:", err);
      if (modalMode === "create") {
        const newMockRole = {
          _id: `role-mock-${Date.now()}`,
          name: payload.name.trim().toLowerCase(),
          permissions: payload.permissions,
          createdAt: new Date().toISOString()
        };
        setRoles(prev => [newMockRole, ...prev]);
        alert("Created mock role successfully (offline mode).");
      } else {
        setRoles(prev => prev.map(r => getRoleId(r) === currentId ? { ...r, name: payload.name.trim().toLowerCase(), permissions: payload.permissions } : r));
        alert("Updated mock role successfully (offline mode).");
      }
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentRole) return;
    const getRoleId = (r) => typeof r?._id === "object" && r?._id?.$oid ? r._id.$oid : r?._id;
    const currentId = getRoleId(currentRole);
    try {
      await deleteRole(currentId);
      alert("Role deleted successfully!");
      fetchRolesList();
    } catch (err) {
      console.warn("Simulating deletion on state due to API error:", err);
      setRoles(prev => prev.filter(r => getRoleId(r) !== currentId));
      alert("Deleted mock role successfully (offline mode).");
    }
  };

  const roleColors = {
    all: "#1e74db",
    admin: "#10b981",
    administrator: "#10b981",
    vendor: "#f59e0b",
    user: "#8b5cf6",
  };
  const fallbackColors = ["#ec4899", "#3b82f6", "#06b6d4", "#f97316", "#84cc16", "#6366f1"];

  const sidebarItems = (() => {
    if (!roles || roles.length === 0) {
      return rolesSidebarData.items.map((item) => ({
        ...item,
        count: 0
      }));
    }

    const items = [
      {
        name: "All Roles",
        color: roleColors.all,
        role: "all",
        count: roles.length
      }
    ];

    roles.forEach((r, idx) => {
      const roleName = r.name ? String(r.name).toLowerCase() : "";
      if (!roleName || roleName === "all") return;

      const displayName = roleName === "admin" ? "Admin" : (roleName.charAt(0).toUpperCase() + roleName.slice(1));
      const color = roleColors[roleName] || fallbackColors[idx % fallbackColors.length];
      const count = roles.filter((roleObj) => String(roleObj.name).toLowerCase() === roleName).length;

      items.push({
        name: displayName,
        color: color,
        role: roleName,
        count: count
      });
    });

    return items;
  })();

  const columns = rolesTableColumns.map((col) => {
    if (col.accessor === "name") {
      return { ...col, render: (row) => <span className="text-dark font-600 mini-text capitalize">{row.name}</span> };
    }
    if (col.accessor === "permissions") {
      return {
        ...col,
        render: (row) => {
          const perms = Array.isArray(row.permissions)
            ? row.permissions
            : typeof row.permissions === "string"
              ? row.permissions.split(",").map(p => p.trim()).filter(Boolean)
              : [];
          return (
            <div className="flex flex-wrap gap-4">
              {perms.length === 0 ? (
                <span className="text-gray mini-text italic">No Permissions</span>
              ) : (
                perms.map((p, idx) => (
                  <span key={idx} className="badge bg-light-primary text-primary px-8 py-3 rounded-5 mini-text font-600 capitalize" style={{ backgroundColor: "#eff6ff", fontSize: "11px" }}>
                    {p}
                  </span>
                ))
              )}
            </div>
          );
        }
      };
    }
    if (col.accessor === "createdAt") {
      return {
        ...col,
        render: (row) => (
          <span className="text-gray mini-text">
            {row.createdAt ? new Date(row.createdAt.$date || row.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
          </span>
        )
      };
    }
    if (col.accessor === "actions") {
      return {
        ...col,
        render: (row) => (
          <div className="flex items-center gap-8">
            <Button
              type="button"
              version="icon"
              icon="Edit"
              bg="light-primary"
              color="primary"
              onClick={() => handleEditClick(row)}
              title="Edit Role"
            />
            <Button
              type="button"
              version="icon"
              icon="Trash"
              bg="light-danger"
              color="danger"
              onClick={() => handleDeleteClick(row)}
              title="Delete Role"
            />
          </div>
        )
      };
    }
    return col;
  });

  const filteredRoles = roles.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesSidebar = selectedSidebar === "All Roles" || r.name.toLowerCase() === selectedSidebar.toLowerCase();
    return matchesSearch && matchesSidebar;
  });

  const paginatedData = filteredRoles.slice((currentPage - 1) * 10, currentPage * 10);

  const getModalFields = () =>
    rolesModalFields.map((field) => ({
      ...field,
      defaultValue: roleForm[field.name]
    }));

  return (
    <Structure
      sidebarTitle={rolesSidebarData.title}
      sidebarItems={sidebarItems}
      selectedSidebarItem={selectedSidebar}
      onSidebarItemClick={(name) => {
        setSelectedSidebar(name);
        setCurrentPage(1);
      }}
      headerIcon={<Icon name="Shield" width="22" height="22" strokeWidth="2" />}
      headerTitle="Role Management"
      headerSub="Administer system authorization roles, user capabilities, and endpoint access"
      showTabControls={false}
      quickAction={
        user?.role === "admin" ? (
          <div className="text-right">
            <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
            <p
              className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer"
              onClick={handleAddClick}
            >
              Add New Role
              <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
            </p>
          </div>
        ) : null
      }
    >
      <div className="roles-wrapper w-full">
        <Table
          title="System Roles"
          headerSub={`${filteredRoles.length} roles total`}
          columns={columns}
          data={paginatedData}
          totalItems={filteredRoles.length}
          itemsPerPage={10}
          page={currentPage}
          onPageChange={(p) => setCurrentPage(p)}
          searchQuery={search}
          onSearchChange={(q) => {
            setSearch(q);
            setCurrentPage(1);
          }}
          showControls={true}
        />
      </div>

      <CrudModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={modalMode === "create" ? "Create New Role" : "Edit Role Details"}
        size="sm"
        type="sidebar"
        placement="right"
        fields={getModalFields()}
        onSubmit={handleFormSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        title="Delete Role"
        message="Are you sure you want to delete this role? Users assigned to this role might lose their permissions."
      />
    </Structure>
  );
};

export default Role;
