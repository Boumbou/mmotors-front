import { Button } from "@/components/ui/button";
import { type VehicleType } from "@/types/VehicleType";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import VehicleCard from "./vehicles/components/VehicleCard";

export default function Home() {
  const navigate = useNavigate();
  const [latestVehicles, setLatestVehicles] = useState<VehicleType[]>([]);

  const handleBtnClick = (type: string) => {
    navigate(`/catalogue?type=${type}&pagenumber=1&pagesize=20`);
  }

  //fetch 5 vehicles
  const vehicles = async () => {
    try {
      const response = await fetch("/api/vehicles?pagesize=20&pagenumber=1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setLatestVehicles(data.items);
    } catch (error) {
      throw new Error("Error fetching vehicles:" + error);
    }
  }

  useEffect(() => {
    vehicles();
  }, []);

  return (
    <>
    <div className="flex basis-full flex-wrap md:gap-10 gap-5 md:px-0 px-2 justify-center flex-row">
      <h1 className="flex md:basis-1/4 md:text-8xl text-6xl font-extrabold leading-20 uppercase md:pt-10 pt-0 mb-5">{"Roulez\navec\npassion"}</h1>
      <div className="flex px-2 flex-col md:basis-1/4 justify-center">
          <img src="/landingPageImage.png" alt="home" className="flex min-w-full rounded-lg object-contain" />
          <div className="flex flex-row gap-4  flex-wrap justify-center">
            {/* <ButtonGroup orientation="horizontal" className="rounded-full"> */}
              <Button variant="outline" size="lg" className="flex h-10 w-full rounded-full" onClick={() => handleBtnClick("locations")}>Découvrir nos véhicules en location</Button>
              <Button variant="outline" size="lg" className="flex h-10 w-full rounded-full bg-black text-white" onClick={() => handleBtnClick("achats")}>Découvrir nos véhicules en vente</Button>
            {/* </ButtonGroup> */}
          </div>
      </div>
      </div>
        {/* add a super nice looking section to display latest vehicles using shadcn cards */}
        <div className="px-4 max-w-3xl self-center justify-center flex-col gap-4 mt-15">
          <h2 className="text-3xl font-semibold mb-6 self-start">Nos dernières offres</h2>
          <div className="flex flex-row flex-wrap gap-4 md:justify-start justify-center">
            {latestVehicles.length > 0 ? latestVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} searchParams={new URLSearchParams({ type: "achats", pagenumber: "1", pagesize: "20" }).toString()} />
            )) : <p>Aucune offre disponible pour le moment.</p>}
          </div>
        </div> 
    </>
  )
}