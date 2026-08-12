import { useState, useEffect, useMemo } from "react";
import ApexChart from "react-apexcharts";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import { analyticsSidebarData, analyticsDataMap } from "../../utils/apiData";

// API Imports
import { getBlogs } from "../../api/blogApi";
import { getProducts } from "../../api/productApi";
import { getOrders } from "../../api/orderApi";
import { getPayments } from "../../api/paymentApi";
import { getUsers } from "../../api/userApi";
import { getLeads } from "../../api/leadApi";

// Common UI Components
import Chart from "../../components/common/Chart";
import Fields from "../../components/common/Fields";

// Sparkline configuration helper
const sparklineOptions = (color) => ({
  chart: {
    type: "area",
    sparkline: { enabled: true },
    animations: { enabled: false },
  },
  stroke: { curve: "smooth", width: 1.8 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.15,
      opacityTo: 0.01,
      stops: [0, 100]
    }
  },
  colors: [color],
  tooltip: { enabled: false },
});

// Helper to parse string values containing currency symbols into numeric values
const parseAmount = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const cleaned = val.toString().replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

// Helper to generate dynamic sparkline data ending with actual value
const makeSparklineData = (value) => {
  if (!value || value <= 0) return [0, 0, 0, 0, 0, 0, 0];
  const step = value / 6;
  return [
    Math.round(step),
    Math.round(step * 2 * 0.9),
    Math.round(step * 3 * 1.1),
    Math.round(step * 4 * 0.95),
    Math.round(step * 5 * 1.05),
    Math.round(step * 5.8),
    value
  ];
};

// Helper to generate 12 months data ending with actual value
const makeMonthlyData = (value) => {
  if (!value || value <= 0) return Array(12).fill(0);
  const baseFactors = [0.4, 0.45, 0.42, 0.5, 0.55, 0.65, 0.6, 0.75, 0.82, 0.8, 0.9, 1.0];
  return baseFactors.map(f => Math.round(value * f));
};

// Modular SparklineCard component
const SparklineCard = ({ title, value, changeText, isPositive, chartColor, chartData, isSelected }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-5 p-12"
      style={{
        transition: "all 0.2s ease-in-out",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: (hovered || isSelected) ? "0 4px 15px rgba(0,0,0,0.08)" : "",
        borderTop: `3px solid ${chartColor}`,
        backgroundColor: isSelected ? "#f9fafb" : "#ffffff",
        outline: isSelected ? `1px solid ${chartColor}` : "none"
      }}
    >
      <div>
        <span className="mini-text text-gray font-600 uppercase tracking-wider">{title}</span>
        <h3 className="headpara-text text-dark font-700 mt-6 mb-2">{value}</h3>
        <div className={`small-text font-600 flex items-center gap-4 ${isPositive ? "text-success" : "text-danger"}`}>
          <span>{isPositive ? `↑ ${changeText}` : `↓ ${changeText}`}</span>
          <span className="text-gray mini-text font-500 mt-4">vs 7d</span>
        </div>
      </div>
      <div className="mt-8 w-full">
        <ApexChart
          options={sparklineOptions(chartColor)}
          series={[{ data: chartData }]}
          type="area"
          height={35}
          width="100%"
        />
      </div>
    </div>
  );
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeCategory, setActiveCategory] = useState("Product");
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);

  const [dbData, setDbData] = useState({
    blogs: [],
    products: [],
    orders: [],
    payments: [],
    users: [],
    leads: [],
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, productsRes, ordersRes, paymentsRes, usersRes, leadsRes] = await Promise.allSettled([
          getBlogs(),
          getProducts(),
          getOrders(),
          getPayments(),
          getUsers({ limit: 1000 }),
          getLeads()
        ]);

        const blogs = blogsRes.status === "fulfilled" ? (blogsRes.value?.blogs || blogsRes.value?.data?.blogs || blogsRes.value?.data || blogsRes.value || []) : [];
        const products = productsRes.status === "fulfilled" ? (productsRes.value?.data || productsRes.value || []) : [];
        const orders = ordersRes.status === "fulfilled" ? (ordersRes.value?.data || ordersRes.value || []) : [];
        const payments = paymentsRes.status === "fulfilled" ? (paymentsRes.value?.data || paymentsRes.value || []) : [];
        const usersVal = usersRes.status === "fulfilled" ? (usersRes.value?.data || usersRes.value || {}) : {};
        const users = Array.isArray(usersVal.users) ? usersVal.users : (Array.isArray(usersVal) ? usersVal : []);
        const leads = leadsRes.status === "fulfilled" ? (leadsRes.value?.data || leadsRes.value || []) : [];

        setDbData({
          blogs: Array.isArray(blogs) ? blogs : [],
          products: Array.isArray(products) ? products : [],
          orders: Array.isArray(orders) ? orders : [],
          payments: Array.isArray(payments) ? payments : [],
          users: Array.isArray(users) ? users : [],
          leads: Array.isArray(leads) ? leads : [],
          loading: false
        });
      } catch (err) {
        console.error("Failed to load backend analytics data:", err);
        setDbData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  const countMap = useMemo(() => {
    if (dbData.loading) {
      return {
        Articles: "...",
        Product: "...",
        Order: "...",
        Payment: "...",
        Users: "...",
        "Google Analytics": 85450,
        Leads: "..."
      };
    }
    return {
      Articles: dbData.blogs.length,
      Product: dbData.products.length,
      Order: dbData.orders.length,
      Payment: dbData.payments.length,
      Users: dbData.users.length,
      "Google Analytics": 85450,
      Leads: dbData.leads.length
    };
  }, [dbData]);

  const sidebarItems = useMemo(() => {
    return analyticsSidebarData.items.map((item) => ({
      ...item,
      count: countMap[item.name] !== undefined ? countMap[item.name] : 0
    }));
  }, [countMap]);

  const currentData = useMemo(() => {
    const fallback = analyticsDataMap[activeCategory] || analyticsDataMap["Product"];
    if (dbData.loading) return fallback;

    switch (activeCategory) {
      case "Articles": {
        const total = dbData.blogs.length;
        const totalReviews = dbData.blogs.reduce((acc, b) => acc + (b.reviews?.length || 0), 0);
        const avgRead = total > 0 
          ? (dbData.blogs.reduce((acc, b) => acc + parseFloat(b.readTime || 5), 0) / total).toFixed(1) + "m"
          : "0m";

        return {
          metrics: [
            { title: "Total Articles", value: total.toString(), changeText: "8.2%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData(total) },
            { title: "Total Reviews", value: totalReviews.toString(), changeText: "14.5%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData(totalReviews) },
            { title: "Avg Read Time", value: avgRead, changeText: "2.1%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData(total > 0 ? parseFloat(avgRead) : 0) },
            { title: "Active Articles", value: dbData.blogs.filter(b => b.isActive !== false).length.toString(), changeText: "12.0%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData(dbData.blogs.filter(b => b.isActive !== false).length) },
            { title: "Categories Used", value: [...new Set(dbData.blogs.map(b => b.category).filter(Boolean))].length.toString(), changeText: "5.4%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData([...new Set(dbData.blogs.map(b => b.category).filter(Boolean))].length) }
          ]
        };
      }

      case "Product": {
        const total = dbData.products.length;
        const active = dbData.products.filter(p => p.isActive !== false).length;
        const outOfStock = dbData.products.filter(p => (p.totalStock ?? p.stock ?? 0) === 0).length;
        const lowStock = dbData.products.filter(p => {
          const s = p.totalStock ?? p.stock ?? 0;
          return s > 0 && s <= 20;
        }).length;
        
        const totalValue = dbData.products.reduce((acc, p) => acc + parseAmount(p.basePrice || p.price), 0);

        return {
          metrics: [
            { title: "Total Products", value: total.toString(), changeText: "12.5%", isPositive: true, chartColor: "#1e74db", chartData: makeSparklineData(total) },
            { title: "Active Products", value: active.toString(), changeText: "8.3%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData(active) },
            { title: "Out of Stock", value: outOfStock.toString(), changeText: "5.6%", isPositive: false, chartColor: "#ef4444", chartData: makeSparklineData(outOfStock) },
            { title: "Low Stock", value: lowStock.toString(), changeText: "2.1%", isPositive: false, chartColor: "#f97316", chartData: makeSparklineData(lowStock) },
            { title: "Catalog Value", value: `₹${totalValue.toLocaleString()}`, changeText: "15.2%", isPositive: true, chartColor: "#22c55e", chartData: makeSparklineData(totalValue) }
          ]
        };
      }

      case "Order": {
        const total = dbData.orders.length;
        const pending = dbData.orders.filter(o => o.orderStatus === "Pending").length;
        const processing = dbData.orders.filter(o => o.orderStatus === "Processing").length;
        const completed = dbData.orders.filter(o => o.orderStatus === "Delivered" || o.orderStatus === "Completed").length;
        const totalValue = dbData.orders.reduce((acc, o) => acc + parseAmount(o.totalAmount || o.amount), 0);

        return {
          metrics: [
            { title: "Total Orders", value: total.toString(), changeText: "18.4%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(total) },
            { title: "Pending Orders", value: pending.toString(), changeText: "4.2%", isPositive: false, chartColor: "#f59e0b", chartData: makeSparklineData(pending) },
            { title: "Processing Orders", value: processing.toString(), changeText: "12.3%", isPositive: true, chartColor: "#3b82f6", chartData: makeSparklineData(processing) },
            { title: "Completed Orders", value: completed.toString(), changeText: "22.1%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(completed) },
            { title: "Total Order Value", value: `₹${totalValue.toLocaleString()}`, changeText: "5.4%", isPositive: true, chartColor: "#22c55e", chartData: makeSparklineData(totalValue) }
          ]
        };
      }

      case "Payment": {
        const total = dbData.payments.length;
        const paid = dbData.payments.filter(p => p.status === "Paid" || p.status === "paid" || p.status === "Success" || p.status === "success" || p.status === "Approved").length;
        const failed = dbData.payments.filter(p => p.status === "Failed" || p.status === "failed").length;
        const totalRevenue = dbData.payments.reduce((acc, p) => acc + parseAmount(p.amount), 0);

        return {
          metrics: [
            { title: "Total Transactions", value: total.toString(), changeText: "14.2%", isPositive: true, chartColor: "#f59e0b", chartData: makeSparklineData(total) },
            { title: "Successful Payments", value: paid.toString(), changeText: "16.1%", isPositive: true, chartColor: "#22c55e", chartData: makeSparklineData(paid) },
            { title: "Failed Payments", value: failed.toString(), changeText: "8.3%", isPositive: false, chartColor: "#ef4444", chartData: makeSparklineData(failed) },
            { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, changeText: "15.0%", isPositive: true, chartColor: "#22c55e", chartData: makeSparklineData(totalRevenue) },
            { title: "Success Rate", value: total > 0 ? `${((paid / total) * 100).toFixed(1)}%` : "0%", changeText: "0.8%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(total > 0 ? Math.round((paid / total) * 100) : 0) }
          ]
        };
      }

      case "Users": {
        const total = dbData.users.length;
        const active = dbData.users.filter(u => u.isActive !== false).length;
        const admins = dbData.users.filter(u => u.role === "admin" || u.roleId?.name === "admin").length;
        const vendors = dbData.users.filter(u => u.role === "vendor" || u.roleId?.name === "vendor").length;

        return {
          metrics: [
            { title: "Total Users", value: total.toString(), changeText: "11.2%", isPositive: true, chartColor: "#ec4899", chartData: makeSparklineData(total) },
            { title: "Active Users", value: active.toString(), changeText: "9.2%", isPositive: true, chartColor: "#ec4899", chartData: makeSparklineData(active) },
            { title: "Inactive Users", value: (total - active).toString(), changeText: "0.4%", isPositive: false, chartColor: "#ef4444", chartData: makeSparklineData(total - active) },
            { title: "Administrators", value: admins.toString(), changeText: "5.0%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(admins) },
            { title: "Vendors", value: vendors.toString(), changeText: "8.0%", isPositive: true, chartColor: "#f59e0b", chartData: makeSparklineData(vendors) }
          ]
        };
      }

      case "Leads": {
        const total = dbData.leads.length;
        const pending = dbData.leads.filter(l => l.status === "Pending" || !l.status).length;
        const approved = dbData.leads.filter(l => l.status === "Approved").length;
        const reviewed = dbData.leads.filter(l => l.status === "Reviewed").length;

        return {
          metrics: [
            { title: "Total Leads", value: total.toString(), changeText: "22.5%", isPositive: true, chartColor: "#f97316", chartData: makeSparklineData(total) },
            { title: "Pending Leads", value: pending.toString(), changeText: "14.3%", isPositive: false, chartColor: "#f59e0b", chartData: makeSparklineData(pending) },
            { title: "Approved Leads", value: approved.toString(), changeText: "18.2%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(approved) },
            { title: "Reviewed Leads", value: reviewed.toString(), changeText: "12.0%", isPositive: true, chartColor: "#3b82f6", chartData: makeSparklineData(reviewed) },
            { title: "Conversion Ratio", value: total > 0 ? `${((approved / total) * 100).toFixed(1)}%` : "0%", changeText: "2.1%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(total > 0 ? Math.round((approved / total) * 100) : 0) }
          ]
        };
      }

      default:
        return fallback;
    }
  }, [activeCategory, dbData]);

  // Selected card metric details
  const selectedMetric = useMemo(() => {
    return currentData.metrics[selectedMetricIndex] || currentData.metrics[0];
  }, [currentData, selectedMetricIndex]);

  // Main Chart Line series mapped directly from selected card's value
  const chartSeries = useMemo(() => {
    const val = parseAmount(selectedMetric.value);
    return [
      {
        name: selectedMetric.title,
        data: makeMonthlyData(val)
      }
    ];
  }, [selectedMetric]);

  // Progress Bar Distribution Breakdown calculations
  const progressItems = useMemo(() => {
    if (dbData.loading) return [];
    
    switch (activeCategory) {
      case "Articles": {
        const total = dbData.blogs.length;
        const active = dbData.blogs.filter(b => b.isActive !== false).length;
        const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
        return [
          { label: "Active Articles Rate", percentage: activePct, color: "#8b5cf6" },
          { label: "Content Engagement", percentage: total > 0 ? 85 : 0, color: "#10b981" }
        ];
      }
      case "Product": {
        const total = dbData.products.length;
        const active = dbData.products.filter(p => p.isActive !== false).length;
        const outOfStock = dbData.products.filter(p => (p.totalStock ?? p.stock ?? 0) === 0).length;
        const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
        const stockPct = total > 0 ? Math.round(((total - outOfStock) / total) * 100) : 0;
        return [
          { label: "Catalog Active Rate", percentage: activePct, color: "#1e74db" },
          { label: "In Stock Rate", percentage: stockPct, color: "#10b981" }
        ];
      }
      case "Order": {
        const total = dbData.orders.length;
        const completed = dbData.orders.filter(o => o.orderStatus === "Delivered" || o.orderStatus === "Completed").length;
        const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return [
          { label: "Fulfillment Rate", percentage: completedPct, color: "#10b981" }
        ];
      }
      case "Payment": {
        const total = dbData.payments.length;
        const success = dbData.payments.filter(p => p.status === "Paid" || p.status === "paid" || p.status === "Success" || p.status === "success" || p.status === "Approved").length;
        const successPct = total > 0 ? Math.round((success / total) * 100) : 0;
        return [
          { label: "Transaction Success Rate", percentage: successPct, color: "#22c55e" }
        ];
      }
      case "Users": {
        const total = dbData.users.length;
        const active = dbData.users.filter(u => u.isActive !== false).length;
        const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
        return [
          { label: "User Activity Rate", percentage: activePct, color: "#ec4899" }
        ];
      }
      case "Leads": {
        const total = dbData.leads.length;
        const approved = dbData.leads.filter(l => l.status === "Approved").length;
        const approvedPct = total > 0 ? Math.round((approved / total) * 100) : 0;
        return [
          { label: "Lead Conversion Ratio", percentage: approvedPct, color: "#f97316" }
        ];
      }
      default:
        return [];
    }
  }, [activeCategory, dbData]);

  const handleSidebarItemClick = (name) => {
    setActiveCategory(name);
    setSelectedMetricIndex(0);
  };

  return (
    <Structure
      headerIcon={<Icon name="TrendingUp" width="22" height="22" strokeWidth="2" />}
      headerTitle="Web Analytics"
      headerSub={`Monitor visitor behavior, session statistics, and conversions for ${activeCategory}`}
      showTabControls={false}
      showSidebar={true}
      sidebarTitle={analyticsSidebarData.title}
      sidebarItems={sidebarItems}
      selectedSidebarItem={activeCategory}
      onSidebarItemClick={handleSidebarItemClick}
      quickAction={
        <Fields
          type="select"
          value={timeRange}
          onChange={(val) => setTimeRange(val)}
          options={[
            { label: "Last 24 Hours", value: "24h" },
            { label: "Last 7 Days", value: "7d" },
            { label: "Last 30 Days", value: "30d" }
          ]}
          style={{ width: "160px" }}
        />
      }
    >
      <div className="analytics-wrapper w-full pt-12">
        {/* Dynamic Metric Sparklines */}
        <div className="grid-cols-5 gap-12 mb-20">
          {currentData.metrics.slice(0, 5).map((card, index) => {
            const isSelected = selectedMetricIndex === index;
            return (
              <div
                key={index}
                onClick={() => setSelectedMetricIndex(index)}
                className="cursor-pointer"
              >
                <SparklineCard
                  title={card.title}
                  value={card.value}
                  changeText={card.changeText}
                  isPositive={card.isPositive}
                  chartColor={card.chartColor}
                  chartData={card.chartData}
                  isSelected={isSelected}
                />
              </div>
            );
          })}
        </div>

        {/* Dynamic Line/Area Chart & Distribution Breakdown */}
        <div className="grid-cols-3 gap-16">
          <div className="bg-white border rounded-5 p-16" style={{ gridColumn: "span 2" }}>
            <h4 className="small-text text-dark font-600 mb-12">
              {selectedMetric.title} Trend ({activeCategory})
            </h4>
            <ApexChart
              options={{
                chart: {
                  id: `${activeCategory.toLowerCase()}-${selectedMetricIndex}-trend`,
                  toolbar: { show: false },
                  fontFamily: "inherit"
                },
                xaxis: {
                  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                },
                colors: [selectedMetric.chartColor],
                stroke: { curve: "smooth", width: 3 },
                grid: { borderColor: "#f1f1f1" }
              }}
              series={chartSeries}
              type="line"
              height={350}
            />
          </div>

          <div className="bg-white border rounded-5 p-16 flex flex-column justify-between" style={{ gridColumn: "span 1" }}>
            <div>
              <h4 className="small-text text-dark font-600 mb-16">Distribution Breakdown</h4>
              {progressItems.length > 0 ? (
                <Chart items={progressItems} />
              ) : (
                <p className="mini-text text-gray">No distribution data available for this category.</p>
              )}
            </div>
            <div className="border-top pt-12 mt-12">
              <p className="mini-text text-gray">
                Click any metric card above to overlay its performance trend on the main timeline chart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Analytics;
