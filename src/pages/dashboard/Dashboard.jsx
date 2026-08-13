import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import Container from "../../components/common/Container";
import Image from "../../components/common/Image";
import Icon from "../../components/common/Icon";
import DashImg from "../../assets/dashimg.png";
import { getProfile } from "../../api/userApi";
import {
  getDashboardTotalLeads,
  getDashboardWeeklyEarnings,
  getDashboardWeeklyLeads,
  getDashboardTopProducts,
  getDashboardYearlyRevenue,
  getDashboardBestSeller,
  getDashboardOrderStatusStats
} from "../../api/dashboardApi";

// --- Chart Configurations ---
const GenericChart = ({ type, categories, series, colors, height, options }) => {
  const mergedOptions = {
    ...options,
    chart: { ...options?.chart, type },
    colors: colors || options?.colors,
    labels: categories || options?.labels || options?.xaxis?.categories,
    ...(type === "bar" && categories ? { xaxis: { ...options?.xaxis, categories } } : {}),
  };
  return <Chart type={type} series={series} height={height} options={mergedOptions} />;
};

const DONUT_CHART_OPTIONS = {
  chart: { offsetY: 10, fontFamily: "Poppins, sans-serif" },
  stroke: { show: true, width: 4, colors: ["var(--white)"] },
  grid: { padding: { top: 20, bottom: -120 } },
  plotOptions: {
    pie: {
      startAngle: -95,
      endAngle: 95,
      offsetY: -10,
      donut: {
        size: "70%",
        labels: {
          show: true,
          name: { offsetY: -45, color: "var(--gray)" },
          value: { fontSize: "22px", fontWeight: 600, offsetY: -25, color: "var(--dark)" },
          total: { show: true, label: "Total Sales", color: "var(--gray)", offsetY: 10 },
        },
      },
    },
  },
  legend: {
    position: "bottom",
    labels: { colors: "var(--dark)" }
  },
  dataLabels: { enabled: false },
};

const SPARKLINE_BAR_OPTIONS = {
  chart: { type: "bar", toolbar: { show: false }, sparkline: { enabled: true } },
  plotOptions: { bar: { borderRadius: 3, columnWidth: "65%", distributed: true } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    offsetY: -9,
    labels: { show: true, axisBorder: { show: false }, axisTicks: { show: false }, style: { colors: "var(--gray)", fontSize: "12px" } },
  },
  grid: { padding: { bottom: 20 } },
  colors: ["var(--tertiary)", "var(--tertiary)", "var(--tertiary)", "var(--tertiary)", "var(--primary)", "var(--tertiary)", "var(--tertiary)"],
  tooltip: { enabled: true },
};

const REVENUE_CHART_OPTIONS = {
  chart: { fontFamily: "Poppins, sans-serif", toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 6, columnWidth: "85%" } },
  stroke: { show: true, width: 2, colors: ["transparent"] },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    tickPlacement: "on",
    labels: { rotate: 0, hideOverlappingLabels: false, style: { colors: "var(--gray)", fontSize: "12px" } },
    axisBorder: { color: "var(--tertiary)" },
    axisTicks: { color: "var(--tertiary)" }
  },
  yaxis: {
    title: { text: "Revenue (₹)", style: { color: "var(--gray)", fontSize: "12px" } },
    labels: { formatter: (val) => `₹${(val / 1000).toFixed(0)}K`, style: { colors: "var(--gray)", fontSize: "12px" } }
  },
  tooltip: { y: { formatter: (val) => `₹${val.toLocaleString()}` } },
  grid: { borderColor: "var(--tertiary)", strokeDashArray: 4 },
  fill: {
    type: "gradient",
    gradient: { shade: "light", type: "vertical", shadeIntensity: 0.3, opacityFrom: 1, opacityTo: 2, stops: [0, 100] },
  },
  states: { hover: { filter: { type: "lighten", value: 0.1 } } },
  responsive: [{ breakpoint: 768, options: { plotOptions: { bar: { columnWidth: "70%" } } } }],
};

const CardHeader = ({ title }) => (
  <div className="px-14 py-12 bordb" style={{ borderColor: "var(--tertiary)" }}>
    <p className="para-text capitalize text-dark font-500">{title}</p>
  </div>
);

const parseAmount = (val) => {
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
};

const formatShortAmount = (val) => {
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return "₹0";
  if (num >= 1000000) {
    return `₹${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `₹${num}`;
};

const Dashboard = () => {
  const { token, user } = useSelector((state) => state.auth) || {};
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dashboard API Stats State
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderManagementData, setOrderManagementData] = useState([0, 0, 0, 0]);
  const [topProducts, setTopProducts] = useState([]);
  const [weeklyEarningsData, setWeeklyEarningsData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [leadsWeeklyData, setLeadsWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [yearlyRevenueData, setYearlyRevenueData] = useState(Array(12).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const promises = [
          getProfile(),
          getDashboardTotalLeads(),
          getDashboardWeeklyEarnings(),
          getDashboardWeeklyLeads(),
          getDashboardTopProducts(),
          getDashboardYearlyRevenue(new Date().getFullYear()),
          getDashboardOrderStatusStats()
        ];

        const [
          profileRes,
          totalLeadsRes,
          weeklyEarningsRes,
          weeklyLeadsRes,
          topProductsRes,
          yearlyRevenueRes,
          orderStatusRes
        ] = await Promise.all(promises);

        setProfile(profileRes?.data || profileRes);
        
        // Total Leads
        const leadsTotal = totalLeadsRes?.data?.totalLeads || totalLeadsRes?.totalLeads || 0;
        setTotalLeadsCount(leadsTotal);

        // Weekly Earnings & Total Sales
        const earnData = weeklyEarningsRes?.data || weeklyEarningsRes || {};
        const overallSales = earnData.overallPaidEarnings || 0;
        setTotalSales(overallSales);
        
        const weeklyEarnList = earnData.weekly || [];
        const earnDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const weeklyEarnArray = earnDays.map(dayName => {
          const matched = weeklyEarnList.find(d => d.day === dayName);
          return matched ? matched.amount : 0;
        });
        setWeeklyEarningsData(weeklyEarnArray);
        
        const wTotal = weeklyEarnArray.reduce((acc, v) => acc + v, 0);
        setWeeklyTotal(wTotal);

        // Weekly Leads
        const leadsWeekly = weeklyLeadsRes?.data || weeklyLeadsRes || {};
        const weeklyLeadsList = leadsWeekly.weekly || [];
        const weeklyLeadsArray = earnDays.map(dayName => {
          const matched = weeklyLeadsList.find(d => d.day === dayName);
          return matched ? matched.count : 0;
        });
        setLeadsWeeklyData(weeklyLeadsArray);

        // Top Products
        const rawTopProds = topProductsRes?.data || topProductsRes || [];
        const formattedProds = rawTopProds.map((p, idx) => ({
          id: p.productId || idx,
          name: p.name,
          category: p.category || "General",
          price: p.price || 0,
          stock: p.stock || 0
        }));
        setTopProducts(formattedProds);

        // Yearly Revenue
        const yearlyRev = yearlyRevenueRes?.data || yearlyRevenueRes || {};
        const monthlyRevList = yearlyRev.monthly || [];
        const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const yearlyRevenueArray = monthsNames.map(mName => {
          const matched = monthlyRevList.find(m => m.month === mName);
          return matched ? matched.revenue : 0;
        });
        setYearlyRevenueData(yearlyRevenueArray);

        // Order Status & Totals
        const statusData = orderStatusRes?.data || orderStatusRes || {};
        setTotalOrders(statusData.totalOrders || 0);
        setTotalRevenue(statusData.totalRevenue || 0);
        
        setOrderManagementData([
          statusData.pending || 0,
          statusData.processing || 0,
          statusData.shipped || 0,
          statusData.delivered || 0
        ]);

      } catch (err) {
        console.error("Dashboard fetching error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // --- Formatting Selectors & Option Mappings ---
  const formattedPaidVal = useMemo(() => {
    return formatShortAmount(totalSales);
  }, [totalSales]);

  const dashboardCounts = useMemo(() => {
    return [
      { title: "Total Sales", value: totalSales.toLocaleString(), prefix: "₹ ", change: "+0.0%", isPositive: true, icon: "TrendingUp" },
      { title: "Total Orders", value: totalOrders.toLocaleString(), prefix: "", change: "+0.0%", isPositive: true, icon: "Orders" },
      { title: "Total Revenue", value: totalRevenue.toLocaleString(), prefix: "₹ ", change: "+0.0%", isPositive: true, icon: "Analytic" },
    ];
  }, [totalSales, totalOrders, totalRevenue]);

  const donutOptions = useMemo(() => {
    return {
      ...DONUT_CHART_OPTIONS,
      plotOptions: {
        ...DONUT_CHART_OPTIONS.plotOptions,
        pie: {
          ...DONUT_CHART_OPTIONS.plotOptions.pie,
          donut: {
            ...DONUT_CHART_OPTIONS.plotOptions.pie.donut,
            labels: {
              ...DONUT_CHART_OPTIONS.plotOptions.pie.donut.labels,
              value: {
                ...DONUT_CHART_OPTIONS.plotOptions.pie.donut.labels.value,
                formatter: (val) => val !== undefined ? val.toLocaleString() : ""
              },
              total: {
                ...DONUT_CHART_OPTIONS.plotOptions.pie.donut.labels.total,
                formatter: () => `₹${totalRevenue.toLocaleString()}`
              }
            }
          }
        }
      }
    };
  }, [totalRevenue]);

  const formattedWeeklyTotal = useMemo(() => {
    return formatShortAmount(weeklyTotal);
  }, [weeklyTotal]);

  const earningsBreakdown = useMemo(() => {
    return [
      { label: "Earnings", value: `₹${weeklyTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "var(--primary)" },
      { label: "Profit", value: `₹${(weeklyTotal * 0.6).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "var(--info)" },
      { label: "Expense", value: `₹${(weeklyTotal * 0.4).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "var(--danger)" },
    ];
  }, [weeklyTotal]);

  const formattedLeadsCount = useMemo(() => {
    if (totalLeadsCount >= 1000) {
      return `${(totalLeadsCount / 1000).toFixed(0)}k`;
    }
    return totalLeadsCount;
  }, [totalLeadsCount]);

  const yearlyRevenueSeries = useMemo(() => {
    return [{ name: "Revenue", data: yearlyRevenueData }];
  }, [yearlyRevenueData]);

  return (
    <Container version="v4" style={{ background: "var(--forth)" }}>
      <div className="flex items-start w-full gap-12">
        {/* Left Column - 30% */}
        <div className="w-30 grid-cols-1 gap-12">
          <div className="bg-secondary px-20 py-10 rounded-5">
            <div className="flex items-center">
              <div className="w-65">
                <h2 className="title-text font-600 text-white capitalize">
                  {profile?.role || user?.role}
                </h2>
                <p className="small-text font-400 text-white">
                  Best seller of the month
                </p>
                <h3 className="title-text font-600 text-white pt-10">{formattedPaidVal}</h3>
                <button className="bg-white mini-text px-16 py-4 rounded-5 text-secondary border-0 mt-4 cursor-pointer">
                  View Sales
                </button>
              </div>
              <div className="w-35">
                <Image
                  src={DashImg}
                  alt="Dash-Profile"
                  className="object-contain w-full flex h-150"
                />
              </div>
            </div>
          </div>
          {/* Order Management Chart */}
          <div className="bg-white rounded-5 pb-25">
            <CardHeader title="Order Management" />
            {totalOrders > 0 ? (
              <GenericChart
                type="donut"
                height={260}
                categories={["Pending", "Confirmed", "Shipped", "Delivered"]}
                series={orderManagementData}
                colors={["var(--warning)", "var(--primary)", "var(--secondary)", "var(--success)"]}
                options={donutOptions}
              />
            ) : (
              <div className="flex items-center justify-center" style={{ height: "260px" }}>
                <p className="mini-text text-gray">No orders to display status ratio</p>
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-5">
            <CardHeader title="Top Products" />
            <div className="py-14 px-16 grid-cols-1 gap-10">
              {topProducts.length > 0 ? (
                topProducts.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--tertiary)" }}>
                    <div className="w-80">
                      <p className="text-dark small-text font-500 truncate" style={{ maxWidth: "170px" }}>{item.name}</p>
                      <p className="mini-text text-gray">{item.category}</p>
                    </div>
                    <div className="text-right w-20">
                      <p className="text-success small-text font-600">₹{item.price.toLocaleString()}</p>
                      <p className="mini-text text-gray">Stock: {item.stock}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="mini-text text-gray">No products in catalog</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - 70% */}
        <div className="w-70 grid-cols-1 gap-12">
          {/* Stat Cards Grid */}
          <div className="grid-cols-3 gap-12">
            {dashboardCounts.map((item, index) => (
              <div key={index} className="px-15 py-10 rounded-5 bg-white">
                <div className="flex items-center justify-between bordb pb-3" style={{ borderColor: "var(--tertiary)" }}>
                   <div>
                    <p className="small-text text-gray font-500">{item.title}</p>
                    <h2 className="title-text text-dark font-600">{item.prefix}{item.value}</h2>
                  </div>
                  <div>
                    <Icon name={item.icon} width="24" height="24" className="text-primary" />
                  </div>
                </div>
                <p className="text-gray small-text font-500 mt-5">
                  <span className={item.isPositive ? "text-success" : "text-danger"}>{item.change}</span> than last week
                </p>
              </div>
            ))}
          </div>

          {/* Earnings & Leads Middle Row */}
          <div className="flex items-start w-full gap-12">
            <div className="w-70 grid-cols-1 gap-12">
              <div className="bg-white rounded-5">
                <div className="p-14">
                  <h3 className="mid-text text-dark font-600">Earning Reports</h3>
                  <p className="mini-text text-gray font-400">Weekly Earnings Overview</p>
                  <div className="flex gap-12 items-end">
                    <div className="w-50">
                      <div className="flex items-center gap-12">
                        <h2 className="large-text text-dark font-600">{formattedWeeklyTotal}</h2>
                        <span className="bg-light-success text-success mini-text font-600 px-8 py-2 rounded-5">+0.0%</span>
                      </div>
                      <p className="text-gray font-500 mini-text mt-8">You informed of this week compared to last week</p>
                    </div>
                    <div className="w-50">
                      <Chart options={SPARKLINE_BAR_OPTIONS} series={[{ data: weeklyEarningsData }]} type="bar" height={150} />
                    </div>
                  </div>
                  <div className="grid-cols-3 gap-10 items-center mt-12">
                    {earningsBreakdown.map((item, i) => (
                      <div className="bg-forth p-10" key={i} style={{ flex: 1 }}>
                        <p className="text-gray mini-text font-400">{item.label}</p>
                        <h3 className="headmini-text text-dark font-600 pt-4">{item.value}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-30 grid-cols-1 gap-12">
              <div className="bg-white rounded-5">
                <div className="p-12">
                  <h4 className="text-dark mid-text font-600">Total Leads</h4>
                  <p className="text-gray mini-text font-400 mt-1">Last Week</p>
                  <Chart options={SPARKLINE_BAR_OPTIONS} series={[{ data: leadsWeeklyData }]} type="bar" height={180} />
                  <div className="flex items-end justify-between bordh pt-8 mt-6" style={{ borderColor: "var(--tertiary)" }}>
                    <div>
                      <p className="text-dark mini-text font-600">{formattedLeadsCount}</p>
                      <p className="text-gray mini-text font-500">Leads Overview</p>
                    </div>
                    <p className="text-success mini-text font-500">+0.0%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yearly Revenue Insights */}
          <div className="bg-white rounded-5">
            <CardHeader title="Yearly Revenue Insights" />
            <div className="px-15">
              <GenericChart
                type="bar"
                series={yearlyRevenueSeries}
                colors={["var(--secondary)"]}
                height={380}
                options={REVENUE_CHART_OPTIONS}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;