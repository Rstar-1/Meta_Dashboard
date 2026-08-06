import { useState, useEffect, useMemo } from "react";
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import { CrudModal, DeleteModal } from "../../components/common/Modal";
import Fields from "../../components/common/Fields";
import Structure from "../../components/layout/Structure";
import ProductForm from "./ProductForm";
import { getCategories } from "../../api/categoryApi";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} from "../../api/productApi";
import {
  productColumns,
  reviewColumns,
  orderColumns,
  initialOrders
} from "./ProductConfig";

const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [activeTab, setActiveTab] = useState("Product List");

  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editProductForm, setEditProductForm] = useState(null);
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    slug: "",
    sku: "",
    productCode: "",
    category: "",
    shortDesc: "",
    desc: "",
    price: "",
    unit: "",
    currency: "INR",
    stock: "",
    reservedStock: "",
    stockStatus: "In Stock",
    isTrending: false,
    isBestSeller: false,
    isActive: true,
    status: "pending",
    images: [],
    specifications: [],
    features: [],
    badges: [],
    metaTitle: "",
    metaDesc: "",
    metaKeywords: ""
  });

  // Filter States
  const [filterTrigger, setFilterTrigger] = useState(0);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterRating, setFilterRating] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      const data = res?.data || res;
      if (data && Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.warn("Could not load categories:", err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts();
      const data = res?.data || res;
      if (data && Array.isArray(data)) {
        const mapped = data.map(p => ({
          ...p,
          id: p._id,
          image: p.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60",
          name: p.name,
          sku: p.sku || p.productCode || "",
          category: p.categoryId?.name || (typeof p.categoryId === "string" ? p.categoryId : ""),
          price: p.currency === "INR" ? `₹${p.basePrice}` : `$${p.basePrice}`,
          stock: p.totalStock ?? 0,
          stockStatus: p.stockStatus || (p.totalStock > 0 ? "In Stock" : "Out of Stock"),
          activeStatus: p.isActive ? "Active" : "Inactive",
          trending: p.isTrending && p.isBestSeller ? "🔥 Trending · Best Seller"
            : p.isTrending ? "🔥 Trending"
              : p.isBestSeller ? "⭐ Best Seller"
                : "-",
          unit: p.unit || "",
          currency: p.currency || "INR",
          basePrice: p.basePrice || 0,
          reservedStock: p.reservedStock ?? 0,
          isTrending: !!p.isTrending,
          isBestSeller: !!p.isBestSeller,
          specifications: p.specifications || [],
          features: p.features || [],
          badges: p.badges || [],
          vendorId: p.vendorId,
          vendorEmail: p.vendorEmail || "",
          reviews: p.reviews || [],
          rating: p.reviews && p.reviews.length > 0
            ? (p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1)
            : "-",
          ratingCount: p.reviews?.length ?? 0,
          updated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString("en-IN") : "Just now"
        }));
        setProductsList(mapped);
      } else {
        setProductsList([]);
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !categories.find(c => c.name === newProductForm.category)) {
      setNewProductForm(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories]);


  const reviewsList = useMemo(() => productsList.flatMap(p =>
    (p.reviews || []).map(r => ({
      id: r._id,
      product: p.name,
      productId: p.id,
      user: r.createdBy?.fullname || r.createdBy?.email || "Anonymous",
      rating: r.rating || 5,
      comment: r.comment || "",
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Unknown",
      status: "Approved"
    }))
  ), [productsList]);

  const handleEditClick = (product) => {
    setEditProductForm({
      id: product.id,
      name: product.name,
      slug: product.slug || "",
      sku: product.sku || "",
      productCode: product.productCode || "",
      category: product.category || "",
      shortDesc: product.shortDesc || "",
      desc: product.description || "",
      price: product.basePrice || "",
      unit: product.unit || "",
      currency: product.currency || "INR",
      stock: product.stock ?? "",
      reservedStock: product.reservedStock ?? "",
      stockStatus: product.stockStatus || "In Stock",
      isTrending: !!product.isTrending,
      isBestSeller: !!product.isBestSeller,
      isActive: product.isActive !== false,
      status: product.status || "pending",
      images: product.images || [],
      specifications: product.specifications || [],
      features: product.features || [],
      badges: product.badges || [],
      metaTitle: product.metaTitle || "",
      metaDesc: product.metaDesc || "",
      metaKeywords: product.metaKeywords || ""
    });
    setIsEditingProduct(true);
  };

  const handleEditSubmit = async (e) => {
    e?.preventDefault();
    if (!editProductForm?.id) return;
    try {
      const processedImages = await Promise.all(
        (editProductForm.images || []).map(async (img) => {
          if (img instanceof File) {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(img);
            });
          }
          return img;
        })
      );

      const payload = {
        name: editProductForm.name,
        slug: editProductForm.slug,
        sku: editProductForm.sku,
        productCode: editProductForm.productCode,
        categoryId: categories.find(c => c.name === editProductForm.category)?._id || categories[0]?._id,
        shortDesc: editProductForm.shortDesc,
        description: editProductForm.desc,
        basePrice: Number(editProductForm.price || 0),
        unit: editProductForm.unit,
        currency: editProductForm.currency || "INR",
        totalStock: Number(editProductForm.stock || 0),
        reservedStock: Number(editProductForm.reservedStock || 0),
        stockStatus: editProductForm.stockStatus,
        isTrending: !!editProductForm.isTrending,
        isBestSeller: !!editProductForm.isBestSeller,
        isActive: !!editProductForm.isActive,
        status: editProductForm.status || "pending",
        images: processedImages,
        specifications: editProductForm.specifications || [],
        features: editProductForm.features || [],
        badges: editProductForm.badges || [],
        metaTitle: editProductForm.metaTitle,
        metaDesc: editProductForm.metaDesc,
        metaKeywords: editProductForm.metaKeywords,
      };

      await updateProduct(editProductForm.id, payload);
      setIsEditingProduct(false);
      setEditProductForm(null);
      loadProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      alert(err.message || "Failed to update product");
    }
  };

  const handleAddNewProductSubmit = async (e) => {
    e?.preventDefault();
    try {
      const processedImages = await Promise.all(
        (newProductForm.images || []).map(async (img) => {
          if (img instanceof File) {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(img);
            });
          }
          return img;
        })
      );

      const payload = {
        name: newProductForm.name,
        slug: newProductForm.slug,
        sku: newProductForm.sku,
        productCode: newProductForm.productCode,
        categoryId: categories.find(c => c.name === newProductForm.category)?._id || categories[0]?._id,
        shortDesc: newProductForm.shortDesc,
        description: newProductForm.desc,
        basePrice: Number(newProductForm.price || 0),
        unit: newProductForm.unit,
        currency: newProductForm.currency || "INR",
        totalStock: Number(newProductForm.stock || 0),
        reservedStock: Number(newProductForm.reservedStock || 0),
        stockStatus: newProductForm.stockStatus,
        isTrending: !!newProductForm.isTrending,
        isBestSeller: !!newProductForm.isBestSeller,
        isActive: !!newProductForm.isActive,
        status: newProductForm.status || "pending",
        images: processedImages,
        specifications: newProductForm.specifications || [],
        features: newProductForm.features || [],
        badges: newProductForm.badges || [],
        metaTitle: newProductForm.metaTitle,
        metaDesc: newProductForm.metaDesc,
        metaKeywords: newProductForm.metaKeywords,
      };

      await createProduct(payload);
      setNewProductForm({
        name: "",
        slug: "",
        sku: "",
        productCode: "",
        category: categories[0]?.name || "",
        shortDesc: "",
        desc: "",
        price: "",
        unit: "",
        currency: "INR",
        stock: "",
        reservedStock: "",
        stockStatus: "In Stock",
        isTrending: false,
        isBestSeller: false,
        isActive: true,
        status: "pending",
        images: [],
        specifications: [],
        features: [],
        badges: [],
        metaTitle: "",
        metaDesc: "",
        metaKeywords: ""
      });
      setIsAddingProduct(false);
      loadProducts();
    } catch (err) {
      console.error("Error creating product:", err);
      alert(err.message || "Failed to create product");
    }
  };

  const handleResetFilters = () => {
    setFilterName("");
    setFilterStatus("All");
    setFilterMinPrice("");
    setFilterMaxPrice("");
    setFilterUser("");
    setFilterRating("All");
    setFilterPayment("All");
    setCurrentPage(1);
    setFilterTrigger(prev => prev + 1);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (activeTab === "Product List") {
        await deleteProduct(itemToDelete.id);
        await loadProducts();
      } else if (activeTab === "Reviews") {
        alert("Deleting individual reviews is not supported by the product API.");
      } else if (activeTab === "Orders") {
        setOrdersList(prev => prev.filter(p => p.id !== itemToDelete.id));
      }
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Error deleting item:", err);
      alert(err.message || "Failed to delete item");
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      if (activeTab === "Product List") {
        let imageVal = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60";
        if (formData.image) {
          const firstImg = Array.isArray(formData.image) ? formData.image[0] : formData.image;
          if (firstImg instanceof File) {
            imageVal = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(firstImg);
            });
          } else if (typeof firstImg === "string") {
            imageVal = firstImg;
          }
        }

        const payload = {
          name: formData.name,
          categoryId: categories.find(c => c.name === formData.category)?._id || categories[0]?._id,
          basePrice: Number(formData.price || 0),
          totalStock: Number(formData.stock || 0),
          isActive: formData.status === "Active",
          stockStatus: Number(formData.stock) > 0 ? "In Stock" : "Out of Stock",
          images: [imageVal]
        };
        await createProduct(payload);
        await loadProducts();
      } else if (activeTab === "Reviews") {
        const product = productsList.find(p => p.name === formData.product);
        if (product) {
          await createProductReview(product.id, {
            rating: parseInt(formData.rating || "5", 10),
            comment: formData.comment || ""
          });
          await loadProducts();
        } else {
          alert("Please select a valid product from the list.");
        }
      } else if (activeTab === "Orders") {
        const newOrd = {
          id: Date.now(),
          orderId: formData.orderId || `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          customer: formData.customer || "Customer",
          date: formData.date || "Just now",
          products: formData.products || "1 item",
          amount: formData.amount ? (formData.amount.startsWith("$") ? formData.amount : `$${formData.amount}`) : "$99.00",
          payment: formData.payment || "Paid",
          status: formData.status || "Processing"
        };
        setOrdersList(prev => [newOrd, ...prev]);
      }
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Error adding item:", err);
      alert(err.message || "Failed to add item");
    }
  };

  const categoriesList = [
    { name: "All Products", count: productsList.length, color: "#1e74db", hasFilterBadge: true },
    ...categories.map((c, i) => ({
      name: c.name,
      count: productsList.filter(p => p.category === c.name).length,
      color: ["#ef4444", "#f97316", "#22c55e", "#0284c7", "#2563eb", "#a855f7", "#92400e", "#475569"][i % 8]
    }))
  ];

  const getModalTitle = () => {
    switch (activeTab) {
      case "Product List":
        return "Add New Product";
      case "Reviews":
        return "Add New Review";
      case "Orders":
        return "Add New Order";
      default:
        return "Add Item";
    }
  };

  const getModalFields = () => {
    switch (activeTab) {
      case "Product List":
        return [
          { name: "image", label: "Image URL", type: "dragfile", placeholder: "https://images.unsplash.com/..." },
          { name: "name", label: "Product Name", type: "text", required: true, placeholder: "e.g. Wireless Headphones" },
          { name: "category", label: "Category", type: "select", options: categoriesList.filter(c => c.name !== "All Products").map(c => ({ label: c.name, value: c.name })) },
          { name: "price", label: "Price ($)", type: "text", placeholder: "99.99" },
          { name: "stock", label: "Initial Stock", type: "number", placeholder: "50" },
          { name: "status", label: "Status", type: "select", options: [{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }] }
        ];
      case "Reviews":
        return [
          {
            name: "product",
            label: "Product",
            type: "select",
            required: true,
            options: productsList.map(p => ({ label: p.name, value: p.name }))
          },
          {
            name: "rating",
            label: "Rating (1-5)",
            type: "select",
            options: [
              { label: "★ 1", value: "1" },
              { label: "★★ 2", value: "2" },
              { label: "★★★ 3", value: "3" },
              { label: "★★★★ 4", value: "4" },
              { label: "★★★★★ 5", value: "5" }
            ]
          },
          { name: "comment", label: "Comment", type: "text", required: true, placeholder: "Share your experience..." }
        ];
      case "Orders":
        return [
          { name: "orderId", label: "Order ID", type: "text", required: true, placeholder: "#ORD-9999" },
          { name: "customer", label: "Customer", type: "text", required: true, placeholder: "Jane Smith" },
          { name: "products", label: "Products", type: "text", placeholder: "2 items" },
          { name: "amount", label: "Amount ($)", type: "text", placeholder: "199.99" },
          { name: "payment", label: "Payment", type: "select", options: [{ label: "Paid", value: "Paid" }, { label: "Pending", value: "Pending" }, { label: "Failed", value: "Failed" }] },
          { name: "status", label: "Status", type: "select", options: [{ label: "Delivered", value: "Delivered" }, { label: "Processing", value: "Processing" }, { label: "Shipped", value: "Shipped" }, { label: "Cancelled", value: "Cancelled" }] }
        ];
      default:
        return [];
    }
  };

  const getTableColumns = () => {
    let cols = productColumns;
    if (activeTab === "Reviews") cols = reviewColumns;
    if (activeTab === "Orders") cols = orderColumns;

    return cols.map((col) => {
      if (col.accessor === "checkbox") {
        return {
          ...col,
          render: () => <input type="checkbox" className="cursor-pointer" />
        };
      }

      if (col.accessor === "actions") {
        return {
          ...col,
          render: (item) => activeTab === "Reviews" ? (
            <div className="flex gap-4">
              <Button version="v0" bg="success" color="white" text="Approve" />
              <Button version="v0" bg="danger" color="white" onClick={() => handleDeleteClick(item)} text="Delete" />
            </div>
          ) : (
            <div className="flex items-center gap-10">
              <span className="cursor-pointer" onClick={() => handleEditClick(item)}>
                <Icon name="Edit" width="16" height="16" stroke="var(--primary)" />
              </span>
              <span className="cursor-pointer" onClick={() => handleDeleteClick(item)}>
                <Icon name="Trash" width="16" height="16" stroke="var(--danger)" />
              </span>
            </div>
          )
        };
      }
      return col;
    });
  };

  const getHeaderSub = () => {
    switch (activeTab) {
      case "Product List":
        return `${productsList.length} products • ${new Set(productsList.map(p => p.category)).size} categories • ${productsList.filter(p => p.activeStatus === "Active").length} active • ${productsList.filter(p => p.stock === 0).length} out of stock`;
      case "Reviews":
        return `${reviewsList.length} reviews • ${reviewsList.filter(r => r.status === "Approved").length} approved • ${reviewsList.filter(r => r.status === "Pending").length} pending`;
      case "Orders":
        return `${ordersList.length} orders • ${ordersList.filter(o => o.status === "Delivered").length} delivered • ${ordersList.filter(o => o.status === "Processing").length} processing`;
      default:
        return "";
    }
  };

  const { tableData, tableTotal } = useMemo(() => {
    if (activeTab === "Analytic") {
      return { tableData: [], tableTotal: 0 };
    }
    let rawData = [];

    if (activeTab === "Product List") {
      rawData = selectedCategory === "All Products"
        ? productsList
        : productsList.filter(p => p.category === selectedCategory);

      if (filterName) rawData = rawData.filter(p => p.name.toLowerCase().includes(filterName.toLowerCase()));
      if (filterStatus !== "All") rawData = rawData.filter(p => p.activeStatus === filterStatus);
      if (filterMinPrice) {
        rawData = rawData.filter(p => {
          const val = parseFloat(String(p.price).replace(/[^0-9.]/g, ""));
          return !isNaN(val) && val >= parseFloat(filterMinPrice);
        });
      }
      if (filterMaxPrice) {
        rawData = rawData.filter(p => {
          const val = parseFloat(String(p.price).replace(/[^0-9.]/g, ""));
          return !isNaN(val) && val <= parseFloat(filterMaxPrice);
        });
      }
    } else if (activeTab === "Reviews") {
      rawData = reviewsList;

      if (filterName) rawData = rawData.filter(p => p.product.toLowerCase().includes(filterName.toLowerCase()));
      if (filterUser) rawData = rawData.filter(p => p.user.toLowerCase().includes(filterUser.toLowerCase()));
      if (filterRating !== "All") rawData = rawData.filter(p => p.rating === parseInt(filterRating, 10));
      if (filterStatus !== "All") rawData = rawData.filter(p => p.status === filterStatus);
    } else if (activeTab === "Orders") {
      rawData = ordersList;

      if (filterName) rawData = rawData.filter(p => p.orderId.toLowerCase().includes(filterName.toLowerCase()));
      if (filterUser) rawData = rawData.filter(p => p.customer.toLowerCase().includes(filterUser.toLowerCase()));
      if (filterPayment !== "All") rawData = rawData.filter(p => p.payment === filterPayment);
      if (filterStatus !== "All") rawData = rawData.filter(p => p.status === filterStatus);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      rawData = rawData.filter(item => {
        const nameMatch = item.name?.toLowerCase().includes(q) || false;
        const customerMatch = item.customer?.toLowerCase().includes(q) || false;
        const commentMatch = item.comment?.toLowerCase().includes(q) || false;
        const prodMatch = item.product?.toLowerCase().includes(q) || false;
        const idMatch = item.orderId?.toLowerCase().includes(q) || false;
        return nameMatch || customerMatch || commentMatch || prodMatch || idMatch;
      });
    }

    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    const paginatedData = rawData.slice(startIndex, startIndex + limit);

    return { tableData: paginatedData, tableTotal: rawData.length };
  }, [
    activeTab,
    selectedCategory,
    currentPage,
    searchQuery,
    filterName,
    filterStatus,
    filterMinPrice,
    filterMaxPrice,
    filterUser,
    filterRating,
    filterPayment,
    productsList,
    reviewsList,
    ordersList
  ]);

  const getFilterDescription = () => {
    const activeFilters = [];
    if (selectedCategory !== "All Products") {
      activeFilters.push(`Category Side-filter: ${selectedCategory}`);
    }
    if (activeTab === "Product List") {
      if (filterName) activeFilters.push(`Name: "${filterName}"`);
      if (filterStatus !== "All") activeFilters.push(`Status: ${filterStatus}`);
      if (filterMinPrice) activeFilters.push(`Min Price: $${filterMinPrice}`);
      if (filterMaxPrice) activeFilters.push(`Max Price: $${filterMaxPrice}`);
    } else if (activeTab === "Reviews") {
      if (filterName) activeFilters.push(`Product: "${filterName}"`);
      if (filterUser) activeFilters.push(`User: "${filterUser}"`);
      if (filterRating !== "All") activeFilters.push(`Rating: ${filterRating} ★`);
      if (filterStatus !== "All") activeFilters.push(`Status: ${filterStatus}`);
    } else if (activeTab === "Orders") {
      if (filterName) activeFilters.push(`Order ID: "${filterName}"`);
      if (filterUser) activeFilters.push(`Customer: "${filterUser}"`);
      if (filterPayment !== "All") activeFilters.push(`Payment: ${filterPayment}`);
      if (filterStatus !== "All") activeFilters.push(`Status: ${filterStatus}`);
    }

    if (activeFilters.length === 0) {
      return `No filters applied — showing all ${activeTab.toLowerCase()} items.`;
    }
    return `Showing filtered items: ${activeFilters.join(" • ")}`;
  };

  const renderFilterInputs = () => {
    switch (activeTab) {
      case "Product List":
        return (
          <div className="grid-cols-4 gap-12 w-full">
            <Fields
              label="PRODUCT NAME"
              type="input"
              placeholder="Search name..."
              value={filterName}
              onChange={(val) => { setFilterName(val); setCurrentPage(1); }}
            />
            <Fields
              label="STATUS"
              type="select"
              value={filterStatus}
              onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
              options={[
                { label: "All Statuses", value: "All" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" }
              ]}
            />
            <Fields
              label="MIN PRICE ($)"
              type="number"
              placeholder="e.g. 50"
              value={filterMinPrice}
              onChange={(val) => { setFilterMinPrice(val); setCurrentPage(1); }}
            />
            <Fields
              label="MAX PRICE ($)"
              type="number"
              placeholder="e.g. 1000"
              value={filterMaxPrice}
              onChange={(val) => { setFilterMaxPrice(val); setCurrentPage(1); }}
            />
          </div>
        );
      case "Reviews":
        return (
          <div className="grid-cols-4 gap-12 w-full">
            <Fields
              label="PRODUCT"
              type="input"
              placeholder="Search product..."
              value={filterName}
              onChange={(val) => { setFilterName(val); setCurrentPage(1); }}
            />
            <Fields
              label="USER"
              type="input"
              placeholder="Search user..."
              value={filterUser}
              onChange={(val) => { setFilterUser(val); setCurrentPage(1); }}
            />
            <Fields
              label="RATING"
              type="select"
              value={filterRating}
              onChange={(val) => { setFilterRating(val); setCurrentPage(1); }}
              options={[
                { label: "All Ratings", value: "All" },
                { label: "5 Stars", value: "5" },
                { label: "4 Stars", value: "4" },
                { label: "3 Stars", value: "3" },
                { label: "2 Stars", value: "2" },
                { label: "1 Star", value: "1" }
              ]}
            />
            <Fields
              label="STATUS"
              type="select"
              value={filterStatus}
              onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
              options={[
                { label: "All Statuses", value: "All" },
                { label: "Approved", value: "Approved" },
                { label: "Pending", value: "Pending" },
                { label: "Flagged", value: "Flagged" }
              ]}
            />
          </div>
        );
      case "Orders":
        return (
          <div className="grid-cols-4 gap-12 w-full">
            <Fields
              label="ORDER ID"
              type="input"
              placeholder="Search Order ID..."
              value={filterName}
              onChange={(val) => { setFilterName(val); setCurrentPage(1); }}
            />
            <Fields
              label="CUSTOMER"
              type="input"
              placeholder="Search customer..."
              value={filterUser}
              onChange={(val) => { setFilterUser(val); setCurrentPage(1); }}
            />
            <Fields
              label="PAYMENT METHOD"
              type="select"
              value={filterPayment}
              onChange={(val) => { setFilterPayment(val); setCurrentPage(1); }}
              options={[
                { label: "All Payments", value: "All" },
                { label: "Credit Card", value: "Credit Card" },
                { label: "PayPal", value: "PayPal" },
                { label: "Apple Pay", value: "Apple Pay" },
                { label: "Google Pay", value: "Google Pay" }
              ]}
            />
            <Fields
              label="STATUS"
              type="select"
              value={filterStatus}
              onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
              options={[
                { label: "All Statuses", value: "All" },
                { label: "Delivered", value: "Delivered" },
                { label: "Shipped", value: "Shipped" },
                { label: "Processing", value: "Processing" },
                { label: "Cancelled", value: "Cancelled" }
              ]}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const isFormMode = isAddingProduct || isEditingProduct;
  const activeForm = isEditingProduct ? editProductForm : newProductForm;
  const activeFormSetter = isEditingProduct ? setEditProductForm : setNewProductForm;
  const activeFormSubmit = isEditingProduct ? handleEditSubmit : handleAddNewProductSubmit;

  return (
    <Structure
      sidebarTitle="Product Categories"
      sidebarItems={categoriesList}
      selectedSidebarItem={selectedCategory}
      onSidebarItemClick={(name) => { setSelectedCategory(name); setCurrentPage(1); }}
      headerIcon={<Icon name="Orders" width="22" height="22" strokeWidth="2" />}
      headerTitle={isEditingProduct ? "Edit Product" : isAddingProduct ? "Add New Product" : "Products Overview"}
      headerSub={isEditingProduct ? `Editing: ${editProductForm?.name || ""}` : isAddingProduct ? "Fill in the details below to add a new product" : getHeaderSub()}
      quickAction={
        isFormMode ? (
          <div className="text-right">
            <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
            <p className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer" onClick={() => { setIsAddingProduct(false); setIsEditingProduct(false); setEditProductForm(null); }}>
              <Icon name="ChevronLeft" width="14" height="14" strokeWidth="2.5" />
              Back to List
            </p>
          </div>
        ) : (
          <div className="text-right">
            <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
            <p className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer" onClick={() => {
              if (activeTab === "Product List") {
                setIsAddingProduct(true);
              } else {
                setIsAddModalOpen(true);
              }
            }}>
              {getModalTitle()}
              <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
            </p>
          </div>
        )
      }
      tabs={[
        {
          name: "Product List",
          count: productsList.length,
          icon: <Icon name="Product List" width="16" height="16" strokeWidth="2.5" />
        },
        {
          name: "Reviews",
          count: reviewsList.length,
          icon: <Icon name="Reviews" width="16" height="16" strokeWidth="2.5" />
        },
        {
          name: "Orders",
          count: ordersList.length,
          icon: <Icon name="Orders" width="16" height="16" strokeWidth="2.5" />
        }
      ]}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        handleResetFilters();
      }}
      filterDescription={getFilterDescription()}
      hasActiveFilters={
        selectedCategory !== "All Products" ||
        !!filterName ||
        filterStatus !== "All" ||
        !!filterMinPrice ||
        !!filterMaxPrice ||
        !!filterUser ||
        filterRating !== "All" ||
        filterPayment !== "All"
      }
      onClearAllFilters={() => {
        setSelectedCategory("All Products");
        handleResetFilters();
      }}
      filterInputs={renderFilterInputs()}
      showTabControls={!isFormMode}
    >
      <div className="">
        {isFormMode ? (
          <ProductForm
            form={activeForm}
            setForm={activeFormSetter}
            onSubmit={activeFormSubmit}
            categoriesList={categoriesList}
            isEditingProduct={isEditingProduct}
            onCancel={() => {
              setIsAddingProduct(false);
              setIsEditingProduct(false);
              setEditProductForm(null);
            }}
          />
        ) : (
          <Table
            title={activeTab}
            headerSub={getHeaderSub()}
            columns={getTableColumns()}
            data={tableData}
            totalItems={tableTotal}
            itemsPerPage={10}
            page={currentPage}
            onPageChange={(p) => setCurrentPage(p)}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            showControls={true}
            minWidth={activeTab === "Reviews" || activeTab === "Orders" ? "950px" : "1100px"}
          />
        )}
      </div>

      <CrudModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={getModalTitle()}
        size="sm"
        type="sidebar"
        placement="right"
        fields={getModalFields()}
        onSubmit={handleAddSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this item? This action cannot be undone."
      />
    </Structure>
  );
};

export default Product;