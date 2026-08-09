import { useState, useEffect, useCallback } from 'react';
import Structure from '../../components/layout/Structure';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';
import Fields from '../../components/common/Fields';
import { CrudModal, DeleteModal } from '../../components/common/Modal';
import {
  getCmsSections,
  createCmsSection,
  updateCmsSection,
  deleteCmsSection
} from '../../api/cmsApi';

const CMS = () => {
  const [sectionsList, setSectionsList] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All Sections');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentSection, setCurrentSection] = useState(null);
  const [sectionForm, setSectionForm] = useState({
    title: '',
    slug: '',
    category: 'Homepage',
    description: '',
    image: '',
    images: [],
    customFields: [],
    status: 'Published'
  });

  const loadSections = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterStatus !== 'All') params.status = filterStatus;
      if (selectedCategory !== 'All Sections') params.category = selectedCategory;

      const res = await getCmsSections(params);
      const data = res?.data || res;
      const list = data?.sections || (Array.isArray(data) ? data : null);

      if (list && Array.isArray(list)) {
        const formatted = list.map((item) => {
          const d = item.updatedAt || item.createdAt;
          const dateObj = d ? new Date(d) : null;
          const updatedDate = dateObj && !isNaN(dateObj.getTime())
            ? `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`
            : (item.updatedDate || new Date().toLocaleDateString('en-US'));

          return {
            ...item,
            id: item.customId || item._id || item.id,
            updatedDate
          };
        });
        setSectionsList(formatted);
      }
    } catch (err) {
      console.warn('Backend CMS service unavailable, using current sections list:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, selectedCategory]);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  const sidebarCategories = [
    { name: 'All Sections', count: sectionsList.length, color: '#2563eb' },
    { name: 'Homepage', count: sectionsList.filter((s) => s.category === 'Homepage').length, color: '#3b82f6' },
    { name: 'Company', count: sectionsList.filter((s) => s.category === 'Company').length, color: '#10b981' },
    { name: 'Portfolio', count: sectionsList.filter((s) => s.category === 'Portfolio').length, color: '#8b5cf6' },
    { name: 'Support', count: sectionsList.filter((s) => s.category === 'Support').length, color: '#f59e0b' },
    { name: 'Navigation', count: sectionsList.filter((s) => s.category === 'Navigation').length, color: '#ec4899' }
  ];

  const handleAddClick = () => {
    setModalMode('create');
    setCurrentSection(null);
    setSectionForm({
      title: '',
      slug: '',
      category: 'Homepage',
      description: '',
      image: '',
      images: [],
      customFields: [{ key: 'CTA Text', value: 'Learn More' }],
      status: 'Published'
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (section) => {
    setModalMode('edit');
    setCurrentSection(section);
    setSectionForm({
      title: section.title || '',
      slug: section.slug || '',
      category: section.category || 'Homepage',
      description: section.description || '',
      image: section.image || '',
      images: section.images || (section.image ? [section.image] : []),
      customFields: section.customFields || [
        { key: 'Hero Badge', value: 'New Release 2026' },
        { key: 'Primary CTA Text', value: 'Explore Products' }
      ],
      status: section.status || 'Published'
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (section) => {
    setCurrentSection(section);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (currentSection) {
      const secId = currentSection.customId || currentSection._id || currentSection.id;
      try {
        await deleteCmsSection(secId);
        await loadSections();
      } catch (err) {
        console.error('Failed to delete CMS section via API, removing locally:', err);
        setSectionsList((prev) => prev.filter((s) => (s.customId || s._id || s.id) !== secId));
      }
      setIsDeleteModalOpen(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    const computedSlug = formData.slug || formData.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

    const extractImageStr = (img) => {
      if (!img) return '';
      if (typeof img === 'string') return img;
      if (Array.isArray(img)) {
        for (const item of img) {
          const res = extractImageStr(item);
          if (res) return res;
        }
        return '';
      }
      if (typeof img === 'object') {
        return img.url || img.path || img.preview || img.src || '';
      }
      return '';
    };

    const extractImagesArr = (imgs) => {
      if (!imgs) return [];
      if (!Array.isArray(imgs)) {
        const single = extractImageStr(imgs);
        return single ? [single] : [];
      }
      return imgs.map(extractImageStr).filter(Boolean);
    };

    const mainImage = extractImageStr(formData.image) || extractImageStr(formData.images && formData.images[0]);
    const galleryImages = extractImagesArr(formData.images);

    const payload = {
      title: formData.title,
      slug: computedSlug,
      category: formData.category || 'Homepage',
      description: formData.description || '',
      image: mainImage,
      images: galleryImages.length ? galleryImages : (mainImage ? [mainImage] : []),
      customFields: formData.customFields || [],
      status: formData.status || 'Published'
    };

    try {
      if (modalMode === 'create') {
        await createCmsSection(payload);
      } else if (currentSection) {
        const secId = currentSection.customId || currentSection._id || currentSection.id;
        await updateCmsSection(secId, payload);
      }
      await loadSections();
    } catch (err) {
      console.warn('API update failed, updating local state:', err);
      if (modalMode === 'create') {
        const newSec = {
          id: `CMS-${Date.now()}`,
          customId: `CMS-${Date.now()}`,
          ...payload,
          updatedDate: dateStr,
          updatedTime: timeStr
        };
        setSectionsList((prev) => [newSec, ...prev]);
      } else if (currentSection) {
        const secId = currentSection.customId || currentSection._id || currentSection.id;
        setSectionsList((prev) =>
          prev.map((s) =>
            (s.customId || s._id || s.id) === secId
              ? {
                ...s,
                ...payload,
                updatedDate: dateStr,
                updatedTime: timeStr
              }
              : s
          )
        );
      }
    }
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Section / Page',
      accessor: 'title',
      ui: 'profile',
      subKey: 'description',
      imageKey: 'image',
      style: { minWidth: '180px' }
    },
    {
      header: 'Key / Slug',
      accessor: 'slug',
      style: { minWidth: '140px' },
      render: (row) => (
        <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '13px' }}>
          {row.slug}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      style: { minWidth: '110px' },
      render: (row) => {
        const isPublished = row.status === 'Published';
        return (
          <span
            style={{
              background: isPublished ? '#e8f2fe' : '#f1f5f9',
              color: isPublished ? '#2563eb' : '#64748b',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              display: 'inline-block'
            }}
          >
            {row.status}
          </span>
        );
      }
    },
    {
      header: 'Updated',
      accessor: 'updatedDate',
      style: { minWidth: '120px' },
      render: (row) => (
        <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '400' }}>
          {row.updatedDate}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      style: { minWidth: '100px', textAlign: 'right' },
      render: (row) => (
        <div className="flex items-center justify-end gap-8">
          <button
            type="button"
            onClick={() => handleEditClick(row)}
            style={{
              border: '1px solid #bfdbfe',
              background: '#f0f9ff',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Edit Section"
          >
            <Icon name="Edit" width="14" height="14" stroke="#2563eb" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteClick(row)}
            style={{
              border: '1px solid #fecaca',
              background: '#fef2f2',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Delete Section"
          >
            <Icon name="Trash" width="14" height="14" stroke="#ef4444" />
          </button>
        </div>
      )
    }
  ];

  const filteredSections = sectionsList.filter((s) => {
    const matchesCategory = selectedCategory === 'All Sections' || s.category === selectedCategory;
    const matchesSearch =
      (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.slug || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.customId || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const paginatedData = filteredSections.slice((currentPage - 1) * 10, currentPage * 10);
  const publishedCount = sectionsList.filter((s) => s.status === 'Published').length;
  const draftCount = sectionsList.filter((s) => s.status === 'Draft').length;

  const renderFilterInputs = () => (
    <div className="flex items-center gap-12 w-full">
      <Fields
        label="SEARCH SECTIONS"
        type="input"
        placeholder="Filter by section title, slug, or custom ID..."
        value={search}
        onChange={(val) => setSearch(val)}
      />
      <Fields
        label="STATUS"
        type="select"
        value={filterStatus}
        onChange={(val) => setFilterStatus(val)}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Published Only', value: 'Published' },
          { label: 'Drafts Only', value: 'Draft' }
        ]}
      />
    </div>
  );

  const getModalFields = () => [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      placeholder: 'e.g., Home Hero Section',
      defaultValue: sectionForm.title,
      validation: { required: true }
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Key / Slug',
      placeholder: 'e.g., home-hero (leave blank to auto-generate)',
      defaultValue: sectionForm.slug,
      validation: { required: false }
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category Group',
      defaultValue: sectionForm.category,
      options: [
        { label: 'Homepage', value: 'Homepage' },
        { label: 'Company', value: 'Company' },
        { label: 'Portfolio', value: 'Portfolio' },
        { label: 'Support', value: 'Support' },
        { label: 'Navigation', value: 'Navigation' }
      ],
      validation: { required: true }
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description / Subtitle',
      placeholder: 'Brief summary of what this section contains...',
      defaultValue: sectionForm.description,
      validation: { required: false }
    },
    {
      name: 'image',
      type: 'dragfile',
      label: 'Section Preview Image URL',
      placeholder: 'https://images.unsplash.com/...',
      defaultValue: sectionForm.image,
      validation: { required: false }
    },
    {
      name: 'status',
      type: 'select',
      label: 'Publication Status',
      defaultValue: sectionForm.status,
      options: [
        { label: 'Published', value: 'Published' },
        { label: 'Draft', value: 'Draft' }
      ],
      validation: { required: true }
    }
  ];

  return (
    <Structure
      sidebarTitle="Section Groups"
      sidebarItems={sidebarCategories}
      selectedSidebarItem={selectedCategory}
      onSidebarItemClick={(name) => {
        setSelectedCategory(name);
        setCurrentPage(1);
      }}
      headerIcon={<Icon name="CMS" width="22" height="22" strokeWidth="2" />}
      headerTitle="CMS Dashboard"
      headerSub={`${sectionsList.length} sections total • ${publishedCount} published • ${draftCount} drafts`}
      showTabControls={true}
      tabs={[
        {
          name: 'Sections / Pages',
          count: filteredSections.length,
          icon: <Icon name="CMS" width="16" height="16" strokeWidth="2.5" />
        }
      ]}
      activeTab="Sections / Pages"
      filterDescription={
        selectedCategory !== 'All Sections' || filterStatus !== 'All' || search
          ? `Filter active — showing ${filteredSections.length} of ${sectionsList.length} page sections`
          : `Showing all page sections.`
      }
      hasActiveFilters={selectedCategory !== 'All Sections' || filterStatus !== 'All' || !!search}
      onClearAllFilters={() => {
        setSelectedCategory('All Sections');
        setSearch('');
        setFilterStatus('All');
      }}
      filterInputs={renderFilterInputs()}
      quickAction={
        <div className="text-right">
          <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
          <p
            className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer"
            onClick={handleAddClick}
          >
            Create New Section
            <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
          </p>
        </div>
      }
    >
      <div className="cms-wrapper w-full">
        <Table
          title="Sections / Pages"
          headerSub={`Showing ${paginatedData.length} of ${filteredSections.length} items`}
          columns={columns}
          data={paginatedData}
          totalItems={filteredSections.length}
          itemsPerPage={10}
          page={currentPage}
          onPageChange={(p) => setCurrentPage(p)}
          showControls={true}
          isLoading={loading}
        />
      </div>

      <CrudModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={modalMode === 'create' ? 'Create New Page Section' : 'Edit Section Details'}
        size="sm"
        type="sidebar"
        placement="right"
        fields={getModalFields()}
        onSubmit={handleFormSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        title="Delete Page Section"
        message={`Are you sure you want to delete "${currentSection?.title || ''}"? This action cannot be undone.`}
      />
    </Structure>
  );
};

export default CMS;
