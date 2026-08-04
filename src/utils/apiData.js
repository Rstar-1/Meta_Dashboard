const menuData = [
  {
    "name": "Dashboard",
    "route": "/dashboard",
    "icon": "Dashboard",
    "status": true
  },
  {
    "name": "Analytics",
    "route": "/analytics",
    "icon": "TrendingUp",
    "status": true
  },
  {
    "name": "Management",
    "status": true,
    "category": [
      {
        "name": "Products",
        "route": "/management/product",
        "icon": "Package",
        "status": true
      },
      {
        "name": "CMS",
        "route": "/management/cms",
        "icon": "Clipboard",
        "status": true
      },
      {
        "name": "Leads",
        "route": "/management/leads",
        "icon": "UserPlus",
        "status": true
      }
    ]
  },
  {
    "name": "Builder",
    "status": true,
    "category": [
      {
        "name": "SEO Metadata",
        "route": "/builder/meta",
        "icon": "Layers",
        "status": true
      }
    ]
  },
  {
    "name": "Users & Clients",
    "status": true,
    "category": [
      {
        "name": "System Users",
        "route": "/users",
        "icon": "Users",
        "status": true
      }
    ]
  }
];

export {
  menuData
};
