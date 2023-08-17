import Header from "./components/Header";
import SearchSidebar from "./components/SearchSidebar";
import RestaurantCard from "./components/RestaurantCard";
import { PrismaClient } from "@prisma/client";

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

export default async function search({
  searchParams,
}: {
  searchParams: { city: string };
}) {
  const restaurants = await fetchRestaurantsByCity(searchParams.city);

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSidebar />
        <div className="w-5/6">
          {restaurants.length ? (
            <RestaurantCard />
          ) : (
            <p>Sorry, no restaurants in that area.</p>
          )}
        </div>
      </div>
    </>
  );
}
