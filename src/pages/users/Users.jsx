import { useState, useEffect } from "react";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import { getUsers as getUsersApi } from "../../api/userApi";

const Users = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("All Users");
  const [usersList, setUsersList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [allUsersForCounts, setAllUsersForCounts] = useState([]);

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

  const rolesList = [
    { name: "All Users", count: allUsersForCounts.length || totalItems, color: "#1e74db" },
    { name: "Administrator", count: allUsersForCounts.filter((u) => u.role === "admin").length, color: "#10b981" },
    { name: "Vendor", count: allUsersForCounts.filter((u) => u.role === "vendor").length, color: "#f59e0b" },
    { name: "User", count: allUsersForCounts.filter((u) => u.role === "user").length, color: "#8b5cf6" }
  ];

  const columns = [
    { header: "", accessor: "checkbox", render: () => <input type="checkbox" className="cursor-pointer" />, style: { width: "40px" } },
    { header: "Name", accessor: "name", render: (row) => <span className="text-dark font-500 mini-text">{row.fullname || row.name}</span>, style: { minWidth: "160px" } },
    { header: "Email", accessor: "email", render: (row) => <span className="text-gray mini-text">{row.email}</span>, style: { minWidth: "200px" } },
    { header: "Mobile", accessor: "mobile", render: (row) => <span className="text-gray mini-text">{row.mobile || "N/A"}</span>, style: { minWidth: "120px" } },
    { header: "Role", accessor: "role", render: (row) => <span className="text-dark font-500 mini-text capitalize">{getRoleDisplayName(row.role)}</span>, style: { minWidth: "120px" } },
    {
      header: "Last Active",
      accessor: "lastActive",
      render: (row) => {
        const loginDate = row.lastLogin?.$date || row.lastLogin;
        return (
          <span className="text-gray mini-text">
            {loginDate ? new Date(loginDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
          </span>
        );
      },
      style: { minWidth: "120px" }
    },
    {
      header: "Status",
      accessor: "status",
      style: { minWidth: "100px" },
      render: (row) => {
        const isAct = row.status === true || row.status === "Active";
        const dot = isAct ? "#10b981" : "#dc2626";
        return (
          <div className="flex items-center gap-6">
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, boxShadow: `0 0 6px ${dot}` }}></div>
            <span style={{ color: isAct ? "#059669" : "#dc2626" }} className="small-text font-500">{isAct ? "Active" : "Inactive"}</span>
          </div>
        );
      }
    }
  ];

  return (
    <Structure
      sidebarTitle="Roles"
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
          <p className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer">
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
    </Structure>
  );
};

export default Users;
