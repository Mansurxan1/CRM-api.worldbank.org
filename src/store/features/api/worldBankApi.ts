import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Mamlakat interfeysi
export interface Country {
  id: string; 
  name: string; 
}

// Ko‘rsatkich interfeysi
export interface Indicator {
  id: string; 
  name: string; 
}

// Ma‘lumot nuqtasi interfeysi
export interface DataPoint {
  year: string;
  value: number | null;
}

// World Bank API sahifalash ma‘lumotlari uchun interfeys
interface PaginationMeta {
  page: number; 
  pages: number; 
  total: number; 
  per_page: number; 
}

// Mamlakatlar API javobi uchun interfeys
interface CountryResponse {
  0: PaginationMeta;
  1: Array<{
    id: string;
    name: string; 
  }>; 
}

// Ko‘rsatkichlar API javobi uchun interfeys
interface IndicatorResponse {
  0: PaginationMeta; 
  1: Array<{
    id: string; 
    name: string;
  }>;
}

// Ma‘lumot nuqtalari API javobi uchun interfeys
interface DataPointResponse {
  0: PaginationMeta;
  1: Array<{
    date: string; 
    value: number | null; 
  }>; 
}

export const worldBankApi = createApi({
  reducerPath: "worldBankApi", 
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.worldbank.org/v2/" }), 
  endpoints: (builder) => ({
    // Mamlakatlar ro‘yxatini olish
    getCountries: builder.query<Country[], void>({
      query: () => `country?format=json&per_page=300`, 
      transformResponse: (response: CountryResponse): Country[] =>
        response[1].map((item) => ({
          id: item.id,
          name: item.name,
        })), 
    }),
    getIndicators: builder.query<Indicator[], void>({
      query: () => `indicator?format=json&per_page=2000&source=2`,
      transformResponse: (response: IndicatorResponse): Indicator[] =>
        response[1].map((item) => ({
          id: item.id,
          name: item.name,
        })),
    }),
    // Tanlangan mamlakat va ko‘rsatkich bo‘yicha ma‘lumotlarni olish
    getDataByCountryAndIndicator: builder.query<
      DataPoint[],
      { countryCode: string; indicatorCode: string; startYear: number; endYear: number }
    >({
      query: ({ countryCode, indicatorCode, startYear, endYear }) =>
        `country/${countryCode}/indicator/${indicatorCode}?date=${startYear}:${endYear}&format=json`, 
      transformResponse: (response: DataPointResponse): DataPoint[] =>
        response[1]?.map((item) => ({
          year: item.date,
          value: item.value,
        })) || [], 
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetIndicatorsQuery,
  useGetDataByCountryAndIndicatorQuery,
} = worldBankApi;