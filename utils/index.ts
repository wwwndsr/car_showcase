import { CarProps, FilterProps } from "../types";

let cachedJwt: string | null = null;
let jwtExpiry = 0;

async function getJwtToken() {
  const res = await fetch("https://carapi.app/api/auth/login", {
    method: "POST",
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_token: "f11d66df-21d8-4e4d-b125-ca9767656c3b", // Ваш API токен
      api_secret: "4b13c3271ec8b930c0687f5c30370cdc", // Ваш API секрет
    }),
  });

  if (!res.ok) throw new Error("JWT auth failed: " + (await res.text()));
  return res.text();
}

export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(type, value);
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  return newPathname;
};

export const deleteSearchParams = (type: string) => {
  const newSearchParams = new URLSearchParams(window.location.search);
  newSearchParams.delete(type.toLowerCase());
  const newPathname = `${window.location.pathname}?${newSearchParams.toString()}`;
  return newPathname;
};

export const calculateCarRent = (city_mpg: number = 0, year: number = new Date().getFullYear()) => {
  const basePricePerDay = 50;
  const mileageFactor = 0.1;
  const ageFactor = 0.05;
  const mileageRate = (city_mpg || 0) * mileageFactor;
  const ageRate = (new Date().getFullYear() - (year || new Date().getFullYear())) * ageFactor;
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;
  return rentalRatePerDay.toFixed(0);
}

export async function fetchCars(filters: FilterProps) {
  const { manufacturer, year, model, fuel, limit } = filters;

  // Проверяем, не истёк ли токен
  if (!cachedJwt || Date.now() > jwtExpiry) {
    const jwt = await getJwtToken();
    cachedJwt = jwt;

    // Вытаскиваем exp из JWT
    const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
    jwtExpiry = payload.exp * 1000 - 60 * 1000; // обновляем заранее за 1 мин
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cachedJwt}`,
  };

  const searchParams = new URLSearchParams();

  if (manufacturer) searchParams.append("make", manufacturer);
  if (year) searchParams.append("year", year.toString());
  if (model) searchParams.append("model", model);
  if (fuel) searchParams.append("fuel_type", fuel);
  if (limit) searchParams.append("page[size]", limit.toString());

  const url = `https://carapi.app/api/trims/v2?${searchParams.toString()}`;

  console.log("Fetching CarAPI URL:", url);

   try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error("CarAPI fetch failed:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    
    // Добавьте для отладки:
    console.log("Full API response:", data);
    console.log("CarAPI response sample:", data?.data?.[0]);
    console.log("Total cars:", data?.data?.length);
    
    return data?.data || [];

  } catch (error) {
    console.error("Error fetching cars from CarAPI:", error);
    return [];
  }
}

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");
  const { make, model, year } = car;

  url.searchParams.append('customer', 'hrjavascript-mastery'); 
  url.searchParams.append('make', make);
  url.searchParams.append('modelFamily', model ? model.split(" ")[0] : "");
  url.searchParams.append('zoomType', 'fullscreen');
  url.searchParams.append('modelYear', `${year}`);
  if (angle) url.searchParams.append('angle', `${angle}`);

  return `${url}`;
}