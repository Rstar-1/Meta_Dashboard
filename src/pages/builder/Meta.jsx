import { useState } from 'react';
import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';

const Meta = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const metaTagsList = [
    { page: 'Home Page', url: '/', title: 'Industrial PVC Strip Curtains & Hanger Systems | Ashmita Enterprises', description: 'Leading manufacturer and supplier of clear polar grade PVC strip curtains, anti-insect yellow PVC rolls, and stainless steel hardware bracket systems in India.', score: '95/100' },
    { page: 'Product Catalog', url: '/products', title: 'Clear PVC Strip Curtains & Welding Sheets | Products', description: 'Browse our full catalog of industrial PVC rolls, sliding strip curtains, anti-static plastic sheets, and installation hanging bracket accessories.', score: '88/100' },
    { page: 'About Us', url: '/about-us', title: 'PVC Strip Curtain Manufacturer in India | About Us', description: 'Ashmita Enterprises offers high-performance warehouse partitions, thermal insulation barriers, and cleanroom PVC curtains. Learn about our quality standards.', score: '92/100' }
  ];

  const columns = [
    { header: "", accessor: "checkbox", render: () => <input type="checkbox" className="cursor-pointer" />, style: { width: "40px" } },
    { header: "Page", accessor: "page", render: (row) => <span style={{ fontWeight: '600' }}>{row.page}</span> },
    { header: "URL Route", accessor: "url", render: (row) => <span style={{ color: '#0284c7', fontFamily: 'monospace' }}>{row.url}</span> },
    { header: "Meta Title Tag", accessor: "title", render: (row) => <span style={{ fontSize: '13px' }}>{row.title}</span> },
    { header: "Meta Description", accessor: "description", render: (row) => <span style={{ fontSize: '12px', color: '#64748b', maxWidth: '300px', display: 'block', lineBreak: 'anywhere' }}>{row.description}</span> },
    {
      header: "SEO Score",
      accessor: "score",
      render: (row) => (
        <span className="score-pill" style={{ background: '#d1fae5', color: '#059669', fontWeight: '700', padding: '4px 8px', borderRadius: '5px', fontSize: '12px' }}>
          {row.score}
        </span>
      )
    }
  ];

  const filtered = metaTagsList.filter(m => 
    m.page.toLowerCase().includes(search.toLowerCase()) || 
    m.url.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Structure
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
