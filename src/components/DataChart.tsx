import { useState, useEffect, useRef } from "react";
import { useGetDataByCountryAndIndicatorQuery } from "../store/features/api/worldBankApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend,
  Filler,
} from "chart.js";
import { Line as ChartJSLineComponent } from "react-chartjs-2";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { Line as NivoLine } from "@nivo/line";

// Chart.js ni ro‘yxatdan o‘tkazish
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartJSTooltip, ChartJSLegend, Filler);

interface DataChartProps {
  countryCode: string;
  indicatorCode: string;
}

const DataChart = ({ countryCode, indicatorCode }: DataChartProps) => {
  const [activeTab, setActiveTab] = useState<"chartjs" | "echarts" | "nivo" | "recharts">("chartjs");
  const echartsRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading } = useGetDataByCountryAndIndicatorQuery({
    countryCode,
    indicatorCode,
    startYear: 2000,
    endYear: 2020,
  });

  const width = "80vw";
  const height = window.innerWidth < 640 ? 400 : 600;

  // ECharts sozlamalari
  useEffect(() => {
    if (echartsRef.current && activeTab === "echarts" && data) {
      const chart = echarts.init(echartsRef.current);
      const option: EChartsOption = {
        xAxis: {
          type: "category",
          data: data.map((d) => d.year),
          axisLabel: { fontSize: 12, color: "#555", fontFamily: "Inter" },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: (value: number) => (value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString()),
            fontSize: 12,
            color: "#555",
            fontFamily: "Inter",
          },
        },
        series: [
          {
            type: "line",
            data: data.map((d) => d.value),
            smooth: true,
            lineStyle: { color: "#6b48ff", width: 3 },
            itemStyle: { color: "#6b48ff" },
            showSymbol: true,
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(107, 72, 255, 0.3)" },
                { offset: 1, color: "rgba(107, 72, 255, 0)" },
              ]),
            },
          },
        ],
        tooltip: { trigger: "axis", backgroundColor: "#fff", borderColor: "#ddd", textStyle: { color: "#333" } },
        grid: { left: "80px", right: "30px", bottom: "50px", top: "50px" },
      };
      chart.setOption(option);
      return () => chart.dispose();
    }
  }, [data, activeTab]);

  if (!countryCode || !indicatorCode) return <div className="text-center text-red-500">Iltimos, mamlakat va ko‘rsatkich tanlang.</div>;
  if (isLoading) return <div className="text-center text-blue-500">Ma'lumotlar yuklanmoqda...</div>;
  if (error) return <div className="text-center text-red-500">Ma'lumotlarni yuklashda xato yuz berdi!</div>;

  // Chart.js ma‘lumotlari
  const chartJSData = {
    labels: data?.map((d) => d.year) || [],
    datasets: [
      {
        label: "Qiymat",
        data: data?.map((d) => d.value) || [],
        borderColor: "#6b48ff",
        backgroundColor: "rgba(107, 72, 255, 0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#6b48ff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartJSOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const, labels: { font: { size: 14, family: "Inter" }, color: "#333" } },
      title: { display: true, text: "Statistika (2000-2020)", font: { size: 18, family: "Inter" }, color: "#333" },
      tooltip: { backgroundColor: "#fff", titleColor: "#333", bodyColor: "#666", borderColor: "#ddd", borderWidth: 1 },
    },
    scales: {
      x: { ticks: { font: { size: 12, family: "Inter" }, color: "#555" }, grid: { display: false } },
      y: {
        ticks: {
          font: { size: 12, family: "Inter" },
          color: "#555",
          callback: (tickValue: string | number) => {
            const value = typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
            return value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString();
          },
        },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
    },
  };

  // Nivo ma‘lumotlari
  const nivoData = [
    {
      id: "Qiymat",
      data: data?.map((d) => ({ x: d.year, y: d.value })) || [],
    },
  ];

  const computedWidth = window.innerWidth * 0.8;

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 font-inter">Statistika (2000-2020)</h2>
      <div className="flex flex-wrap mb-6 gap-2">
        {["chartjs", "echarts", "nivo", "recharts"].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-full transition-all duration-300 font-inter text-sm font-medium ${
              activeTab === tab
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab as typeof activeTab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ width, height, overflowX: "auto" }} className="bg-white rounded-lg shadow-sm p-4">
        {activeTab === "chartjs" && (
          <div style={{ width, height }}>
            <ChartJSLineComponent data={chartJSData} options={chartJSOptions} />
          </div>
        )}
        {activeTab === "echarts" && <div ref={echartsRef} style={{ width, height }} />}
        {activeTab === "nivo" && (
          <NivoLine
            width={computedWidth}
            height={height}
            data={nivoData}
            margin={{ top: 50, right: 60, bottom: 70, left: 100 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Yil",
              legendOffset: 36,
              legendPosition: "middle",
              tickValues: data?.map((d) => d.year),
              format: (value: string) => value,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 10,
              tickRotation: 0,
              legend: "Qiymat",
              legendOffset: -80,
              legendPosition: "middle",
              format: (value: number) => (value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString()),
              tickValues: 6,
            }}
            colors={["#6b48ff"]}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            enablePoints={true}
            enableArea={true}
            areaOpacity={0.2}
            curve="monotoneX"
            useMesh={true}
            enableGridX={false}
            enableGridY={true}
            gridYValues={6}
            animate={true}
            motionConfig="gentle"
            theme={{
              axis: {
                ticks: {
                  text: { fontSize: 12, fill: "#555", fontFamily: "Inter" },
                },
                legend: {
                  text: { fontSize: 14, fill: "#333", fontFamily: "Inter" },
                },
              },
              grid: { line: { stroke: "rgba(0, 0, 0, 0.05)" } },
            }}
          />
        )}
        {activeTab === "recharts" && (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
              <XAxis
                dataKey="year"
                tick={{ fontFamily: "Inter", fontSize: 12, fill: "#555" }}
                label={{ value: "Yil", position: "insideBottom", offset: -10, fontFamily: "Inter", fontSize: 14, fill: "#333" }}
              />
              <YAxis
                tickFormatter={(value: number) => (value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString())}
                tick={{ fontFamily: "Inter", fontSize: 12, fill: "#555" }}
                label={{ value: "Qiymat", angle: -90, position: "insideLeft", fontFamily: "Inter", fontSize: 14, fill: "#333" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderColor: "#ddd", borderRadius: "8px", fontFamily: "Inter" }}
                labelStyle={{ color: "#333" }}
                itemStyle={{ color: "#666" }}
              />
              <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: 14, color: "#333" }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6b48ff"
                strokeWidth={3}
                dot={{ r: 5, fill: "#fff", stroke: "#6b48ff", strokeWidth: 2 }}
                activeDot={{ r: 8 }}
                fill="url(#gradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(107, 72, 255, 0.3)" />
                  <stop offset="95%" stopColor="rgba(107, 72, 255, 0)" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DataChart;