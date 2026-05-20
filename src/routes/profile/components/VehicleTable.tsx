import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { Trash2 } from "@hugeicons/core-free-icons";
import { listingTypeLabels, type VehicleType } from "@/types/VehicleType";
import { useNavigate } from "react-router";

export default function ManagementTable({ vehicles, columns }: { vehicles: VehicleType[], columns: { header: string, accessor: string }[] }) {
    const navigate = useNavigate();


    const openVehicleSettings = (vehicleId: number) => {
        // Implement the logic to open the vehicle settings page
        // For example, you can use React Router's useNavigate hook to navigate to the settings page
        navigate(`/catalogue/vehicle/${vehicleId}/edition`);
    }
    
    return(
        <Table className="overflow-hidden rounded-lg bg-white" title="Nos véhicules">
            <TableHeader  className="bg-slate-800">
                <TableRow key="header" >
                        {
                            columns.map((column) => (
                                <TableHead key={column.header} className="text-white">
                                    {column.header}
                                </TableHead>
                            ))
                        }
                    <TableHead className="text-white text-center">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                        {
                            columns.map((column) => (
                                <TableCell key={column.header}>
                                    {vehicle[column.accessor as keyof VehicleType] || (column.accessor === "listingType" ? listingTypeLabels[vehicle.listingType] : "")}
                                </TableCell>
                            ))
                        }
                        {/* <TableCell className="font-medium">{vehicle.brand}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell>{vehicle.listedAmount} €</TableCell>
                        <TableCell>{listingTypeLabels[vehicle.listingType]}</TableCell> */}
                        <TableCell className="text-center items-center">
                            {/* Add action buttons here */}
                            <Button onClick={() => openVehicleSettings(vehicle.id)} variant="outline" size="sm" className="mr-2">
                                Edit
                            </Button>
                            <Button variant="destructive" size="sm" className="mr-2">
                                <HugeiconsIcon icon={Trash2}/>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}