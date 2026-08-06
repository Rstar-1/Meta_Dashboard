import { useState, useEffect } from 'react';
import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';
import { CrudModal, DeleteModal } from '../../components/common/Modal';
import { getLeads, createLead, updateLead, deleteLead } from '../../api/leadApi';

const Leads = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await getLeads();
      setEnquiriesList(res.data || res || []);
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const columns = [
    { header: "", accessor: "checkbox", render: () => <input type="checkbox" className="cursor-pointer" />, style: { width: "40px" } },
    { header: "Enquiry ID", accessor: "id", render: (row) => <span className="text-dark font-600 mini-text">{row.id}</span>, style: { minWidth: "110px" } },
    { header: "Company/Person Name", accessor: "company", render: (row) => <span className="text-dark font-500 mini-text">{row.company}</span>, style: { minWidth: "180px" } },
    { header: "Mobile Number", accessor: "mobile", render: (row) => <span className="text-gray mini-text">{row.mobile}</span>, style: { minWidth: "130px" } },
    { header: "Email Address", accessor: "email", render: (row) => <span className="text-gray mini-text">{row.email}</span>, style: { minWidth: "180px" } },
    { header: "Location", accessor: "location", render: (row) => <span className="text-gray mini-text">{row.location}</span>, style: { minWidth: "140px" } },
    {
      header: "Enquiry",
      accessor: "enquiry",
      style: { minWidth: "220px" },
      render: (row) => (
        <span
          className="text-gray mini-text"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            maxHeight: '32px',
            lineHeight: '16px'
          }}
          title={row.enquiry}
        >
          {row.enquiry}
        </span>
      )
    },
    {
      header: "Status",
      accessor: "status",
      style: { minWidth: "100px" },
      render: (row) => {
        const colors = {
          Pending: { dot: "#d97706", text: "#d97706" },
          Reviewed: { dot: "#4f46e5", text: "#4f46e5" },
          Approved: { dot: "#10b981", text: "#059669" }
        };
        const { dot = "#64748b", text = "#64748b" } = colors[row.status] || {};
        return (
          <div className="flex items-center gap-6">
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, boxShadow: `0 0 6px ${dot}` }}></div>
            <span style={{ color: text }} className="small-text font-500">{row.status}</span>
          </div>
        );
      }
    },
    { header: "Created By", accessor: "createdBy", render: (row) => <span className="text-gray mini-text">{row.createdBy}</span>, style: { minWidth: "100px" } },
    {
      header: "Actions",
      accessor: "actions",
      style: { minWidth: "100px" },
      render: (row) => (
        <div className="flex items-center gap-10">
          <span className="cursor-pointer" onClick={() => {
            setSelectedEnquiry(row);
            setIsEditModalOpen(true);
          }}>
            <Icon name="Edit" width="16" height="16" stroke="var(--primary)" />
          </span>
          <span className="cursor-pointer" onClick={() => {
            setSelectedEnquiry(row);
            setIsDeleteModalOpen(true);
          }}>
            <Icon name="Trash" width="16" height="16" stroke="var(--danger)" />
          </span>
        </div>
      )
    }
  ];

  const modalFields = [
    { name: "company", label: "Company/Person Name", type: "text", required: true, placeholder: "e.g. Evergreen Plastics Ltd" },
    { name: "mobile", label: "Mobile Number", type: "text", required: true, placeholder: "e.g. +91 98765 43210" },
    { name: "email", label: "Email Address", type: "text", required: true, placeholder: "e.g. info@company.com" },
    { name: "location", label: "Location", type: "text", required: true, placeholder: "e.g. Mumbai, Maharashtra" },
    { name: "enquiry", label: "Enquiry Details", type: "text", required: true, placeholder: "Request details..." },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "Pending" },
        { label: "Reviewed", value: "Reviewed" },
        { label: "Approved", value: "Approved" }
      ]
    },
    { name: "createdBy", label: "Created By", type: "text", required: true, placeholder: "e.g. Self, Admin" }
  ];

  const handleAddSubmit = async (formData) => {
    try {
      await createLead(formData);
      setIsAddModalOpen(false);
      loadLeads();
    } catch (err) {
      alert("Failed to create lead: " + (err.message || err));
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!selectedEnquiry) return;
    try {
      const leadId = selectedEnquiry._id || selectedEnquiry.id;
      await updateLead(leadId, formData);
      setIsEditModalOpen(false);
      setSelectedEnquiry(null);
      loadLeads();
    } catch (err) {
      alert("Failed to update lead: " + (err.message || err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEnquiry) return;
    try {
      const leadId = selectedEnquiry._id || selectedEnquiry.id;
      await deleteLead(leadId);
      setIsDeleteModalOpen(false);
      setSelectedEnquiry(null);
      loadLeads();
    } catch (err) {
      alert("Failed to delete lead: " + (err.message || err));
    }
  };

  const filtered = enquiriesList.filter(e =>
    (e.id || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.company || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.mobile || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.location || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.enquiry || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.createdBy || '').toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Structure
      showSidebar={false}
      headerIcon={<Icon name="UserPlus" width="22" height="22" strokeWidth="2" />}
      headerTitle="Leads & RFQs"
      headerSub="Track wholesale enquiries, customer quotes, and supplier negotiations"
      showTabControls={false}
      quickAction={
        <div className="text-right">
          <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
          <p
            className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Lead Reference
            <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
          </p>
        </div>
      }
    >
      <div className="leads-wrapper w-full">
        <Table
          title="Leads & RFQs"
          headerSub={`${enquiriesList.length} enquiries • ${enquiriesList.filter(e => e.status === 'Approved').length} approved`}
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
          loading={loading}
          minWidth="1250px"
        />
      </div>

      <CrudModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Lead Reference"
        size="sm"
        type="sidebar"
        placement="right"
        fields={modalFields}
        onSubmit={handleAddSubmit}
      />

      <CrudModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEnquiry(null);
        }}
        title="Edit Lead Reference"
        size="sm"
        type="sidebar"
        placement="right"
        fields={modalFields}
        form={selectedEnquiry}
        onSubmit={handleEditSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEnquiry(null);
        }}
        title="Delete Lead Reference"
        onConfirm={handleConfirmDelete}
      />
    </Structure>
  );
};

export default Leads;
