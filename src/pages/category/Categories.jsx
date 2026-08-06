import { useState, useEffect } from "react";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import Image from "../../components/common/Image";
import { CrudModal, DeleteModal } from "../../components/common/Modal";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api/categoryApi";



const Categories = () => {
  const [search, setSearch] = useState("");
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

  const columns = [
    {
      header: "No.",
      style: { width: "60px" },
      render: (row) => (
        <p className="text-primary mini-text">
          {row.number || "00"}
        </p>
      )
    },
    {
      header: "Category",
      style: { minWidth: "200px" },
      render: (row) => {
        return (
          <div className="flex items-center gap-12">
            {row.icon ? (
              <Image
                src={row.icon}
                alt={row.name}
                className="common-img rounded-5 object-cover border-tertiary"
                style={{ width: "32px", height: "32px", flexShrink: 0 }}
              />
            ) : (
              <div
                style={{
                  background: row.bgColor || "var(--forth)",
                  width: "32px",
                  height: "32px",
                  borderRadius: "5px",
                  flexShrink: 0
                }}
                className="center-div"
              >
                <Icon name={row.iconName || "Grid"} width="14" height="14" stroke={row.accentColor || "var(--gray)"} />
              </div>
            )}
            <div className="flex items-center gap-8">
              <span className="text-dark font-500 mini-text">{row.name}</span>
              {row.iconName && (
                <span className="text-gray" title={`Icon: ${row.iconName}`} style={{ display: "inline-flex", alignItems: "center" }}>
                  <Icon name={row.iconName} width="14" height="14" stroke="currentColor" />
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: "Slug",
      style: { minWidth: "100px" },
      render: (row) => (
        <code style={{ fontFamily: "monospace", fontSize: "11px", backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", color: "#475569" }}>
          {row.slug}
        </code>
      )
    },
    {
      header: "Description",
      style: { minWidth: "250px" },
      render: (row) => (
        <p
          className="text-gray mini-text line-clamp1"
          title={row.description || ""}
          style={{ margin: 0, maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {row.description || "-"}
        </p>
      )
    },
    {
      header: "Theme Colors",
      style: { minWidth: "100px" },
      render: (row) => (
        <p className="text-gray mini-text">
          {row.accentColor || "N/A"}
        </p>
      )
    },
    {
      header: "Bg Colors",
      style: { minWidth: "100px" },
      render: (row) => (
        <p className="text-gray mini-text">
          {row.bgColor || "N/A"}
        </p>
      )
    },
    {
      header: "Status",
      style: { minWidth: "100px" },
      render: (row) => {
        const isAct = row.isActive !== false;
        const dot = isAct ? "#10b981" : "#9ca3af";
        return (
          <div className="flex items-center gap-6">
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, boxShadow: `0 0 6px ${dot}` }}></div>
            <span style={{ color: isAct ? "#059669" : "#6b7280" }} className="small-text font-500">
              {isAct ? "Active" : "Inactive"}
            </span>
          </div>
        );
      }
    }
  ];

  columns.push({
    header: "Actions",
    accessor: "actions",
    style: { minWidth: "100px", textAlign: "right" },
    render: (row) => (
      <div className="flex items-center gap-10">
        <span
          className="cursor-pointer"
          onClick={() => handleEditClick(row)}
        >
          <Icon name="Edit" width="16" height="16" stroke="var(--primary)" />
        </span>
        <span
          className="cursor-pointer"
          onClick={() => handleDeleteClick(row)}
        >
          <Icon name="Trash" width="16" height="16" stroke="var(--danger)" />
        </span>
      </div>
    )
  });

  const filteredCategories = categoriesList.filter((cat) =>
    (cat.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (cat.slug || "").toLowerCase().includes(search.toLowerCase()) ||
    (cat.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const getModalFields = () => [
    {
      name: "name",
      type: "text",
      label: "Category Name",
      placeholder: "e.g., PVC Curtain",
      defaultValue: categoryForm.name,
      validation: { required: true }
    },
    {
      name: "number",
      type: "text",
      label: "Number/Badge",
      placeholder: "e.g., 01",
      defaultValue: categoryForm.number,
      validation: { required: false }
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      placeholder: "e.g., pvc-curtain",
      defaultValue: categoryForm.slug,
      validation: { required: false }
    },
    {
      name: "icon",
      type: "dragfile",
      label: "Icon Image URL",
      placeholder: "e.g., /src/assets/icon.webp",
      defaultValue: categoryForm.icon,
      validation: { required: false }
    },
    {
      name: "iconName",
      type: "text",
      label: "Lucide Icon Name",
      placeholder: "e.g., Settings",
      defaultValue: categoryForm.iconName,
      validation: { required: false }
    },
    {
      name: "bgColor",
      type: "color",
      label: "Background Color Hex",
      placeholder: "e.g., #e8f0fe",
      defaultValue: categoryForm.bgColor,
      validation: { required: false }
    },
    {
      name: "accentColor",
      type: "color",
      label: "Accent Color Hex",
      placeholder: "e.g., #1f5ac0",
      defaultValue: categoryForm.accentColor,
      validation: { required: false }
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Enter category description...",
      defaultValue: categoryForm.description,
      validation: { required: false }
    }
  ];

  return (
    <Structure
      sidebarTitle="Categories"
      sidebarItems={[]}
      selectedSidebarItem="Categories"
      headerIcon={<Icon name="Grid" width="22" height="22" strokeWidth="2" />}
      headerTitle="Category Management"
      headerSub="Administer store product categories, theme styles, and badges"
      showTabControls={false}
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
