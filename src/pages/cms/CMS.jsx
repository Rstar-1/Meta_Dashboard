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
import { cmsTableColumns, cmsModalFields, cmsSidebarData } from '../../utils/apiData';

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

  const sidebarCategories = cmsSidebarData.items.map((item) => ({
    ...item,
    count: item.category === "all" ? sectionsList.length : sectionsList.filter((s) => s.category === item.category).length
  }));

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

  const columns = cmsTableColumns.map((col) => {
    if (col.accessor === "actions") {
      return {
        ...col,
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
      };
    }
    return col;
  });

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

  const getModalFields = () =>
    cmsModalFields.map((field) => ({
      ...field,
      defaultValue: sectionForm[field.name]
    }));

  return (
    <Structure
      sidebarTitle={cmsSidebarData.title}
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
