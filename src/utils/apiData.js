const menuData = [
  {
    name: "Dashboard",
    route: "/dashboard",
    icon: "Dashboard",
    status: true,
    role: ["admin", "vendor", "Manager"],
  },
  {
    name: "Analytics",
    route: "/analytics",
    icon: "TrendingUp",
    status: true,
    role: ["admin", "vendor", "Manager"],
  },
  {
    name: "Category",
    status: true,
    role: ["admin", "vendor", "Manager"],
    category: [
      {
        name: "Product",
        route: "/management/categories",
        icon: "Layers",
        status: true,
        role: ["admin", "vendor"],
      },
      {
        name: "Blog",
        route: "/management/blog-categories",
        icon: "Layers",
        status: true,
        role: ["admin", "Manager"],
      },
    ],
  },
  {
    name: "Management",
    status: true,
    role: ["admin", "vendor", "Manager"],
    category: [
      {
        name: "Products",
        route: "/management/product",
        icon: "Box",
        status: true,
        role: ["admin", "vendor"],
      },
      {
        name: "Articles",
        route: "/management/blogs",
        icon: "Clipboard",
        status: true,
        role: ["admin", "Manager"],
      },
      {
        name: "CMS",
        route: "/management/cms",
        icon: "CMS",
        status: true,
        role: ["admin", "Manager"],
      },
      {
        name: "Leads",
        route: "/management/leads",
        icon: "UserPlus",
        status: true,
        role: ["admin", "vendor"],
      },
    ],
  },
  {
    name: "Builder",
    status: true,
    role: ["admin", "vendor", "Manager"],
    category: [
      {
        name: "SEO Metadata",
        route: "/builder/meta",
        icon: "Meta",
        status: true,
        role: ["admin", "Manager"],
      },
      {
        name: "Orders",
        route: "/management/orders",
        icon: "Orders",
        status: true,
        role: ["admin", "vendor"],
      },
      {
        name: "Payments",
        route: "/management/payments",
        icon: "Payments",
        status: true,
        role: ["admin"],
      },
    ],
  },
  {
    name: "Users & Clients",
    status: true,
    role: ["admin", "vendor"],
    category: [
      {
        name: "System Users",
        route: "/users",
        icon: "Users",
        status: true,
        role: ["admin"],
      },
      {
        name: "Roles",
        route: "/roles",
        icon: "Shield",
        status: true,
        role: ["admin"],
      },
    ],
  },
];

/* ==========================================
   TABLE COLUMNS DATA
   ========================================== */

const usersTableColumns = [
  {
    header: "",
    accessor: "checkbox",
    ui: "checkbox",
    style: { width: "40px" },
  },
  {
    header: "Name",
    accessor: "name",
    ui: "profile",
    imageKey: "avatar",
    subKey: "email",
    style: { minWidth: "160px" },
  },
  {
    header: "Email",
    accessor: "email",
    ui: "text",
    style: { minWidth: "200px" },
  },
  {
    header: "Mobile",
    accessor: "mobile",
    ui: "text",
    style: { minWidth: "120px" },
  },
  {
    header: "Role",
    accessor: "role",
    ui: "badge",
    style: { minWidth: "120px" },
  },
  {
    header: "Last Active",
    accessor: "lastActive",
    ui: "text",
    style: { minWidth: "120px" },
  },
  {
    header: "Status",
    accessor: "status",
    ui: "status",
    style: { minWidth: "100px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "100px", textAlign: "right" },
  },
];

const rolesTableColumns = [
  {
    header: "Role Name",
    accessor: "name",
    ui: "text",
    style: { minWidth: "150px" },
  },
  {
    header: "Permissions",
    accessor: "permissions",
    ui: "badge-list",
    style: { minWidth: "300px" },
  },
  {
    header: "Created At",
    accessor: "createdAt",
    ui: "text",
    style: { minWidth: "150px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "100px", textAlign: "right" },
  },
];

const productsTableColumns = [
  {
    header: "",
    accessor: "checkbox",
    ui: "checkbox",
    style: { width: "40px" },
  },
  {
    header: "Product",
    accessor: "name",
    ui: "profile",
    imageKey: "image",
    subKey: "sku",
    style: { minWidth: "240px" },
  },
  {
    header: "Category",
    accessor: "category",
    ui: "text",
    style: { minWidth: "140px" },
  },
  {
    header: "Price",
    accessor: "price",
    ui: "text",
    style: { minWidth: "90px" },
  },
  {
    header: "Stock",
    accessor: "stock",
    ui: "text",
    style: { minWidth: "80px" },
  },
  {
    header: "Stock Status",
    accessor: "stockStatus",
    ui: "status",
    style: { minWidth: "120px" },
  },
  {
    header: "Active",
    accessor: "activeStatus",
    ui: "status",
    style: { minWidth: "100px" },
  },
  {
    header: "Trending",
    accessor: "trending",
    ui: "badge",
    style: { minWidth: "180px" },
  },
  {
    header: "Updated",
    accessor: "updated",
    ui: "text",
    style: { minWidth: "110px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "100px" },
  },
];

const productReviewsTableColumns = [
  {
    header: "",
    accessor: "checkbox",
    ui: "checkbox",
    style: { width: "40px" },
  },
  {
    header: "Product",
    accessor: "product",
    ui: "text",
    style: { minWidth: "160px" },
  },
  {
    header: "User",
    accessor: "user",
    ui: "text",
    style: { minWidth: "120px" },
  },
  {
    header: "Rating",
    accessor: "rating",
    ui: "icon-badge",
    icon: "Star",
    style: { minWidth: "90px" },
  },
  {
    header: "Comment",
    accessor: "comment",
    ui: "desc",
    style: { minWidth: "200px" },
  },
  {
    header: "Date",
    accessor: "date",
    ui: "text",
    style: { minWidth: "100px" },
  },
  {
    header: "Status",
    accessor: "status",
    ui: "status",
    style: { minWidth: "100px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "160px" },
  },
];

const leadsTableColumns = [
  {
    header: "",
    accessor: "checkbox",
    ui: "checkbox",
    style: { width: "40px" },
  },
  {
    header: "Enquiry ID",
    accessor: "id",
    ui: "text",
    style: { minWidth: "110px" },
  },
  {
    header: "Company/Person Name",
    accessor: "company",
    ui: "text",
    style: { minWidth: "180px" },
  },
  {
    header: "Mobile Number",
    accessor: "mobile",
    ui: "text",
    style: { minWidth: "130px" },
  },
  {
    header: "Email Address",
    accessor: "email",
    ui: "text",
    style: { minWidth: "180px" },
  },
  {
    header: "Location",
    accessor: "location",
    ui: "text",
    style: { minWidth: "140px" },
  },
  {
    header: "Enquiry",
    accessor: "enquiry",
    ui: "desc",
    style: { minWidth: "220px" },
  },
  {
    header: "Created By",
    accessor: "createdByProfile",
    ui: "profile",
    imageKey: "createdByAvatar",
    subKey: "createdBySub",
    style: { minWidth: "180px" },
  },
  {
    header: "Status",
    accessor: "status",
    ui: "status",
    style: { minWidth: "100px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "100px" },
  },
];

const ordersTableColumns = [
  {
    header: "Order ID",
    accessor: "id",
    ui: "text",
    style: { minWidth: "110px" },
  },
  {
    header: "Customer",
    accessor: "customerName",
    ui: "profile",
    imageKey: "avatar",
    subKey: "phone",
    style: { minWidth: "180px" },
  },
  {
    header: "Products",
    accessor: "products",
    ui: "text",
    style: { minWidth: "160px" },
  },
  {
    header: "Total Amount",
    accessor: "totalAmount",
    ui: "text",
    style: { minWidth: "130px" },
  },
  {
    header: "Payment Status",
    accessor: "paymentStatus",
    ui: "status",
    style: { minWidth: "120px" },
  },
  {
    header: "Payment Option",
    accessor: "paymentMethod",
    ui: "text",
    style: { minWidth: "140px" },
  },
  {
    header: "Order Status",
    accessor: "orderStatus",
    ui: "status",
    style: { minWidth: "120px" },
  },

  {
    header: "Date",
    accessor: "date",
    ui: "text",
    style: { minWidth: "150px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "120px" },
  },
];

const cmsTableColumns = [
  {
    header: "Section / Page",
    accessor: "title",
    ui: "profile",
    imageKey: "image",
    subKey: "description",
    style: { minWidth: "180px" },
  },
  {
    header: "Key / Slug",
    accessor: "slug",
    ui: "code",
    style: { minWidth: "140px" },
  },
  {
    header: "Category",
    accessor: "category",
    ui: "badge",
    style: { minWidth: "120px" },
  },
  {
    header: "Status",
    accessor: "status",
    ui: "status",
    style: { minWidth: "110px" },
  },
  {
    header: "Updated",
    accessor: "updatedDate",
    ui: "text",
    style: { minWidth: "120px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "100px", textAlign: "right" },
  },
];

const categoriesTableColumns = [
  { header: "No.", accessor: "number", ui: "text", style: { width: "60px" } },
  {
    header: "Category",
    accessor: "name",
    ui: "profile",
    imageKey: "icon",
    iconKey: "iconName",
    style: { minWidth: "200px" },
  },
  {
    header: "Slug",
    accessor: "slug",
    ui: "code",
    style: { minWidth: "100px" },
  },
  {
    header: "Description",
    accessor: "description",
    ui: "desc",
    style: { minWidth: "250px" },
  },
  {
    header: "Theme Colors",
    accessor: "accentColor",
    ui: "color-badge",
    style: { minWidth: "100px" },
  },
  {
    header: "Bg Colors",
    accessor: "bgColor",
    ui: "color-badge",
    style: { minWidth: "100px" },
  },
  {
    header: "Created By",
    accessor: "createdByProfile",
    ui: "profile",
    imageKey: "createdByAvatar",
    subKey: "createdBySub",
    style: { minWidth: "180px" },
  },
  {
    header: "Status",
    accessor: "isActive",
    ui: "status",
    style: { minWidth: "100px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "100px", textAlign: "right" },
  },
];

const blogsTableColumns = [
  { header: "#", accessor: "index", ui: "number", style: { width: "50px" } },
  {
    header: "Article Details",
    accessor: "title",
    ui: "profile",
    imageKey: "image",
    subKey: "slug",
    idKey: "customId",
    style: { minWidth: "280px" },
  },
  {
    header: "Category & Tags",
    accessor: "category",
    ui: "badge-tags",
    subKey: "tag",
    style: { minWidth: "180px" },
  },
  {
    header: "Read Time / Date",
    accessor: "readTime",
    ui: "text",
    subKey: "date",
    style: { minWidth: "150px" },
  },
  {
    header: "Reviews",
    accessor: "reviews",
    ui: "rating-count",
    style: { minWidth: "120px" },
  },
  {
    header: "Status",
    accessor: "status",
    ui: "status",
    style: { minWidth: "100px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "120px", textAlign: "right" },
  },
];

const blogReviewsTableColumns = [
  {
    header: "",
    accessor: "checkbox",
    ui: "checkbox",
    style: { width: "40px" },
  },
  {
    header: "Article",
    accessor: "articleTitle",
    ui: "text",
    style: { minWidth: "200px" },
  },
  {
    header: "User",
    accessor: "user",
    ui: "text",
    style: { minWidth: "140px" },
  },
  {
    header: "Rating",
    accessor: "rating",
    ui: "icon-badge",
    icon: "Star",
    style: { minWidth: "110px" },
  },
  {
    header: "Comment",
    accessor: "comment",
    ui: "desc",
    style: { minWidth: "220px" },
  },
  {
    header: "Date",
    accessor: "date",
    ui: "text",
    style: { minWidth: "110px" },
  },
  {
    header: "Status",
    accessor: "status",
    ui: "status",
    style: { minWidth: "110px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "160px", textAlign: "right" },
  },
];

const blogCategoriesTableColumns = [
  {
    header: "Category Name",
    accessor: "name",
    ui: "profile",
    icon: "Layers",
    subKey: "slug",
    style: { minWidth: "180px" },
  },
  {
    header: "Description",
    accessor: "description",
    ui: "desc",
    style: { minWidth: "260px" },
  },
  {
    header: "Articles",
    accessor: "count",
    ui: "badge",
    style: { minWidth: "90px" },
  },
  {
    header: "Created By",
    accessor: "createdByProfile",
    ui: "profile",
    imageKey: "createdByAvatar",
    subKey: "createdBySub",
    style: { minWidth: "180px" },
  },
  {
    header: "Status",
    accessor: "status",
    ui: "status",
    style: { minWidth: "110px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "100px", textAlign: "right" },
  },
];

const metaTableColumns = [
  {
    header: "Page",
    accessor: "pageName",
    ui: "text",
    style: { minWidth: "100px" },
  },
  {
    header: "URL Route",
    accessor: "route",
    ui: "text",
    style: { minWidth: "100px" },
  },
  {
    header: "Meta Title Tag",
    accessor: "meta.title",
    ui: "text",
    style: { minWidth: "170px" },
  },
  {
    header: "Meta Description",
    accessor: "meta.description",
    ui: "desc",
    style: { minWidth: "100px" },
  },
  {
    header: "SEO Score",
    accessor: "analytics.seoScore",
    ui: "score-pill",
    style: { minWidth: "120px" },
  },
  {
    header: "Created By",
    accessor: "createdByProfile",
    ui: "profile",
    imageKey: "createdByAvatar",
    subKey: "createdBySub",
    style: { minWidth: "180px" },
  },
  {
    header: "Status",
    accessor: "status",
    ui: "status",
    style: { minWidth: "100px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "100px" },
  },
];

const paymentsTableColumns = [
  {
    header: "Payment ID",
    accessor: "paymentId",
    ui: "text",
    style: { minWidth: "120px" },
  },
  {
    header: "Order ID",
    accessor: "orderIdText",
    ui: "text",
    style: { minWidth: "120px" },
  },
  {
    header: "Customer",
    accessor: "customerText",
    ui: "text",
    style: { minWidth: "140px" },
  },
  {
    header: "Amount",
    accessor: "amountText",
    ui: "text",
    style: { minWidth: "100px" },
  },
  {
    header: "Gateway",
    accessor: "gateway",
    ui: "text",
    style: { minWidth: "120px" },
  },
  {
    header: "Gateway Order ID",
    accessor: "gatewayOrderIdText",
    ui: "text",
    style: { minWidth: "150px" },
  },
  {
    header: "Gateway Payment ID",
    accessor: "gatewayPaymentIdText",
    ui: "text",
    style: { minWidth: "150px" },
  },
  {
    header: "Method",
    accessor: "paymentMethod",
    ui: "text",
    style: { minWidth: "120px" },
  },
  {
    header: "Status",
    accessor: "status",
    ui: "status",
    style: { minWidth: "120px" },
  },
  {
    header: "Paid At",
    accessor: "paidAtText",
    ui: "text",
    style: { minWidth: "150px" },
  },
];

const paymentIntegrationsTableColumns = [
  {
    header: "Gateway Name",
    accessor: "gatewayName",
    ui: "text",
    style: { minWidth: "150px" },
  },
  {
    header: "Provider",
    accessor: "provider",
    ui: "text",
    style: { minWidth: "120px" },
  },
  {
    header: "Supported Methods",
    accessor: "supportedMethodsText",
    ui: "text",
    style: { minWidth: "180px" },
  },
  {
    header: "Mode",
    accessor: "mode",
    ui: "text",
    style: { minWidth: "100px" },
  },
  {
    header: "Key ID",
    accessor: "keyId",
    ui: "text",
    style: { minWidth: "150px" },
  },
  {
    header: "Status",
    accessor: "status",
    ui: "status",
    style: { minWidth: "110px" },
  },
  {
    header: "Default",
    accessor: "isDefaultText",
    ui: "badge",
    style: { minWidth: "100px" },
  },
  {
    header: "Added On",
    accessor: "addedOnText",
    ui: "text",
    style: { minWidth: "130px" },
  },
  {
    header: "Actions",
    accessor: "actions",
    ui: "actions",
    style: { minWidth: "100px", textAlign: "right" },
  },
];

const seoTableColumns = metaTableColumns;
const blogCategoryTableColumns = blogCategoriesTableColumns;

const pageTableColumns = {
  users: usersTableColumns,
  roles: rolesTableColumns,
  products: productsTableColumns,
  productReviews: productReviewsTableColumns,
  leads: leadsTableColumns,
  orders: ordersTableColumns,
  payments: paymentsTableColumns,
  paymentIntegrations: paymentIntegrationsTableColumns,
  cms: cmsTableColumns,
  categories: categoriesTableColumns,
  blogs: blogsTableColumns,
  blogReviews: blogReviewsTableColumns,
  blogCategories: blogCategoriesTableColumns,
  blogCategory: blogCategoryTableColumns,
  meta: metaTableColumns,
  seo: seoTableColumns,
};

/* ==========================================
   GENERIC ADD / EDIT FORM MODAL FIELDS DATA
   ========================================== */

const usersModalFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "e.g. John Doe",
  },
  {
    name: "email",
    label: "Email Address",
    type: "text",
    required: true,
    placeholder: "e.g. john@example.com",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: [
      { label: "Administrator", value: "admin" },
      { label: "Vendor", value: "vendor" },
      { label: "User", value: "user" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
  },
];

const rolesModalFields = [
  {
    name: "name",
    type: "text",
    label: "Role Name",
    placeholder: "e.g., manager",
    validation: { required: true },
  },
  {
    name: "permissions",
    type: "bulk-badge",
    label: "Permissions",
    addText: "Permission",
    validation: { required: false },
  },
];

const productsModalFields = [
  {
    name: "image",
    label: "Image URL",
    type: "dragfile",
    placeholder: "https://images.unsplash.com/...",
  },
  {
    name: "name",
    label: "Product Name",
    type: "text",
    required: true,
    placeholder: "e.g. Wireless Headphones",
  },
  { name: "category", label: "Category", type: "select", options: [] },
  { name: "price", label: "Price ($)", type: "text", placeholder: "99.99" },
  { name: "stock", label: "Initial Stock", type: "number", placeholder: "50" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
  },
];

const productReviewsModalFields = [
  {
    name: "product",
    label: "Product",
    type: "select",
    required: true,
    options: [],
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
      { label: "★★★★★ 5", value: "5" },
    ],
  },
  {
    name: "comment",
    label: "Comment",
    type: "text",
    required: true,
    placeholder: "Share your experience...",
  },
];

const leadsModalFields = [
  {
    name: "company",
    label: "Company/Person Name",
    type: "text",
    required: true,
    placeholder: "e.g. Evergreen Plastics Ltd",
  },
  {
    name: "mobile",
    label: "Mobile Number",
    type: "text",
    required: true,
    placeholder: "e.g. +91 98765 43210",
  },
  {
    name: "email",
    label: "Email Address",
    type: "text",
    required: true,
    placeholder: "e.g. info@company.com",
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    required: true,
    placeholder: "e.g. Mumbai, Maharashtra",
  },
  {
    name: "enquiry",
    label: "Enquiry Details",
    type: "text",
    required: true,
    placeholder: "Request details...",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Pending", value: "Pending" },
      { label: "Reviewed", value: "Reviewed" },
      { label: "Approved", value: "Approved" },
    ],
  },
];

const ordersModalFields = [
  {
    name: "products",
    label: "Products",
    type: "multiselect",
    required: true,
    placeholder: "Select Products",
    options: [],
  },
  {
    name: "totalAmount",
    label: "Total Amount (₹)",
    type: "text",
    required: true,
    placeholder: "e.g. ₹ 4,599.00",
  },
  {
    name: "paymentStatus",
    label: "Payment Status",
    type: "select",
    required: true,
    options: [
      { label: "Paid", value: "Paid" },
      { label: "Pending", value: "Pending" },
      { label: "Failed", value: "Failed" },
    ],
  },
  {
    name: "paymentMethod",
    label: "Payment Option",
    type: "select",
    required: true,
    options: [
      { label: "Razorpay (Online)", value: "Razorpay" },
      { label: "UPI", value: "UPI" },
      { label: "Credit / Debit Card", value: "Card" },
      { label: "Net Banking", value: "NetBanking" },
      { label: "Cash on Delivery (COD)", value: "COD" },
    ],
  },
  {
    name: "orderStatus",
    label: "Order Status",
    type: "select",
    required: true,
    options: [
      { label: "Delivered", value: "Delivered" },
      { label: "Processing", value: "Processing" },
      { label: "Pending", value: "Pending" },
      { label: "Shipped", value: "Shipped" },
      { label: "Cancelled", value: "Cancelled" },
    ],
  },
];

const cmsModalFields = [
  {
    name: "title",
    type: "text",
    label: "Section Title",
    placeholder: "e.g., Home Hero Section",
    validation: { required: true },
  },
  {
    name: "slug",
    type: "text",
    label: "Key / Slug",
    placeholder: "e.g., home-hero (leave blank to auto-generate)",
    validation: { required: false },
  },
  {
    name: "category",
    type: "select",
    label: "Category Group",
    options: [
      { label: "Homepage", value: "Homepage" },
      { label: "Company", value: "Company" },
      { label: "Portfolio", value: "Portfolio" },
      { label: "Support", value: "Support" },
      { label: "Navigation", value: "Navigation" },
    ],
    validation: { required: true },
  },
  {
    name: "description",
    type: "textarea",
    label: "Description / Subtitle",
    placeholder: "Brief summary of what this section contains...",
    validation: { required: false },
  },
  {
    name: "image",
    type: "dragfile",
    label: "Section Preview Image URL",
    placeholder: "https://images.unsplash.com/...",
    validation: { required: false },
  },
  {
    name: "images",
    type: "bulk-image",
    label: "Gallery Images",
    helperText: "Upload or add multiple gallery images",
    validation: { required: false },
  },
  {
    name: "customFields",
    type: "bulk-inputs",
    label: "Custom Fields / CTA Configuration",
    firstInputName: "key",
    firstInputLabel: "Field Key",
    secondInputName: "value",
    secondInputLabel: "Field Value",
    addText: "Add Custom Field",
    validation: { required: false },
  },
  {
    name: "status",
    type: "select",
    label: "Publication Status",
    options: [
      { label: "Published", value: "Published" },
      { label: "Draft", value: "Draft" },
    ],
    validation: { required: true },
  },
];

const categoriesModalFields = [
  {
    name: "name",
    type: "text",
    label: "Category Name",
    placeholder: "e.g., PVC Curtain",
    validation: { required: true },
  },
  {
    name: "number",
    type: "text",
    label: "Number/Badge",
    placeholder: "e.g., 01",
    validation: { required: false },
  },
  {
    name: "slug",
    type: "text",
    label: "Slug",
    placeholder: "e.g., pvc-curtain",
    validation: { required: false },
  },
  {
    name: "icon",
    type: "dragfile",
    label: "Icon Image URL",
    placeholder: "e.g., /src/assets/icon.webp",
    validation: { required: false },
  },
  {
    name: "iconName",
    type: "text",
    label: "Lucide Icon Name",
    placeholder: "e.g., Settings",
    validation: { required: false },
  },
  {
    name: "bgColor",
    type: "color",
    label: "Background Color Hex",
    placeholder: "e.g., #e8f0fe",
    validation: { required: false },
  },
  {
    name: "accentColor",
    type: "color",
    label: "Accent Color Hex",
    placeholder: "e.g., #1f5ac0",
    validation: { required: false },
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Enter category description...",
    validation: { required: false },
  },
];

const blogsModalFields = [
  {
    name: "title",
    type: "text",
    label: "Article Title",
    placeholder: "e.g., 10 Reasons to Install PVC Strip Curtains",
    validation: { required: true },
  },
  {
    name: "category",
    type: "select",
    label: "Category",
    options: [],
    validation: { required: true },
  },
  {
    name: "tag",
    type: "text",
    label: "Tags (Comma separated)",
    placeholder: "e.g., Warehouse, Energy, Insulation",
    validation: { required: false },
  },
  {
    name: "image",
    type: "dragfile",
    label: "Featured Cover Image URL",
    placeholder: "https://images.unsplash.com/...",
    validation: { required: false },
  },
  {
    name: "summary",
    type: "textarea",
    label: "Short Excerpt / Summary",
    placeholder: "Brief summary shown on blog list cards...",
    validation: { required: false },
  },
  {
    name: "description",
    type: "textarea",
    label: "Full Article Content",
    placeholder: "Write main blog post body content...",
    validation: { required: false },
  },
  {
    name: "keywords",
    type: "text",
    label: "SEO Keywords",
    placeholder: "e.g., pvc strip curtain, freezer door, energy saving",
    validation: { required: false },
  },
  {
    name: "isActive",
    type: "select",
    label: "Publication Status",
    options: [
      { label: "Published (Active)", value: "Active" },
      { label: "Draft (Inactive)", value: "Inactive" },
    ],
    validation: { required: true },
  },
];

const blogReviewsModalFields = [
  {
    name: "blogId",
    type: "select",
    label: "Select Article to Review",
    options: [],
    validation: { required: true },
  },
  {
    name: "rating",
    type: "select",
    label: "Rating Score",
    options: [
      { label: "★ 5 - Excellent", value: "5" },
      { label: "★ 4 - Very Good", value: "4" },
      { label: "★ 3 - Average", value: "3" },
      { label: "★ 2 - Poor", value: "2" },
      { label: "★ 1 - Terrible", value: "1" },
    ],
    validation: { required: true },
  },
  {
    name: "comment",
    type: "textarea",
    label: "Review Feedback",
    placeholder: "Write reader feedback or testimonial comment...",
    validation: { required: true },
  },
];

const blogCategoriesModalFields = [
  {
    name: "name",
    type: "text",
    label: "Category Name",
    placeholder: "e.g., Industrial Trends",
    validation: { required: true },
  },
  {
    name: "slug",
    type: "text",
    label: "Slug (Auto-generated if left blank)",
    placeholder: "e.g., industrial-trends",
    validation: { required: false },
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Brief description of the blog category...",
    validation: { required: false },
  },
  {
    name: "isActive",
    type: "select",
    label: "Status",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
    validation: { required: true },
  },
];

const seoModalFields = {
  general: [
    {
      name: "pageName",
      label: "Page Name",
      type: "text",
      validation: { required: true },
      placeholder: "e.g. Products Catalog",
    },
    {
      name: "route",
      label: "URL Route",
      type: "text",
      validation: { required: true },
      placeholder: "e.g. /products",
    },
    {
      name: "priority",
      label: "Priority",
      type: "number",
      placeholder: "e.g. 1",
    },
    { name: "status", label: "Active Index", type: "switch" },
  ],
  meta: [
    {
      name: "meta_title",
      label: "Meta Title Tag",
      type: "text",
      placeholder: "Enter SEO title tag",
    },
    {
      name: "meta_description",
      label: "Meta Description",
      type: "textarea",
      placeholder: "Enter search snippet description",
    },
    {
      name: "meta_keywords",
      label: "Keywords",
      type: "bulk-badge",
      addText: "Keyword",
      padding: 0,
    },
    {
      name: "meta_author",
      label: "Author",
      type: "text",
      placeholder: "e.g. Company Name",
    },
    {
      name: "meta_canonical",
      label: "Canonical URL",
      type: "text",
      placeholder: "https://example.com",
    },
  ],
  ogTwitter: [
    {
      name: "og_title",
      label: "OG Title (Facebook)",
      type: "text",
      placeholder: "OG Title",
    },
    {
      name: "og_description",
      label: "OG Description (Facebook)",
      type: "textarea",
      placeholder: "OG Description",
    },
    {
      name: "og_image_url",
      label: "OG Image URL (Facebook)",
      type: "text",
      placeholder: "https://example.com/og.webp",
    },
    {
      name: "twitter_title",
      label: "Twitter Title",
      type: "text",
      placeholder: "Twitter Title",
    },
    {
      name: "twitter_description",
      label: "Twitter Description (Facebook)",
      type: "textarea",
      placeholder: "Twitter Description",
    },
    {
      name: "twitter_image",
      label: "Twitter Image URL",
      type: "text",
      placeholder: "https://example.com/twitter.webp",
    },
  ],
  schema: [
    {
      name: "schema_type",
      label: "Schema Type",
      type: "select",
      options: [
        { label: "WebPage", value: "WebPage" },
        { label: "Organization", value: "Organization" },
        { label: "CollectionPage", value: "CollectionPage" },
        { label: "AboutPage", value: "AboutPage" },
        { label: "Blog", value: "Blog" },
        { label: "ContactPage", value: "ContactPage" },
      ],
    },
    {
      name: "schema_name",
      label: "Schema Name",
      type: "text",
      placeholder: "e.g. Ashmita Enterprises",
    },
    {
      name: "schema_url",
      label: "Schema URL",
      type: "text",
      placeholder: "e.g. https://example.com",
    },
    {
      name: "schema_logo",
      label: "Schema Logo URL",
      type: "text",
      placeholder: "e.g. https://example.com/logo.png",
    },
  ],
};

const metaModalFields = seoModalFields;
const blogCategoryModalFields = blogCategoriesModalFields;

const paymentIntegrationsModalFields = [
  {
    name: "gatewayName",
    label: "Gateway Name",
    type: "text",
    required: true,
    placeholder: "e.g. Razorpay, Stripe",
  },
  {
    name: "provider",
    label: "Provider",
    type: "text",
    required: true,
    placeholder: "e.g. Razorpay, Stripe",
  },
  {
    name: "supportedMethods",
    label: "Supported Methods",
    type: "multiselect",
    required: true,
    options: [
      { label: "UPI", value: "UPI" },
      { label: "Cards", value: "Cards" },
      { label: "Net Banking", value: "Net Banking" },
      { label: "COD", value: "COD" },
    ],
  },
  {
    name: "mode",
    label: "Mode",
    type: "select",
    required: true,
    options: [
      { label: "Test", value: "test" },
      { label: "Live", value: "live" },
    ],
  },
  {
    name: "keyId",
    label: "Key ID",
    type: "text",
    required: true,
    placeholder: "Enter Key ID",
  },
  {
    name: "keySecret",
    label: "Key Secret",
    type: "password",
    required: true,
    placeholder: "Enter Key Secret",
  },
  {
    name: "webhookSecret",
    label: "Webhook Secret",
    type: "text",
    required: false,
    placeholder: "Enter Webhook Secret (optional)",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    name: "isDefault",
    label: "Set as Default",
    type: "switch",
    required: false,
  },
];

const pageModalFields = {
  users: usersModalFields,
  roles: rolesModalFields,
  products: productsModalFields,
  productReviews: productReviewsModalFields,
  leads: leadsModalFields,
  orders: ordersModalFields,
  paymentIntegrations: paymentIntegrationsModalFields,
  cms: cmsModalFields,
  categories: categoriesModalFields,
  blogs: blogsModalFields,
  blogReviews: blogReviewsModalFields,
  blogCategories: blogCategoriesModalFields,
  blogCategory: blogCategoryModalFields,
  meta: metaModalFields,
  seo: seoModalFields,
};

const pageFormFields = pageModalFields;

const formatCreatedBy = (createdBy, usersMap = {}, loggedInUser = null) => {
  let name = "";
  let subText = "";
  let avatar = "";

  if (createdBy && typeof createdBy === "object") {
    name = createdBy.fullname || createdBy.name || createdBy.username || createdBy.email || "";
    subText = createdBy.mobile || createdBy.phone || createdBy.email || createdBy.role || "";
    avatar = createdBy.image || createdBy.avatar || "";
  } else if (typeof createdBy === "string" && createdBy.trim()) {
    const matchedUser = usersMap[createdBy] || usersMap[createdBy.trim()];
    if (matchedUser) {
      name = matchedUser.fullname || matchedUser.name || matchedUser.username || "";
      subText = matchedUser.mobile || matchedUser.phone || matchedUser.email || matchedUser.role || "";
      avatar = matchedUser.image || matchedUser.avatar || "";
    } else if (loggedInUser && (loggedInUser._id === createdBy || loggedInUser.id === createdBy)) {
      name = loggedInUser.fullname || loggedInUser.name || "";
      subText = loggedInUser.mobile || loggedInUser.email || "";
      avatar = loggedInUser.image || loggedInUser.avatar || "";
    }
  }

  if (!name) {
    name = loggedInUser?.fullname || loggedInUser?.name || "Rakesh";
  }
  if (!subText) {
    subText = loggedInUser?.mobile || loggedInUser?.email || "8779030648";
  }
  if (!avatar) {
    avatar = loggedInUser?.image || loggedInUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80";
  }

  return {
    createdByProfile: name,
    createdByName: name,
    createdBySub: subText,
    createdByAvatar: avatar,
  };
};

export {
  menuData,
  usersTableColumns,
  rolesTableColumns,
  productsTableColumns,
  productReviewsTableColumns,
  leadsTableColumns,
  ordersTableColumns,
  cmsTableColumns,
  categoriesTableColumns,
  blogsTableColumns,
  blogReviewsTableColumns,
  blogCategoriesTableColumns,
  blogCategoryTableColumns,
  metaTableColumns,
  seoTableColumns,
  pageTableColumns,
  formatCreatedBy,

  // Add / Edit Modal Form Fields
  usersModalFields,
  rolesModalFields,
  productsModalFields,
  productReviewsModalFields,
  leadsModalFields,
  ordersModalFields,
  cmsModalFields,
  categoriesModalFields,
  blogsModalFields,
  blogReviewsModalFields,
  blogCategoriesModalFields,
  blogCategoryModalFields,
  metaModalFields,
  seoModalFields,
  pageModalFields,
  pageFormFields,
  paymentsTableColumns,
  paymentIntegrationsTableColumns,
  paymentIntegrationsModalFields,
};

/* ==========================================
   GENERIC PAGE SIDEBAR DATA CONFIGURATION
   ========================================== */

const usersSidebarData = {
  title: "Roles",
  items: [
    { name: "All Users", color: "#1e74db", role: "all" },
    { name: "Administrator", color: "#10b981", role: "admin" },
    { name: "Vendor", color: "#f59e0b", role: "vendor" },
    { name: "User", color: "#8b5cf6", role: "user" },
  ],
};

const rolesSidebarData = {
  title: "Roles Overview",
  items: [
    { name: "All Roles", color: "#1e74db", role: "all" },
    { name: "Admin", color: "#10b981", role: "admin" },
    { name: "Vendor", color: "#f59e0b", role: "vendor" },
    { name: "User", color: "#8b5cf6", role: "user" },
  ],
};

const productsSidebarData = {
  title: "Product Categories",
  defaultItems: [{ name: "All Products", color: "#1e74db" }],
};

const leadsSidebarData = {
  title: "Lead Statuses",
  items: [
    { name: "All Leads", color: "#1e74db", status: "all" },
    { name: "Pending", color: "#f59e0b", status: "Pending" },
    { name: "Reviewed", color: "#3b82f6", status: "Reviewed" },
    { name: "Approved", color: "#10b981", status: "Approved" },
  ],
};

const ordersSidebarData = {
  title: "Order Statuses",
  items: [
    { name: "All Orders", color: "#1e74db", status: "all" },
    { name: "Delivered", color: "#10b981", status: "Delivered" },
    { name: "Processing", color: "#3b82f6", status: "Processing" },
    { name: "Pending", color: "#f59e0b", status: "Pending" },
    { name: "Shipped", color: "#8b5cf6", status: "Shipped" },
    { name: "Cancelled", color: "#ef4444", status: "Cancelled" },
  ],
};

const cmsSidebarData = {
  title: "Section Groups",
  items: [
    { name: "All Sections", color: "#1e74db", category: "all" },
    { name: "Homepage", color: "#10b981", category: "Homepage" },
    { name: "Company", color: "#3b82f6", category: "Company" },
    { name: "Portfolio", color: "#8b5cf6", category: "Portfolio" },
    { name: "Support", color: "#f59e0b", category: "Support" },
    { name: "Navigation", color: "#ec4899", category: "Navigation" },
  ],
};

const categoriesSidebarData = {
  title: "Categories",
  items: [
    { name: "All Categories", color: "#1e74db", status: "all" },
    { name: "Active", color: "#10b981", status: "Active" },
    { name: "Inactive", color: "#ef4444", status: "Inactive" },
  ],
};

const blogsSidebarData = {
  title: "Categories",
  defaultItems: [{ name: "All Articles", color: "#1e74db" }],
};

const blogCategoriesSidebarData = {
  title: "Blog Navigation",
  items: [
    { name: "All Categories", color: "#1e74db", status: "all" },
    { name: "Active", color: "#10b981", status: "Active" },
    { name: "Inactive", color: "#ef4444", status: "Inactive" },
  ],
};

const metaSidebarData = {
  title: "Page Types",
  items: [
    { name: "All Pages", color: "#1e74db", category: "all" },
    { name: "Home", color: "#2563eb", category: "Home" },
    { name: "About Us", color: "#10b981", category: "About Us" },
    { name: "Blog", color: "#f59e0b", category: "Blog" },
    { name: "Product", color: "#8b5cf6", category: "Product" },
    { name: "Other", color: "#ec4899", category: "Other" },
  ],
};

const analyticsSidebarData = {
  title: "Categories",
  items: [
    { name: "Articles", color: "#8b5cf6", icon: "Clipboard" },
    { name: "Product", color: "#1e74db", icon: "Layers" },
    { name: "Order", color: "#10b981", icon: "ShoppingBag" },
    { name: "Payment", color: "#f59e0b", icon: "CreditCard" },
    { name: "Users", color: "#ec4899", icon: "Users" },
    { name: "Google Analytics", color: "#3b82f6", icon: "TrendingUp" },
    { name: "Leads", color: "#f97316", icon: "UserPlus" },
  ],
};

const analyticsDataMap = {
  Articles: {
    metrics: [
      {
        title: "Total Articles",
        value: "34",
        changeText: "8.2%",
        isPositive: true,
        chartColor: "#8b5cf6",
        chartData: [28, 30, 29, 32, 31, 33, 34],
      },
      {
        title: "Total Views",
        value: "12,450",
        changeText: "14.5%",
        isPositive: true,
        chartColor: "#8b5cf6",
        chartData: [9800, 10500, 11000, 11200, 11800, 12100, 12450],
      },
      {
        title: "Avg Read Time",
        value: "4.2m",
        changeText: "2.1%",
        isPositive: false,
        chartColor: "#8b5cf6",
        chartData: [4.5, 4.4, 4.3, 4.4, 4.3, 4.2, 4.2],
      },
      {
        title: "Shares",
        value: "845",
        changeText: "12.0%",
        isPositive: true,
        chartColor: "#8b5cf6",
        chartData: [710, 750, 740, 790, 810, 830, 845],
      },
      {
        title: "Comments",
        value: "112",
        changeText: "5.4%",
        isPositive: true,
        chartColor: "#8b5cf6",
        chartData: [95, 99, 102, 105, 108, 110, 112],
      },
    ],
    chart: {
      title: "Article Performance & Readership",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        {
          name: "Article Views",
          data: [
            1200, 1900, 1500, 2800, 3200, 4500, 4100, 5600, 6200, 5800, 7100,
            8450,
          ],
        },
        {
          name: "Shares",
          data: [80, 150, 120, 250, 310, 420, 380, 490, 580, 510, 640, 720],
        },
      ],
    },
  },
  Product: {
    metrics: [
      {
        title: "Total Products",
        value: "1,248",
        changeText: "12.5%",
        isPositive: true,
        chartColor: "#1e74db",
        chartData: [1180, 1200, 1195, 1220, 1210, 1235, 1248],
      },
      {
        title: "Active Products",
        value: "892",
        changeText: "8.3%",
        isPositive: true,
        chartColor: "#8b5cf6",
        chartData: [840, 860, 850, 880, 872, 885, 892],
      },
      {
        title: "Out of Stock",
        value: "256",
        changeText: "5.6%",
        isPositive: true,
        chartColor: "#ef4444",
        chartData: [240, 248, 252, 245, 250, 253, 256],
      },
      {
        title: "Low Stock",
        value: "100",
        changeText: "2.1%",
        isPositive: false,
        chartColor: "#f97316",
        chartData: [110, 105, 108, 104, 102, 101, 100],
      },
      {
        title: "Total Revenue",
        value: "$78,642",
        changeText: "15.2%",
        isPositive: true,
        chartColor: "#22c55e",
        chartData: [68000, 71000, 70000, 74000, 75500, 77000, 78642],
      },
    ],
    chart: {
      title: "Revenue & Sales Trends",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        {
          name: "Revenue ($)",
          data: [
            12000, 19000, 15000, 28000, 32000, 45000, 41000, 56000, 62000,
            58000, 71000, 78642,
          ],
        },
        {
          name: "Sales",
          data: [
            450, 720, 610, 890, 1100, 1450, 1320, 1780, 1950, 1820, 2100, 2450,
          ],
        },
      ],
    },
  },
  Order: {
    metrics: [
      {
        title: "Total Orders",
        value: "482",
        changeText: "18.4%",
        isPositive: true,
        chartColor: "#10b981",
        chartData: [410, 425, 430, 445, 460, 472, 482],
      },
      {
        title: "Pending Orders",
        value: "45",
        changeText: "4.2%",
        isPositive: false,
        chartColor: "#f59e0b",
        chartData: [55, 52, 50, 48, 47, 46, 45],
      },
      {
        title: "Processing Orders",
        value: "112",
        changeText: "12.3%",
        isPositive: true,
        chartColor: "#3b82f6",
        chartData: [90, 95, 98, 102, 105, 109, 112],
      },
      {
        title: "Completed Orders",
        value: "325",
        changeText: "22.1%",
        isPositive: true,
        chartColor: "#10b981",
        chartData: [265, 278, 282, 295, 308, 317, 325],
      },
      {
        title: "Avg Order Value",
        value: "$163.15",
        changeText: "5.4%",
        isPositive: true,
        chartColor: "#22c55e",
        chartData: [155, 158, 157, 160, 161, 162, 163],
      },
    ],
    chart: {
      title: "Order Fulfilment & Volume",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        {
          name: "Orders Placed",
          data: [110, 180, 140, 290, 310, 420, 390, 520, 590, 530, 680, 742],
        },
        {
          name: "Completed",
          data: [95, 160, 125, 260, 285, 390, 365, 480, 545, 490, 620, 690],
        },
      ],
    },
  },
  Payment: {
    metrics: [
      {
        title: "Total Payments",
        value: "$92,450",
        changeText: "14.2%",
        isPositive: true,
        chartColor: "#f59e0b",
        chartData: [81000, 83000, 84000, 86500, 89000, 91200, 92450],
      },
      {
        title: "Refunded",
        value: "$2,100",
        changeText: "12.5%",
        isPositive: false,
        chartColor: "#ef4444",
        chartData: [2400, 2350, 2300, 2250, 2200, 2150, 2100],
      },
      {
        title: "Failed Payments",
        value: "24",
        changeText: "8.3%",
        isPositive: false,
        chartColor: "#ef4444",
        chartData: [32, 30, 28, 27, 26, 25, 24],
      },
      {
        title: "Successful Trans",
        value: "458",
        changeText: "16.1%",
        isPositive: true,
        chartColor: "#22c55e",
        chartData: [390, 410, 415, 430, 442, 450, 458],
      },
      {
        title: "Conversion Rate",
        value: "98.5%",
        changeText: "0.8%",
        isPositive: true,
        chartColor: "#10b981",
        chartData: [97.5, 97.8, 97.9, 98.1, 98.2, 98.4, 98.5],
      },
    ],
    chart: {
      title: "Payment Gateway Performance",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        {
          name: "Success Transactions",
          data: [80, 140, 110, 240, 260, 360, 330, 450, 510, 460, 600, 660],
        },
        {
          name: "Refunds/Chargebacks",
          data: [2, 5, 3, 8, 9, 12, 10, 14, 16, 13, 18, 20],
        },
      ],
    },
  },
  Users: {
    metrics: [
      {
        title: "Total Users",
        value: "4,850",
        changeText: "11.2%",
        isPositive: true,
        chartColor: "#ec4899",
        chartData: [4300, 4400, 4480, 4590, 4680, 4750, 4850],
      },
      {
        title: "New Signups",
        value: "320",
        changeText: "15.4%",
        isPositive: true,
        chartColor: "#ec4899",
        chartData: [260, 270, 280, 295, 305, 312, 320],
      },
      {
        title: "Active Users",
        value: "1,890",
        changeText: "9.2%",
        isPositive: true,
        chartColor: "#ec4899",
        chartData: [1710, 1750, 1780, 1820, 1845, 1860, 1890],
      },
      {
        title: "Churn Rate",
        value: "1.8%",
        changeText: "0.4%",
        isPositive: false,
        chartColor: "#ef4444",
        chartData: [2.2, 2.1, 2.0, 1.9, 1.9, 1.8, 1.8],
      },
      {
        title: "Retention Rate",
        value: "98.2%",
        changeText: "0.4%",
        isPositive: true,
        chartColor: "#10b981",
        chartData: [97.8, 97.9, 98.0, 98.1, 98.1, 98.2, 98.2],
      },
    ],
    chart: {
      title: "User Growth & Engagement",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        {
          name: "New Users",
          data: [150, 210, 180, 320, 360, 480, 450, 580, 650, 590, 720, 810],
        },
        {
          name: "Daily Active (x10)",
          data: [80, 110, 95, 150, 170, 220, 205, 260, 290, 270, 315, 350],
        },
      ],
    },
  },
  "Google Analytics": {
    metrics: [
      {
        title: "Page Views",
        value: "85,450",
        changeText: "16.4%",
        isPositive: true,
        chartColor: "#3b82f6",
        chartData: [72000, 75000, 77000, 80000, 82000, 84000, 85450],
      },
      {
        title: "Sessions",
        value: "42,100",
        changeText: "12.2%",
        isPositive: true,
        chartColor: "#3b82f6",
        chartData: [36000, 38000, 39000, 40500, 41200, 41800, 42100],
      },
      {
        title: "Bounce Rate",
        value: "38.5%",
        changeText: "1.2%",
        isPositive: false,
        chartColor: "#10b981",
        chartData: [39.7, 39.4, 39.1, 38.9, 38.8, 38.6, 38.5],
      },
      {
        title: "Avg Session Dur",
        value: "2m 45s",
        changeText: "4.8%",
        isPositive: true,
        chartColor: "#3b82f6",
        chartData: [150, 155, 158, 160, 162, 163, 165],
      },
      {
        title: "Goal Conversion",
        value: "3.2%",
        changeText: "0.5%",
        isPositive: true,
        chartColor: "#22c55e",
        chartData: [2.7, 2.8, 2.9, 3.0, 3.1, 3.1, 3.2],
      },
    ],
    chart: {
      title: "Audience Activity Trends",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        {
          name: "Sessions",
          data: [
            4500, 7200, 6100, 8900, 11000, 14500, 13200, 17800, 19500, 18200,
            21000, 24500,
          ],
        },
        {
          name: "Unique Visitors",
          data: [
            3200, 5100, 4400, 6300, 7800, 10200, 9300, 12600, 13800, 12900,
            14900, 17400,
          ],
        },
      ],
    },
  },
  Leads: {
    metrics: [
      {
        title: "Total Leads",
        value: "348",
        changeText: "22.5%",
        isPositive: true,
        chartColor: "#f97316",
        chartData: [280, 290, 305, 315, 328, 335, 348],
      },
      {
        title: "New Leads",
        value: "48",
        changeText: "14.3%",
        isPositive: true,
        chartColor: "#f97316",
        chartData: [35, 38, 40, 42, 44, 46, 48],
      },
      {
        title: "Converted Leads",
        value: "112",
        changeText: "18.2%",
        isPositive: true,
        chartColor: "#10b981",
        chartData: [90, 94, 98, 102, 105, 108, 112],
      },
      {
        title: "Conversion Ratio",
        value: "32.1%",
        changeText: "2.1%",
        isPositive: true,
        chartColor: "#10b981",
        chartData: [30.0, 30.5, 31.0, 31.2, 31.5, 31.8, 32.1],
      },
      {
        title: "Response Time",
        value: "2.4h",
        changeText: "15.0%",
        isPositive: false,
        chartColor: "#22c55e",
        chartData: [2.8, 2.7, 2.6, 2.5, 2.5, 2.4, 2.4],
      },
    ],
    chart: {
      title: "Lead Capture & Conversion Status",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        {
          name: "Leads Captured",
          data: [25, 42, 36, 54, 62, 85, 78, 96, 110, 98, 118, 134],
        },
        {
          name: "Converted",
          data: [8, 14, 11, 18, 20, 28, 25, 32, 38, 31, 39, 45],
        },
      ],
    },
  },
};

const seoSidebarData = metaSidebarData;
const blogCategorySidebarData = blogCategoriesSidebarData;

const pageSidebarData = {
  users: usersSidebarData,
  roles: rolesSidebarData,
  products: productsSidebarData,
  leads: leadsSidebarData,
  orders: ordersSidebarData,
  cms: cmsSidebarData,
  categories: categoriesSidebarData,
  blogs: blogsSidebarData,
  blogCategories: blogCategoriesSidebarData,
  blogCategory: blogCategorySidebarData,
  meta: metaSidebarData,
  seo: seoSidebarData,
  analytics: analyticsSidebarData,
};

export {
  usersSidebarData,
  rolesSidebarData,
  productsSidebarData,
  leadsSidebarData,
  ordersSidebarData,
  cmsSidebarData,
  categoriesSidebarData,
  blogsSidebarData,
  blogCategoriesSidebarData,
  blogCategorySidebarData,
  metaSidebarData,
  seoSidebarData,
  pageSidebarData,
  analyticsSidebarData,
  analyticsDataMap,
};
