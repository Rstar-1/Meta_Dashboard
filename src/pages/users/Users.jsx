import { useState } from 'react';
import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';

const Users = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const usersList = [
    { id: 'USR-01', name: 'Sandra Marx', email: 'sandra@gmail.com', role: 'Administrator', lastActive: 'Active Now', status: 'Active' },
    { id: 'USR-02', name: 'Ashmita Dev', email: 'ashmita@enterprises.com', role: 'Owner', lastActive: '2 hours ago', status: 'Active' },
    { id: 'USR-03', name: 'Rohan Sharma', email: 'rohan.s@gmail.com', role: 'Manager', lastActive: 'Yesterday', status: 'Inactive' }
  ];

  const columns = [
    { header: "", accessor: "checkbox", render: () => <input type="checkbox" className="cursor-pointer" />, style: { width: "40px" } },
    { header: "User ID", accessor: "id" },
    { header: "Name", accessor: "name", render: (row) => <span style={{ fontWeight: '600' }}>{row.name}</span> },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role", render: (row) => <span style={{ fontWeight: '500' }}>{row.role}</span> },
    { header: "Last Active", accessor: "lastActive", render: (row) => <span style={{ color: '#64748b' }}>{row.lastActive}</span> },
    {
      header: "Status",
      accessor: "status",
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

  const filtered = usersList.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Structure
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
          headerSub={`${usersList.length} users • ${usersList.filter(u => u.status === 'Active').length} active`}
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
