import type { VehicleType } from "@/types/VehicleType";
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

export default function Vehicles() {
    //get last url section to determine if we are in achats or locations
    const [searchParams] = useSearchParams();
    const transactionType = searchParams.get("type") || null;
    const type = transactionType == "achats" ? 0 : transactionType === "locations" ? 1 : null;
    const [vehicles, setVehicles] = useState<VehicleType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        //fetch vehicles from /api/vehicles?type=transactionType
        const fetchVehiclesByType = async () => {
            setLoading(true);
            const fetchedVehicles = await fetchVehicles();
            setVehicles(fetchedVehicles.filter((vehicle) => {return vehicle.listingType == type})); // filter vehicles by transaction type
            setLoading(false);
        };
        fetchVehiclesByType();
    }, [transactionType]);

    //fetch vehicles from /api/vehicles
    const fetchVehicles = async (): Promise<VehicleType[]> => {
        const response = await fetch("/api/vehicles");
        const data = await response.json();
        return data;
    }

    return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex min-w-80 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Vehicles</h1>
          {/* wrap cards in a flex row with gap and make them responsive with min width */}
          <div className="flex flex-row flex-wrap gap-5 w-full">
            {loading && (
              <p className="text-center w-full">Loading...</p>
            )}

            {vehicles.length>0 && vehicles.map((vehicle) => (
              
              <Card key={vehicle.id} className="flex min-w-[250px] md:basis-1/4 xs:basis-full bg-white">
                   <img src={vehicle.imageUrl || "/NoPicture.png"} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-48 object-cover rounded-none" />
                <CardHeader>
                  <div className="flex flex-row">
                    <CardTitle>{vehicle.brand} {vehicle.model}</CardTitle>
                    <Badge variant="secondary" className="ml-auto">{vehicle.listingType === 0 ? "Achat" : "Location"}</Badge>
                  </div>
                  <CardDescription>{vehicle.year} - {vehicle.motorization}</CardDescription>
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
            {vehicles.length == 0 && !loading && (
              <img src="/NoResult.png" alt="No results" className="w-full h-100 object-cover rounded-none mask" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}