import { useState, useEffect } from 'react';
import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';
import { CrudModal, DeleteModal } from '../../components/common/Modal';
import FormBuilder from '../../components/common/FormBuilder';
import Tab from '../../components/common/Tab';
import {
  getSEORecords,
  createSEORecord,
  updateSEORecord,
  deleteSEORecord
} from '../../api/seoApi';

const Meta = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All Pages');
  const [seoRecords, setSeoRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [activeFormTab, setActiveFormTab] = useState('general'); // 'general' | 'meta' | 'ogTwitter' | 'schema'

  const initialFormState = {
    pageName: '',
    route: '',
    priority: 0,
    status: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    meta_author: '',
    meta_canonical: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    schema_type: 'WebPage',
    schema_name: '',
    schema_url: '',
    schema_logo: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const res = await getSEORecords();
      setSeoRecords(res.data || res || []);
    } catch (err) {
      console.error("Failed to load SEO records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const getCategory = (record) => {
    const r = record.route || '';
    if (r === '/') return 'Home';
    if (r.startsWith('/about')) return 'About Us';
    if (r.startsWith('/blog')) return 'Blog';
    if (r.startsWith('/products') || r.startsWith('/product')) return 'Product';
    return 'Other';
  };

  const categoriesList = [
    { name: "All Pages", count: seoRecords.length, color: "#1e74db" },
    { name: "Home", count: seoRecords.filter(m => getCategory(m) === 'Home').length, color: "#2563eb" },
    { name: "About Us", count: seoRecords.filter(m => getCategory(m) === 'About Us').length, color: "#10b981" },
    { name: "Blog", count: seoRecords.filter(m => getCategory(m) === 'Blog').length, color: "#f59e0b" },
    { name: "Product", count: seoRecords.filter(m => getCategory(m) === 'Product').length, color: "#8b5cf6" },
    { name: "Other", count: seoRecords.filter(m => getCategory(m) === 'Other').length, color: "#ec4899" }
  ];

  const handleAddClick = () => {
    setCurrentRecord(null);
    setModalMode('create');
    setActiveFormTab('general');
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setModalMode('edit');
    setActiveFormTab('general');
    setFormData({
      pageName: record.pageName || '',
      route: record.route || '',
      priority: record.priority || 0,
      status: record.status !== false,
      meta_title: record.meta?.title || '',
      meta_description: record.meta?.description || '',
      meta_keywords: Array.isArray(record.meta?.keywords) ? record.meta.keywords : [],
      meta_author: record.meta?.author || '',
      meta_canonical: record.meta?.canonical || '',
      og_title: record.openGraph?.title || '',
      og_description: record.openGraph?.description || '',
      og_image_url: record.openGraph?.image?.url || '',
      twitter_title: record.twitter?.title || '',
      twitter_description: record.twitter?.description || '',
      twitter_image: record.twitter?.image || '',
      schema_type: record.schema?.type || 'WebPage',
      schema_name: record.schema?.name || '',
      schema_url: record.schema?.url || '',
      schema_logo: record.schema?.logo || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (record) => {
    setCurrentRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSEORecord(currentRecord._id);
      alert("SEO page record deleted successfully!");
      setIsDeleteModalOpen(false);
      loadRecords();
    } catch (err) {
      alert("Delete failed: " + (err.message || err));
    }
  };

  const getFieldsForTab = () => {
    switch (activeFormTab) {
      case 'general':
        return [
          { name: "pageName", label: "Page Name", type: "text", validation: { required: true }, placeholder: "e.g. Products Catalog" },
          { name: "route", label: "URL Route", type: "text", validation: { required: true }, placeholder: "e.g. /products" },
          { name: "priority", label: "Priority", type: "number", placeholder: "e.g. 1" },
          { name: "status", label: "Active Index", type: "switch" }
        ];
      case 'meta':
        return [
          { name: "meta_title", label: "Meta Title Tag", type: "text", placeholder: "Enter SEO title tag" },
          { name: "meta_description", label: "Meta Description", type: "textarea", placeholder: "Enter search snippet description" },
          { name: "meta_keywords", label: "Keywords", type: "bulk-badge", addText: "Keyword", padding: 0 },
          { name: "meta_author", label: "Author", type: "text", placeholder: "e.g. Company Name" },
          { name: "meta_canonical", label: "Canonical URL", type: "text", placeholder: "https://example.com" }
        ];
      case 'ogTwitter':
        return [
          { name: "og_title", label: "OG Title (Facebook)", type: "text", placeholder: "OG Title" },
          { name: "og_description", label: "OG Description (Facebook)", type: "textarea", placeholder: "OG Description" },
          { name: "og_image_url", label: "OG Image URL (Facebook)", type: "text", placeholder: "https://example.com/og.webp" },
          { name: "twitter_title", label: "Twitter Title", type: "text", placeholder: "Twitter Title" },
          { name: "twitter_description", label: "Twitter Description", type: "textarea", placeholder: "Twitter Description" },
          { name: "twitter_image", label: "Twitter Image URL", type: "text", placeholder: "https://example.com/twitter.webp" }
        ];
      case 'schema':
        return [
          {
            name: "schema_type",
            label: "Schema Type",
            type: "select",
            options: [
              { label: "WebPage", value: "WebPage" },
              { label: "Organization", value: "Organization" },
              { label: "CollectionPage", value: "CollectionPage" },
              { label: "AboutPage", value: "AboutPage" },
              { label: "Blog", value: "Blog" },
              { label: "ContactPage", value: "ContactPage" }
            ]
          },
          { name: "schema_name", label: "Schema Name", type: "text", placeholder: "e.g. Ashmita Enterprises" },
          { name: "schema_url", label: "Schema URL", type: "text", placeholder: "e.g. https://example.com" },
          { name: "schema_logo", label: "Schema Logo URL", type: "text", placeholder: "e.g. https://example.com/logo.png" }
        ];
      default:
        return [];
    }
  };

  const handleSubmit = async (formValues) => {
    const data = formValues && typeof formValues === 'object' && !formValues.preventDefault ? formValues : formData;
    const payload = {
      _id: modalMode === 'create'
        ? `seo_${data.pageName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
        : currentRecord._id,
      pageName: data.pageName,
      route: data.route,
      priority: Number(data.priority) || 0,
      status: data.status !== false,
      meta: {
        title: data.meta_title,
        description: data.meta_description,
        keywords: Array.isArray(data.meta_keywords) ? data.meta_keywords : [],
        author: data.meta_author,
        canonical: data.meta_canonical
      },
      openGraph: {
        title: data.og_title,
        description: data.og_description,
        image: {
          url: data.og_image_url
        }
      },
      twitter: {
        title: data.twitter_title,
        description: data.twitter_description,
        image: data.twitter_image
      },
      schema: {
        type: data.schema_type,
        name: data.schema_name,
        url: data.schema_url,
        logo: data.schema_logo
      }
    };

    try {
      if (modalMode === 'create') {
        await createSEORecord(payload);
        alert("SEO page record created successfully!");
      } else {
        await updateSEORecord(currentRecord._id, payload);
        alert("SEO page record updated successfully!");
      }
      setIsAddModalOpen(false);
      loadRecords();
    } catch (err) {
      alert("Action failed: " + (err.message || err));
    }
  };

  const columns = [
    { header: "Page", accessor: "pageName", render: (row) => <span className="text-dark font-600 mini-text">{row.pageName}</span>, style: { minWidth: "120px" } },
    { header: "URL Route", accessor: "route", render: (row) => <span style={{ color: '#0284c7', fontFamily: 'monospace' }} className="mini-text">{row.route}</span>, style: { minWidth: "100px" } },
    { header: "Meta Title Tag", accessor: "title", render: (row) => <span className="text-dark mini-text font-400" style={{ display: 'block', whiteSpace: 'normal' }}>{row.meta?.title || '-'}</span>, style: { minWidth: "220px" } },
    { header: "Meta Description", accessor: "description", render: (row) => <span className="text-gray mini-text font-400" style={{ display: 'block', whiteSpace: 'normal' }}>{row.meta?.description || '-'}</span>, style: { minWidth: "350px" } },
    {
      header: "SEO Score",
      accessor: "score",
      style: { minWidth: "90px" },
      render: (row) => {
        const score = row.analytics?.seoScore || 0;
        const color = score >= 90 ? { bg: '#d1fae5', text: '#059669' } : score >= 80 ? { bg: '#fef3c7', text: '#d97706' } : { bg: '#fee2e2', text: '#dc2626' };
        return (
          <span className="score-pill" style={{ background: color.bg, color: color.text, fontWeight: '700', padding: '4px 8px', borderRadius: '5px', fontSize: '12px' }}>
            {score}/100
          </span>
        );
      }
    },
    {
      header: "Actions",
      accessor: "actions",
      style: { minWidth: "100px" },
      render: (row) => (
        <div className="flex items-center gap-10">
          <span className="cursor-pointer" onClick={() => handleEditClick(row)}>
            <Icon name="Edit" width="16" height="16" stroke="var(--primary)" />
          </span>
          <span className="cursor-pointer" onClick={() => handleDeleteClick(row)}>
            <Icon name="Trash" width="16" height="16" stroke="var(--danger)" />
          </span>
        </div>
      )
    }
  ];

  const filtered = seoRecords.filter(m => {
    const matchesCategory = selectedCategory === 'All Pages' || getCategory(m) === selectedCategory;
    const matchesSearch = m.pageName.toLowerCase().includes(search.toLowerCase()) ||
      m.route.toLowerCase().includes(search.toLowerCase());
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
          <p className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer" onClick={handleAddClick}>
            Add SEO Page
            <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
          </p>
        </div>
      }
    >
      <div className="meta-wrapper w-full">

        <Table
          title="SEO Pages"
          headerSub={`${seoRecords.length} pages indexed • average score ${seoRecords.length ? (seoRecords.reduce((acc, curr) => acc + (curr.analytics?.seoScore || 0), 0) / seoRecords.length).toFixed(1) : 0}%`}
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
        />
      </div>

      {/* Crud Modal */}
      <CrudModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={modalMode === 'create' ? "Add SEO Page Record" : "Edit SEO Page Record"}
        size="sm"
        type="sidebar"
        placement="right"
      >
        <div className="">
          {/* Tab Selector */}
          {modalMode === 'edit' && (
            <div className="mb-12">
              <Tab
                tabs={[
                  { label: 'General', value: 'general' },
                  { label: 'Meta Tags', value: 'meta' },
                  { label: 'OG & Twitter', value: 'ogTwitter' },
                  { label: 'Schema Data', value: 'schema' }
                ]}
                activeTab={activeFormTab}
                onChange={setActiveFormTab}
                padding={0}
              />
            </div>
          )}

          <FormBuilder
            fields={getFieldsForTab()}
            value={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            col='1'
            buttonClassName="display-none"
          >
            <div className="flex justify-end gap-12 mt-16">
              <Button
                variant="outline"
                type="button"
                text='Cancel'
                version='v2'
                onClick={() => setIsAddModalOpen(false)}
              />
              <Button
                variant="primary"
                type="submit"
                text={modalMode === 'create' ? 'Create Page' : 'Save Changes'}
                version='v2'
              />
            </div>
          </FormBuilder>
        </div>
      </CrudModal>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        title="Delete SEO Page"
        message={`Are you sure you want to delete the SEO page configuration for "${currentRecord?.pageName || ''}"? This action cannot be undone.`}
      />
    </Structure>
  );
};

export default Meta;
