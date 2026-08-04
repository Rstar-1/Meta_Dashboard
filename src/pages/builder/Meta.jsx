import { useState } from 'react';
import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';

const Meta = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All Pages');

  const metaTagsList = [
    { page: 'Home Page', url: '/', title: 'Industrial PVC Strip Curtains & Hanger Systems | Ashmita Enterprises', description: 'Leading manufacturer and supplier of clear polar grade PVC strip curtains, anti-insect yellow PVC rolls, and stainless steel hardware bracket systems in India.', score: '95/100', category: 'Home' },
    { page: 'Product Catalog', url: '/products', title: 'Clear PVC Strip Curtains & Welding Sheets | Products', description: 'Browse our full catalog of industrial PVC rolls, sliding strip curtains, anti-static plastic sheets, and installation hanging bracket accessories.', score: '88/100', category: 'Product' },
    { page: 'About Us', url: '/about-us', title: 'PVC Strip Curtain Manufacturer in India | About Us', description: 'Ashmita Enterprises offers high-performance warehouse partitions, thermal insulation barriers, and cleanroom PVC curtains. Learn about our quality standards.', score: '92/100', category: 'About Us' },
    { page: 'Agency Blog Page', url: '/blog', title: 'Latest News & Insights | Ashmita Enterprises', description: 'Stay updated with industry news, PVC curtain maintenance guides, and thermal barrier optimization tips.', score: '90/100', category: 'Blog' },
    { page: 'Contact Us', url: '/contact', title: 'Contact Ashmita Enterprises | PVC Strip Curtain Manufacturer', description: 'Get in touch with our team for bulk orders, custom specifications, and installation quotes.', score: '94/100', category: 'Other' }
  ];

  const categoriesList = [
    { name: "All Pages", count: metaTagsList.length, color: "#1e74db" },
    { name: "Home", count: metaTagsList.filter(m => m.category === 'Home').length, color: "#2563eb" },
    { name: "About Us", count: metaTagsList.filter(m => m.category === 'About Us').length, color: "#10b981" },
    { name: "Blog", count: metaTagsList.filter(m => m.category === 'Blog').length, color: "#f59e0b" },
    { name: "Product", count: metaTagsList.filter(m => m.category === 'Product').length, color: "#8b5cf6" },
    { name: "Other", count: metaTagsList.filter(m => m.category === 'Other').length, color: "#ec4899" }
  ];

  const columns = [
    { header: "", accessor: "checkbox", render: () => <input type="checkbox" className="cursor-pointer" />, style: { width: "40px" } },
    { header: "Page", accessor: "page", render: (row) => <span className="text-dark font-600 mini-text">{row.page}</span>, style: { minWidth: "120px" } },
    { header: "URL Route", accessor: "url", render: (row) => <span style={{ color: '#0284c7', fontFamily: 'monospace' }} className="mini-text">{row.url}</span>, style: { minWidth: "100px" } },
    { header: "Meta Title Tag", accessor: "title", render: (row) => <span className="text-dark mini-text font-400" style={{ display: 'block', whiteSpace: 'normal' }}>{row.title}</span>, style: { minWidth: "220px" } },
    { header: "Meta Description", accessor: "description", render: (row) => <span className="text-gray mini-text font-400" style={{ display: 'block', whiteSpace: 'normal' }}>{row.description}</span>, style: { minWidth: "350px" } },
    {
      header: "SEO Score",
      accessor: "score",
      style: { minWidth: "90px" },
      render: (row) => (
        <span className="score-pill" style={{ background: '#d1fae5', color: '#059669', fontWeight: '700', padding: '4px 8px', borderRadius: '5px', fontSize: '12px' }}>
          {row.score}
        </span>
      )
    }
  ];

  const filtered = metaTagsList.filter(m => {
    const matchesCategory = selectedCategory === 'All Pages' || m.category === selectedCategory;
    const matchesSearch = m.page.toLowerCase().includes(search.toLowerCase()) || 
                          m.url.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const paginatedData = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Structure
      sidebarTitle="Page Types"
      sidebarItems={categoriesList}
      selectedSidebarItem={selectedCategory}
      onSidebarItemClick={(name) => { setSelectedCategory(name); setCurrentPage(1); }}
      headerIcon={<Icon name="Layers" width="22" height="22" strokeWidth="2" />}
      headerTitle="SEO Metadata Builder"
      headerSub="Define custom title tags, descriptions, and view SEO health score ratings"
      showTabControls={false}
      quickAction={
        <div className="text-right">
          <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
          <p className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer">
            Generate Auto-Meta
            <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
          </p>
        </div>
      }
    >
      <div className="meta-wrapper w-full">
        <Table
          title="SEO Pages"
          headerSub={`${metaTagsList.length} pages indexed • average score 91.6%`}
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

export default Meta;
