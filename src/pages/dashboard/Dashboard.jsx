import Chart from "react-apexcharts";
import Container from "../../components/common/Container";
import Image from "../../components/common/Image";
import Icon from "../../components/common/Icon";
import DashImg from "../../assets/dashimg.png";

// --- Data Constants ---
const DASHBOARD_COUNTS = [
  { title: "Total Sales", value: "4,52,800", change: "+14.2%", isPositive: true, icon: "TrendingUp" },
  { title: "Total Orders", value: "1,240", change: "+8.1%", isPositive: true, icon: "Orders" },
  { title: "Total Revenue", value: "12,84,000", change: "+18.6%", isPositive: true, icon: "Analytic" },
];

const TOP_PRODUCTS = [
  { id: 1, name: "iPhone 14 Pro", category: "Electronics", price: 12099, stock: 25 },
  { id: 2, name: "Nike Air Max 270", category: "Fashion", price: 15000, stock: 40 },
  { id: 3, name: "Wooden Dining Table", category: "Home & Kitchen", price: 49009, stock: 10 },
  { id: 7, name: "Dell XPS 13 Laptop", category: "Electronics", price: 14909, stock: 8 },
  { id: 8, name: "Office Chair Ergonomic", category: "Home & Kitchen", price: 22000, stock: 20 },
];

const EARNINGS_BREAKDOWN = [
  { label: "Earnings", value: "$545.69", color: "#6C63FF" },
  { label: "Profit", value: "$256.34", color: "#00CFE8" },
  { label: "Expense", value: "$74.19", color: "#FF4C51" },
];

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
  stroke: { show: true, width: 6 },
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
          name: { offsetY: -45 },
          value: { fontSize: "22px", fontWeight: 600, offsetY: -25, formatter: () => "20,000" },
          total: { show: true, label: "Total Sales", offsetY: 10, formatter: () => "₹10,00,000" },
        },
      },
    },
  },
  legend: { position: "bottom" },
  dataLabels: { enabled: false },
};

const SPARKLINE_BAR_OPTIONS = {
  chart: { type: "bar", toolbar: { show: false }, sparkline: { enabled: true } },
  plotOptions: { bar: { borderRadius: 3, columnWidth: "65%", distributed: true } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    offsetY: -9,
    labels: { show: true, axisBorder: { show: false }, axisTicks: { show: false }, style: { colors: "#9aa0ac", fontSize: "12px" } },
  },
  grid: { padding: { bottom: 20 } },
  colors: ["#E7E7F3", "#E7E7F3", "#E7E7F3", "#E7E7F3", "#6C63FF", "#E7E7F3", "#E7E7F3"],
  tooltip: { enabled: true },
};

const SPARKLINE_SERIES = [{ data: [120, 180, 150, 140, 260, 170, 210] }];

const REVENUE_CHART_OPTIONS = {
  chart: { fontFamily: "Poppins, sans-serif", toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 6, columnWidth: "85%" } },
  stroke: { show: true, width: 2, colors: ["transparent"] },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    tickPlacement: "on",
    labels: { rotate: 0, hideOverlappingLabels: false, style: { fontSize: "12px" } },
  },
  yaxis: { title: { text: "Revenue (₹)" }, labels: { formatter: (val) => `₹${val / 1000}K` } },
  tooltip: { y: { formatter: (val) => `₹${val.toLocaleString()}` } },
  grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
  fill: {
    type: "gradient",
    gradient: { shade: "light", type: "vertical", shadeIntensity: 0.3, opacityFrom: 1, opacityTo: 2, stops: [0, 100] },
  },
  states: { hover: { filter: { type: "lighten", value: 0.1 } } },
  responsive: [{ breakpoint: 768, options: { plotOptions: { bar: { columnWidth: "70%" } } } }],
};

const REVENUE_SERIES = [
  { name: "Revenue", data: [15000, 22000, 18000, 26000, 32000, 30000, 42000, 18000, 26000, 20000, 20000, 30000] },
];

const CardHeader = ({ title }) => (
  <div className="px-14 py-12 bordb">
    <p className="para-text capitalize text-dark font-500">{title}</p>
  </div>
);

const Dashboard = () => {
  return (
    <Container version="v4" style={{ background: "var(--forth)" }}>
      <div className="flex items-start w-full gap-12">
        {/* Left Column - 30% */}
        <div className="w-30 grid-cols-1 gap-12">
          <div className="bg-secondary px-20 py-10 rounded-5">
            <div className="flex items-center">
              <div className="w-65">
                <h2 className="title-text font-600 text-white">Super Admin</h2>
                <p className="small-text font-400 text-white">
                  Best seller of the month
                </p>
                <h3 className="title-text font-600 text-white pt-10">$48.9k</h3>
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
            <GenericChart
              type="donut"
              height={260}
              categories={["Pending", "Confirmed", "Shipped", "Delivered"]}
              series={[25, 40, 30, 34]}
              colors={["#f97316", "#a855f7", "#3b82f6", "#10b981", "var(--primary)"]}
              options={DONUT_CHART_OPTIONS}
            />
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-5">
            <CardHeader title="Top Products" />
            <div className="py-14 px-16 grid-cols-1 gap-10">
              {TOP_PRODUCTS.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-3">
                  <div className="w-80">
                    <p className="text-dark small-text font-500">{item.name}</p>
                    <p className="mini-text text-gray">{item.category}</p>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-success small-text font-600">₹{item.price}</p>
                    <p className="mini-text text-gray">Stock: {item.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 70% */}
        <div className="w-70 grid-cols-1 gap-12">
          {/* Stat Cards Grid */}
          <div className="grid-cols-3 gap-12">
            {DASHBOARD_COUNTS.map((item, index) => (
              <div key={index} className="px-15 py-10 rounded-5 bg-white">
                <div className="flex items-center justify-between bordb pb-3">
                  <div>
                    <p className="small-text text-gray font-500">{item.title}</p>
                    <h2 className="title-text text-dark font-600">₹ {item.value}</h2>
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
                        <h2 className="large-text text-dark font-600">₹46K</h2>
                        <span className="bg-light-success text-success mini-text font-600 px-8 py-2 rounded-5">+4.2%</span>
                      </div>
                      <p className="text-gray font-500 mini-text mt-8">You informed of this week compared to last week</p>
                    </div>
                    <div className="w-50">
                      <Chart options={SPARKLINE_BAR_OPTIONS} series={SPARKLINE_SERIES} type="bar" height={150} />
                    </div>
                  </div>
                  <div className="grid-cols-3 gap-10 items-center mt-12">
                    {EARNINGS_BREAKDOWN.map((item, i) => (
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
                  <Chart options={SPARKLINE_BAR_OPTIONS} series={SPARKLINE_SERIES} type="bar" height={180} />
                  <div className="flex items-end justify-between bordh pt-8 mt-6">
                    <div>
                      <p className="text-dark mini-text font-600">124k</p>
                      <p className="text-gray mini-text font-500">Leads Overview</p>
                    </div>
                    <p className="text-success mini-text font-500">+12.6%</p>
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
                series={REVENUE_SERIES}
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