import { useState } from 'react';
import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';

const CMS = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All Pages');

  const pages = [
    { id: 'CMS-01', title: 'Home Hero Section', path: '/home', author: 'Sandra Marx', lastUpdated: '03 Aug 2026', status: 'Published', category: 'Home' },
    { id: 'CMS-02', title: 'About Us Company Info', path: '/about', author: 'Sandra Marx', lastUpdated: '01 Aug 2026', status: 'Published', category: 'About Us' },
    { id: 'CMS-03', title: 'PVC Curtain Catalog Hero', path: '/products', author: 'Admin User', lastUpdated: '28 Jul 2026', status: 'Draft', category: 'Product' },
    { id: 'CMS-04', title: 'Privacy Policy Document', path: '/privacy', author: 'Legal Team', lastUpdated: '15 Jul 2026', status: 'Published', category: 'Other' },
    { id: 'CMS-05', title: 'Agency Blog Banner', path: '/blog', author: 'Admin User', lastUpdated: '10 Jul 2026', status: 'Published', category: 'Blog' }
  ];

  const categoriesList = [
    { name: "All Pages", count: pages.length, color: "#1e74db" },
    { name: "Home", count: pages.filter(p => p.category === 'Home').length, color: "#2563eb" },
    { name: "About Us", count: pages.filter(p => p.category === 'About Us').length, color: "#10b981" },
    { name: "Blog", count: pages.filter(p => p.category === 'Blog').length, color: "#f59e0b" },
    { name: "Product", count: pages.filter(p => p.category === 'Product').length, color: "#8b5cf6" },
    { name: "Other", count: pages.filter(p => p.category === 'Other').length, color: "#ec4899" }
  ];

  const columns = [
    { header: "", accessor: "checkbox", render: () => <input type="checkbox" className="cursor-pointer" />, style: { width: "40px" } },
    { header: "Block ID", accessor: "id", render: (row) => <span className="text-dark font-600 mini-text">{row.id}</span>, style: { minWidth: "90px" } },
    { header: "Section/Page Title", accessor: "title", render: (row) => <span className="text-dark font-500 mini-text">{row.title}</span>, style: { minWidth: "180px" } },
    { header: "URL Path", accessor: "path", render: (row) => <span style={{ color: '#0284c7', fontFamily: 'monospace' }} className="mini-text">{row.path}</span>, style: { minWidth: "100px" } },
    { header: "Author", accessor: "author", render: (row) => <span className="text-gray mini-text">{row.author}</span>, style: { minWidth: "125px" } },
    { header: "Last Updated", accessor: "lastUpdated", render: (row) => <span className="text-gray mini-text">{row.lastUpdated}</span>, style: { minWidth: "120px" } },
    {
      header: "Status",
      accessor: "status",
      style: { minWidth: "100px" },
      render: (row) => {
        const isPublished = row.status === "Published";
        const dotColor = isPublished ? "#10b981" : "#0284c7";
        return (
          <div className="flex items-center gap-6">
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dotColor, boxShadow: `0 0 6px ${dotColor}` }}></div>
            <span style={{ color: isPublished ? "#059669" : "#0284c7" }} className="small-text font-500">{row.status}</span>
          </div>
        );
      }
    }
  ];

  const filtered = pages.filter(p => {
    const matchesCategory = selectedCategory === 'All Pages' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.path.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const paginatedData = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Structure
      sidebarTitle="Page Types"
      sidebarItems={categoriesList}
      selectedSidebarItem={selectedCategory}
      onSidebarItemClick={(name) => { setSelectedCategory(name); setCurrentPage(1); }}
      headerIcon={<Icon name="Clipboard" width="22" height="22" strokeWidth="2" />}
      headerTitle="Content Management"
      headerSub="Modify block components, hero sections, and main page layouts"
      showTabControls={false}
      quickAction={
        <div className="text-right">
          <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
          <p className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer">
            Create Page Block
            <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
          </p>
        </div>
      }
    >
      <div className="cms-wrapper w-full">
        <Table
          title="Content Blocks"
          headerSub={`${pages.length} total blocks • ${pages.filter(p => p.status === 'Published').length} published`}
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

export default CMS;
