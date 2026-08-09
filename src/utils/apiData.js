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
      },
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

export { menuData };
