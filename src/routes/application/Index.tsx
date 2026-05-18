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

export default function Application() {
    const user = useStore((state: any) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const history = window.history;
    const [vehicle, setVehicle] = useState<VehicleType | null>( location.state?.vehicle || null);
    const [services, setServices] = useState<ServiceType[]>(location.state?.services || []);
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<ApplicationType | null>(null);

    const fetchVehicleDetails = async (id: number) => {
        try {
            const response = await fetch(`/api/vehicles/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch vehicle details");
            }
            const data = await response.json();
            setVehicle(data);
        } catch (err: any) {
            console.error(err.message);
            toast.error("Erreur lors du chargement des détails du véhicule");
        }
    }

    const fetchApplicationDetails = async (id:number) => {
        try {
            const response = await fetch(`/api/applications/${id}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch application details");
            }
            const data = await response.json();
            setApplication(data);
            setServices(data.applicationServices || []);
            await fetchVehicleDetails(data.vehicleId);

        } catch (error) {
            console.error("Error fetching application details:", error);
            toast.error("Erreur lors du chargement du dossier");
        } finally {
            setLoading(false);
        }

    }

    const calculateOverhead = (service: ServiceType) => {
        if (!vehicle) return 0;
        return service.overheadType === overheadType.Percentage ? 
        service.overheadValue * vehicle.listedAmount : 
        service.overheadValue;
    }

    const totalOverhead = services.reduce((total, service) => total + calculateOverhead(service), 0);

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
                    "Authorization": `Bearer ${user.token}`
                },
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

    useEffect(() => {
        // if application id is in the url, fetch application details and set application state
        const applicationId = parseInt(window.location.pathname.split("/").pop() || "0");
        if (applicationId) {
            fetchApplicationDetails(applicationId);
        }
        setLoading(false);
    }, []);

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
                                <BreadcrumbLink href={"/catalogue"+(location.state?.search || "")}>Catalogue</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/catalogue/vehicle/${vehicle?.id}${location.state?.search || ""}`} >{vehicle ? `${vehicle.brand} ${vehicle.model}` : "Détails du véhicule"}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </>
                    ) : (
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => navigate(location.state.origin, { state: { section: "applications" } })}>Mes dossiers</BreadcrumbLink>
                        </BreadcrumbItem>
                    )}
                </BreadcrumbList>
            </Breadcrumb>


            {loading ? (<p>Loading...</p>)
            :(
                <>
                    { !application &&<ApplicationCreation vehicle={vehicle!} services={services} totalOverhead={totalOverhead} calculateOverhead={calculateOverhead} onCreateApplication={onCreateApplication} />}
        
                    { application &&<ApplicationManagement vehicle={vehicle!} application={application!} totalOverhead={totalOverhead} motorizationLabels={motorizationLabels} />}
                </>
            )}

        </div>
    )
}