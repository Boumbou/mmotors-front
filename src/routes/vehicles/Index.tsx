import {  listingTypeLabels, motorizationLabels, type VehicleListResponse } from "@/types/VehicleType";
import { Link, useSearchParams } from "react-router"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import MmotorsPagination from "@/components/pagination/MmotorsPagination";

export default function Vehicles() {
    //get last url section to determine if we are in achats or locations
    const [searchParams] = useSearchParams();
    const [transactionType, setTransactionType] = useState<string>(searchParams.get("type")!);
    const [vehiclesResponse, setVehiclesResponse] = useState<VehicleListResponse>({ items: [], totalCount: 0, pageNumber: 0, pageSize: 0, totalPages: 0 });
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
      //fetch vehicles from /api/vehicles?type=transactionType
      const fetchVehiclesByType = async () => {
        const fetchedVehicles = await fetchVehicles();
        setVehiclesResponse(fetchedVehicles); 
      };
      fetchVehiclesByType();
    }, [transactionType]);
    
    //fetch vehicles from /api/vehicles
    const fetchVehicles = async (page: number = 1): Promise<VehicleListResponse> => {
        setLoading(true); 
        const type = transactionType == "achats" ? "sale" : transactionType === "locations" ? "rental" : null;
        const response = await fetch(`/api/vehicles?type=${type}&pagenumber=${page}&pagesize=1`);
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
        <div className="flex min-h-80% justify-start p-6 mx-30">
          <div className="flex min-w-80 flex-col gap-4 text-sm leading-loose">
            <div>
              <h1 className="font-medium text-4xl">Vehicles</h1>
            </div>
            <div>
              {/* wrap cards in a flex row with gap and make them responsive with min width */}
              {loading && (
                <p className="text-center w-full">Loading...</p>
              )}
              <ToggleGroup onValueChange={handleToggleChange} type="single" className="bg-transparent  p-1 my-4" defaultValue={transactionType}>
                <ToggleGroupItem value="achats" className="data-[state=on]:bg-blue-500 data-[state=on]:text-white px-3 py-1 rounded-md">Achats</ToggleGroupItem>
                <ToggleGroupItem value="locations" className="data-[state=on]:bg-blue-500 data-[state=on]:text-white px-3 py-1 rounded-md">Locations</ToggleGroupItem>
              </ToggleGroup>
              <div className="flex flex-row flex-wrap gap-5 w-full">

                {vehiclesResponse.items.length>0 && vehiclesResponse.items.map((vehicle) => (
                  
                  <Card key={vehicle.id} className="flex min-w-[250px] md:basis-1/4 xs:basis-full bg-white">
                      <img src={vehicle.imageUrl || "/NoPicture.png"} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-48 object-cover rounded-none" />
                    <CardHeader>
                      <div className="flex flex-row">
                        <CardTitle>{vehicle.brand} {vehicle.model}</CardTitle>
                        <Badge variant="secondary" className="ml-auto">{listingTypeLabels[vehicle.listingType]}</Badge>
                      </div>
                      <CardDescription>{vehicle.year} - {motorizationLabels[vehicle.motorization]}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Kilometrage: {vehicle.mileage} km</p>
                      <p>Prix: {vehicle.listedAmount} €</p>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/vehicles/${vehicle.id}`}>
                        <CardAction>Voir les détails</CardAction>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
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