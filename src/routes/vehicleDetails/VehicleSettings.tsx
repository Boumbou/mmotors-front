import { useLocation, useParams } from "react-router";
import useStore from "../auth/userStore";
import Forbidden from "@/components/Foribidden";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motorizationLabels, vehicleStatusLabels, type VehicleType } from "@/types/VehicleType";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Save, Trash2 } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function VehicleSettings() {
    const { id } = useParams<{ id: string }>();
    const vehicleId = parseInt(id || "", 10);
    const user = useStore((state) => state.user);
    const [vehicleDetails, setVehicleDetails] = useState<VehicleType | null>(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    if (user?.roles.includes("Customer")) {
        return <Forbidden />;
    }

    const fetchVehicleDetails = async () => {
        try {
            const response = await fetch(`/api/vehicles/${vehicleId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch vehicle details");
            }
            const data = await response.json();
            // Handle the fetched vehicle details as needed
            setVehicleDetails(data);
        } catch (error) {
            console.error("Error fetching vehicle details:", error);
        }
    }

    const updateVehicleDetails = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>) => {
        const { name, value } = event.target;
        // keep track of each field changes and setVehicleDetails to be ready to put
        if (name === "listingType" || name === "motorization" || name === "status" || name === "rentalTermMonths") {
            setVehicleDetails({
                ...vehicleDetails,
                [name]: parseInt(value)
            } as VehicleType);
        }else{
            setVehicleDetails({
                ...vehicleDetails,
                [name]: value
            } as VehicleType);
        }
    }

    useEffect(() => {
        if (location.pathname.includes("nouveau")) {
            return;
        }
        setLoading(true);

        setTimeout(() => {
            fetchVehicleDetails();
        }, 3000);

        setLoading(false);
    }, [vehicleId]);

    return (
        <>
            {
                loading && <Skeleton className="self-center w-full max-w-2xl h-48 bg-slate-300 mb-4" />
                
            }
            {
                (vehicleDetails || location.pathname.includes("nouveau")) && (
                    <Card className="self-center w-full max-w-2xl h-fit pb-10 mb-4 text-slate-500">
                        <CardHeader className="flex flex-row justify-between">

                            {vehicleDetails && <h2 className="text-lg font-medium">Paramètres du véhicule # {vehicleDetails.id}</h2> }
                            {!vehicleDetails && <h2 className="text-lg font-medium">Ajouter un nouveau véhicule</h2> }
                            <div>
                                <Button className="bg-blue-500 mr-3" variant="default" size="lg" onClick={()=>toast.warning("Feature coming")}>
                                    <HugeiconsIcon icon={Save} className="w-4 h-4" />
                                </Button>
                                {/* delete button */}
                                {vehicleDetails?.id && (
                                     <Button  variant="destructive" size="lg" onClick={()=>toast.warning("Feature coming")}>
                                        <HugeiconsIcon icon={Trash2} className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form className="flex flex-col gap-4">
                                {/* marque */}
                                <FieldGroup>
                                    <FieldLabel htmlFor="brand">
                                        Marque
                                    </FieldLabel>
                                    <Input onChange={updateVehicleDetails} id="brand" name="brand" value={vehicleDetails?.brand} defaultValue={vehicleDetails?.brand} />
                                </FieldGroup>

                                {/* modèle */}
                                <FieldGroup>
                                    <FieldLabel htmlFor="model">Modèle</FieldLabel>
                                    <Input onChange={updateVehicleDetails} id="model" name="model" value={vehicleDetails?.model} defaultValue={vehicleDetails?.model} />
                                </FieldGroup>

                                {/* année */}
                                <FieldGroup>
                                    <FieldLabel htmlFor="year">Première immatriculation</FieldLabel>
                                    <Input onChange={updateVehicleDetails} id="year" name="year" value={vehicleDetails?.year} defaultValue={vehicleDetails?.year} />
                                </FieldGroup>

                                {/* kilométrage */}
                                <FieldGroup>
                                    <FieldLabel htmlFor="mileage">Kilométrage</FieldLabel>
                                    <Input onChange={updateVehicleDetails} id="mileage" name="mileage" value={vehicleDetails?.mileage} defaultValue={vehicleDetails?.mileage} />
                                </FieldGroup>

                                {/* montant listé */}
                                <FieldGroup>
                                    <FieldLabel htmlFor="listedAmount">Montant</FieldLabel>
                                    <Input onChange={updateVehicleDetails} id="listedAmount" name="listedAmount" value={vehicleDetails?.listedAmount} defaultValue={vehicleDetails?.listedAmount} />
                                </FieldGroup>
                                {/* motorisation */}
                                <FieldGroup >
                                    <FieldLabel htmlFor="motorization">Motorisation</FieldLabel>
                                    <Select 
                                        onValueChange={(value)=>updateVehicleDetails({ target: { name: 'motorization', value } } as React.ChangeEvent<HTMLInputElement>)} 
                                        name="motorization" value={String(vehicleDetails?.motorization)} 
                                        defaultValue={String(vehicleDetails?.motorization)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner la motorisation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.entries(motorizationLabels).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
    
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FieldGroup>

                                {/* type d'annonce */}
                                <FieldGroup>
                                    <FieldLabel htmlFor="listingType">Type d'annonce</FieldLabel>
                                    <Field orientation="horizontal">
                                        <Select 
                                            onValueChange={(value=>updateVehicleDetails({target:{name:"listingType",value}} as React.ChangeEvent<HTMLInputElement>))} 
                                            value={String(vehicleDetails?.listingType)} 
                                            defaultValue={String(vehicleDetails?.listingType)} 
                                            name="listingType" 
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue onChange={updateVehicleDetails} placeholder="Sélectionner le type d'annonce" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="0">Vente</SelectItem>
                                                    <SelectItem value="1">Location</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </FieldGroup>

                                {/* statut du véhicule */}
                                <FieldGroup>
                                    <FieldLabel htmlFor="status">Statut du véhicule</FieldLabel>
                                    <Select 
                                        onValueChange={(value=>updateVehicleDetails({target:{name:"status",value:value}} as React.ChangeEvent<HTMLInputElement>))} 
                                        value={String(vehicleDetails?.status)} 
                                        defaultValue={String(vehicleDetails?.status)} 
                                        name="status" 
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue onChange={updateVehicleDetails} placeholder="Sélectionner le statut du véhicule" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.entries(vehicleStatusLabels).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FieldGroup>
                                
                                {/* durée de location */}
                                <FieldGroup>
                                    <FieldLabel htmlFor="rentalTermMonths">Durée de location (mois)</FieldLabel>
                                    <Field orientation="horizontal">
                                        <Select 
                                        onValueChange={(value=>updateVehicleDetails({target:{name:"rentalTermMonths",value:value}} as React.ChangeEvent<HTMLInputElement>))} 
                                        value={String(vehicleDetails?.rentalTermMonths)} 
                                        defaultValue={String(vehicleDetails?.rentalTermMonths)} 
                                        name="rentalTermMonths"
                                        disabled={vehicleDetails?.listingType !== 1}
                                    >
                                            <SelectTrigger className="w-full">
                                                <SelectValue onChange={updateVehicleDetails} placeholder="Sélectionner la durée de location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="24">24 mois</SelectItem>
                                                    <SelectItem value="48">48 mois</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </FieldGroup>
                                
                                
                                

                            </form>
                        </CardContent>
                    </Card>
                )
            }
        </>
    )
}