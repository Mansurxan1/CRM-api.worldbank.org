import { useGetIndicatorsQuery } from "../store/features/api/worldBankApi";

interface IndicatorSelectorProps {
  onSelect: (indicatorCode: string) => void;
}

const IndicatorSelector = ({ onSelect }: IndicatorSelectorProps) => {
  const { data: indicators, isLoading, error } = useGetIndicatorsQuery();

  if (isLoading) return <div>Ko‘rsatkichlar yuklanmoqda...</div>;
  if (error) return <div>Ko‘rsatkichlarni yuklashda xato!</div>;

  return (
    <div className="mb-6">
      <label htmlFor="indicator" className="block text-lg font-medium mb-2">
        Ko‘rsatkichni tanlang
      </label>
      <select
        id="indicator"
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Ko‘rsatkich tanlang</option>
        {indicators?.map((indicator) => (
          <option key={indicator.id} value={indicator.id}>
            {indicator.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default IndicatorSelector;