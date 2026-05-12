import { useEffect, useState } from "react";
import { listingTypeLabels, type VehicleType } from "../../types/VehicleType";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon } from "@hugeicons/core-free-icons";
import {  FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router";

export default function VehicleDetails() {
    const [vehicle, setVehicle] = useState<VehicleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentVehicleId:number = parseInt(window.location.pathname.split("/").pop() || "0");
    const location = useLocation();

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
        


        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {vehicle && (
            <div className="flex flex-col gap-5 md:mx-30 mx-5 md:justify-start justify-center mt-10">
                <Breadcrumb>
                    <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={"/catalogue"+location.search}>Catalogue</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#" >{vehicle ? `${vehicle.brand} ${vehicle.model}` : "Détails du véhicule"}</BreadcrumbLink>
                    </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-4xl">{vehicle.brand} {vehicle.model} {vehicle.year}</h1>
                <div className="flex flex-row flex-wrap min-w-full gap-5">
                    <div className=" md:min-100 md:max-w-150 basis-full rounded-lg bg-white">
                        <img src={vehicle.imageUrl || "/NoPicture.png"} alt={`${vehicle.brand} ${vehicle.model}`} className="w-auto h-full rounded-lg object-cover"/>
                    </div>
                    <div className=" xl:min-100 xl:max-w-100 basis-full flex-col gap-10 p-20 align-stretch rounded-lg bg-white ">
                        <div className="flex flex-row justify-between mb-10">
                            <h2 className="md:text-2xl  text-lg font-medium">Soumettre un dossier</h2>
                            <HugeiconsIcon icon={Folder01Icon} className="w-8 h-8 text-slate-500" />
                        </div>
                        {listingTypeLabels[vehicle.listingType] === "Location" && (
                            <FieldGroup className="flex flex-row gap-4">
                                <Input id="driverLicense" name="driverLicense" type="checkbox" className="rounded-full border-gray-300 w-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                <FieldLabel htmlFor="driverLicense" className="text-md font-medium text-gray-700">Permis de conduire</FieldLabel>
                            </FieldGroup>
                        )}
                        
                        <Button className="w-full bg-black mt-20" onClick={() => alert("Dossier soumis !")}>Soumettre</Button>
                        
                    </div>
                </div>
                <Badge variant="outline" className="w-fit text-lg p-5 bg-blue-100 border-blue-300">
                    { listingTypeLabels[vehicle.listingType]}
                </Badge>
                <h2 className="text-xl">--- Détails du véhicule</h2>
                <div className="flex flex-row flex-wrap md:gap-20 gap-10">
                    <div className="flex-col w-50">
                        <p className="text-slate-400 italic font-light">Marque</p> 
                        <p>{vehicle.brand}</p>
                    </div>
                    <div className="flex-col w-50">
                        <p className="text-slate-400 italic font-light">Modèle</p> 
                        <p>{vehicle.model}</p>
                    </div>
                    <div className="flex-col w-50">
                        <p className="text-slate-400 italic font-light">Année</p> 
                        <p>{vehicle.year}</p>
                    </div>
                    <div className="flex-col w-50">
                        <p className="text-slate-400 italic font-light">Prix</p> 
                        <p>{vehicle.listedAmount} €</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
              