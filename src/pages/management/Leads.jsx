import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';
import { CrudModal, DeleteModal } from '../../components/common/Modal';
import { getLeads, createLead, updateLead, deleteLead } from '../../api/leadApi';
import { getUsers } from '../../api/userApi';
import { leadsTableColumns, leadsModalFields, leadsSidebarData, formatCreatedBy } from '../../utils/apiData';

const Leads = () => {
  const loggedInUser = useSelector((state) => state.auth?.user);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers({ limit: 100 });
        const resData = res?.data || res;
        const usersArray = Array.isArray(resData?.users) ? resData.users : Array.isArray(resData) ? resData : [];
        const map = {};
        usersArray.forEach((u) => {
          if (u._id) map[u._id] = u;
          if (u.id) map[u.id] = u;
        });
        setUsersMap(map);
      } catch (err) {
        console.warn("Could not load users for createdBy lookup:", err);
      }
    };
    fetchUsers();
  }, []);

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
          <div className="flex items-center gap-8">
            <Button
              type="button"
              version="icon"
              icon="Edit"
              bg="light-primary"
              color="primary"
              onClick={() => {
                setSelectedEnquiry(row);
                setIsEditModalOpen(true);
              }}
              title="Edit Lead"
            />
            <Button
              type="button"
              version="icon"
              icon="Trash"
              bg="light-danger"
              color="danger"
              onClick={() => {
                setSelectedEnquiry(row);
                setIsDeleteModalOpen(true);
              }}
              title="Delete Lead"
            />
          </div>
        )
      };
    }
    return col;
  });

  const getModalFields = () =>
    leadsModalFields.map((field) => ({
      ...field,
      defaultValue: selectedEnquiry ? selectedEnquiry[field.name] : ""
    }));

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

  const filtered = enquiriesList
    .map((e) => ({
      ...e,
      ...formatCreatedBy(e.createdBy, usersMap, loggedInUser)
    }))
    .filter((e) => {
      const matchesStatus = selectedStatus === 'All Leads' || e.status === selectedStatus;
      const matchesSearch = (e.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.company || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.mobile || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.location || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.enquiry || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.createdByProfile || '').toLowerCase().includes(search.toLowerCase());
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
        fields={getModalFields()}
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
        fields={getModalFields()}
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
