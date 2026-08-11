import { useState, useEffect } from "react";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import Image from "../../components/common/Image";
import Button from "../../components/common/Button";
import { CrudModal, DeleteModal } from "../../components/common/Modal";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api/categoryApi";
import { categoriesTableColumns, categoriesModalFields, categoriesSidebarData } from "../../utils/apiData";



const Categories = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    number: "",
    slug: "",
    icon: "",
    iconName: "",
    bgColor: "",
    accentColor: "",
    description: ""
  });

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategories();
      const data = res?.data || res;
      if (data && Array.isArray(data)) {
        setCategoriesList(data);
      } else {
        setCategoriesList([]);
      }
    } catch (err) {
      console.warn("Could not load categories:", err);
      setCategoriesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, []);

  const handleAddClick = () => {
    setModalMode("create");
    setCurrentCategory(null);
    setCategoryForm({
      name: "",
      number: "",
      slug: "",
      icon: [],
      iconName: "",
      bgColor: "#eff6ff",
      accentColor: "#1e74db",
      description: ""
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (category) => {
    setModalMode("edit");
    setCurrentCategory(category);
    setCategoryForm({
      name: category.name || "",
      number: category.number || "",
      slug: category.slug || "",
      icon: category.icon ? [{ name: category.icon }] : [],
      iconName: category.iconName || "",
      bgColor: category.bgColor || "",
      accentColor: category.accentColor || "",
      description: category.description || ""
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    let iconValue = "";
    let fileToUpload = null;

    if (Array.isArray(formData.icon) && formData.icon.length > 0) {
      const firstIcon = formData.icon[0];
      if (firstIcon instanceof File) {
        fileToUpload = firstIcon;
        iconValue = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(firstIcon);
        });
      } else if (firstIcon && typeof firstIcon.name === "string") {
        iconValue = firstIcon.name;
      }
    } else if (typeof formData.icon === "string") {
      iconValue = formData.icon;
    }

    const payload = {
      name: formData.name,
      number: formData.number,
      slug: formData.slug || undefined,
      icon: iconValue,
      iconName: formData.iconName,
      bgColor: formData.bgColor,
      accentColor: formData.accentColor,
      description: formData.description,
      isActive: true
    };

    const apiData = new FormData();
    apiData.append("name", payload.name);
    if (payload.number) apiData.append("number", payload.number);
    if (payload.slug) apiData.append("slug", payload.slug);
    if (payload.iconName) apiData.append("iconName", payload.iconName);
    if (payload.bgColor) apiData.append("bgColor", payload.bgColor);
    if (payload.accentColor) apiData.append("accentColor", payload.accentColor);
    if (payload.description) apiData.append("description", payload.description);

    if (fileToUpload) {
      apiData.append("icon", fileToUpload);
    } else if (iconValue) {
      apiData.append("icon", iconValue);
    }

    const getCategoryId = (c) => typeof c?._id === "object" && c?._id?.$oid ? c._id.$oid : c?._id;
    const currentId = getCategoryId(currentCategory);

    try {
      if (modalMode === "create") {
        const res = await createCategory(apiData);
        alert("Category created successfully!");
        const createdCat = res?.data || res || { ...payload, _id: `cat-mock-${Date.now()}` };
        setCategoriesList((prev) => [...prev, createdCat]);
      } else {
        const res = await updateCategory(currentId, apiData);
        alert("Category updated successfully!");
        const updatedCat = res?.data || res || { ...payload, _id: currentId };
        setCategoriesList((prev) =>
          prev.map((cat) => (getCategoryId(cat) === currentId ? updatedCat : cat))
        );
      }
      setIsAddModalOpen(false);
    } catch (err) {
      console.warn("Simulating action on state due to API error:", err);
      if (modalMode === "create") {
        const newMockCategory = {
          _id: `cat-mock-${Date.now()}`,
          ...payload,
          isActive: true
        };
        setCategoriesList((prev) => [...prev, newMockCategory]);
      } else {
        setCategoriesList((prev) =>
          prev.map((cat) => (getCategoryId(cat) === currentId ? { ...cat, ...payload, isActive: true } : cat))
        );
      }
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    const getCategoryId = (c) => typeof c?._id === "object" && c?._id?.$oid ? c._id.$oid : c?._id;
    const currentId = getCategoryId(currentCategory);

    try {
      await deleteCategory(currentId);
      alert("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      loadCategories();
    } catch (err) {
      console.warn("Simulating delete on state due to API error:", err);
      setCategoriesList((prev) => prev.filter((cat) => getCategoryId(cat) !== currentId));
      setIsDeleteModalOpen(false);
    }
  };

  const columns = categoriesTableColumns.map((col) => {
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

  const [selectedStatus, setSelectedStatus] = useState("All Categories");

  const sidebarItems = categoriesSidebarData.items.map((item) => ({
    ...item,
    count: item.status === "all" ? categoriesList.length : categoriesList.filter((c) => (item.status === "Active" ? c.status !== false : c.status === false)).length
  }));

  const filteredCategories = categoriesList.filter((cat) => {
    const isActive = cat.status !== false;
    const matchesStatus = selectedStatus === "All Categories" || (selectedStatus === "Active" ? isActive : !isActive);
    const matchesSearch = (cat.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (cat.slug || "").toLowerCase().includes(search.toLowerCase()) ||
      (cat.description || "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const ITEMS_PER_PAGE = 10;
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getModalFields = () =>
    categoriesModalFields.map((field) => ({
      ...field,
      defaultValue: categoryForm[field.name]
    }));

  return (
    <Structure
      sidebarTitle={categoriesSidebarData.title}
      sidebarItems={sidebarItems}
      selectedSidebarItem={selectedStatus}
      onSidebarItemClick={(name) => setSelectedStatus(name)}
      headerIcon={<Icon name="Layers" width="22" height="22" strokeWidth="2" />}
      headerTitle="Category Management"
      headerSub="Administer store product categories, theme styles, and badges"
      showTabControls={false}
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
      <div className="categories-wrapper w-full">
        {error && (
          <div className="p-16 mb-16 rounded-5 bg-red-100 text-red-700">
            <p className="small-text font-500">{error}</p>
          </div>
        )}
        <Table
          title="Categories"
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
        title={modalMode === "create" ? "Create New Category" : "Edit Category Details"}
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
        title="Delete Category"
        message="Are you sure you want to delete this category? Products mapped to this category may need re-assignment."
      />
    </Structure>
  );
};

export default Categories;
