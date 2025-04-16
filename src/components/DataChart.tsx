import { useState } from "react";
import { useGetDataByCountryAndIndicatorQuery } from "../store/features/api/worldBankApi";
import D3Chart from "./D3Chart";
import ChartJSChart from "./ChartJSChart";
import EChartsChart from "./EChartsChart";
import NivoChart from "./NivoChart";
import RechartsChart from "./RechartsChart";

interface DataChartProps {
  countryCode: string;
  indicatorCode: string;
}

const DataChart = ({ countryCode, indicatorCode }: DataChartProps) => {
  const [activeTab, setActiveTab] = useState<"d3" | "chartjs" | "echarts" | "nivo" | "recharts">("d3");
  const [chartType, setChartType] = useState<"line" | "bar" | "pie" | "scatter">("line");

  const { data, error, isLoading } = useGetDataByCountryAndIndicatorQuery({
    countryCode,
    indicatorCode,
    startYear: 2000,
    endYear: 2020,
  });

  const width = "80vw";
  const height = window.innerWidth < 640 ? 400 : 600;

  if (!countryCode || !indicatorCode)
    return <div className="text-center text-red-500">Iltimos, mamlakat va ko‘rsatkich tanlang.</div>;
  if (isLoading) return <div className="text-center text-blue-500">Ma'lumotlar yuklanmoqda...</div>;
  if (error) return <div className="text-center text-red-500">Ma'lumotlarni yuklashda xato yuz berdi!</div>;
  if (!data || data.length === 0)
    return <div className="text-center text-gray-500">Ma'lumotlar mavjud emas.</div>;

  const renderChart = () => {
    // Null qiymatlarni filtrlaymiz
    const filteredData = data.filter((d): d is { year: string; value: number } => d.value !== null);

    switch (activeTab) {
      case "d3":
        return <D3Chart data={filteredData} chartType={chartType} width={width} height={height} />;
      case "chartjs":
        return <ChartJSChart data={filteredData} chartType={chartType} width={width} height={height} />;
      case "echarts":
        return <EChartsChart data={filteredData} chartType={chartType} width={width} height={height} />;
      case "nivo":
        return <NivoChart data={filteredData} chartType={chartType} height={height} />;
      case "recharts":
        return <RechartsChart data={filteredData} chartType={chartType} width={width} height={height} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 font-inter">Statistika (2000-2020)</h2>
      <div className="flex flex-wrap mb-6 gap-2">
        {["line", "bar", "pie", "scatter"].map((type) => (
          <button
            key={type}
            className={`px-5 py-2 rounded-full transition-all duration-300 font-inter text-sm font-medium ${
              chartType === type
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setChartType(type as typeof chartType)}
          >
            {type === "line"
              ? "Chiziqli Grafik"
              : type === "bar"
              ? "Ustunli Grafik"
              : type === "pie"
              ? "Doira Grafik"
              : "Nuqtali Grafik"}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap mb-6 gap-2">
        {["d3", "chartjs", "echarts", "nivo", "recharts"].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-full transition-all duration-300 font-inter text-sm font-medium ${
              activeTab === tab
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab as typeof activeTab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ width, height, overflowX: "auto" }} className="bg-white rounded-lg shadow-sm p-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default DataChart;