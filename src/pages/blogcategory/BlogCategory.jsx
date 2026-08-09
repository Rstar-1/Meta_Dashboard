import { useState, useEffect } from "react";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import Fields from "../../components/common/Fields";
import { CrudModal, DeleteModal } from "../../components/common/Modal";
import {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory
} from "../../api/blogCategoryApi";

const BlogCategory = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: "Active"
  });

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBlogCategories();
      const rawData = res?.data || res;
      if (rawData && Array.isArray(rawData)) {
        // Filter out summary item { name: "All" } if without _id
        const list = rawData.filter((cat) => cat._id || (cat.name && cat.name.toLowerCase() !== "all"));
        setCategoriesList(list);
      } else {
        setCategoriesList([]);
      }
    } catch (err) {
      console.error("Could not load blog categories from API:", err);
      setError("Failed to load blog categories from server.");
      setCategoriesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddClick = () => {
    setModalMode("create");
    setCurrentCategory(null);
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      isActive: "Active"
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (category) => {
    setModalMode("edit");
    setCurrentCategory(category);
    setCategoryForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      isActive: category.isActive !== false ? "Active" : "Inactive"
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleFormSubmit = async (formData) => {
    const computedSlug = formData.slug
      ? generateSlug(formData.slug)
      : generateSlug(formData.name || "");

    const payload = {
      name: formData.name,
      slug: computedSlug,
      description: formData.description || "",
      isActive: formData.isActive === "Active" || formData.isActive === true
    };

    const getCategoryId = (c) => (typeof c?._id === "object" && c?._id?.$oid ? c._id.$oid : c?._id);
    const currentId = getCategoryId(currentCategory);

    try {
      if (modalMode === "create") {
        await createBlogCategory(payload);
        alert("Blog Category created successfully!");
      } else {
        await updateBlogCategory(currentId, payload);
        alert("Blog Category updated successfully!");
      }
      setIsAddModalOpen(false);
      loadCategories();
    } catch (err) {
      console.error("API action failed:", err);
      alert(err.response?.data?.message || err.message || "Operation failed.");
    }
  };

  const handleConfirmDelete = async () => {
    const getCategoryId = (c) => (typeof c?._id === "object" && c?._id?.$oid ? c._id.$oid : c?._id);
    const currentId = getCategoryId(currentCategory);

    try {
      await deleteBlogCategory(currentId);
      alert("Blog Category deleted successfully!");
      setIsDeleteModalOpen(false);
      loadCategories();
    } catch (err) {
      console.error("API delete failed:", err);
      alert(err.response?.data?.message || err.message || "Failed to delete category.");
      setIsDeleteModalOpen(false);
    }
  };

  // Filtered Categories
  const filteredCategories = categoriesList.filter((cat) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (cat.name || "").toLowerCase().includes(q) ||
      (cat.slug || "").toLowerCase().includes(q) ||
      (cat.description || "").toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === "All"
        ? true
        : filterStatus === "Active"
          ? cat.isActive !== false
          : cat.isActive === false;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: "No.",
      accessor: "number",
      style: { width: "60px" },
      render: (_, index) => (
        <p className="text-primary mini-text font-600">
          {String(index + 1).padStart(2, "0")}
        </p>
      )
    },
    {
      header: "Category Name",
      accessor: "name",
      style: { minWidth: "180px" },
      render: (row) => (
        <div className="flex items-center gap-10">
          <div
            className="flex items-center justify-center rounded-5 bg-light-primary text-primary"
            style={{ width: "32px", height: "32px", flexShrink: 0 }}
          >
            <Icon name="Layers" width="16" height="16" stroke="currentColor" />
          </div>
          <div>
            <p className="text-dark font-600 mini-text">{row.name}</p>
            <p className="text-gray mini-text" style={{ fontSize: "11px" }}>
              ID: {row._id ? (typeof row._id === "string" ? row._id.slice(-6) : "N/A") : "N/A"}
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Slug",
      accessor: "slug",
      style: { minWidth: "160px" },
      render: (row) => (
        <code
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            backgroundColor: "#f1f5f9",
            padding: "3px 8px",
            borderRadius: "4px",
            color: "#0284c7",
            border: "1px solid #e0f2fe"
          }}
        >
          {row.slug}
        </code>
      )
    },
    {
      header: "Description",
      accessor: "description",
      ui: "desc",
      style: { minWidth: "260px" }
    },
    {
      header: "Articles",
      accessor: "count",
      style: { minWidth: "90px" },
      render: (row) => (
        <span
          className="rounded-5 px-10 py-2 mini-text font-600"
          style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }}
        >
          {row.count ?? 0} Posts
        </span>
      )
    },
    {
      header: "Status",
      accessor: "isActive",
      ui: "status",
      style: { minWidth: "110px" }
    },
    {
      header: "Actions",
      accessor: "actions",
      style: { minWidth: "100px", textAlign: "right" },
      render: (row) => (
        <div className="flex items-center gap-10">
          <span className="cursor-pointer" onClick={() => handleEditClick(row)} title="Edit Category">
            <Icon name="Edit" width="16" height="16" stroke="var(--primary)" />
          </span>
          <span className="cursor-pointer" onClick={() => handleDeleteClick(row)} title="Delete Category">
            <Icon name="Trash" width="16" height="16" stroke="var(--danger)" />
          </span>
        </div>
      )
    }
  ];

  const getModalFields = () => [
    {
      name: "name",
      type: "text",
      label: "Category Name",
      placeholder: "e.g., Industrial Trends",
      defaultValue: categoryForm.name,
      validation: { required: true }
    },
    {
      name: "slug",
      type: "text",
      label: "Slug (Auto-generated if left blank)",
      placeholder: "e.g., industrial-trends",
      defaultValue: categoryForm.slug,
      validation: { required: false }
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Brief description of the blog category...",
      defaultValue: categoryForm.description,
      validation: { required: false }
    },
    {
      name: "isActive",
      type: "select",
      label: "Status",
      defaultValue: categoryForm.isActive,
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" }
      ],
      validation: { required: true }
    }
  ];

  const renderFilterInputs = () => (
    <div className="grid-cols-2 gap-12 w-full">
      <Fields
        label="SEARCH CATEGORIES"
        type="input"
        placeholder="Filter by name, slug, or description..."
        value={search}
        onChange={(val) => setSearch(val)}
      />
      <Fields
        label="STATUS"
        type="select"
        value={filterStatus}
        onChange={(val) => setFilterStatus(val)}
        options={[
          { label: "All Statuses", value: "All" },
          { label: "Active Only", value: "Active" },
          { label: "Inactive Only", value: "Inactive" }
        ]}
      />
    </div>
  );

  return (
    <Structure
      sidebarTitle="Blog Navigation"
      sidebarItems={[]}
      selectedSidebarItem="Blog Categories"
      headerIcon={<Icon name="Box" width="22" height="22" strokeWidth="2" />}
      headerTitle="Blog Category Management"
      headerSub="Organize blog posts into structured categories and manage status visibility"
      showTabControls={true}
      tabs={[
        {
          name: "All Categories",
          count: categoriesList.length,
          icon: <Icon name="Box" width="16" height="16" strokeWidth="2.5" />
        }
      ]}
      activeTab="All Categories"
      filterDescription={
        filterStatus !== "All" || search
          ? `Filter active — showing ${filteredCategories.length} of ${categoriesList.length} categories`
          : `Showing all ${categoriesList.length} blog categories.`
      }
      hasActiveFilters={filterStatus !== "All" || !!search}
      onClearAllFilters={() => {
        setSearch("");
        setFilterStatus("All");
      }}
      filterInputs={renderFilterInputs()}
      showSidebar={false}
      quickAction={
        <div className="text-right">
          <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
          <p
            className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer"
            onClick={handleAddClick}
          >
            Add New Category
            <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
          </p>
        </div>
      }
    >
      <div className="w-full">
        {error && (
          <div className="p-16 mb-16 rounded-5 bg-red-100 text-red-700">
            <p className="small-text font-500">{error}</p>
          </div>
        )}
        <Table
          title="Blog Categories"
          headerSub={`${filteredCategories.length} categories total`}
          columns={columns}
          data={filteredCategories}
          totalItems={filteredCategories.length}
          itemsPerPage={10}
          page={1}
          searchQuery={search}
          onSearchChange={(q) => setSearch(q)}
          showControls={true}
          loading={loading}
        />
      </div>

      <CrudModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={modalMode === "create" ? "Create New Blog Category" : "Edit Blog Category"}
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
        title="Delete Blog Category"
        message="Are you sure you want to delete this category? Articles assigned to this category will revert to General."
      />
    </Structure>
  );
};

export default BlogCategory;
