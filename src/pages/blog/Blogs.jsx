import { useState, useEffect, useMemo } from "react";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import Image from "../../components/common/Image";
import Fields from "../../components/common/Fields";
import { CrudModal, DeleteModal } from "../../components/common/Modal";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  createBlogReview,
  deleteBlogReview
} from "../../api/blogApi";
import { getBlogCategories } from "../../api/blogCategoryApi";

const Blogs = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All Articles");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentBlog, setCurrentBlog] = useState(null);

  const [blogForm, setBlogForm] = useState({
    title: "",
    customId: "",
    slug: "",
    category: "",
    tag: "",
    readTime: "5 min read",
    image: "",
    summary: "",
    description: "",
    keywords: "",
    isActive: "Active"
  });

  const [reviewForm, setReviewForm] = useState({
    rating: "5",
    comment: ""
  });

  const loadCategories = async () => {
    try {
      const res = await getBlogCategories();
      const rawData = res?.data || res;
      if (Array.isArray(rawData)) {
        const catNames = rawData
          .filter((c) => c.name && c.name.toLowerCase() !== "all")
          .map((c) => c.name);
        setCategories(catNames);
      }
    } catch {
      setCategories([]);
    }
  };

  const loadBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBlogs();
      const data = res?.blogs || res?.data?.blogs || res?.data || res;
      if (Array.isArray(data)) {
        setBlogsList(data);
      } else {
        setBlogsList([]);
      }
    } catch (err) {
      console.error("Could not load blogs from API:", err);
      setError("Failed to load blog posts from server.");
      setBlogsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadBlogs();
  }, []);

  const handleAddClick = () => {
    setModalMode("create");
    setCurrentBlog(null);
    setBlogForm({
      title: "",
      slug: "",
      category: categories[0] || "",
      tag: "",
      image: "",
      summary: "",
      description: "",
      keywords: "",
      isActive: "Active"
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (blog) => {
    setModalMode("edit");
    setCurrentBlog(blog);
    setBlogForm({
      title: blog.title || "",
      slug: blog.slug || "",
      category: blog.category || categories[0] || "",
      tag: blog.tag || "",
      image: blog.image || (blog.images && blog.images[0]) || "",
      summary: blog.summary || "",
      description: blog.description || "",
      keywords: blog.keywords || "",
      isActive: blog.isActive !== false ? "Active" : "Inactive"
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (blog) => {
    setCurrentBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const handleAddReviewClick = (blog) => {
    setCurrentBlog(blog);
    setReviewForm({ rating: "5", comment: "" });
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = async (blogId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      if (blogId && reviewId) {
        await deleteBlogReview(blogId, reviewId);
      }
      alert("Review deleted successfully!");
      loadBlogs();
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert(err.response?.data?.message || err.message || "Failed to delete review.");
    }
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
    let imgVal = "";
    if (formData.image) {
      const firstImg = Array.isArray(formData.image) ? formData.image[0] : formData.image;
      if (firstImg instanceof File) {
        imgVal = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(firstImg);
        });
      } else if (typeof firstImg === "string" && firstImg.trim() !== "") {
        imgVal = firstImg;
      }
    }

    const computedSlug = formData.slug
      ? generateSlug(formData.slug)
      : generateSlug(formData.title || "");

    const payload = {
      title: formData.title,
      slug: computedSlug,
      category: formData.category || "General",
      tag: formData.tag || "",
      image: imgVal,
      images: imgVal ? [imgVal] : [],
      summary: formData.summary || "",
      description: formData.description || "",
      keywords: formData.keywords || "",
      isActive: formData.isActive === "Active" || formData.isActive === true,
      datePublished: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      content: {
        intro: [formData.summary || ""],
        sections: [{ id: "sec-1", title: formData.title, text: formData.description || "" }],
        quote: formData.summary || "",
        outro: "Thank you for reading Ashmita Enterprises industry insights."
      }
    };

    const getBlogId = (b) => (typeof b?._id === "object" && b?._id?.$oid ? b._id.$oid : b?._id || b?.customId);
    const currentId = getBlogId(currentBlog);

    try {
      if (modalMode === "create") {
        await createBlog(payload);
        alert("Blog Article created successfully!");
      } else {
        await updateBlog(currentId, payload);
        alert("Blog Article updated successfully!");
      }
      setIsAddModalOpen(false);
      loadBlogs();
    } catch (err) {
      console.error("API operation failed:", err);
      alert(err.response?.data?.message || err.message || "Operation failed.");
    }
  };

  const handleConfirmDelete = async () => {
    const getBlogId = (b) => (typeof b?._id === "object" && b?._id?.$oid ? b._id.$oid : b?._id || b?.customId);
    const currentId = getBlogId(currentBlog);

    try {
      await deleteBlog(currentId);
      alert("Blog Article deleted successfully!");
      setIsDeleteModalOpen(false);
      loadBlogs();
    } catch (err) {
      console.error("API delete failed:", err);
      alert(err.response?.data?.message || err.message || "Failed to delete blog article.");
      setIsDeleteModalOpen(false);
    }
  };

  const handleReviewSubmit = async (formData) => {
    let blogIdToUse = formData.blogId;
    if (!blogIdToUse && currentBlog) {
      const getBlogId = (b) => (typeof b?._id === "object" && b?._id?.$oid ? b._id.$oid : b?._id || b?.customId);
      blogIdToUse = getBlogId(currentBlog);
    }
    if (!blogIdToUse && blogsList.length > 0) {
      const getBlogId = (b) => (typeof b?._id === "object" && b?._id?.$oid ? b._id.$oid : b?._id || b?.customId);
      blogIdToUse = getBlogId(blogsList[0]);
    }
    if (!blogIdToUse) {
      alert("No article selected for review.");
      return;
    }

    try {
      await createBlogReview(blogIdToUse, {
        rating: parseInt(formData.rating || "5", 10),
        comment: formData.comment || ""
      });
      alert("Review added successfully!");
      setIsReviewModalOpen(false);
      loadBlogs();
    } catch (err) {
      console.error("API review failed:", err);
      alert(err.response?.data?.message || err.message || "Failed to submit review.");
    }
  };

  // Dynamic Categories Dropdown Options
  const categoriesOptions = useMemo(() => {
    const list = [
      { label: "All Categories", value: "All" },
      ...categories.map((c) => ({ label: c, value: c }))
    ];
    return list;
  }, [categories]);

  // Sidebar Category Items
  const sidebarItems = useMemo(() => [
    { name: "All Articles", count: blogsList.length, color: "#1e74db", icon: "Clipboard" },
    ...categories.map((catName) => ({
      name: catName,
      count: blogsList.filter((b) => b.category === catName).length,
      color: "#8b5cf6",
      icon: "Layers"
    }))
  ], [blogsList, categories]);

  // Flattened Reviews List for Reviews Tab
  const reviewsList = useMemo(() => {
    const list = [];
    blogsList.forEach((blog) => {
      if (blog.reviews && Array.isArray(blog.reviews)) {
        blog.reviews.forEach((rev, idx) => {
          list.push({
            _id: rev._id || `${blog._id || blog.customId}-rev-${idx}`,
            reviewId: rev._id,
            blogId: typeof blog._id === "object" && blog._id?.$oid ? blog._id.$oid : blog._id || blog.customId,
            articleTitle: blog.title || "Untitled Article",
            user: (rev.createdBy && rev.createdBy.name) || rev.userName || "Anonymous",
            rating: rev.rating || 5,
            comment: rev.comment || "",
            date: rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : (blog.date || "Today"),
            status: "Approved"
          });
        });
      }
    });

    if (search) {
      const q = search.toLowerCase();
      return list.filter(
        (r) =>
          r.articleTitle.toLowerCase().includes(q) ||
          r.user.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
      );
    }

    return list;
  }, [blogsList, search]);

  // Filtered Articles dataset for All Articles Tab
  const filteredBlogs = useMemo(() => {
    return blogsList.filter((blog) => {
      // Category filter
      if (filterCategory !== "All" && blog.category !== filterCategory) return false;

      // Status filter
      if (filterStatus === "Active" && blog.isActive === false) return false;
      if (filterStatus === "Inactive" && blog.isActive !== false) return false;

      // Search query
      if (search) {
        const q = search.toLowerCase();
        const titleMatch = (blog.title || "").toLowerCase().includes(q);
        const slugMatch = (blog.slug || "").toLowerCase().includes(q);
        const catMatch = (blog.category || "").toLowerCase().includes(q);
        const tagMatch = (blog.tag || "").toLowerCase().includes(q);
        const idMatch = (blog.customId || "").toLowerCase().includes(q);
        return titleMatch || slugMatch || catMatch || tagMatch || idMatch;
      }

      return true;
    });
  }, [blogsList, filterCategory, filterStatus, search]);

  // Columns for All Articles Table
  const columns = [
    {
      header: "#",
      style: { width: "50px" },
      render: (_, idx) => (
        <p className="text-primary mini-text font-600">
          {String(idx + 1).padStart(2, "0")}
        </p>
      )
    },
    {
      header: "Article Details",
      style: { minWidth: "280px" },
      render: (row) => (
        <div className="flex items-center gap-12">
          {row.image || (row.images && row.images[0]) ? (
            <Image
              src={row.image || row.images[0]}
              alt={row.title}
              className="common-img rounded-5 object-cover border-tertiary"
              style={{ width: "42px", height: "42px", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{ width: "42px", height: "42px", borderRadius: "5px", flexShrink: 0, background: "#eff6ff" }}
              className="center-div text-primary"
            >
              <Icon name="Clipboard" width="18" height="18" stroke="currentColor" />
            </div>
          )}
          <div>
            <p className="text-dark font-600 mini-text line-clamp1" style={{ maxWidth: "230px" }} title={row.title}>
              {row.title}
            </p>
            <div className="flex items-center gap-6 mt-2">
              <span className="mini-text text-gray" style={{ fontSize: "11px" }}>
                {row.customId || row.id || `BLOG-${typeof row._id === "string" ? row._id.slice(-4) : "100"}`}
              </span>
              <span className="text-gray">•</span>
              <code style={{ fontSize: "10px", color: "#0284c7" }}>
                /{row.slug}
              </code>
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Category & Tags",
      style: { minWidth: "180px" },
      render: (row) => (
        <div>
          <span
            className="rounded-5 px-8 py-2 mini-text font-600"
            style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }}
          >
            {row.category || "General"}
          </span>
          {row.tag && (
            <p className="text-gray mini-text mt-4 line-clamp1" style={{ fontSize: "11px", maxWidth: "160px" }}>
              🏷️ {row.tag}
            </p>
          )}
        </div>
      )
    },
    {
      header: "Read Time / Date",
      style: { minWidth: "150px" },
      render: (row) => (
        <div>
          <p className="text-dark mini-text font-500">{row.readTime || "5 min read"}</p>
          <p className="text-gray mini-text" style={{ fontSize: "11px" }}>
            📅 {row.date || (row.datePublished ? new Date(row.datePublished).toLocaleDateString() : "Just now")}
          </p>
        </div>
      )
    },
    {
      header: "Reviews",
      style: { minWidth: "120px" },
      render: (row) => {
        const revCount = row.reviews?.length || 0;
        const avgRating =
          revCount > 0
            ? (row.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / revCount).toFixed(1)
            : "-";
        return (
          <div className="flex items-center gap-6">
            <span
              className="flex items-center gap-4 rounded-5 px-8 py-2 mini-text font-600 cursor-pointer"
              style={{ backgroundColor: revCount > 0 ? "#fef3c7" : "#f1f5f9", color: revCount > 0 ? "#d97706" : "#64748b" }}
              onClick={() => handleAddReviewClick(row)}
              title="Click to add review"
            >
              <Icon name="Star" width="12" height="12" stroke="currentColor" fill={revCount > 0 ? "currentColor" : "none"} />
              {avgRating} ({revCount})
            </span>
          </div>
        );
      }
    },
    {
      header: "Status",
      style: { minWidth: "100px" },
      render: (row) => {
        const isAct = row.isActive !== false;
        const dot = isAct ? "#10b981" : "#9ca3af";
        return (
          <div className="flex items-center gap-6">
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, boxShadow: `0 0 6px ${dot}` }} />
            <span style={{ color: isAct ? "#059669" : "#6b7280" }} className="small-text font-500">
              {isAct ? "Published" : "Draft"}
            </span>
          </div>
        );
      }
    },
    {
      header: "Actions",
      accessor: "actions",
      style: { minWidth: "120px", textAlign: "right" },
      render: (row) => (
        <div className="flex items-center gap-10 justify-end">
          <span className="cursor-pointer" onClick={() => handleAddReviewClick(row)} title="Add Reader Review">
            <Icon name="Star" width="16" height="16" stroke="#f59e0b" />
          </span>
          <span className="cursor-pointer" onClick={() => handleEditClick(row)} title="Edit Blog Article">
            <Icon name="Edit" width="16" height="16" stroke="var(--primary)" />
          </span>
          <span className="cursor-pointer" onClick={() => handleDeleteClick(row)} title="Delete Article">
            <Icon name="Trash" width="16" height="16" stroke="var(--danger)" />
          </span>
        </div>
      )
    }
  ];

  // Columns for Reviews Table (matching requested UI)
  const reviewColumns = [
    {
      header: "",
      accessor: "checkbox",
      render: () => <input type="checkbox" className="cursor-pointer" />,
      style: { width: "40px" }
    },
    {
      header: "Article",
      accessor: "articleTitle",
      style: { minWidth: "200px" },
      render: (row) => (
        <span className="text-gray font-500 mini-text">{row.articleTitle}</span>
      )
    },
    {
      header: "User",
      accessor: "user",
      style: { minWidth: "140px" },
      render: (row) => (
        <span className="text-gray mini-text">{row.user}</span>
      )
    },
    {
      header: "Rating",
      accessor: "rating",
      style: { minWidth: "110px" },
      render: (row) => (
        <span
          style={{ backgroundColor: "#fef3c7", color: "#b45309", borderRadius: "20px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          className="px-12 py-4 mini-text font-600"
        >
          <Icon name="Star" width="12" height="12" fill="#b45309" stroke="none" />
          {row.rating}
        </span>
      )
    },
    {
      header: "Comment",
      accessor: "comment",
      style: { minWidth: "220px" },
      render: (row) => (
        <p className="text-gray mini-text line-clamp1" style={{ margin: 0 }}>
          {row.comment}
        </p>
      )
    },
    {
      header: "Date",
      accessor: "date",
      style: { minWidth: "110px" },
      render: (row) => <span className="text-gray mini-text">{row.date}</span>
    },
    {
      header: "Status",
      accessor: "status",
      style: { minWidth: "110px" },
      render: (row) => (
        <div className="flex items-center gap-6">
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
          <span className="text-success small-text font-500">{row.status || "Approved"}</span>
        </div>
      )
    },
    {
      header: "Actions",
      accessor: "actions",
      style: { minWidth: "160px", textAlign: "right" },
      render: (row) => (
        <div className="flex items-center gap-8 justify-end">
          <button
            type="button"
            className="px-12 py-6 rounded-5 border-0 bg-success text-white mini-text font-600 cursor-pointer"
            style={{ backgroundColor: "#22c55e" }}
            onClick={() => alert(`Review for "${row.articleTitle}" is already approved.`)}
          >
            Approve
          </button>
          <button
            type="button"
            className="px-12 py-6 rounded-5 border-0 bg-danger text-white mini-text font-600 cursor-pointer"
            style={{ backgroundColor: "#ef4444" }}
            onClick={() => handleDeleteReview(row.blogId, row.reviewId)}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const getModalFields = () => [
    {
      name: "title",
      type: "text",
      label: "Article Title",
      placeholder: "e.g., 10 Reasons to Install PVC Strip Curtains",
      defaultValue: blogForm.title,
      validation: { required: true }
    },
    {
      name: "category",
      type: "select",
      label: "Category",
      defaultValue: blogForm.category,
      options: categoriesOptions.filter((c) => c.value !== "All"),
      validation: { required: true }
    },
    {
      name: "tag",
      type: "text",
      label: "Tags (Comma separated)",
      placeholder: "e.g., Warehouse, Energy, Insulation",
      defaultValue: blogForm.tag,
      validation: { required: false }
    },
    {
      name: "image",
      type: "dragfile",
      label: "Featured Cover Image URL",
      placeholder: "https://images.unsplash.com/...",
      defaultValue: blogForm.image,
      validation: { required: false }
    },
    {
      name: "summary",
      type: "textarea",
      label: "Short Excerpt / Summary",
      placeholder: "Brief summary shown on blog list cards...",
      defaultValue: blogForm.summary,
      validation: { required: false }
    },
    {
      name: "description",
      type: "textarea",
      label: "Full Article Content",
      placeholder: "Write main blog post body content...",
      defaultValue: blogForm.description,
      validation: { required: false }
    },
    {
      name: "keywords",
      type: "text",
      label: "SEO Keywords",
      placeholder: "e.g., pvc strip curtain, freezer door, energy saving",
      defaultValue: blogForm.keywords,
      validation: { required: false }
    },
    {
      name: "isActive",
      type: "select",
      label: "Publication Status",
      defaultValue: blogForm.isActive,
      options: [
        { label: "Published (Active)", value: "Active" },
        { label: "Draft (Inactive)", value: "Inactive" }
      ],
      validation: { required: true }
    }
  ];

  const getReviewModalFields = () => [
    ...(blogsList.length > 0
      ? [
        {
          name: "blogId",
          type: "select",
          label: "Select Article to Review",
          defaultValue: currentBlog ? (currentBlog._id || currentBlog.customId) : (blogsList[0]?._id || blogsList[0]?.customId),
          options: blogsList.map((b) => ({
            label: b.title,
            value: typeof b._id === "object" && b._id?.$oid ? b._id.$oid : b._id || b.customId
          })),
          validation: { required: true }
        }
      ]
      : []),
    {
      name: "rating",
      type: "select",
      label: "Rating Score",
      defaultValue: reviewForm.rating,
      options: [
        { label: "★ 5 - Excellent", value: "5" },
        { label: "★ 4 - Very Good", value: "4" },
        { label: "★ 3 - Average", value: "3" },
        { label: "★ 2 - Poor", value: "2" },
        { label: "★ 1 - Terrible", value: "1" }
      ],
      validation: { required: true }
    },
    {
      name: "comment",
      type: "textarea",
      label: "Review Feedback",
      placeholder: "Write reader feedback or testimonial comment...",
      defaultValue: reviewForm.comment,
      validation: { required: true }
    }
  ];

  const renderFilterInputs = () => (
    <div className="grid-cols-3 gap-12 w-full">
      <Fields
        label="SEARCH ARTICLES"
        type="input"
        placeholder="Search title, ID, tag, or slug..."
        value={search}
        onChange={(val) => setSearch(val)}
      />
      <Fields
        label="CATEGORY"
        type="select"
        value={filterCategory}
        onChange={(val) => setFilterCategory(val)}
        options={categoriesOptions}
      />
      <Fields
        label="STATUS"
        type="select"
        value={filterStatus}
        onChange={(val) => setFilterStatus(val)}
        options={[
          { label: "All Statuses", value: "All" },
          { label: "Published Only", value: "Active" },
          { label: "Drafts Only", value: "Inactive" }
        ]}
      />
    </div>
  );

  return (
    <Structure
      sidebarTitle="Categories"
      sidebarItems={sidebarItems}
      selectedSidebarItem={filterCategory === "All" ? "All Articles" : filterCategory}
      onSidebarItemClick={(name) => {
        if (name === "All Articles") {
          setFilterCategory("All");
        } else {
          setFilterCategory(name);
        }
      }}
      headerIcon={<Icon name="Clipboard" width="22" height="22" strokeWidth="2" />}
      headerTitle="Blog Articles & Insights"
      headerSub="Create, curate, edit, and publish industry articles and technical guides"
      showTabControls={true}
      tabs={[
        {
          name: "All Articles",
          count: blogsList.length,
          icon: <Icon name="Clipboard" width="16" height="16" strokeWidth="2.5" />
        },
        {
          name: "Reviews",
          count: reviewsList.length,
          icon: <Icon name="Reviews" width="16" height="16" strokeWidth="2.5" />
        }
      ]}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab)}
      filterDescription={
        activeTab === "Reviews"
          ? `Showing all ${reviewsList.length} review items.`
          : filterCategory !== "All" || filterStatus !== "All" || search
            ? `Showing ${filteredBlogs.length} filtered articles.`
            : `Showing all ${filteredBlogs.length} articles.`
      }
      hasActiveFilters={filterCategory !== "All" || filterStatus !== "All" || !!search}
      onClearAllFilters={() => {
        setSearch("");
        setFilterCategory("All");
        setFilterStatus("All");
      }}
      filterInputs={renderFilterInputs()}
      showSidebar={true}
      quickAction={
        <div className="text-right">
          <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
          {activeTab === "Reviews" ? (
            <p
              className="small-text font-600 text-primary flex items-center justify-end gap-2 decoration-none cursor-pointer"
              onClick={() => {
                if (blogsList.length > 0) {
                  handleAddReviewClick(blogsList[0]);
                } else {
                  alert("Please create an article first to add a review.");
                }
              }}
            >
              Add Review
              <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
            </p>
          ) : (
            <p
              className="small-text font-600 text-primary flex items-center justify-end gap-2 decoration-none cursor-pointer"
              onClick={handleAddClick}
            >
              Add New Article
              <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
            </p>
          )}
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
          title={activeTab === "Reviews" ? "Reviews" : `Blog Articles (${activeTab})`}
          headerSub={
            activeTab === "Reviews"
              ? `${reviewsList.length} reviews • ${reviewsList.length} approved • 0 pending`
              : `${filteredBlogs.length} articles listed`
          }
          columns={activeTab === "Reviews" ? reviewColumns : columns}
          data={activeTab === "Reviews" ? reviewsList : filteredBlogs}
          totalItems={activeTab === "Reviews" ? reviewsList.length : filteredBlogs.length}
          itemsPerPage={10}
          page={1}
          searchQuery={search}
          onSearchChange={(q) => setSearch(q)}
          showControls={true}
          loading={loading}
          minWidth="1050px"
        />
      </div>

      <CrudModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={modalMode === "create" ? "Create New Blog Article" : "Edit Blog Article Details"}
        size="sm"
        type="sidebar"
        placement="right"
        fields={getModalFields()}
        onSubmit={handleFormSubmit}
      />

      <CrudModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={currentBlog ? `Add Review for: ${currentBlog.title}` : "Add Reader Review"}
        size="sm"
        type="sidebar"
        placement="right"
        fields={getReviewModalFields()}
        onSubmit={handleReviewSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        title="Delete Blog Article"
        message="Are you sure you want to delete this article? This action will permanently remove the post and its reviews."
      />
    </Structure>
  );
};

export default Blogs;
