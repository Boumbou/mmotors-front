import {  type VehicleListResponse } from "@/types/VehicleType";
import { useSearchParams } from "react-router"


import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import MmotorsPagination from "@/components/pagination/MmotorsPagination";
import VehicleCard from "./components/VehicleCard";
import VehicleListSkeleton from "./components/VehicleListSkeleton";

export default function Vehicles() {
    //get last url section to determine if we are in achats or locations
    const [searchParams] = useSearchParams();
    const [transactionType, setTransactionType] = useState<string>(searchParams.get("type")!);
    const [vehiclesResponse, setVehiclesResponse] = useState<VehicleListResponse>({ items: [], totalCount: 0, pageNumber: 0, pageSize: 0, totalPages: 0 });
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
      //fetch vehicles from /api/vehicles?type=transactionType
      const fetchVehiclesByType = async () => {
        const fetchedVehicles = await fetchVehicles(parseInt(searchParams.get("pagenumber")!));
        setVehiclesResponse(fetchedVehicles); 
      };
      fetchVehiclesByType();
    }, [transactionType]);
    
    //fetch vehicles from /api/vehicles
    const fetchVehicles = async (page: number = 1): Promise<VehicleListResponse> => {
        setLoading(true); 
        const type = transactionType == "achats" ? "sale" : transactionType === "locations" ? "rental" : null;
        const response = await fetch(`/api/vehicles?type=${type}&pagenumber=${page}&pagesize=20`);
        const data = await response.json();
        setLoading(false);
        return data;
    }

    //handle toggle change
    const handleToggleChange = (value: string) => {
        if (value === undefined) {
          return;
        }

        searchParams.set("type", value);
        searchParams.set("pagenumber", "1");
        window.history.pushState(null, "", `/vehicles?type=${value}&pagenumber=1&pagesize=${searchParams.get("pagesize")}`);
        setTransactionType(value);
    }

    const handlePageChange = (page: number) => {
      searchParams.set("pagenumber", page.toString());
      window.history.pushState(null, "", `/vehicles?type=${transactionType}&pagenumber=${page}&pagesize=${searchParams.get("pagesize")}`);
      fetchVehicles(page).then((data) => setVehiclesResponse(data));
    }

    return (
      <>
        <div className="flex min-h-80% justify-start py-6 md:mx-30 mx-0">
          <div className="flex w-full flex-col gap-4 text-sm leading-loose">
            <div>
              <h1 className="font-medium text-4xl">Nos véhicules</h1>
            </div>
            <div>
              {/* wrap cards in a flex row with gap and make them responsive with min width */}
              {loading && (
                <VehicleListSkeleton />
              )}
              {!loading && (
                <>
                  <ToggleGroup onValueChange={handleToggleChange} type="single" className="bg-transparent mx-0  p-0 my-4" defaultValue={transactionType}>
                    <ToggleGroupItem value="achats" className="data-[state=on]:bg-black data-[state=on]:text-white px-3 py-1 rounded-md">Achats</ToggleGroupItem>
                    <ToggleGroupItem value="locations" className="data-[state=on]:bg-black data-[state=on]:text-white px-3 py-1 rounded-md">Locations</ToggleGroupItem>
                  </ToggleGroup>
                  
                  <div className="flex flex-row flex-wrap md:justify-start justify-center gap-5 w-full">
                    {vehiclesResponse.items.length>0 && vehiclesResponse.items.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} searchParams={searchParams.toString()} />
                    ))}
                  </div>
                </>
              )}
              {vehiclesResponse.items.length == 0 && !loading && (
                <img src="/NoResult.png" alt="No results" className="w-full h-100 object-cover rounded-none mask-x-from-70% mask-x-to-90% mask-y-from-70% mask-y-to-90%" />
              )}
            </div>
          </div>
        </div>
      <div className="flex">
        <MmotorsPagination
          currentPage={parseInt(searchParams.get("pagenumber")!) || 1}
          totalPages={vehiclesResponse.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}