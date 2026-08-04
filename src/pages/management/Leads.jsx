import { useState } from 'react';
import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';

const Leads = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const enquiriesList = [
    { id: 'ENQ-2041', supplier: 'Evergreen Plastics Ltd', item: 'Super Clear PVC Rolls (2mm)', qty: '200 Rolls', date: '04 Aug 2026', status: 'Pending' },
    { id: 'ENQ-2040', supplier: 'Standard Hardware Corp', item: 'Stainless Steel Hanger System', qty: '500 Sets', date: '03 Aug 2026', status: 'Reviewed' },
    { id: 'ENQ-2039', supplier: 'SafeGate Industrial', item: 'Polar Grade PVC Strip Curtains', qty: '120 Rolls', date: '02 Aug 2026', status: 'Approved' },
    { id: 'ENQ-2038', supplier: 'Kolkata Polymer Solutions', item: 'Anti-Static PVC Sheets', qty: '80 Rolls', date: '02 Aug 2026', status: 'Pending' },
  ];

  const columns = [
    { header: "", accessor: "checkbox", render: () => <input type="checkbox" className="cursor-pointer" />, style: { width: "40px" } },
    { header: "Enquiry ID", accessor: "id", render: (row) => <span className="text-dark font-600 mini-text">{row.id}</span>, style: { minWidth: "100px" } },
    { header: "Company / Contact", accessor: "supplier", render: (row) => <span className="text-dark font-500 mini-text">{row.supplier}</span>, style: { minWidth: "180px" } },
    { header: "Item Requested", accessor: "item", render: (row) => <span className="text-gray mini-text">{row.item}</span>, style: { minWidth: "160px" } },
    { header: "Quantity", accessor: "qty", render: (row) => <span className="text-gray mini-text">{row.qty}</span>, style: { minWidth: "100px" } },
    { header: "Received Date", accessor: "date", render: (row) => <span className="text-gray mini-text">{row.date}</span>, style: { minWidth: "120px" } },
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
    }
  ];

  const filtered = enquiriesList.filter(e => 
    e.id.toLowerCase().includes(search.toLowerCase()) || 
    e.supplier.toLowerCase().includes(search.toLowerCase()) ||
    e.item.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Structure
      headerIcon={<Icon name="UserPlus" width="22" height="22" strokeWidth="2" />}
      headerTitle="Leads & RFQs"
      headerSub="Track wholesale enquiries, customer quotes, and supplier negotiations"
      showTabControls={false}
      quickAction={
        <div className="text-right">
          <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
          <p className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer">
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
        />
      </div>
    </Structure>
  );
};

export default Leads;
