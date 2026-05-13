import { useEffect, useState } from "react";
import { listingTypeLabels, type VehicleType } from "../../types/VehicleType";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon, Info } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation, useNavigate } from "react-router";
import useStore from "../auth/userStore";

export default function VehicleDetails() {
    const [vehicle, setVehicle] = useState<VehicleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentVehicleId:number = parseInt(window.location.pathname.split("/").pop() || "0");
    const location = useLocation();
    const user = useStore((state: any) => state.user);
    const navigate = useNavigate();

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
            // <div className="flex flex-col gap-5 md:mx-30 mx-5 md:justify-start justify-center mt-10">
            <>
            
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
                    {/* display application option for customer only */}
                    {(user?.roles.includes("Customer") || !user) && (
                        <div className=" lg:basis-1/2 basis-full flex-col gap-10 p-8 align-stretch rounded-lg bg-white ">
                            <div className="flex flex-row justify-between mb-10">
                                <h2 className="md:text-2xl  text-lg font-medium">Soumettre un dossier</h2>
                                <HugeiconsIcon icon={Folder01Icon} className="w-8 h-8 text-slate-500" />
                            </div>
                            {listingTypeLabels[vehicle.listingType] === "Location" ? (
                                // write a paragraph to explain the process of submitting an application in simple terms
                                <p className="text-slate-500 bg-slate-100 p-4 rounded-lg"> 
                                    <HugeiconsIcon icon={Info} className="w-6 h-6 inline-block mr-2 mb-3" />
                                    <em className="font-bold">Intéressé ?</em> <br /> 
                                    Pour soumettre un dossier de location, veuillez cliquer sur le bouton "Soumettre". 
                                    Vous serez redirigé vers une page de formulaire où vous pourrez sélectionner les services que 
                                    vous souhaitez et fournir les informations et documents justificatifs. Une fois votre dossier soumis, 
                                    notre équipe examinera votre demande et vous contactera pour les étapes suivantes.
                                </p>
                            ) : 
                            (
                                // write a paragraph to explain the process of submitting an application in simple terms
                                <p className="text-slate-500 bg-slate-100 p-4 rounded-lg"> 
                                    <HugeiconsIcon icon={Info} className="w-6 h-6 inline-block mr-2 mb-3" />
                                    <em className="font-bold">Intéressé ?</em> <br /> 
                                    Pour soumettre un dossier d'achat, veuillez cliquer sur le bouton "Soumettre". 
                                    Vous serez redirigé vers une page de formulaire faire votre offre d'achat et fournir les informations
                                    et documents justificatifs. Une fois votre dossier soumis, notre équipe examinera votre demande 
                                    et vous contactera pour les étapes suivantes.
                                </p>
                            )
                            }
                            {user ?(
                                <Button className="w-full bg-black mt-20" onClick={() => navigate("/application", { state: { vehicleId: vehicle } })}>Soumettre</Button>
                            ) : (
                                <>
                                    <p>Connectez vous pour soumettre un dossier.</p>
                                    <Button className="w-full bg-black mt-20" onClick={() => navigate("/auth/login", { state: { from: location.pathname } })}>Connectez-vous</Button>
                                </>
                            )}

                            
                        </div>
                    )}
                </div>
                <Badge variant="outline" className="w-fit text-lg p-5 bg-blue-100 border-blue-300">
                    { listingTypeLabels[vehicle.listingType]}
                </Badge>
                <h2 className="text-xl">--- Détails du véhicule</h2>
                <div className="flex flex-row flex-wrap md:gap-20 gap-10 mb-20">
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
            </>
            // </div>
        )}
    </div>
  );
}
              