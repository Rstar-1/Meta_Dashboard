import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import ApexChart from "react-apexcharts";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";
import { analyticsSidebarData, analyticsDataMap } from "../../utils/apiData";

// API Imports
import {
  getArticlesAnalytics,
  getProductsAnalytics,
  getOrdersAnalytics,
  getPaymentsAnalytics,
  getUsersAnalytics,
  getLeadsAnalytics
} from "../../api/analyticsApi";

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
  const { token } = useSelector((state) => state.auth) || {};
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: ""
  });
  const [activeCategory, setActiveCategory] = useState("Product");
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);

  const [dbData, setDbData] = useState({
    Articles: null,
    Product: null,
    Order: null,
    Payment: null,
    Users: null,
    Leads: null,
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      setDbData(prev => ({ ...prev, loading: true }));
      try {
        const params = {};
        if (dateRange.fromDate && dateRange.toDate) {
          params.startDate = dateRange.fromDate;
          params.endDate = dateRange.toDate;
        } else {
          params.period = "7d";
        }

        const promises = [
          token ? getArticlesAnalytics(params) : Promise.resolve(null),
          getProductsAnalytics(params),
          token ? getOrdersAnalytics(params) : Promise.resolve(null),
          token ? getPaymentsAnalytics(params) : Promise.resolve(null),
          token ? getUsersAnalytics(params) : Promise.resolve(null),
          token ? getLeadsAnalytics(params) : Promise.resolve(null)
        ];

        const [articlesRes, productsRes, ordersRes, paymentsRes, usersRes, leadsRes] = await Promise.allSettled(promises);

        setDbData({
          Articles: articlesRes.status === "fulfilled" ? articlesRes.value : null,
          Product: productsRes.status === "fulfilled" ? productsRes.value : null,
          Order: ordersRes.status === "fulfilled" ? ordersRes.value : null,
          Payment: paymentsRes.status === "fulfilled" ? paymentsRes.value : null,
          Users: usersRes.status === "fulfilled" ? usersRes.value : null,
          Leads: leadsRes.status === "fulfilled" ? leadsRes.value : null,
          loading: false
        });
      } catch (err) {
        console.error("Failed to load analytics data:", err);
        setDbData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [token, dateRange]);

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
      Articles: dbData.Articles?.totalArticles ?? 0,
      Product: dbData.Product?.totalProducts ?? 0,
      Order: dbData.Order?.totalOrders ?? 0,
      Payment: dbData.Payment?.totalTransactions ?? 0,
      Users: dbData.Users?.totalUsers ?? 0,
      "Google Analytics": 85450,
      Leads: dbData.Leads?.totalLeads ?? 0
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

    const data = dbData[activeCategory];
    if (!data) return fallback;

    const trendValues = (data.trend && data.trend.length > 0) ? data.trend.map(t => t.value) : [];

    switch (activeCategory) {
      case "Articles": {
        const total = data.totalArticles ?? 0;
        return {
          metrics: [
            { title: "Total Articles", value: total.toString(), changeText: "8.2%", isPositive: true, chartColor: "#8b5cf6", chartData: trendValues.length > 0 ? trendValues : makeSparklineData(total) },
            { title: "Total Reviews", value: (data.totalReviews ?? 0).toString(), changeText: "14.5%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData(data.totalReviews) },
            { title: "Avg Read Time", value: `${data.avgReadTime ?? 0}m`, changeText: "2.1%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData(data.avgReadTime) },
            { title: "Active Articles", value: (data.activeArticles ?? 0).toString(), changeText: "12.0%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData(data.activeArticles) },
            { title: "Categories Used", value: (data.categoriesUsed ?? 0).toString(), changeText: "5.4%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData(data.categoriesUsed) }
          ]
        };
      }

      case "Product": {
        const total = data.totalProducts ?? 0;
        return {
          metrics: [
            { title: "Total Products", value: total.toString(), changeText: "12.5%", isPositive: true, chartColor: "#1e74db", chartData: trendValues.length > 0 ? trendValues : makeSparklineData(total) },
            { title: "Active Products", value: (data.activeProducts ?? 0).toString(), changeText: "8.3%", isPositive: true, chartColor: "#8b5cf6", chartData: makeSparklineData(data.activeProducts) },
            { title: "Out of Stock", value: (data.outOfStock ?? 0).toString(), changeText: "5.6%", isPositive: false, chartColor: "#ef4444", chartData: makeSparklineData(data.outOfStock) },
            { title: "Low Stock", value: (data.lowStock ?? 0).toString(), changeText: "2.1%", isPositive: false, chartColor: "#f97316", chartData: makeSparklineData(data.lowStock) },
            { title: "Catalog Value", value: `₹${(data.catalogValue ?? 0).toLocaleString()}`, changeText: "15.2%", isPositive: true, chartColor: "#22c55e", chartData: makeSparklineData(data.catalogValue) }
          ]
        };
      }

      case "Order": {
        const total = data.totalOrders ?? 0;
        return {
          metrics: [
            { title: "Total Orders", value: total.toString(), changeText: "18.4%", isPositive: true, chartColor: "#10b981", chartData: trendValues.length > 0 ? trendValues : makeSparklineData(total) },
            { title: "Pending Orders", value: (data.pendingOrders ?? 0).toString(), changeText: "4.2%", isPositive: false, chartColor: "#f59e0b", chartData: makeSparklineData(data.pendingOrders) },
            { title: "Processing Orders", value: (data.processingOrders ?? 0).toString(), changeText: "12.3%", isPositive: true, chartColor: "#3b82f6", chartData: makeSparklineData(data.processingOrders) },
            { title: "Completed Orders", value: (data.completedOrders ?? 0).toString(), changeText: "22.1%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(data.completedOrders) },
            { title: "Total Order Value", value: `₹${(data.totalOrderValue ?? 0).toLocaleString()}`, changeText: "5.4%", isPositive: true, chartColor: "#22c55e", chartData: makeSparklineData(data.totalOrderValue) }
          ]
        };
      }

      case "Payment": {
        const total = data.totalTransactions ?? 0;
        return {
          metrics: [
            { title: "Total Transactions", value: total.toString(), changeText: "14.2%", isPositive: true, chartColor: "#f59e0b", chartData: trendValues.length > 0 ? trendValues : makeSparklineData(total) },
            { title: "Successful Payments", value: (data.successfulPayments ?? 0).toString(), changeText: "16.1%", isPositive: true, chartColor: "#22c55e", chartData: makeSparklineData(data.successfulPayments) },
            { title: "Failed Payments", value: (data.failedPayments ?? 0).toString(), changeText: "8.3%", isPositive: false, chartColor: "#ef4444", chartData: makeSparklineData(data.failedPayments) },
            { title: "Total Revenue", value: `₹${(data.totalRevenue ?? 0).toLocaleString()}`, changeText: "15.0%", isPositive: true, chartColor: "#22c55e", chartData: makeSparklineData(data.totalRevenue) },
            { title: "Success Rate", value: `${data.successRate ?? 0}%`, changeText: "0.8%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(data.successRate) }
          ]
        };
      }

      case "Users": {
        const total = data.totalUsers ?? 0;
        return {
          metrics: [
            { title: "Total Users", value: total.toString(), changeText: "11.2%", isPositive: true, chartColor: "#ec4899", chartData: trendValues.length > 0 ? trendValues : makeSparklineData(total) },
            { title: "Active Users", value: (data.activeUsers ?? 0).toString(), changeText: "9.2%", isPositive: true, chartColor: "#ec4899", chartData: makeSparklineData(data.activeUsers) },
            { title: "Inactive Users", value: (data.inactiveUsers ?? 0).toString(), changeText: "0.4%", isPositive: false, chartColor: "#ef4444", chartData: makeSparklineData(data.inactiveUsers) },
            { title: "Administrators", value: (data.administrators ?? 0).toString(), changeText: "5.0%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(data.administrators) },
            { title: "Vendors", value: (data.vendors ?? 0).toString(), changeText: "8.0%", isPositive: true, chartColor: "#f59e0b", chartData: makeSparklineData(data.vendors) }
          ]
        };
      }

      case "Leads": {
        const total = data.totalLeads ?? 0;
        return {
          metrics: [
            { title: "Total Leads", value: total.toString(), changeText: "22.5%", isPositive: true, chartColor: "#f97316", chartData: trendValues.length > 0 ? trendValues : makeSparklineData(total) },
            { title: "Pending Leads", value: (data.pendingLeads ?? 0).toString(), changeText: "14.3%", isPositive: false, chartColor: "#f59e0b", chartData: makeSparklineData(data.pendingLeads) },
            { title: "Approved Leads", value: (data.approvedLeads ?? 0).toString(), changeText: "18.2%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(data.approvedLeads) },
            { title: "Reviewed Leads", value: (data.reviewedLeads ?? 0).toString(), changeText: "12.0%", isPositive: true, chartColor: "#3b82f6", chartData: makeSparklineData(data.reviewedLeads) },
            { title: "Conversion Ratio", value: `${data.conversionRatio ?? 0}%`, changeText: "2.1%", isPositive: true, chartColor: "#10b981", chartData: makeSparklineData(data.conversionRatio) }
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
    const activeData = dbData[activeCategory];
    if (activeData && activeData.trend && activeData.trend.length > 0 && selectedMetricIndex === 0) {
      return [
        {
          name: selectedMetric.title,
          data: activeData.trend.map(t => t.value)
        }
      ];
    }
    const val = parseAmount(selectedMetric.value);
    return [
      {
        name: selectedMetric.title,
        data: makeMonthlyData(val)
      }
    ];
  }, [selectedMetric, dbData, activeCategory, selectedMetricIndex]);

  const chartCategories = useMemo(() => {
    const activeData = dbData[activeCategory];
    if (activeData && activeData.trend && activeData.trend.length > 0 && selectedMetricIndex === 0) {
      return activeData.trend.map(t => {
        try {
          const d = new Date(t.date);
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } catch {
          return t.date;
        }
      });
    }
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  }, [dbData, activeCategory, selectedMetricIndex]);

  // Progress Bar Distribution Breakdown calculations
  const progressItems = useMemo(() => {
    if (dbData.loading) return [];
    const data = dbData[activeCategory];
    if (!data) return [];

    switch (activeCategory) {
      case "Articles": {
        const total = data.totalArticles ?? 0;
        const active = data.activeArticles ?? 0;
        const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
        return [
          { label: "Active Articles Rate", percentage: activePct, color: "#8b5cf6" },
          { label: "Content Engagement", percentage: total > 0 ? 85 : 0, color: "#10b981" }
        ];
      }
      case "Product": {
        const total = data.totalProducts ?? 0;
        const active = data.activeProducts ?? 0;
        const outOfStock = data.outOfStock ?? 0;
        const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
        const stockPct = total > 0 ? Math.round(((total - outOfStock) / total) * 100) : 0;
        return [
          { label: "Catalog Active Rate", percentage: activePct, color: "#1e74db" },
          { label: "In Stock Rate", percentage: stockPct, color: "#10b981" }
        ];
      }
      case "Order": {
        const total = data.totalOrders ?? 0;
        const completed = data.completedOrders ?? 0;
        const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return [
          { label: "Fulfillment Rate", percentage: completedPct, color: "#10b981" }
        ];
      }
      case "Payment": {
        const successPct = data.successRate ?? 0;
        return [
          { label: "Transaction Success Rate", percentage: successPct, color: "#22c55e" }
        ];
      }
      case "Users": {
        const total = data.totalUsers ?? 0;
        const active = data.activeUsers ?? 0;
        const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
        return [
          { label: "User Activity Rate", percentage: activePct, color: "#ec4899" }
        ];
      }
      case "Leads": {
        const approvedPct = data.conversionRatio ?? 0;
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
      quickStyle={{ width: "25%" }}
      quickAction={
        <Fields
          type="range-datepicker"
          value={dateRange}
          onChange={(val) => setDateRange(val)}
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
                  categories: chartCategories
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
