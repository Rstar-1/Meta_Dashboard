import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import Fields from "../../components/common/Fields";
import Button from "../../components/common/Button";
import { CrudModal, DeleteModal } from "../../components/common/Modal";
import {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory
} from "../../api/blogCategoryApi";
import { getUsers } from "../../api/userApi";
import { blogCategoryTableColumns, blogCategoryModalFields, blogCategorySidebarData, formatCreatedBy } from "../../utils/apiData";

const BlogCategory = () => {
  const loggedInUser = useSelector((state) => state.auth?.user);
  const [categoriesList, setCategoriesList] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

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
  const filteredCategories = categoriesList
    .map((cat) => ({
      ...cat,
      ...formatCreatedBy(cat.createdBy, usersMap, loggedInUser)
    }))
    .filter((cat) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (cat.name || "").toLowerCase().includes(q) ||
        (cat.slug || "").toLowerCase().includes(q) ||
        (cat.description || "").toLowerCase().includes(q) ||
        (cat.createdByProfile || "").toLowerCase().includes(q);

      const matchesStatus =
        filterStatus === "All"
          ? true
          : filterStatus === "Active"
            ? cat.isActive !== false
            : cat.isActive === false;

      return matchesSearch && matchesStatus;
    });

  const ITEMS_PER_PAGE = 10;
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const columns = blogCategoryTableColumns.map((col) => {
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
              onClick={() => handleEditClick(row)}
              title="Edit Category"
            />
            <Button
              type="button"
              version="icon"
              icon="Trash"
              bg="light-danger"
              color="danger"
              onClick={() => handleDeleteClick(row)}
              title="Delete Category"
            />
          </div>
        )
      };
    }
    return col;
  });

  const getModalFields = () =>
    blogCategoryModalFields.map((field) => ({
      ...field,
      defaultValue: categoryForm[field.name]
    }));

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

  const sidebarItems = blogCategorySidebarData.items.map((item) => ({
    ...item,
    count: item.status === "all" ? categoriesList.length : categoriesList.filter((c) => (item.status === "Active" ? c.status !== false : c.status === false)).length
  }));

  return (
    <Structure
      sidebarTitle={blogCategorySidebarData.title}
      sidebarItems={sidebarItems}
      selectedSidebarItem={filterStatus === "All" ? "All Categories" : filterStatus}
      onSidebarItemClick={(name) => {
        if (name === "All Categories") setFilterStatus("All");
        else setFilterStatus(name);
      }}
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
          data={paginatedCategories}
          totalItems={filteredCategories.length}
          itemsPerPage={ITEMS_PER_PAGE}
          page={currentPage}
          onPageChange={(p) => setCurrentPage(p)}
          searchQuery={search}
          onSearchChange={(q) => { setSearch(q); setCurrentPage(1); }}
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
