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
import { getUsers } from "../../api/userApi";
import {
  blogsTableColumns,
  blogReviewsTableColumns,
  blogsModalFields,
  blogReviewsModalFields,
  blogsSidebarData
} from "../../utils/apiData";

const getIdString = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val.$oid) return String(val.$oid);
    if (val._id) {
      if (typeof val._id === "string") return val._id;
      if (typeof val._id === "object" && val._id.$oid) return String(val._id.$oid);
    }
    if (val.id) {
      if (typeof val.id === "string") return val.id;
      if (typeof val.id === "object" && val.id.$oid) return String(val.id.$oid);
    }
  }
  return String(val);
};

const Blogs = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All Articles");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

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

  const loadUsers = async () => {
    try {
      const res = await getUsers({ limit: 100 });
      const rawData = res?.users || res?.data?.users || res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(rawData)) {
        const map = {};
        rawData.forEach((u) => {
          const id = getIdString(u._id || u.id || u);
          if (id) {
            map[id] = u;
          }
        });
        setUsersMap(map);
      }
    } catch {
      setUsersMap({});
    }
  };

  useEffect(() => {
    loadCategories();
    loadBlogs();
    loadUsers();
  }, []);

  const handleAddClick = () => {
    setModalMode("create");
    setCurrentBlog(null);
    setBlogForm({
      title: "",
      slug: "",
      category: categories[0] || "",
      tag: "",
      keywords: "",
      image: "",
      images: [],
      summary: "",
      description: "",
      shareLink: "",
      authorSocials_linkedin: "",
      authorSocials_twitter: "",
      authorSocials_facebook: "",
      authorSocials_instagram: "",
      schemaPosting: "",
      schemaBreadcrumb: "",
      isActive: "Active"
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (blog) => {
    setModalMode("edit");
    setCurrentBlog(blog);

    const rawInitialImages = Array.isArray(blog.images) && blog.images.length > 0
      ? blog.images
      : (blog.image ? [blog.image] : []);
    const initialImages = [...new Set(rawInitialImages.filter(Boolean))];

    const initialImage = blog.image || (initialImages[0] || "");

    const catName = typeof blog.categoryId === "object"
      ? (blog.categoryId?.name || "")
      : (typeof blog.category === "object" ? (blog.category?.name || "") : (blog.category || categories[0] || ""));

    setBlogForm({
      title: blog.title || "",
      slug: blog.slug || "",
      category: catName,
      tag: blog.tag || "",
      keywords: blog.keywords || "",
      image: initialImage,
      images: initialImages,
      summary: blog.summary || (blog.content?.intro?.[0] || ""),
      description: blog.description || (blog.content?.sections?.[0]?.text || ""),
      shareLink: blog.shareLink || "",
      authorSocials_linkedin: blog.authorSocials?.linkedin || "",
      authorSocials_twitter: blog.authorSocials?.twitter || "",
      authorSocials_facebook: blog.authorSocials?.facebook || "",
      authorSocials_instagram: blog.authorSocials?.instagram || "",
      schemaPosting: typeof blog.schemaPosting === "object" ? JSON.stringify(blog.schemaPosting, null, 2) : (blog.schemaPosting || ""),
      schemaBreadcrumb: typeof blog.schemaBreadcrumb === "object" ? JSON.stringify(blog.schemaBreadcrumb, null, 2) : (blog.schemaBreadcrumb || ""),
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
          reader.onloadend = () => resolve(reader.result || "");
          reader.onerror = () => resolve("");
          reader.readAsDataURL(firstImg);
        });
      } else if (typeof firstImg === "string" && firstImg.trim() !== "") {
        imgVal = firstImg;
      }
    }

    let imagesList = [];
    if (Array.isArray(formData.images) && formData.images.length > 0) {
      imagesList = await Promise.all(
        formData.images.map((item) => {
          return new Promise((resolve) => {
            if (item instanceof File) {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result || "");
              reader.onerror = () => resolve("");
              reader.readAsDataURL(item);
            } else if (typeof item === "string") {
              resolve(item);
            } else if (item && typeof item === "object") {
              const url = item.url || item.path || item.preview || item.src || "";
              resolve(url);
            } else {
              resolve("");
            }
          });
        })
      );
      imagesList = [...new Set(imagesList.filter(Boolean))];
    }

    const computedSlug = formData.slug
      ? generateSlug(formData.slug)
      : generateSlug(formData.title || "");

    let parsedSchemaPosting = null;
    if (formData.schemaPosting) {
      try {
        parsedSchemaPosting = typeof formData.schemaPosting === "string" ? JSON.parse(formData.schemaPosting) : formData.schemaPosting;
      } catch {
        parsedSchemaPosting = formData.schemaPosting;
      }
    }

    let parsedSchemaBreadcrumb = null;
    if (formData.schemaBreadcrumb) {
      try {
        parsedSchemaBreadcrumb = typeof formData.schemaBreadcrumb === "string" ? JSON.parse(formData.schemaBreadcrumb) : formData.schemaBreadcrumb;
      } catch {
        parsedSchemaBreadcrumb = formData.schemaBreadcrumb;
      }
    }

    const finalImages = imagesList.length > 0 ? imagesList : (imgVal ? [imgVal] : []);
    const uniqueImages = [...new Set(finalImages.filter(Boolean))];

    const blogName = formData.name || formData.title || "";
    const payload = {
      name: blogName,
      title: blogName,
      slug: computedSlug,
      category: formData.category || "General",
      tag: formData.tag || "",
      image: imgVal || (uniqueImages[0] || ""),
      images: uniqueImages,
      summary: formData.summary || "",
      description: formData.description || "",
      keywords: formData.keywords || "",
      shareLink: formData.shareLink || "",
      authorSocials: {
        linkedin: formData.authorSocials_linkedin || "",
        twitter: formData.authorSocials_twitter || "",
        facebook: formData.authorSocials_facebook || "",
        instagram: formData.authorSocials_instagram || ""
      },
      schemaPosting: parsedSchemaPosting,
      schemaBreadcrumb: parsedSchemaBreadcrumb,
      isActive: formData.isActive === "Active" || formData.isActive === true,
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
    ...blogsSidebarData.defaultItems.map((item) => ({ ...item, count: blogsList.length, icon: "Clipboard" })),
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
          const getUserProfile = (r) => {
            let uObj = null;
            if (r.user && typeof r.user === "object") uObj = r.user;
            else if (r.createdBy && typeof r.createdBy === "object") uObj = r.createdBy;
            else if (r.author && typeof r.author === "object") uObj = r.author;

            const target = r.createdBy || r.user || r.author;
            const id = getIdString(target);
            const mapped = id && usersMap[id] ? usersMap[id] : null;

            const name =
              uObj?.fullName ||
              uObj?.name ||
              uObj?.username ||
              mapped?.fullName ||
              mapped?.name ||
              mapped?.username ||
              (typeof r.user === "string" && !r.user.includes("@") ? r.user : (r.userName || "User"));

            const subText =
              uObj?.mobile ||
              uObj?.phone ||
              mapped?.mobile ||
              mapped?.phone ||
              uObj?.email ||
              mapped?.email ||
              (typeof r.user === "string" && r.user.includes("@") ? r.user : "");

            const image =
              uObj?.image ||
              uObj?.avatar ||
              uObj?.profileImage ||
              mapped?.image ||
              mapped?.avatar ||
              mapped?.profileImage ||
              "";

            return { name, subText, image };
          };

          const userProfile = getUserProfile(rev);
          const revId = getIdString(rev._id) || `${getIdString(blog._id || blog.customId)}-rev-${idx}`;
          const createdDate = rev.createdAt || rev.createdDate || blog.createdAt || blog.createdDate || "";
          const updatedDate = rev.updatedAt || rev.updatedDate || rev.createdAt || blog.updatedAt || blog.createdDate || "";

          list.push({
            _id: revId,
            reviewId: revId,
            blogId: getIdString(blog._id || blog.customId),
            articleTitle: blog.title || "Untitled Article",
            user: userProfile.name,
            userSubText: userProfile.subText,
            userImage: userProfile.image,
            rating: rev.rating || 5,
            comment: rev.comment || "",
            createdDate: createdDate,
            updatedDate: updatedDate,
            status: rev.status || (rev.isActive === false ? "Inactive" : "Approved")
          });
        });
      }
    });

    if (search) {
      const q = search.toLowerCase();
      return list.filter(
        (r) =>
          r.articleTitle.toLowerCase().includes(q) ||
          (r.user || "").toLowerCase().includes(q) ||
          (r.userSubText || "").toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
      );
    }

    return list;
  }, [blogsList, usersMap, search]);

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
  const columns = blogsTableColumns.map((col) => {
    if (col.accessor === "reviews") {
      return {
        ...col,
        render: (row) => {
          const revCount = row.reviews?.length || 0;
          const avgRating =
            revCount > 0
              ? (row.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / revCount).toFixed(1)
              : "-";
          return (
            <div className="flex items-center gap-6">
              <span
                className="flex items-center gap-4 rounded-5 px-8 py-2 mini-text font-600 cursor-default"
                style={{ backgroundColor: revCount > 0 ? "#fef3c7" : "#f1f5f9", color: revCount > 0 ? "#d97706" : "#64748b" }}
              >
                <Icon name="Star" width="12" height="12" stroke="currentColor" fill={revCount > 0 ? "currentColor" : "none"} />
                {avgRating} ({revCount})
              </span>
            </div>
          );
        }
      };
    }
    return col;
  });

  // Columns for Reviews Table
  const reviewColumns = blogReviewsTableColumns.map((col) => {
    if (col.accessor === "actions") {
      return {
        ...col,
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
      };
    }
    return col;
  });

  const getModalFields = () =>
    blogsModalFields.map((field) => {
      let fieldObj = { ...field, defaultValue: blogForm[field.name] };
      if (field.name === "category") {
        fieldObj.options = categoriesOptions.filter((c) => c.value !== "All");
      }
      return fieldObj;
    });

  const getReviewModalFields = () =>
    blogReviewsModalFields.map((field) => {
      let fieldObj = { ...field, defaultValue: reviewForm[field.name] };
      if (field.name === "blogId") {
        fieldObj.defaultValue = currentBlog ? (currentBlog._id || currentBlog.customId) : (blogsList[0]?._id || blogsList[0]?.customId);
        fieldObj.options = blogsList.map((b) => ({
          label: b.title,
          value: typeof b._id === "object" && b._id?.$oid ? b._id.$oid : b._id || b.customId
        }));
      }
      return fieldObj;
    });

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
      sidebarTitle={blogsSidebarData.title}
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
      onTabChange={(tab) => { setActiveTab(tab); setCurrentPage(1); }}
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
          data={activeTab === "Reviews"
            ? reviewsList.slice((currentPage - 1) * 10, currentPage * 10)
            : filteredBlogs.slice((currentPage - 1) * 10, currentPage * 10)
          }
          totalItems={activeTab === "Reviews" ? reviewsList.length : filteredBlogs.length}
          itemsPerPage={10}
          page={currentPage}
          onPageChange={(p) => setCurrentPage(p)}
          searchQuery={search}
          onSearchChange={(q) => { setSearch(q); setCurrentPage(1); }}
          showControls={true}
          loading={loading}
          minWidth="1050px"
          onEdit={activeTab !== "Reviews" ? handleEditClick : undefined}
          onDelete={activeTab !== "Reviews" ? handleDeleteClick : undefined}
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
