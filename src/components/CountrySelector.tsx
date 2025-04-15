import { useGetCountriesQuery } from "../store/features/api/worldBankApi";

interface CountrySelectorProps {
  onSelect: (countryCode: string) => void;
}

const CountrySelector = ({ onSelect }: CountrySelectorProps) => {
  const { data: countries, isLoading, error } = useGetCountriesQuery();

  if (isLoading) return <div>Mamlakatlar yuklanmoqda...</div>;
  if (error) return <div>Mamlakatlarni yuklashda xato!</div>;

  return (
    <div className="mb-6">
      <label htmlFor="country" className="block text-lg font-medium mb-2">
        Mamlakatni tanlang
      </label>
      <select
        id="country"
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Mamlakat tanlang</option>
        {countries?.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;