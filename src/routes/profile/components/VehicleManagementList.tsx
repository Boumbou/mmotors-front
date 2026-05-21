import { type VehicleType } from "@/types/VehicleType";
import { useEffect, useState } from "react";
import ManagementTable from "./VehicleTable";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add } from "@hugeicons/core-free-icons";
import { Link } from "react-router";
import MmotorsPagination from "@/components/pagination/MmotorsPagination";

export default function VehicleManagementList() {
    const [vehicles, setVehicles] = useState<VehicleType[]>([]);
    const [result, setResult] = useState({
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
    });

    const columns = [
        { header: "Marque", accessor:  "brand" },
        { header: "Modèle", accessor: "model" },
        { header: "Année", accessor: "year" },
        { header: "Prix", accessor: "listedAmount" },
        { header: "Type", accessor: "listingType" },
    ];

    const fetchVehicles = async (pageNumber = 1, pageSize = 10) => {
        //fetch user applications from backend
        const userVehicles = await fetch(`/api/vehicles?pagenumber=${pageNumber}&pageSize=${pageSize}`,{
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
            setResult({
                totalCount: userVehicles.totalCount,
                pageNumber: userVehicles.pageNumber,
                pageSize: userVehicles.pageSize,
                totalPages: userVehicles.totalPages,
            });
        }
    }

    useEffect(() => {

        fetchVehicles(result.pageNumber, result.pageSize);
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
            <div className="mt-3">
                <MmotorsPagination
                    currentPage={result.pageNumber}
                    totalPages={result.totalPages}
                    onPageChange={(page) => {
                        // Handle page change, e.g., fetch new data for the selected page
                        fetchVehicles(page, result.pageSize);
                    }}
                />
            </div>
        </>
    );
}
