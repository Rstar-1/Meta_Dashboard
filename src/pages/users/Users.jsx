import { useState } from "react";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";

const Users = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("All Users");

  const [usersList] = useState([
    { id: "USR-01", name: "Sandra Marx", email: "sandra@gmail.com", role: "Administrator", lastActive: "Active Now", status: "Active" },
    { id: "USR-02", name: "Ashmita Dev", email: "ashmita@enterprises.com", role: "Vendor", lastActive: "2 hours ago", status: "Active" },
    { id: "USR-03", name: "Rohan Sharma", email: "rohan.s@gmail.com", role: "User", lastActive: "Yesterday", status: "Inactive" },
    { id: "USR-04", name: "Raj Shetye", email: "raj.shetye@gmail.com", role: "Dev Admin", lastActive: "10 mins ago", status: "Active" },
    { id: "USR-05", name: "Akib Khan", email: "akib@gmail.com", role: "Vendor", lastActive: "3 hours ago", status: "Active" },
    { id: "USR-06", name: "Johnathan Doe", email: "john@example.com", role: "User", lastActive: "3 days ago", status: "Inactive" }
  ]);

  const rolesList = [
    { name: "All Users", count: usersList.length, color: "#1e74db", icon: "Users" },
    { name: "Administrator", count: usersList.filter((u) => u.role === "Administrator").length, color: "#10b981", icon: "Shield" },
    { name: "Vendor", count: usersList.filter((u) => u.role === "Vendor").length, color: "#f59e0b", icon: "Briefcase" },
    { name: "User", count: usersList.filter((u) => u.role === "User").length, color: "#8b5cf6", icon: "User" },
    { name: "Dev Admin", count: usersList.filter((u) => u.role === "Dev Admin").length, color: "#ef4444", icon: "Cpu" }
  ];

  const columns = [
    { header: "", accessor: "checkbox", render: () => <input type="checkbox" className="cursor-pointer" />, style: { width: "40px" } },
    { header: "User ID", accessor: "id", render: (row) => <span className="text-dark font-600 mini-text">{row.id}</span>, style: { minWidth: "100px" } },
    { header: "Name", accessor: "name", render: (row) => <span className="text-dark font-500 mini-text">{row.name}</span>, style: { minWidth: "160px" } },
    { header: "Email", accessor: "email", render: (row) => <span className="text-gray mini-text">{row.email}</span>, style: { minWidth: "200px" } },
    { header: "Role", accessor: "role", render: (row) => <span className="text-dark font-500 mini-text">{row.role}</span>, style: { minWidth: "120px" } },
    { header: "Last Active", accessor: "lastActive", render: (row) => <span className="text-gray mini-text">{row.lastActive}</span>, style: { minWidth: "120px" } },
    {
      header: "Status",
      accessor: "status",
      style: { minWidth: "100px" },
      render: (row) => {
        const isAct = row.status === "Active";
        const dot = isAct ? "#10b981" : "#dc2626";
        return (
          <div className="flex items-center gap-6">
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, boxShadow: `0 0 6px ${dot}` }}></div>
            <span style={{ color: isAct ? "#059669" : "#dc2626" }} className="small-text font-500">{row.status}</span>
          </div>
        );
      }
    }
  ];

  const filtered = usersList.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === "All Users" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const paginatedData = filtered.slice((currentPage - 1) * 10, currentPage * 10);

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
          headerSub={`${filtered.length} users • ${filtered.filter((u) => u.status === "Active").length} active`}
          columns={columns}
          data={paginatedData}
          totalItems={filtered.length}
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
