import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";

interface RechartsChartProps {
  data: { year: string; value: number }[];
  chartType: "line" | "bar" | "pie" | "scatter";
  width: string;
  height: number;
}

const RechartsChart = ({ data, chartType, height }: RechartsChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "line" ? (
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
      ) : chartType === "bar" ? (
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis
            dataKey="year"
            tick={{ fontFamily: "Inter", fontSize: 12, fill: "#555" }}
            label={{ value: "Yil", position: "insideBottom", offset: -10, fontFamily: "Inter", fontSize: 14, fill: "#333" }}
          />
          <YAxis hide={true} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderColor: "#ddd", borderRadius: "8px", fontFamily: "Inter" }}
            labelStyle={{ color: "#333" }}
            itemStyle={{ color: "#666" }}
          />
          <Bar
            dataKey="value"
            fill="#66b3ff"
            barSize={20}
            label={{
              position: "top",
              formatter: (value: number) => (value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString()),
              fontFamily: "Inter",
              fontSize: 12,
              fill: "#333",
            }}
          />
        </BarChart>
      ) : chartType === "pie" ? (
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="year"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString()}`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"][index % 7]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderColor: "#ddd", borderRadius: "8px", fontFamily: "Inter" }}
            labelStyle={{ color: "#333" }}
            itemStyle={{ color: "#666" }}
          />
        </PieChart>
      ) : (
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
          <Scatter data={data} fill="#6b48ff" />
        </ScatterChart>
      )}
    </ResponsiveContainer>
  );
};

export default RechartsChart;
