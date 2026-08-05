import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";
import Table from "../../components/common/Table";
import { CrudModal, DeleteModal } from "../../components/common/Modal";
import Fields from "../../components/common/Fields";
import FormBuilder from "../../components/common/FormBuilder";
import Structure from "../../components/layout/Structure";

const productColumns = [
  { header: "", accessor: "checkbox", style: { width: "40px" } },
  { header: "Name", accessor: "name", ui: "profile", imageKey: "image", subKey: "sub" },
  { header: "SKU", accessor: "sku", ui: "text" },
  { header: "Category", accessor: "category", ui: "text" },
  { header: "Price", accessor: "price", ui: "text" },
  { header: "Stock", accessor: "stock", ui: "text" },
  { header: "Status", accessor: "status", ui: "status" },
  { header: "Rating", accessor: "rating", ui: "icon-badge", icon: "Star" },
  { header: "Sales", accessor: "sales", ui: "text" },
  { header: "", accessor: "actions", style: { width: "50px" }, className: "text-center" }
];

const inventoryColumns = [
  { header: "", accessor: "checkbox", style: { width: "40px" } },
  { header: "Name", accessor: "name", ui: "text" },
  { header: "Category", accessor: "category", ui: "text" },
  { header: "Quantity", accessor: "qty", ui: "text" },
  { header: "Location", accessor: "location", ui: "text" },
  { header: "Value", accessor: "val", ui: "text" },
  { header: "Status", accessor: "status", ui: "status" },
  { header: "", accessor: "actions", style: { width: "50px" }, className: "text-center" }
];

const reviewColumns = [
  { header: "", accessor: "checkbox", style: { width: "40px" } },
  { header: "Product", accessor: "product", ui: "text" },
  { header: "User", accessor: "user", ui: "text" },
  { header: "Rating", accessor: "rating", ui: "icon-badge", icon: "Star" },
  { header: "Comment", accessor: "comment", ui: "desc" },
  { header: "Date", accessor: "date", ui: "text" },
  { header: "Status", accessor: "status", ui: "status" },
  { header: "", accessor: "actions", style: { width: "120px" }, className: "text-center" }
];

const orderColumns = [
  { header: "", accessor: "checkbox", style: { width: "40px" } },
  { header: "Order ID", accessor: "orderId", ui: "text" },
  { header: "Customer", accessor: "customer", ui: "text" },
  { header: "Date", accessor: "date", ui: "text" },
  { header: "Products", accessor: "products", ui: "text" },
  { header: "Amount", accessor: "amount", ui: "text" },
  { header: "Payment", accessor: "payment", ui: "badge" },
  { header: "Status", accessor: "status", ui: "status" },
  { header: "", accessor: "actions", style: { width: "50px" }, className: "text-center" }
];

const initialProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60",
    name: "W. S. I PVC Strip Curtain Roll",
    sub: "Standard clear grade 2mm x 200mm",
    sku: "AE-153625330",
    category: "Electronics",
    price: "$115.00",
    stock: 50,
    status: "Active",
    rating: 4.8,
    ratingCount: 12,
    sales: "120 sales",
    updated: "2 hours ago"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=100&auto=format&fit=crop&q=60",
    name: "Stainless Steel Hanger System",
    sub: "Quick mount bracket set",
    sku: "AE-153625331",
    category: "Home & Kitchen",
    price: "$25.00",
    stock: 120,
    status: "Active",
    rating: 4.9,
    ratingCount: 8,
    sales: "85 sales",
    updated: "Yesterday"
  }
];

const initialInventory = [
  { id: 1, name: "W. S. I PVC Strip Curtain Roll", category: "Electronics", qty: 50, location: "Warehouse A - Row 3", val: "$5,750.00", status: "In Stock" },
  { id: 2, name: "Stainless Steel Hanger System", category: "Home & Kitchen", qty: 120, location: "Warehouse B - Row 1", val: "$3,000.00", status: "In Stock" }
];

const initialReviews = [
  { id: 1, product: "W. S. I PVC Strip Curtain Roll", user: "Johnathan Doe", rating: 5, comment: "High quality material and fast delivery!", date: "03 Aug 2026", status: "Approved" },
  { id: 2, product: "Stainless Steel Hanger System", user: "Mary Smith", rating: 4, comment: "Easy to install, very durable", date: "02 Aug 2026", status: "Pending" }
];

const initialOrders = [
  { id: 1, orderId: "#ORD-9842", customer: "Rstar Industries", date: "04 Aug 2026", products: "12 items", amount: "$452.00", payment: "Paid", status: "Processing" },
  { id: 2, orderId: "#ORD-9841", customer: "Mumbai Cold Storage", date: "03 Aug 2026", products: "2 items", amount: "$112.00", payment: "Paid", status: "Shipped" }
];


const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [activeTab, setActiveTab] = useState("Product List");

  const [productsList, setProductsList] = useState(initialProducts);
  const [inventoryList, setInventoryList] = useState(initialInventory);
  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [ordersList, setOrdersList] = useState(initialOrders);

  const [tableData, setTableData] = useState([]);
  const [tableTotal, setTableTotal] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: "PVC Clear Sheet",
    slug: "pvc-clear-sheet",
    sku: "PVC-CS-030-001",
    productCode: "ASH-PVC-001",
    category: "Home & Kitchen",
    supplier: "supplierId",
    shortDesc: "Premium quality transparent PVC clear sheet for industrial applications.",
    desc: "Industrial grade transparent PVC clear sheet suitable for curtain, packaging, printing and safety applications.",
    price: 145,
    unit: "Kg",
    currency: "INR",
    stock: 850,
    reservedStock: 32,
    stockStatus: "In Stock",
    isTrending: true,
    isBestSeller: true,
    status: "Active",
    images: ["https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=100&auto=format&fit=crop&q=60"],
    specifications: [
      { name: "Brand", value: "Ashmita" },
      { name: "Material", value: "PVC" },
      { name: "Thickness", value: "0.30 mm" },
      { name: "Width", value: "54 Inch" }
    ],
    features: ["High Quality Assurance", "Industrial Standard Certified", "Reliable Performance", "Durable Construction", "Trusted Supplier", "Value For Money"],
    badges: ["Verified Supplier", "100% Original Products", "GST Invoice Available", "Easy Returns", "Secure Payments"],
    metaTitle: "PVC Clear Sheet | Buy Online | Ashmita Enterprises",
    metaDesc: "Premium quality transparent PVC clear sheet for industrial applications. Suitable for curtains, packaging, and safety applications. Buy at wholesale rates.",
    metaKeywords: "pvc clear sheet, transparent pvc sheet, soft pvc roll, industrial plastic barrier"
  });

  const handleAddNewProductSubmit = (e) => {
    e?.preventDefault();
    const newProd = {
      id: Date.now(),
      image: newProductForm.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60",
      name: newProductForm.name || "New Product",
      sub: newProductForm.shortDesc || "",
      sku: newProductForm.sku || `PROD-${Math.floor(100 + Math.random() * 900)}`,
      category: newProductForm.category || "Electronics",
      price: newProductForm.price ? `₹${newProductForm.price}.00` : "₹99.00",
      stock: newProductForm.stock ? parseInt(newProductForm.stock, 10) : 0,
      status: newProductForm.status || "Active",
      rating: 4.8,
      ratingCount: 1,
      sales: "0 sales",
      updated: "Just now"
    };
    setProductsList(prev => [newProd, ...prev]);
    setIsAddingProduct(false);
  };

  const renderAddProductForm = () => {
    const basicInfoFields = [
      { name: "name", label: "Product Name", type: "input", required: true },
      { name: "slug", label: "Slug", type: "input", required: true },
      { name: "sku", label: "SKU", type: "input", required: true },
      { name: "productCode", label: "Product Code", type: "input" },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: categoriesList.filter(c => c.name !== "All Products").map(c => ({ label: c.name, value: c.name }))
      },
      {
        name: "supplier",
        label: "Supplier",
        type: "select",
        options: [
          { label: "supplierId", value: "supplierId" },
          { label: "Vendor A", value: "vendor_a" }
        ]
      },
      { name: "shortDesc", label: "Short Description", type: "textarea", required: true, className: "col-span-2" },
      { name: "desc", label: "Description", type: "textarea", required: true, className: "col-span-2" }
    ];

    const pricingStockFieldsRow1 = [
      { name: "price", label: "Price (INR)", type: "number", required: true },
      {
        name: "unit",
        label: "Unit",
        type: "select",
        options: [
          { label: "Kg", value: "Kg" },
          { label: "Pcs", value: "Pcs" },
          { label: "Mtr", value: "Mtr" }
        ]
      },
      { name: "currency", label: "Currency", type: "input", disabled: true }
    ];

    const pricingStockFieldsRow2 = [
      { name: "stock", label: "Stock", type: "number", required: true },
      { name: "reservedStock", label: "Reserved Stock", type: "number" },
      {
        name: "stockStatus",
        label: "Stock Status",
        type: "select",
        options: [
          { label: "In Stock", value: "In Stock" },
          { label: "Out of Stock", value: "Out of Stock" }
        ]
      }
    ];

    const pricingSwitches = [
      { name: "isTrending", label: "Is Trending" },
      { name: "isBestSeller", label: "Is Best Seller" }
    ];

    const seoFields = [
      { name: "metaTitle", label: "Meta Title", type: "input", limit: 60 },
      { name: "metaDesc", label: "Meta Description", type: "textarea", limit: 160 },
      { name: "metaKeywords", label: "Meta Keywords", type: "input", limit: 160 }
    ];

    return (
      <div>
        <form onSubmit={handleAddNewProductSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

            {/* Left Column */}
            <div className="grid-cols-1 gap-12">

              {/* Card 1: Basic Information */}
              <div className="border-tertiary rounded-5 bg-white p-16">
                <h3 className="mid-text font-600 text-dark mb-16">Basic Information</h3>
                <div className="grid grid-cols-2 gap-12">
                  {basicInfoFields.map((field) => (
                    <div key={field.name} className={field.className || "col-span-1"}>
                      <Fields
                        {...field}
                        value={newProductForm[field.name]}
                        onChange={(val) => setNewProductForm(prev => ({ ...prev, [field.name]: val }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Key Features */}
              <FormBuilder
                value={newProductForm}
                onChange={setNewProductForm}
                fields={[
                  { name: "features", label: "Key Features", type: "bulk-badge", addText: "Feature" }
                ]}
                buttonClassName="hidden"
              />

              {/* Card 3: Trust Badges */}
              <FormBuilder
                value={newProductForm}
                onChange={setNewProductForm}
                fields={[
                  { name: "badges", label: "Trust Badges", type: "bulk-badge", addText: "Badge" }
                ]}
                buttonClassName="hidden"
              />
            </div>

            {/* Middle Column */}
            <div className="grid-cols-1 gap-12">
              {/* Card 4: Pricing & Stock */}
              <div className="border-tertiary rounded-5 bg-white p-16">
                <h3 className="mid-text font-600 text-dark mb-16">Pricing & Stock</h3>
                <div className="grid grid-cols-3 gap-12 mb-12">
                  {pricingStockFieldsRow1.map((field) => (
                    <Fields
                      key={field.name}
                      {...field}
                      value={newProductForm[field.name]}
                      onChange={(val) => setNewProductForm(prev => ({ ...prev, [field.name]: val }))}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-12 mb-12">
                  {pricingStockFieldsRow2.map((field) => (
                    <Fields
                      key={field.name}
                      {...field}
                      value={newProductForm[field.name]}
                      onChange={(val) => setNewProductForm(prev => ({ ...prev, [field.name]: val }))}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-12 items-center">
                  {pricingSwitches.map((sw) => (
                    <div key={sw.name} className="gap-4">
                      <span className="mini-text text-gray font-600">{sw.label}</span>
                      <Fields
                        type="switch"
                        value={newProductForm[sw.name]}
                        onChange={(val) => setNewProductForm(prev => ({ ...prev, [sw.name]: val }))}
                      />
                    </div>
                  ))}
                  <div>
                    <Fields
                      label="Status"
                      type="select"
                      value={newProductForm.status}
                      onChange={(val) => setNewProductForm(prev => ({ ...prev, status: val }))}
                      options={[
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive" }
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="gap-12 grid-cols-1">
              {/* Card 5: Product Images */}
              <FormBuilder
                value={newProductForm}
                onChange={setNewProductForm}
                fields={[
                  { name: "images", label: "Product Images", type: "bulk-image", helperText: "Max 5 images. JPG, PNG, WEBP up to 5MB" }
                ]}
                buttonClassName="hidden"
              />

              {/* Card 6: Specifications */}
              <FormBuilder
                value={newProductForm}
                onChange={setNewProductForm}
                fields={[
                  { name: "specifications", label: "Specifications", type: "bulk-inputs", addText: "Specification" }
                ]}
                buttonClassName="hidden"
              />

              {/* Card 7: SEO Information */}
              <div className="border-tertiary rounded-5 bg-white p-16">
                <h3 className="mid-text font-600 text-dark mb-16">SEO Information</h3>
                <div className="grid grid-cols-1 gap-12">
                  {seoFields.map((field) => (
                    <div key={field.name}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="mini-text text-gray font-600">{field.label}</span>
                        <span className="mini-text text-gray">
                          {(newProductForm[field.name]?.length || 0)}/{field.limit}
                        </span>
                      </div>
                      <Fields
                        type={field.type}
                        placeholder={field.label}
                        value={newProductForm[field.name]}
                        onChange={(val) => setNewProductForm(prev => ({ ...prev, [field.name]: val }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-12 mt-16 p-16 bg-white rounded-5 border border-tertiary">
            <Button
              type="button"
              version="v2"
              bg="white"
              color="gray"
              border="tertiary"
              onClick={() => setIsAddingProduct(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              version="v2"
              bg="primary"
            >
              Publish Product
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const [filterTrigger, setFilterTrigger] = useState(0);

  const [filterName, setFilterName] = useState("");
  const [filterSku, setFilterSku] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterRating, setFilterRating] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");

  const handleResetFilters = () => {
    setFilterName("");
    setFilterSku("");
    setFilterCat("All");
    setFilterStatus("All");
    setFilterMinPrice("");
    setFilterMaxPrice("");
    setFilterLocation("");
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
    if (activeTab === "Product List") {
      setProductsList(prev => prev.filter(p => p.id !== itemToDelete.id));
    } else if (activeTab === "Inventory") {
      setInventoryList(prev => prev.filter(p => p.id !== itemToDelete.id));
    } else if (activeTab === "Reviews") {
      setReviewsList(prev => prev.filter(p => p.id !== itemToDelete.id));
    } else if (activeTab === "Orders") {
      setOrdersList(prev => prev.filter(p => p.id !== itemToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleAddSubmit = (formData) => {
    if (activeTab === "Product List") {
      const newProd = {
        id: Date.now(),
        image: formData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60",
        name: formData.name || "New Product",
        sub: formData.sub || "",
        sku: formData.sku || `PROD-${Math.floor(100 + Math.random() * 900)}`,
        category: formData.category || "Electronics",
        price: formData.price ? (formData.price.startsWith("$") ? formData.price : `$${formData.price}`) : "$99.99",
        stock: formData.stock ? parseInt(formData.stock, 10) : 10,
        status: formData.status || "Active",
        rating: formData.rating ? parseFloat(formData.rating) : 5.0,
        ratingCount: 1,
        sales: formData.sales || "0 sales",
        updated: formData.updated || "Just now"
      };
      setProductsList(prev => [newProd, ...prev]);
    } else if (activeTab === "Inventory") {
      const newItem = {
        id: Date.now(),
        name: formData.name || "New Inventory Item",
        category: formData.category || "Electronics",
        qty: formData.qty ? parseInt(formData.qty, 10) : 50,
        location: formData.location || "Warehouse A",
        val: formData.val ? (formData.val.startsWith("$") ? formData.val : `$${formData.val}`) : "$500.00",
        status: formData.status || "In Stock"
      };
      setInventoryList(prev => [newItem, ...prev]);
    } else if (activeTab === "Reviews") {
      const newRev = {
        id: Date.now(),
        product: formData.product || "Product",
        user: formData.user || "Anonymous",
        rating: formData.rating ? parseFloat(formData.rating) : 5.0,
        comment: formData.comment || "Excellent!",
        date: formData.date || "Just now",
        status: formData.status || "Pending"
      };
      setReviewsList(prev => [newRev, ...prev]);
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
  };

  // Mock category options
  const categoriesList = [
    { name: "All Products", count: productsList.length, color: "#1e74db", hasFilterBadge: true },
    { name: "Electronics", count: productsList.filter(p => p.category === "Electronics").length, color: "#ef4444" },
    { name: "Fashion", count: productsList.filter(p => p.category === "Fashion").length, color: "#f97316" },
    { name: "Home & Kitchen", count: productsList.filter(p => p.category === "Home & Kitchen").length, color: "#22c55e" },
    { name: "Beauty & Personal Care", count: productsList.filter(p => p.category === "Beauty & Personal Care").length, color: "#0284c7" },
    { name: "Sports & Outdoors", count: productsList.filter(p => p.category === "Sports & Outdoors").length, color: "#2563eb" },
    { name: "Toys & Games", count: productsList.filter(p => p.category === "Toys & Games").length, color: "#a855f7" },
    { name: "Books & Stationery", count: productsList.filter(p => p.category === "Books & Stationery").length, color: "#92400e" },
    { name: "Automotive", count: productsList.filter(p => p.category === "Automotive").length, color: "#475569" },
  ];

  const getModalTitle = () => {
    switch (activeTab) {
      case "Product List":
        return "Add New Product";
      case "Inventory":
        return "Add Inventory Item";
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
      case "Inventory":
        return [
          { name: "name", label: "Product Name", type: "text", required: true, placeholder: "e.g. Wireless Headphones" },
          { name: "category", label: "Category", type: "select", options: categoriesList.filter(c => c.name !== "All Products").map(c => ({ label: c.name, value: c.name })) },
          { name: "qty", label: "Stock Quantity", type: "number", placeholder: "100" },
          { name: "location", label: "Location", type: "text", placeholder: "Warehouse A" },
          { name: "val", label: "Value ($)", type: "text", placeholder: "1,500.00" },
          { name: "status", label: "Status", type: "select", options: [{ label: "In Stock", value: "In Stock" }, { label: "Low Stock", value: "Low Stock" }, { label: "Out of Stock", value: "Out of Stock" }] }
        ];
      case "Reviews":
        return [
          { name: "product", label: "Product", type: "text", required: true, placeholder: "e.g. iPhone 15 Pro" },
          { name: "user", label: "User", type: "text", required: true, placeholder: "John Doe" },
          { name: "rating", label: "Rating", type: "number", placeholder: "5" },
          { name: "comment", label: "Comment", type: "text", placeholder: "Great product!" },
          { name: "date", label: "Date", type: "text", placeholder: "Today" },
          { name: "status", label: "Status", type: "select", options: [{ label: "Approved", value: "Approved" }, { label: "Pending", value: "Pending" }] }
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
    if (activeTab === "Inventory") cols = inventoryColumns;
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
              <Button version="v2" bg="success" color="white" className="px-6 py-2">Approve</Button>
              <Button version="v2" bg="danger" color="white" className="px-6 py-2" onClick={() => handleDeleteClick(item)}>Delete</Button>
            </div>
          ) : (
            <Button
              version="v2"
              bg="white"
              color="gray"
              colorHover="dark"
              className="p-4"
              onClick={() => handleDeleteClick(item)}
            >
              <Icon name="MoreVertical" width="16" height="16" strokeWidth="2.5" />
            </Button>
          )
        };
      }
      return col;
    });
  };

  const getHeaderSub = () => {
    switch (activeTab) {
      case "Product List":
        return `${productsList.length} products • ${new Set(productsList.map(p => p.category)).size} categories • ${productsList.filter(p => p.status === "Active").length} active • ${productsList.filter(p => p.stock === 0).length} out of stock`;
      case "Inventory":
        return `${inventoryList.length} items • ${inventoryList.filter(i => i.status === "In Stock").length} in stock • ${inventoryList.filter(i => i.status === "Low Stock").length} low stock • ${inventoryList.filter(i => i.status === "Out of Stock").length} out of stock`;
      case "Reviews":
        return `${reviewsList.length} reviews • ${reviewsList.filter(r => r.status === "Approved").length} approved • ${reviewsList.filter(r => r.status === "Pending").length} pending`;
      case "Orders":
        return `${ordersList.length} orders • ${ordersList.filter(o => o.status === "Delivered").length} delivered • ${ordersList.filter(o => o.status === "Processing").length} processing`;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (activeTab === "Analytic") {
      setTableData([]);
      setTableTotal(0);
      return;
    }
    let rawData = [];

    if (activeTab === "Product List") {
      rawData = selectedCategory === "All Products"
        ? productsList
        : productsList.filter(p => p.category === selectedCategory);

      if (filterName) rawData = rawData.filter(p => p.name.toLowerCase().includes(filterName.toLowerCase()));
      if (filterStatus !== "All") rawData = rawData.filter(p => p.status === filterStatus);
      if (filterMinPrice) {
        rawData = rawData.filter(p => {
          const val = parseFloat(p.price.replace(/[^0-9.]/g, ""));
          return !isNaN(val) && val >= parseFloat(filterMinPrice);
        });
      }
      if (filterMaxPrice) {
        rawData = rawData.filter(p => {
          const val = parseFloat(p.price.replace(/[^0-9.]/g, ""));
          return !isNaN(val) && val <= parseFloat(filterMaxPrice);
        });
      }
    } else if (activeTab === "Inventory") {
      rawData = selectedCategory === "All Products"
        ? inventoryList
        : inventoryList.filter(p => p.category === selectedCategory);

      if (filterName) rawData = rawData.filter(p => p.name.toLowerCase().includes(filterName.toLowerCase()));
      if (filterLocation) rawData = rawData.filter(p => p.location.toLowerCase().includes(filterLocation.toLowerCase()));
      if (filterStatus !== "All") rawData = rawData.filter(p => p.status === filterStatus);
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

    setTableData(paginatedData);
    setTableTotal(rawData.length);
  }, [activeTab, selectedCategory, currentPage, searchQuery, filterName, filterSku, filterCat, filterStatus, filterMinPrice, filterMaxPrice, filterLocation, filterUser, filterRating, filterPayment, productsList, inventoryList, reviewsList, ordersList, filterTrigger]);

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
    } else if (activeTab === "Inventory") {
      if (filterName) activeFilters.push(`Name: "${filterName}"`);
      if (filterLocation) activeFilters.push(`Location: "${filterLocation}"`);
      if (filterStatus !== "All") activeFilters.push(`Status: ${filterStatus}`);
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
      case "Inventory":
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
              label="LOCATION"
              type="input"
              placeholder="e.g. Aisle A-3"
              value={filterLocation}
              onChange={(val) => { setFilterLocation(val); setCurrentPage(1); }}
            />
            <Fields
              label="STATUS"
              type="select"
              value={filterStatus}
              onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
              options={[
                { label: "All Statuses", value: "All" },
                { label: "In Stock", value: "In Stock" },
                { label: "Low Stock", value: "Low Stock" },
                { label: "Out of Stock", value: "Out of Stock" }
              ]}
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

  return (
    <Structure
      sidebarTitle="Product Categories"
      sidebarItems={categoriesList}
      selectedSidebarItem={selectedCategory}
      onSidebarItemClick={(name) => { setSelectedCategory(name); setCurrentPage(1); }}
      headerIcon={<Icon name="Orders" width="22" height="22" strokeWidth="2" />}
      headerTitle={isAddingProduct ? "Add New Product" : "Products Overview"}
      headerSub={isAddingProduct ? "Fill in the details below to add a new product" : getHeaderSub()}
      quickAction={
        isAddingProduct ? (
          <div className="text-right">
            <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
            <p className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer" onClick={() => setIsAddingProduct(false)}>
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
          name: "Inventory",
          count: inventoryList.length,
          icon: <Icon name="Inventory" width="16" height="16" strokeWidth="2.5" />
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
        !!filterSku ||
        filterCat !== "All" ||
        filterStatus !== "All" ||
        !!filterMinPrice ||
        !!filterMaxPrice ||
        !!filterLocation ||
        !!filterUser ||
        filterRating !== "All" ||
        filterPayment !== "All"
      }
      onClearAllFilters={() => {
        setSelectedCategory("All Products");
        handleResetFilters();
      }}
      filterInputs={renderFilterInputs()}
      showTabControls={!isAddingProduct}
    >
      <div className="">
        {isAddingProduct ? (
          renderAddProductForm()
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