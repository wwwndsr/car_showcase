import { CarProps, FilterProps } from "../types";

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

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50;
  const mileageFactor = 0.1;
  const ageFactor = 0.05;
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;
  return rentalRatePerDay.toFixed(0);
}

export async function fetchCars(filters: FilterProps) {
  const { manufacturer, year, model, fuel } = filters;
  const headers = {
    'x-rapidapi-key': '6124467d7emsh4c66b8634a15278p1b6ed4jsndd6726542ff3',
    'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com'
  };

  const params = new URLSearchParams();
  if (manufacturer) params.append("make", manufacturer);
  if (year) params.append("year", year.toString());
  if (model) params.append("model", model);
  if (fuel) params.append("fuel_type", fuel);

  const url = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${params.toString()}`;
  const response = await fetch(url, { headers });
  const result = await response.json();
  return result;
}

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");
  const { make, model, year } = car;

  url.searchParams.append('customer', process.env.NEXT_PUBLIC_IMAGIN_API_KEY || '');
  url.searchParams.append('make', make);
  url.searchParams.append('modelFamily', model ? model.split(" ")[0] : "");
  url.searchParams.append('zoomType', 'fullscreen');
  url.searchParams.append('modelYear', `${year}`);
  if (angle) url.searchParams.append('angle', `${angle}`);

  return `${url}`;
}