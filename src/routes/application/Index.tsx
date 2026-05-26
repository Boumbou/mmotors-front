import useStore from "../auth/userStore";
import { useLocation, useNavigate } from "react-router";
import Forbidden from "@/components/Foribidden";
import { overheadType, type ServiceType } from "@/types/ServiceType";
import { motorizationLabels, type VehicleType } from "@/types/VehicleType";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ApplicationType } from "@/types/ApplicationType";
import ApplicationCreation from "./components/ApplicationCreation";
import ApplicationManagement from "./components/ApplicationManagement";
import type { User } from "@/types/UserType";
import NoResult from "@/components/NoResult";
import { Skeleton } from "@/components/ui/skeleton";

export default function Application() {
    const applicationId = parseInt(window.location.pathname.split("/").pop() || "0");
    const user:User = useStore((state: any) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const history = window.history;
    const [vehicle, setVehicle] = useState<VehicleType | null>( location.state?.vehicle || null);
    const services: ServiceType[] = location.state?.services || [];
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<ApplicationType | null>(null);
    const [totalOverhead, setTotalOverhead] = useState(0);
    const [error, setError] = useState<string | null>(null);

    
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            // if application id is in the url, fetch application details and set application state
            if (applicationId) {
                await fetchApplicationDetails(applicationId);
            }else if (location.state?.vehicle) {
                setTotalOverhead(calculateTotalOverhead());
            } else {
                toast.error("Aucun véhicule sélectionné pour ce dossier", { duration: 2000 });
                setError("Aucun véhicule sélectionné pour ce dossier");
            }
        };

        fetchData();
        setLoading(false);
            

    }, []);

    const fetchApplicationDetails = async (id:number) => {
        
        try {
            setError(null);
            const response = await fetch(`/api/applications/${id}`, {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Failed to fetch application details");
            }
            const data = await response.json();
            setApplication(data);
            setVehicle(data.vehicle);
            setTotalOverhead(calculateTotalOverhead());
            setLoading(false);

        } catch (error) {
            console.error("Error fetching application details:", error);
            toast.error("Erreur lors du chargement du dossier");
            setLoading(false);
            setError("Erreur lors du chargement du dossier");
        }

    }

    //calculate overhead for a service based on its type and value, and the vehicle price if it's a percentage
    const calculateOverhead = (service: ServiceType) => {
        if (!vehicle) return 0;
        return service.overheadType === overheadType.Percentage ? 
        service.overheadValue * vehicle.listedAmount : 
        service.overheadValue;
    }
    
    const calculateTotalOverhead = () => {
        const effectiveServices = application ? application.applicationServices : services
        if (!effectiveServices || effectiveServices.length === 0) return 0;

        if (!vehicle) return 0;
        
        const total = effectiveServices.reduce((acc:number, service: any) => {
            const overhead = application ? service.calculatedOverheadAmount : calculateOverhead(service);
            return acc + overhead;
        }, 0);
        return total;
    }
    
    const onCreateApplication = async () => {
        if (!vehicle) {
            toast.error("Véhicule non sélectionné");
            return;
        }
        setLoading(true);
        // call api to create application with vehicle id and selected services
        const applicationData = {
            vehicleId: vehicle.id,
            userId: user.id,
            applicationType: vehicle.listingType,
            baseAmount: vehicle.listedAmount,
            totalOverheadAmount: totalOverhead,
            serviceIds: services.map(service => service.id)
        };
        
        try {
            const response = await fetch("/api/applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(applicationData)
            });
            
            if (!response.ok) {
                throw new Error("Failed to create application");
            }
            const data = await response.json();
            // add the created application to the the path
            // location.pathname = location.pathname + `/${data.id}`;
            history.replaceState(null, "", location.pathname+ `/${data.id}`);
            
            setApplication(data);
            toast.success("Dossier créé avec succès");
            console.log("Created application:", data);
        } catch (error) {
            console.error("Error creating application:", error);
            toast.error("Erreur lors de la création du dossier");
        } finally {
            setLoading(false);
        }
    }
    

    if (!user) {
            return (
                <div className="flex flex-col items-center justify-center mt-20 gap-5">
                    <Forbidden />
                </div>
            )
        }

    return (
        <div className="flex flex-col items-center justify-center mb-20 gap-5">
            <Breadcrumb className="self-start">
                <BreadcrumbList>
                    {location.state?.search ? (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => navigate("/catalogue"+(location.state?.search || ""))}>Catalogue</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => navigate(`/catalogue/vehicle/${vehicle?.id}${location.state?.search || ""}`)}>{vehicle ? `${vehicle.brand} ${vehicle.model}` : "Détails du véhicule"}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </>
                    ) : (
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => navigate(location.state.origin, { state: { section: "applications" } })}>{user.roles.includes("Customer") ? "Mes dossiers" : "Dossiers en cours"}</BreadcrumbLink>
                        </BreadcrumbItem>
                    )}
                </BreadcrumbList>
            </Breadcrumb>


            {
                error ? 
                (
                    <NoResult />
                ) : loading ? 
                (
                    <div className="w-full max-w-2xl p-6">
                        <Skeleton className="w-full bg-slate-200 h-80 mb-5" />
                        <Skeleton className="w-full bg-slate-200 h-40" />
                    </div>
                )
                :(
                    <>
                        { !applicationId &&<ApplicationCreation vehicle={vehicle!} services={services} totalOverhead={totalOverhead} calculateOverhead={calculateOverhead} onCreateApplication={onCreateApplication} />}
            
                        { application &&<ApplicationManagement vehicle={vehicle!} application={application!} motorizationLabels={motorizationLabels} />}
                    </>
                )
            }

        </div>
    )
}