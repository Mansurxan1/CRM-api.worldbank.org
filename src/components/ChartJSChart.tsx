import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend,
  Filler,
  PieController,
  ArcElement,
  ScatterController,
} from "chart.js";
import {
  Line as ChartJSLineComponent,
  Bar as ChartJSBarComponent,
  Pie as ChartJSPieComponent,
  Scatter as ChartJSScatterComponent,
} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartJSTooltip,
  ChartJSLegend,
  Filler,
  PieController,
  ArcElement,
  ScatterController
);

interface ChartJSChartProps {
  data: { year: string; value: number }[];
  chartType: "line" | "bar" | "pie" | "scatter";
  width: string;
  height: number;
}

const ChartJSChart = ({ data, chartType, width, height }: ChartJSChartProps) => {
  const labels = data?.map((d) => d.year) || [];
  const commonDataset = data?.map((d) => d.value) || [];
  const pieDataset = data?.map((d) => d.value) || [];
  const scatterDataset = data?.map((d) => ({ x: +d.year, y: d.value })) || [];

  const chartJSData =
    chartType === "line"
      ? {
          labels,
          datasets: [
            {
              label: "Qiymat",
              data: commonDataset,
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
        }
      : chartType === "bar"
      ? {
          labels,
          datasets: [
            {
              label: "Qiymat",
              data: commonDataset,
              backgroundColor: "#66b3ff",
              barThickness: 20,
            },
          ],
        }
      : chartType === "pie"
      ? {
          labels,
          datasets: [
            {
              data: pieDataset,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        }
      : {
          datasets: [
            {
              label: "Qiymat",
              data: scatterDataset,
              backgroundColor: "#6b48ff",
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        };

  const chartJSOptions =
    chartType === "pie"
      ? {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top" as const,
              labels: {
                font: { size: 14, family: "Inter" },
                color: "#333",
              },
            },
            tooltip: {
              backgroundColor: "#fff",
              titleColor: "#333",
              bodyColor: "#666",
              borderColor: "#ddd",
              borderWidth: 1,
            },
          },
        }
      : {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: chartType === "line",
              position: "top" as const,
              labels: {
                font: { size: 14, family: "Inter" },
                color: "#333",
              },
            },
            title: {
              display: chartType === "line",
              text: "Statistika (2000-2020)",
              font: { size: 18, family: "Inter" },
              color: "#333",
            },
            tooltip: {
              backgroundColor: "#fff",
              titleColor: "#333",
              bodyColor: "#666",
              borderColor: "#ddd",
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              ticks: {
                font: { size: 12, family: "Inter" },
                color: "#555",
              },
              grid: { display: false },
            },
            y: {
              display: chartType === "line" || chartType === "scatter",
              ticks: {
                font: { size: 12, family: "Inter" },
                color: "#555",
                callback: (value: string | number) => {
                  const num = typeof value === "string" ? parseFloat(value) : value;
                  return num >= 1_000_000 ? `${(num / 1_000_000).toFixed(1)}M` : num.toLocaleString();
                },
              },
              grid: { color: "rgba(0,0,0,0.05)" },
            },
          },
        };

  return (
    <div style={{ width, height }}>
      {chartType === "line" ? (
        <ChartJSLineComponent data={chartJSData as any} options={chartJSOptions} />
      ) : chartType === "bar" ? (
        <ChartJSBarComponent data={chartJSData as any} options={chartJSOptions} />
      ) : chartType === "pie" ? (
        <ChartJSPieComponent data={chartJSData as any} options={chartJSOptions} />
      ) : (
        <ChartJSScatterComponent data={chartJSData as any} options={chartJSOptions} />
      )}
    </div>
  );
};

export default ChartJSChart;
