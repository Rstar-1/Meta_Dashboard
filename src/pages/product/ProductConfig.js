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

export const orderColumns = [
  { header: "", accessor: "checkbox", style: { width: "40px" } },
  { header: "Order ID", accessor: "orderId", ui: "text", style: { minWidth: "120px" } },
  { header: "Customer", accessor: "customer", ui: "text", style: { minWidth: "160px" } },
  { header: "Date", accessor: "date", ui: "text", style: { minWidth: "110px" } },
  { header: "Products", accessor: "products", ui: "text", style: { minWidth: "120px" } },
  { header: "Amount", accessor: "amount", ui: "text", style: { minWidth: "100px" } },
  { header: "Payment", accessor: "payment", ui: "badge", style: { minWidth: "110px" } },
  { header: "Status", accessor: "status", ui: "status", style: { minWidth: "120px" } },
  { header: "Actions", accessor: "actions", style: { minWidth: "100px" } }
];

export const initialOrders = [
  { id: 1, orderId: "#ORD-9842", customer: "Rstar Industries", date: "04 Aug 2026", products: "12 items", amount: "$452.00", payment: "Paid", status: "Processing" },
  { id: 2, orderId: "#ORD-9841", customer: "Mumbai Cold Storage", date: "03 Aug 2026", products: "2 items", amount: "$112.00", payment: "Paid", status: "Shipped" }
];
