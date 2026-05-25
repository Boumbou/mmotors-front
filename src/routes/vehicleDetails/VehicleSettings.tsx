import { Link, useLocation, useNavigate, useParams } from "react-router";
import useStore from "../auth/userStore";
import Forbidden from "@/components/Foribidden";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motorizationLabels, VehicleStatus, vehicleStatusLabels, type VehicleType } from "@/types/VehicleType";
import { Field, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Save, Trash2 } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationStatusMap } from "@/types/ApplicationType";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";


export default function VehicleSettings() {
    const { id } = useParams<{ id: string }>();
    const vehicleId = parseInt(id || "", 10);
    const user = useStore((state) => state.user);
    const [vehicleDetails, setVehicleDetails] = useState<VehicleType>({brand: "", model: "", mileage: 0, listedAmount: 0,status:VehicleStatus.AVAILABLE} as VehicleType);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    if (user?.roles.includes("Customer")) {
        return <Forbidden />;
    }

    const validateForm = () => {
        if (!vehicleDetails) return false;
        if (vehicleDetails.brand.trim() === "") return false;
        if (vehicleDetails.model.trim() === "") return false;
        if (!vehicleDetails.year) return false;
        if (vehicleDetails.mileage < 0) return false;
        if (vehicleDetails.listedAmount <= 0) return false;
        if (vehicleDetails.motorization === undefined) return false;
        if (vehicleDetails.status === undefined) return false;
        if (vehicleDetails.listingType === undefined) return false;
        if (vehicleDetails.listingType === 1 && !vehicleDetails.rentalTermMonths) return false;
        return true;
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
        if (
            name === "listingType" || 
            name === "motorization" || 
            name === "status" || 
            name === "rentalTermMonths" 
        ) {
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

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setNewImageFile(file);
    };

    useEffect(() => {
        if (location.pathname.includes("nouveau")) {
            return;
        }
        setLoading(true);

        fetchVehicleDetails();
        

        setLoading(false);
    }, [vehicleId]);

    const onDeleteVehicle = async () => {
        
        try {

            await fetch(`/api/vehicles/${vehicleId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${user?.token}`,
                },
            });
        } catch (error) {
            toast.error("Erreur lors de la suppression du véhicule");
            throw new Error("Error deleting vehicle:", { cause: error });
        }

        toast.success("Véhicule supprimé avec succès");
        // Optionally, you can redirect the user after deletion
        navigate("/profile", { state: { section: "vehicles" } });
    }

    const onCreateOrUpdateVehicle = async () => {
        // setLoading(true);

        const isCreate = location.pathname.includes("nouveau");
        const formData = new FormData();

        if(!isCreate){
            formData.append("Id", String(vehicleDetails?.id));
            formData.append("ImageKey", String(vehicleDetails?.imageKey));
        }
            formData.append("Brand", String(vehicleDetails?.brand));
            formData.append("Model", String(vehicleDetails?.model));
            formData.append("Year", String(vehicleDetails?.year));
            formData.append("Mileage", String(vehicleDetails?.mileage));
            formData.append("ListedAmount", String(vehicleDetails?.listedAmount));
            formData.append("Motorization", String(vehicleDetails?.motorization));
            formData.append("ListingType", String(vehicleDetails?.listingType));
            formData.append("Status", String(vehicleDetails?.status));
            formData.append("RentalTermMonths", vehicleDetails?.listingType === 1 ? String(vehicleDetails.rentalTermMonths) : ""); // only include rentalTermMonths if listingType is RENTAL
        
        if (newImageFile) {
            formData.append("image", newImageFile);
        }
        

        if (vehicleDetails) {
            try {
                const response = await fetch(isCreate ? "/api/vehicles" : `/api/vehicles/${vehicleId}`, {
                    method: isCreate ? "POST" : "PUT",
                    headers: {
                        "Authorization": `Bearer ${user?.token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Impossible de sauvegarder les détails du véhicule");
                }
                toast.success(`Véhicule ${isCreate ? "créé" : "mis à jour"} avec succès`);
                // Optionally, you can redirect the user or refresh the vehicle details after saving
                if (isCreate) {
                    const createdVehicle = await response.json();
                    setVehicleDetails(createdVehicle);
                } else {
                    fetchVehicleDetails(); // Refresh details after update
                    
                }
            } catch (error) {
                toast.error(`Erreur lors de la ${isCreate ? "création" : "mise à jour"} du véhicule`);
                console.error("Error creating/updating vehicle:", error);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <>
            <Breadcrumb className="self-start max-w-2xl w-full mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => navigate("/profile", { state: { section: "vehicles" } })}>Retour aux véhicules</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className="self-center w-full max-w-2xl h-fit pb-10 mb-4 text-slate-500">
            {
                loading && (
                    <>
                        <Skeleton className="self-center w-full max-w-2xl h-48 bg-slate-300 mb-4" />
                        <Skeleton className="self-center w-full max-w-2xl h-48 bg-slate-300 mb-4" />
                        <Skeleton className="self-center w-full max-w-2xl h-48 bg-slate-300 mb-4" />
                        <Skeleton className="self-center w-full max-w-2xl h-48 bg-slate-300 mb-4" />
                        <Skeleton className="self-center w-full max-w-2xl h-48 bg-slate-300 mb-4" />
                    </>
                )
                
            }
            {
                (vehicleDetails.id || location.pathname.includes("nouveau")) && (
                    <>
                        
                        
                        <CardHeader className="flex flex-row items-center justify-between">

                            {vehicleDetails && <h2 className="text-lg font-medium">Paramètres du véhicule # {vehicleDetails.id}</h2> }
                            {!vehicleDetails && <h2 className="text-lg font-medium">Ajouter un nouveau véhicule</h2> }
                            <div className="flex flex-row items-center gap-2">
                                <Button disabled={!validateForm()} className="bg-blue-500 mr-3" variant="default" size="lg" onClick={onCreateOrUpdateVehicle}>
                                    <HugeiconsIcon icon={Save} className="w-4 h-4" />
                                </Button>
                                {/* delete button */}
                                {vehicleDetails?.id && (
                                    <DeleteDialog
                                        header="Supprimer le véhicule"
                                        description="Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible."
                                        OnDeleteApplication={onDeleteVehicle}
                                    >
                                        <Badge  variant="destructive" className="rounded-lg w-9 h-9 mt-0">
                                            <HugeiconsIcon icon={Trash2} className="w-4 h-4" />
                                        </Badge>
                                    </DeleteDialog>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form className="flex flex-col gap-4">
                                {/* marque */}
                                <FieldGroup className="mb-4">
                                    <Field>
                                        <FieldLabel htmlFor="brand">
                                            Marque
                                        </FieldLabel>
                                        <Input 
                                            onChange={updateVehicleDetails} id="brand" 
                                            name="brand" 
                                            value={vehicleDetails?.brand} 
                                            defaultValue={vehicleDetails?.brand} 
                                            className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${vehicleDetails?.brand === "" ? "border-2 border-red-300" : ""}`}
                                        />
                                    </Field>
                                </FieldGroup>

                                {/* modèle */}
                                <FieldGroup className="mb-4">
                                    <Field>
                                        <FieldLabel htmlFor="model">Modèle</FieldLabel>
                                        <Input 
                                            onChange={updateVehicleDetails} id="model" 
                                            name="model" 
                                            value={vehicleDetails?.model} 
                                            defaultValue={vehicleDetails?.model} 
                                            className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${vehicleDetails?.model === "" ? "border-2 border-red-300" : ""}`}
                                        />
                                    </Field>
                                </FieldGroup>

                                {/* année */}
                                <FieldGroup className="mb-4">
                                    <Field>
                                        <FieldLabel htmlFor="year">Première immatriculation</FieldLabel>
                                        <Input 
                                            type="number"
                                            min={2000}
                                            onChange={updateVehicleDetails} 
                                            id="year" 
                                            name="year" 
                                            value={vehicleDetails?.year} 
                                            defaultValue={vehicleDetails?.year} 
                                            className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${ !vehicleDetails?.year? "border-2 border-red-300" : ""}`}
                                        />
                                    </Field>
                                </FieldGroup>

                                {/* kilométrage */}
                                <FieldGroup className="mb-4">
                                    <Field>
                                        <FieldLabel htmlFor="mileage">Kilométrage</FieldLabel>
                                        <Input 
                                            type="number"
                                            min={0}
                                            onChange={updateVehicleDetails} 
                                            id="mileage" name="mileage" value={vehicleDetails?.mileage} defaultValue={vehicleDetails?.mileage} 
                                            className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${vehicleDetails?.mileage === 0 ? "border-2 border-red-300" : ""}`}
                                        />
                                    </Field>
                                </FieldGroup>

                                {/* montant listé */}
                                <FieldGroup className="mb-4">
                                    <Field>
                                        <FieldLabel htmlFor="listedAmount">Montant</FieldLabel>
                                        <Input 
                                            type="number"
                                            onChange={updateVehicleDetails} 
                                            id="listedAmount" name="listedAmount" value={vehicleDetails?.listedAmount} defaultValue={vehicleDetails?.listedAmount} 
                                            className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${vehicleDetails?.listedAmount === 0 ? "border-2 border-red-300" : ""}`}
                                        />
                                    </Field>
                                </FieldGroup>
                                {/* motorisation */}
                                <FieldGroup >
                                    <Field>
                                        <FieldLabel htmlFor="motorization">Motorisation</FieldLabel>
                                        <Select 
                                            onValueChange={(value)=>updateVehicleDetails({ target: { name: 'motorization', value } } as React.ChangeEvent<HTMLInputElement>)} 
                                            name="motorization" value={String(vehicleDetails?.motorization)} 
                                            defaultValue={String(vehicleDetails?.motorization)}
                                            
                                        >
                                            <SelectTrigger className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${!vehicleDetails?.motorization ? "border-2 border-red-300" : ""}`}>
                                                <SelectValue 
                                                placeholder="Sélectionner la motorisation" 
                                                />
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
                                    </Field>
                                </FieldGroup>

                                {/* statut du véhicule */}
                                <FieldGroup className="mb-4">
                                    <Field>
                                        <FieldLabel htmlFor="status">Statut du véhicule</FieldLabel>
                                        <Select 
                                            onValueChange={(value=>updateVehicleDetails({target:{name:"status",value:value}} as React.ChangeEvent<HTMLInputElement>))} 
                                            value={String(vehicleDetails?.status)} 
                                            defaultValue={String(vehicleDetails?.status)} 
                                            name="status" 
                                        >
                                            <SelectTrigger className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${vehicleDetails?.status === undefined ? "border-2 border-red-300" : ""}`}>
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
                                    </Field>
                                </FieldGroup>

                                {/* type d'annonce */}
                                <FieldGroup className="mb-4">
                                    <Field orientation="vertical">
                                        <FieldLabel htmlFor="listingType">Type d'annonce</FieldLabel>
                                        <Select 
                                            onValueChange={(value=>updateVehicleDetails({target:{name:"listingType",value}} as React.ChangeEvent<HTMLInputElement>))} 
                                            value={String(vehicleDetails?.listingType)} 
                                            defaultValue={String(vehicleDetails?.listingType)} 
                                            name="listingType" 
                                        >
                                            <SelectTrigger className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${vehicleDetails?.listingType === undefined ? "border-2 border-red-300" : ""}`}>
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

                                
                                
                                {/* durée de location */}
                                <FieldGroup className="mb-4">
                                    <Field orientation="vertical">
                                        <FieldLabel htmlFor="rentalTermMonths">Durée de location (mois)</FieldLabel>
                                        <Select 
                                        onValueChange={(value=>updateVehicleDetails({target:{name:"rentalTermMonths",value:value}} as React.ChangeEvent<HTMLInputElement>))} 
                                        value={String(vehicleDetails?.rentalTermMonths)} 
                                        defaultValue={String(vehicleDetails?.rentalTermMonths)} 
                                        name="rentalTermMonths"
                                        disabled={vehicleDetails?.listingType !== 1}
                                    >
                                            <SelectTrigger className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${vehicleDetails?.listingType !== 1 ? "hidden" : ""} ${!vehicleDetails?.rentalTermMonths ? "border-2 border-red-300" : ""}`}>
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

                                {/* file upload */}
                                <FieldGroup className="mb-4">
                                    <FieldTitle>Image du véhicule</FieldTitle>
                                    <Field orientation="horizontal">
                                        <Field orientation="vertical">
                                            <FieldLabel htmlFor="image">Image actuelle</FieldLabel>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Link to="#" className="w-32 h-32 max-w-full object-cover rounded-md mr-4">
                                                        <img 
                                                            src={vehicleDetails?.imageUrl ?? "/NoPicture.png"}
                                                            alt={vehicleDetails?.model || "Vehicle"} 
                                                            className="w-full h-full object-cover rounded-md mr-4" 
                                                        />
                                                    </Link>
                                                </DialogTrigger>
                                                <DialogContent className="m-0 p-0">
                                                    {/* real size image */}
                                                    {/* add here the full size image */}

                                                    <img src={
                                                        vehicleDetails?.imageUrl ?? "/NoPicture.png"} 
                                                        alt={vehicleDetails?.model || "Vehicle"} className="w-full object-cover rounded-md" />
                                                </DialogContent>   
                                            </Dialog>
                                        </Field>
                                        <Input onChange={handleImageChange} id="image" name="image" type="file" accept="image/*" />
                                    </Field>
                                </FieldGroup>
                            </form>
                            {/* associated applications */}
                            {vehicleDetails?.applications   && (
                                <div className="mt-6">
                                    <h3 className="text-md font-medium mb-4">Dossiers associés</h3>
                                    <div className="flex flex-col gap-4 w-full">
                                        {vehicleDetails.applications.map((application) => (

                                            <Link to={`/application/${application.id}`} key={application.id}>
                                                <Card className={`flex flex-row bg-${ApplicationStatusMap[application.status].color}-100 p-4 hover:bg-${ApplicationStatusMap[application.status].color}-800 transition-colors`}>
                                                    <div>
                                                        <p><strong>Dossier numéro :</strong> {application.id}</p>
                                                        <p><strong>Statut :</strong> {ApplicationStatusMap[application.status].label}</p>
                                                    </div>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </>
                )
            }
            </Card>
        </>
    )
}