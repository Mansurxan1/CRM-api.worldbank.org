import { useState } from "react";
import CountrySelector from "./components/CountrySelector";
import IndicatorSelector from "./components/IndicatorSelector";
import DataChart from "./components/DataChart";

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedIndicator, setSelectedIndicator] = useState<string>("");

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Mamlakatlar Statistikasi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CountrySelector onSelect={setSelectedCountry} />
        <IndicatorSelector onSelect={setSelectedIndicator} />
      </div>
      <DataChart countryCode={selectedCountry} indicatorCode={selectedIndicator} />
    </div>
  );
}

export default App;