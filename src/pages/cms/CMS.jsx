import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
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
import { getUsers } from '../../api/userApi';
import { cmsTableColumns, cmsModalFields, cmsSidebarData, formatCreatedBy } from '../../utils/apiData';

const CMS = () => {
  const loggedInUser = useSelector((state) => state.auth?.user);
  const [sectionsList, setSectionsList] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All Sections');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch users for createdBy profile details mapping
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
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

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

  const filteredSections = sectionsList
    .map((s) => ({
      ...s,
      ...formatCreatedBy(s.createdBy, usersMap, loggedInUser)
    }))
    .filter((sec) => {
      const matchesCat = selectedCategory === 'All Sections' || sec.category === selectedCategory;
      const matchesSearch = (sec.title || sec.sectionName || '').toLowerCase().includes(search.toLowerCase()) ||
        (sec.page || '').toLowerCase().includes(search.toLowerCase()) ||
        (sec.customId || sec.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (sec.createdByProfile?.name || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'All' || sec.status === filterStatus;
      return matchesCat && matchesSearch && matchesStatus;
    });

  const publishedCount = sectionsList.filter((s) => s.status === 'Published').length;
  const draftCount = sectionsList.filter((s) => s.status === 'Draft').length;

  const paginatedData = filteredSections.slice((currentPage - 1) * 10, currentPage * 10);

  const renderFilterInputs = () => (
    <div className="flex items-center gap-12 w-full">
      <Fields
        label="SEARCH SECTIONS"
        type="input"
        placeholder="Filter by section title, page, custom ID, or creator..."
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
          columns={cmsTableColumns}
          data={paginatedData}
          totalItems={filteredSections.length}
          itemsPerPage={10}
          page={currentPage}
          onPageChange={(p) => setCurrentPage(p)}
          showControls={true}
          isLoading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
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
        title="Delete Page Section"
        message={`Are you sure you want to delete "${currentSection?.title || ''}"? This action cannot be undone.`}
      />
    </Structure>
  );
};

export default CMS;
