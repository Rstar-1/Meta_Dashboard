export const productColumns = [
  { header: "", accessor: "checkbox", style: { width: "40px" } },
  { header: "Product", accessor: "name", ui: "profile", imageKey: "image", subKey: "sku", style: { minWidth: "240px" } },
  { header: "Category", accessor: "category", ui: "text", style: { minWidth: "140px" } },
  { header: "Price", accessor: "price", ui: "text", style: { minWidth: "90px" } },
  { header: "Stock", accessor: "stock", ui: "text", style: { minWidth: "80px" } },
  { header: "Stock Status", accessor: "stockStatus", ui: "status", style: { minWidth: "120px" } },
  { header: "Active", accessor: "activeStatus", ui: "status", style: { minWidth: "100px" } },
  { header: "Trending", accessor: "trending", ui: "badge", style: { minWidth: "180px" } },
  { header: "Updated", accessor: "updated", ui: "text", style: { minWidth: "110px" } },
  { header: "Actions", accessor: "actions", style: { minWidth: "100px" } }
];

export const reviewColumns = [
  { header: "", accessor: "checkbox", style: { width: "40px" } },
  { header: "Product", accessor: "product", ui: "text", style: { minWidth: "160px" } },
  { header: "User", accessor: "user", ui: "text", style: { minWidth: "120px" } },
  { header: "Rating", accessor: "rating", ui: "icon-badge", icon: "Star", style: { minWidth: "90px" } },
  { header: "Comment", accessor: "comment", ui: "desc", style: { minWidth: "200px" } },
  { header: "Date", accessor: "date", ui: "text", style: { minWidth: "100px" } },
  { header: "Status", accessor: "status", ui: "status", style: { minWidth: "100px" } },
  { header: "Actions", accessor: "actions", style: { minWidth: "160px" } }
];


