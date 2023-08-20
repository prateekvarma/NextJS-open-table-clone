import Header from "./components/Header";
import SearchSidebar from "./components/SearchSidebar";
import RestaurantCard from "./components/RestaurantCard";
import { PRICE, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchRestaurantsByCity = async (city: string | undefined) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
  };

  if (!city) return await prisma.restaurant.findMany({ select });

  const restaurant = await prisma.restaurant.findMany({
    where: {
      location: {
        name: {
          equals: city.toLowerCase(),
        },
      },
    },
    select,
  });

  return restaurant;
};

const fetchLocations = async () => {
  return prisma.location.findMany();
};

const fetchCuisines = async () => {
  return prisma.cuisine.findMany();
};

export default async function Search({
  searchParams,
}: {
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) {
  const restaurants = await fetchRestaurantsByCity(searchParams.city);
  const location = await fetchLocations();
  const cuisine = await fetchCuisines();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSidebar
          locations={location}
          cuisines={cuisine}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            <>
              {restaurants.map((restaurant) => {
                return (
                  <RestaurantCard restaurant={restaurant} key={restaurant.id} />
                );
              })}
            </>
          ) : (
            <p>Sorry, no restaurants in that area.</p>
          )}
        </div>
      </div>
    </>
  );
}
