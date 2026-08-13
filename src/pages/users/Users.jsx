import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { CrudModal } from "../../components/common/Modal";
import { getUsers as getUsersApi, updateUser as updateUserApi } from "../../api/userApi";
import { getRoles as getRolesApi } from "../../api/roleApi";

import { usersTableColumns, usersModalFields, usersSidebarData } from "../../utils/apiData";

const Users = () => {
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("All Users");
  const [usersList, setUsersList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [allUsersForCounts, setAllUsersForCounts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentUser, setCurrentUser] = useState(null);
  const [roles, setRoles] = useState([]);

  const fetchRolesList = async () => {
    try {
      const res = await getRolesApi();
      const rolesData = res?.data || res;
      if (rolesData && Array.isArray(rolesData)) {
        setRoles(rolesData);
      }
    } catch (err) {
      console.warn("Could not retrieve roles list:", err);
    }
  };

  useEffect(() => {
    fetchRolesList();
  }, []);

  const fetchAllUsersForCounts = async () => {
    try {
      const res = await getUsersApi({ limit: 1000 });
      const resData = res?.data || res;
      if (resData && Array.isArray(resData.users)) {
        setAllUsersForCounts(resData.users);
      }
    } catch (err) {
      console.warn("Could not retrieve all users for counts:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const query = {
        page: currentPage,
        limit: 10,
        search: search || undefined
      };
      if (selectedRole !== "All Users") {
        query.role = selectedRole === "Administrator" ? "admin" : selectedRole.toLowerCase();
      }
      const res = await getUsersApi(query);
      const resData = res?.data || res;
      if (resData && Array.isArray(resData.users)) {
        setUsersList(resData.users);
        setTotalItems(resData.pagination?.total || resData.users.length);
      } else {
        setUsersList([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.warn("Could not retrieve users list:", err);
      setUsersList([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllUsersForCounts();
  }, [totalItems]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, selectedRole]);

  const getRoleDisplayName = (roleVal) => {
    const matched = roles.find((r) => r.name?.toLowerCase() === String(roleVal).toLowerCase());
    if (matched && matched.name) {
      return matched.name.charAt(0).toUpperCase() + matched.name.slice(1);
    }
    if (roleVal === "admin") return "Administrator";
    if (roleVal === "vendor") return "Vendor";
    if (roleVal === "user") return "User";
    return roleVal || "N/A";
  };

  const rolesList = usersSidebarData.items.map((item) => ({
    ...item,
    count: item.role === "all" ? (allUsersForCounts.length || totalItems) : allUsersForCounts.filter((u) => u.role === item.role).length
  }));

  const handleEditClick = (user) => {
    setModalMode("edit");
    setCurrentUser(user);
    setIsAddModalOpen(true);
  };

  const getModalFields = () => {
    return usersModalFields.map((field) => {
      let val = "";
      if (modalMode === "edit" && currentUser) {
        val = currentUser[field.name] || (field.name === "name" ? (currentUser.fullname || currentUser.name) : "") || "";
      }
      if (field.name === "role" && roles.length > 0) {
        return {
          ...field,
          defaultValue: val,
          options: roles.map((r) => ({
            label: r.name ? (r.name.charAt(0).toUpperCase() + r.name.slice(1)) : "Role",
            value: r.name?.toLowerCase() || ""
          }))
        };
      }
      return { ...field, defaultValue: val };
    });
  };

  const columns = usersTableColumns
    .filter((col) => {
      if (col.accessor === "actions") {
        return loggedInUser?.role === "admin";
      }
      return true;
    })
    .map((col) => {
      if (col.accessor === "checkbox") {
        return { ...col, render: () => <input type="checkbox" className="cursor-pointer" /> };
      }
      if (col.accessor === "name") {
        return { ...col, render: (row) => <span className="text-dark font-500 mini-text">{row.fullname || row.name}</span> };
      }
      if (col.accessor === "role") {
        return { ...col, render: (row) => <span className="text-dark font-500 mini-text capitalize">{getRoleDisplayName(row.role)}</span> };
      }
      if (col.accessor === "lastActive") {
        return {
          ...col,
          render: (row) => {
            const loginDate = row.lastLogin?.$date || row.lastLogin;
            return (
              <span className="text-gray mini-text">
                {loginDate ? new Date(loginDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
              </span>
            );
          }
        };
      }
      if (col.accessor === "actions") {
        return {
          ...col,
          render: (row) => (
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                version="icon"
                icon="Edit"
                bg="white"
                color="primary"
                onClick={() => handleEditClick(row)}
              />
            </div>
          )
        };
      }
      return col;
    });

  const handleFormSubmit = async (formData) => {
    if (modalMode === "edit" && currentUser) {
      try {
        const userId = currentUser._id || currentUser.id;
        await updateUserApi(userId, formData);
        alert("User updated successfully!");
        fetchUsers();
        fetchAllUsersForCounts();
      } catch (err) {
        alert("Failed to update user: " + (err.message || err));
      }
    } else {
      alert("Invitation link sent successfully!");
    }
    setIsAddModalOpen(false);
  };

  return (
    <Structure
      sidebarTitle={usersSidebarData.title}
      sidebarItems={rolesList}
      selectedSidebarItem={selectedRole}
      onSidebarItemClick={(roleName) => {
        setSelectedRole(roleName);
        setCurrentPage(1);
      }}
      headerIcon={<Icon name="Users" width="22" height="22" strokeWidth="2" />}
      headerTitle="System Users"
      headerSub="Administer dashboard user roles, system permissions, and logs"
      showTabControls={false}
      quickAction={
        <div className="text-right">
          <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
          <p
            className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer"
            onClick={() => {
              setModalMode("edit");
              setCurrentUser(loggedInUser);
              setIsAddModalOpen(true);
            }}
          >
            Edit User
            <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
          </p>
        </div>
      }
    >
      <div className="users-wrapper w-full">
        <Table
          title="System Users"
          headerSub={`${totalItems} users total`}
          columns={columns}
          data={usersList}
          totalItems={totalItems}
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
        title={modalMode === "create" ? "Invite New System User" : "Edit User Details"}
        size="sm"
        type="sidebar"
        placement="right"
        fields={getModalFields()}
        onSubmit={handleFormSubmit}
      />
    </Structure>
  );
};

export default Users;
