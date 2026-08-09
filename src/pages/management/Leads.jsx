import { useState, useEffect } from 'react';
import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';
import { CrudModal, DeleteModal } from '../../components/common/Modal';
import { getLeads, createLead, updateLead, deleteLead } from '../../api/leadApi';
import { leadsTableColumns, leadsModalFields, leadsSidebarData } from '../../utils/apiData';

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

  const columns = leadsTableColumns.map((col) => {
    if (col.accessor === "checkbox") {
      return { ...col, render: () => <input type="checkbox" className="cursor-pointer" /> };
    }
    if (col.accessor === "actions") {
      return {
        ...col,
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
      };
    }
    return col;
  });

  const modalFields = leadsModalFields;

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

  const [selectedStatus, setSelectedStatus] = useState('All Leads');

  const sidebarItems = leadsSidebarData.items.map((item) => ({
    ...item,
    count: item.status === "all" ? enquiriesList.length : enquiriesList.filter((e) => e.status === item.status).length
  }));

  const filtered = enquiriesList.filter(e => {
    const matchesStatus = selectedStatus === 'All Leads' || e.status === selectedStatus;
    const matchesSearch = (e.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.mobile || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.enquiry || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const paginatedData = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Structure
      sidebarTitle={leadsSidebarData.title}
      sidebarItems={sidebarItems}
      selectedSidebarItem={selectedStatus}
      onSidebarItemClick={(name) => { setSelectedStatus(name); setCurrentPage(1); }}
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
