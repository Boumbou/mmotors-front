import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit01Icon, Trash2 } from "@hugeicons/core-free-icons";
import { listingTypeLabels, type VehicleType } from "@/types/VehicleType";
import { useNavigate } from "react-router";
import { DeleteDialog } from "@/components/DeleteDialog";
import useStore from "@/routes/auth/userStore";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ManagementTable({ vehicles, columns }: { vehicles: VehicleType[], columns: { header: string, accessor: string }[] }) {
    const navigate = useNavigate();
    const user = useStore((state) => state.user);

    if(user?.roles.includes("Customer")) {
        throw new Error("Non autorisé");
    }
    const openVehicleSettings = (vehicleId: number) => {
        // Implement the logic to open the vehicle settings page
        // For example, you can use React Router's useNavigate hook to navigate to the settings page
        navigate(`/catalogue/vehicle/${vehicleId}/edition`);
    }

    const onDeleteVehicle = async (vehicleId: number) => {
        
        try {

            await fetch(`/api/vehicles/${vehicleId}`, {
                method: "DELETE",
                credentials: "include",
            });
        } catch (error) {
            toast.error("Erreur lors de la suppression du véhicule");
            throw new Error("Error deleting vehicle:", { cause: error });
        }

        toast.success("Véhicule supprimé avec succès");
        // Optionally, you can redirect the user after deletion
        navigate(-1)
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
                {vehicles.map((vehicle : VehicleType) => (
                    <TableRow key={vehicle.id}>
                        {
                        
                            columns.map((column) => (
                                console.log(vehicle[column.accessor]),
                                console.log(vehicle.listingType),
                                <TableCell key={column.header}>
                                    <div>
                                        {
                                         column.header === "Type"?
                                            listingTypeLabels[vehicle.listingType as keyof typeof listingTypeLabels] :
                                        vehicle[column.accessor] }
                                    </div>
                                </TableCell>
                            ))
                        }

                        <TableCell className="text-center items-center">
                            {/* Add action buttons here */}
                            <Button onClick={() => openVehicleSettings(vehicle.id)} variant="outline" size="sm" className="mr-2">
                                <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4" />
                            </Button>
                            <DeleteDialog
                                header="Supprimer le véhicule"
                                description="Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible."
                                OnDeleteApplication={() => onDeleteVehicle(vehicle.id)}
                            >
                                <Badge variant="destructive" className="h-8 rounded-md mt-2">
                                    <HugeiconsIcon icon={Trash2} className="w-4 h-4" />
                                </Badge>
                            </DeleteDialog>
                            
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}