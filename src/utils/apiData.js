const menuData = [
  {
    name: "Dashboard",
    route: "/dashboard",
    icon: "Dashboard",
    status: true,
  },
  {
    name: "Analytics",
    route: "/analytics",
    icon: "TrendingUp",
    status: true,
  },
  {
    name: "Category",
    status: true,
    category: [
      {
        name: "Product Category",
        route: "/management/categories",
        icon: "Layers",
        status: true,
      },
      {
        name: "Blog Category",
        route: "/management/blog-categories",
        icon: "Layers",
        status: true,
      },
    ],
  },
  {
    name: "Management",
    status: true,
    category: [
      {
        name: "Products",
        route: "/management/product",
        icon: "Box",
        status: true,
      },
      {
        name: "Blogs",
        route: "/management/blogs",
        icon: "Clipboard",
        status: true,
      },
      {
        name: "CMS",
        route: "/management/cms",
        icon: "CMS",
        status: true,
      },
      {
        name: "Leads",
        route: "/management/leads",
        icon: "UserPlus",
        status: true,
      },
      {
        name: "Orders",
        route: "/management/orders",
        icon: "Orders",
        status: true,
      },
      {
        name: "Payments",
        route: "/management/payments",
        icon: "Payments",
        status: true,
      }
    ],
  },
  {
    name: "Builder",
    status: true,
    category: [
      {
        name: "SEO Metadata",
        route: "/builder/meta",
        icon: "Meta",
        status: true,
      }
    ],
  },
  {
    name: "Users & Clients",
    status: true,
    category: [
      {
        name: "System Users",
        route: "/users",
        icon: "Users",
        status: true,
      },
      {
        name: "Roles",
        route: "/roles",
        icon: "Shield",
        status: true,
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
    name: "productsText",
    label: "Products (comma separated)",
    type: "text",
    placeholder: "e.g. Headphones, Watch",
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
    label: "Supported Methods (comma separated)",
    type: "text",
    required: true,
    placeholder: "e.g. UPI, Cards, Net Banking, COD",
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
    type: "select",
    required: true,
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
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
  defaultItems: [
    { name: "All Products", color: "#1e74db" },
  ],
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
  defaultItems: [
    { name: "All Articles", color: "#1e74db" },
  ],
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
};
