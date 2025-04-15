import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Country {
  id: string;
  name: string;
}

export interface Indicator {
  id: string;
  name: string;
}

export interface DataPoint {
  year: string;
  value: number | null;
}

export const worldBankApi = createApi({
  reducerPath: "worldBankApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.worldbank.org/v2/" }),
  endpoints: (builder) => ({
    // Mamlakatlar ro'yxatini olish
    getCountries: builder.query<Country[], void>({
      query: () => `country?format=json&per_page=300`,
      transformResponse: (response: any) =>
        response[1].map((item: any) => ({
          id: item.id,
          name: item.name,
        })),
    }),
    // Ko'rsatkichlar ro'yxatini olish
    getIndicators: builder.query<Indicator[], void>({
      query: () => `indicator?format=json&per_page=1000&source=2`,
      transformResponse: (response: any) =>
        response[1].map((item: any) => ({
          id: item.id,
          name: item.name,
        })),
    }),
    // Tanlangan mamlakat va ko'rsatkich bo'yicha ma'lumot
    getDataByCountryAndIndicator: builder.query<
      DataPoint[],
      { countryCode: string; indicatorCode: string; startYear: number; endYear: number }
    >({
      query: ({ countryCode, indicatorCode, startYear, endYear }) =>
        `country/${countryCode}/indicator/${indicatorCode}?date=${startYear}:${endYear}&format=json`,
      transformResponse: (response: any) =>
        response[1]?.map((item: any) => ({
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