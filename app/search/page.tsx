import Link from "next/link";
import NavBar from "../components/NavBar";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import RestaurantCard from "./components/RestaurantCard";

export default function search() {
  return (
    <main className="bg-gray-100 min-h-screen w-screen">
      <main className="max-w-screen-2xl m-auto bg-white">
        <NavBar />
        <Header />
        <div className="flex py-4 m-auto w-2/3 justify-between items-start">
          <Sidebar />
          <div className="w-5/6">
            <RestaurantCard />
          </div>
        </div>
      </main>
    </main>
  );
}
