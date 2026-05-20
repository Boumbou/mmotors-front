import { listingTypeLabels, type VehicleType } from "@/types/VehicleType";
import { useEffect, useState } from "react";
import ManagementTable from "./VehicleTable";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add } from "@hugeicons/core-free-icons";
import { Link } from "react-router";

export default function VehicleManagementList() {
    const [vehicles, setVehicles] = useState<VehicleType[]>([]);

    const columns = [
        { header: "Marque", accessor:  "brand" },
        { header: "Modèle", accessor: "model" },
        { header: "Année", accessor: "year" },
        { header: "Prix", accessor: "listedAmount" },
        { header: "Type", accessor: "listingType" },
    ];

    useEffect(() => {
        const fetchVehicles = async () => {
            //fetch user applications from backend
            const userVehicles = await fetch("/api/vehicles",{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${user.token}`
                }
            })
            .then(response => response.json())
            .catch(error => {
                console.error("Error fetching user vehicles:", error);
                return [];
            });

            if (userVehicles) {
                setVehicles(userVehicles.items);
            }
        }

        fetchVehicles();
    },[]);

    return (
        <>
            <Link to="/catalogue/vehicle/nouveau">
                <Button variant="outline" className="mb-4">
                    <HugeiconsIcon icon={Add} className="mr-2"/>
                    Ajouter un véhicule
                </Button>
            </Link>
            <ManagementTable vehicles={vehicles} columns={columns} />
        </>
    );
}
