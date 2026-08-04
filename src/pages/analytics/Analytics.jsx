import { useState } from "react";
import Chart from "react-apexcharts";
import Structure from "../../components/layout/Structure";
import Icon from "../../components/common/Icon";

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

// Modular SparklineCard component with premium hover transitions and colors
const SparklineCard = ({ title, value, changeText, isPositive, chartColor, chartData }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-5 p-12"
      style={{
        transition: "all 0.2s ease-in-out",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 4px 15px rgba(0,0,0,0.08)" : "",
        borderTop: `3px solid ${chartColor}`,
      }}
    >
      <div>
        <span className="mini-text text-gray font-600 uppercase tracking-wider">{title}</span>
        <h3 className="headpara-text text-dark font-700 mt-6 mb-2">{value}</h3>
        <div className={`small-text font-600 flex items-center gap-4 ${isPositive ? "text-success" : "text-danger"}`}>
          <span>{isPositive ? `↑ ${changeText}` : `↓ ${changeText}`}</span>
          <span className="text-gray mini-text font-500 mt-4">vs last 7 days</span>
        </div>
      </div>
      <div className="mt-8 w-full">
        <Chart
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

const sparklineCardsData = [
  {
    id: "total-products",
    title: "Total Products",
    value: "1,248",
    changeText: "12.5%",
    isPositive: true,
    chartColor: "#1e74db",
    chartData: [1180, 1200, 1195, 1220, 1210, 1235, 1248]
  },
  {
    id: "active-products",
    title: "Active Products",
    value: "892",
    changeText: "8.3%",
    isPositive: true,
    chartColor: "#8b5cf6",
    chartData: [840, 860, 850, 880, 872, 885, 892]
  },
  {
    id: "out-of-stock",
    title: "Out of Stock",
    value: "256",
    changeText: "5.6%",
    isPositive: true,
    chartColor: "#ef4444",
    chartData: [240, 248, 252, 245, 250, 253, 256]
  },
  {
    id: "low-stock",
    title: "Low Stock",
    value: "100",
    changeText: "2.1%",
    isPositive: false,
    chartColor: "#f97316",
    chartData: [110, 105, 108, 104, 102, 101, 100]
  },
  {
    id: "total-revenue",
    title: "Total Revenue",
    value: "$78,642",
    changeText: "15.2%",
    isPositive: true,
    chartColor: "#22c55e",
    chartData: [68000, 71000, 70000, 74000, 75500, 77000, 78642]
  }
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <Structure
      headerIcon={<Icon name="TrendingUp" width="22" height="22" strokeWidth="2" />}
      headerTitle="Web Analytics"
      headerSub="Monitor visitor behavior, session statistics, and conversions"
      showTabControls={false}
      quickAction={
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border-tertiary rounded-5 px-12 py-6 bg-white text-gray font-500"
          style={{ fontSize: "13px", outline: "none" }}
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      }
    >
      <div className="analytics-wrapper w-full pt-12">
        <div className="grid-cols-5 gap-12 mb-20">
          {sparklineCardsData.map((card) => (
            <SparklineCard
              key={card.id}
              title={card.title}
              value={card.value}
              changeText={card.changeText}
              isPositive={card.isPositive}
              chartColor={card.chartColor}
              chartData={card.chartData}
            />
          ))}
        </div>

        <div className="bg-white border rounded-5 p-16">
          <h4 className="small-text text-dark font-600 mb-12">Revenue & Sales Trends</h4>
          <Chart
            options={{
              chart: {
                id: "revenue-trend",
                toolbar: { show: false },
                fontFamily: "inherit"
              },
              xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
              },
              colors: ["#1e74db", "#22c55e"],
              stroke: { curve: "smooth", width: 3 },
              grid: { borderColor: "#f1f1f1" }
            }}
            series={[
              { name: "Revenue ($)", data: [12000, 19000, 15000, 28000, 32000, 45000, 41000, 56000, 62000, 58000, 71000, 78642] },
              { name: "Sales", data: [450, 720, 610, 890, 1100, 1450, 1320, 1780, 1950, 1820, 2100, 2450] }
            ]}
            type="line"
            height={350}
          />
        </div>
      </div>
    </Structure>
  );
};

export default Analytics;
