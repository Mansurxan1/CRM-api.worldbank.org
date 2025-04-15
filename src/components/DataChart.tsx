import { useGetDataByCountryAndIndicatorQuery } from "../store/features/api/worldBankApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface DataChartProps {
  countryCode: string;
  indicatorCode: string;
}

const DataChart = ({ countryCode, indicatorCode }: DataChartProps) => {
  const { data, error, isLoading } = useGetDataByCountryAndIndicatorQuery({
    countryCode,
    indicatorCode,
    startYear: 2000,
    endYear: 2020,
  });

  if (!countryCode || !indicatorCode) return <div>Iltimos, mamlakat va ko‘rsatkich tanlang.</div>;
  if (isLoading) return <div>Ma'lumotlar yuklanmoqda...</div>;
  if (error) return <div>Ma'lumotlarni yuklashda xato yuz berdi!</div>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Statistika (2000-2020)</h2>
      <LineChart
        width={window.innerWidth < 640 ? window.innerWidth - 40 : 600}
        height={window.innerWidth < 640 ? 200 : 300}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default DataChart;