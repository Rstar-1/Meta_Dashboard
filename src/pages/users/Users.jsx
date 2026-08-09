import { useState, useEffect } from "react";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import { CrudModal } from "../../components/common/Modal";
import { getUsers as getUsersApi } from "../../api/userApi";

import { usersTableColumns, usersModalFields, usersSidebarData } from "../../utils/apiData";

const Users = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("All Users");
  const [usersList, setUsersList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [allUsersForCounts, setAllUsersForCounts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const getRoleDisplayName = (role) => {
    if (role === "admin") return "Administrator";
    if (role === "vendor") return "Vendor";
    if (role === "user") return "User";
    return role || "N/A";
  };

  const rolesList = usersSidebarData.items.map((item) => ({
    ...item,
    count: item.role === "all" ? (allUsersForCounts.length || totalItems) : allUsersForCounts.filter((u) => u.role === item.role).length
  }));

  const columns = usersTableColumns.map((col) => {
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
    return col;
  });

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
            onClick={() => setIsAddModalOpen(true)}
          >
            Invite User
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
        title="Invite New System User"
        size="sm"
        type="sidebar"
        placement="right"
        fields={usersModalFields}
        onSubmit={() => {
          alert("Invitation link sent successfully!");
          setIsAddModalOpen(false);
        }}
      />
    </Structure>
  );
};

export default Users;
