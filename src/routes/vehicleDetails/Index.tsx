import { useEffect, useState } from "react";
import { type VehicleType } from "../../types/VehicleType";
import { HugeiconsIcon } from "@hugeicons/react";
import { Check, Folder01Icon } from "@hugeicons/core-free-icons";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VehicleDetails() {
    const [vehicle, setVehicle] = useState<VehicleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentVehicleId:number = parseInt(window.location.pathname.split("/").pop() || "0");

    const fetchVehicleDetails = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/vehicles/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch vehicle details");
            }
            const data = await response.json();
            setVehicle(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchVehicleDetails(currentVehicleId);
    }, [currentVehicleId]);

    return (
    <div>
      {/* Add your vehicle details content here */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {vehicle && (
            <div className="flex flex-col gap-5 mx-30 mt-10">
                <h1 className="text-4xl">{vehicle.brand} {vehicle.model} {vehicle.year}</h1>
                <div className="flex flex-row min-w-full gap-5">
                    <div className="flex basis-1/2 rounded-lg bg-white">
                        <img src={vehicle.imageUrl || "/NoPicture.png"} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-auto rounded-lg" />
                    </div>
                    <div className="flex basis-1/2 flex-col gap-10 p-20 align-stretch rounded-lg bg-white">
                        <div className="flex flex-row justify-between">
                            <h2 className="text-2xl font-medium">Soumettre un dossier</h2>
                            <HugeiconsIcon icon={Folder01Icon} className="w-8 h-8" />
                        </div>
                        <FieldGroup className="flex flex-row gap-4">

                            <Input id="insurance" name="insurance" type="checkbox" className="rounded-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            <FieldLabel htmlFor="insurance" className="text-md font-medium text-gray-700">Assurance</FieldLabel>
                        </FieldGroup>
                        <Button className="w-full bg-black" onClick={() => alert("Dossier soumis !")}>Soumettre</Button>
                        
                    </div>
                </div>
                <h2></h2>
                <p>Year: {vehicle.year}</p>
                <p>Price: ${vehicle.listedAmount}</p>
                {/* Add more vehicle details as needed */}
            </div>
        )}
    </div>
  );
}