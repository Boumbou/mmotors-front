import { useEffect, useState } from "react";
import { listingTypeLabels, type VehicleType } from "../../types/VehicleType";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation, useNavigate } from "react-router";
import useStore from "../auth/userStore";
import NewApplication from "./components/NewApplication";
import type { ServiceType } from "../../types/ServiceType";
import AlreadyApplied from "./components/AlreadyApplied";

export default function VehicleDetails() {
    const [vehicle, setVehicle] = useState<VehicleType | null>(null);
    const [availableServices, setAvailableServices] = useState<ServiceType[]>([]);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentVehicleId:number = parseInt(window.location.pathname.split("/").pop() || "0");
    const location = useLocation();
    const navigate = useNavigate();
    const user = useStore((state: any) => state.user);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    
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
            throw err;
        } finally {
            setLoading(false);
        }
    }
    
    const fetchAvailableServices = async () => {
        const currentListingType = location.search.search("achats") !== -1 ? 0 : 1;

        try {
            const response = await fetch(`/api/services?listingType=${currentListingType}`);
            if (!response.ok) {
                throw new Error("Failed to fetch available services");
            }
            const data = await response.json();
            setAvailableServices(data);
        } catch (err: any) {
            console.error(err.message);
        }
    }

    const checkIfApplied = async () => {
        try {
            const response = await fetch(`/api/applications`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to check if already applied");
            }
            const data = await response.json();
            if (data.items.find((application: any) => application.vehicleId === currentVehicleId)) {
                setAlreadyApplied(true);
            }
        } catch (err: any) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        const getVehiclesAndServices = async () => {
            await fetchVehicleDetails(currentVehicleId);
            if(user?.roles.includes("Customer")) {
                await checkIfApplied();
                await fetchAvailableServices();
            }
        }
        getVehiclesAndServices();
    }, [currentVehicleId]);

    const onCheckboxChange = (serviceId: number) => {
        setSelectedServices((prevSelected) => {
            if (prevSelected.includes(serviceId)) {
                return prevSelected.filter((id) => id !== serviceId);
            } else {
                return [...prevSelected, serviceId];
            }
        });
    }

    const onInitiateApplication = () => {
        // navigate to application form page with selected services and vehicle id as state
        const selectedServiceList: ServiceType[] = availableServices.filter((service) => selectedServices.includes(service.id));
        navigate("/application", { state: {search: location.search, vehicle: vehicle, services:selectedServiceList } });
    }

    return (
    <div>
        


        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {vehicle && (
            // <div className="flex flex-col gap-5 md:mx-30 mx-5 md:justify-start justify-center mt-10">
            <div className="flex flex-col gap-5">
            
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
                        <>
                            {alreadyApplied ? (
                                <AlreadyApplied />
                            ) : (
                                <NewApplication 
                                    listingType={vehicle.listingType} 
                                    availableServices={availableServices} 
                                    selectedServices={selectedServices} 
                                    onCheckboxChange={onCheckboxChange} 
                                    onInitiateApplication={onInitiateApplication}
                                />
                            )}
                        </>
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
            </div>
            // </div>
        )}
    </div>
  );
}
              