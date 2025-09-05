import Image from "next/image";
import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from "@/components";
import { fetchCars } from "../utils";
import { manufacturers, fuels, yearsOfProduction } from "@/constants";

interface SearchParams {
  manufacturer?: string;
  year?: string;
  model?: string;
  fuel?: string;
  limit?: string;
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  // Правильно ожидаем searchParams
  const params = await searchParams;
  
  const allCars = await fetchCars({
    manufacturer: params.manufacturer || "",
    year: params.year ? parseInt(params.year) : 2020,
    fuel: params.fuel || "",
    model: params.model || "",
    limit: params.limit ? parseInt(params.limit) : 10
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length === 0;

  return ( 
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels}/>
            <CustomFilter title="year" options={yearsOfProduction}/>
          </div>
        </div>

        {!isDataEmpty ? (
          <section>
           <div className="home__cars-wrapper">
            {allCars?.map((car, index) => 
              <CarCard key={car.id || index} car={car} />
            )}
          </div>
            <ShowMore
              pageNumber={(params.limit ? parseInt(params.limit) : 10) / 10}
              isNext={(params.limit ? parseInt(params.limit) : 10) > allCars.length}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            <p>Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </main>
  );
}