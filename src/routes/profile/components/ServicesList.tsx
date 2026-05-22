import {Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add, Edit, Trash2 } from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ServiceType } from "@/types/ServiceType";
import { toast } from "sonner";
import ServiceForm from "./ServiceForm";
import useStore from "@/routes/auth/userStore";

export function ServicesList({ services, refreshServices }: { services: ServiceType[], refreshServices: () => void }) {
    const user = useStore((state: any) => state.user);
    
    


    const handleDelete = async (id: number) => {
        if (!id) return;
        try {
            const response = await fetch(`/api/services/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
            });

            if (response.ok) {
                refreshServices();
                toast.success("Service supprimé avec succès !");
            } else {
                toast.error("Erreur lors de la suppression du service.");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Erreur lors de la suppression du service.");
        }   
    }

    return (
        <>
            <Dialog >
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 self-start mb-2" >
                        <HugeiconsIcon icon={Add} className="w-4 h-4" /> Ajouter un service
                    </Button>
                </DialogTrigger>
                <DialogContent className="md:min-w-2xl  min-w-90%">
                    <DialogTitle>Service </DialogTitle>
                    <ServiceForm  refreshServices={refreshServices} />
                </DialogContent>
            </Dialog>
            {services.map((service) => (
                <Card key={service.id} className="w-full rounded-md border-none">
                    {/* <CardTitle className="mx-3 my-0 py-0 flex-">
                    </CardTitle> */}
                    <CardContent className="flex flex-row gap-3 justify-between py-0">
                        <div className="flex flex-col gap-0">
                            <p>
                                {service.name}
                            </p>
                            <p className="w-full text-sm font-light text-slate-600">
                                {service.description}
                            </p>
                        </div>
                        <div>
                            <Dialog >
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 self-start">
                                        <HugeiconsIcon icon={Edit} className="w-4 h-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="md:min-w-2xl  min-w-90%">
                                    <DialogTitle>Service </DialogTitle>
                                    <ServiceForm service={service} refreshServices={refreshServices} deleteService={handleDelete} />
                                </DialogContent>
                            </Dialog>
                            <Button variant="destructive" size="sm" className="ml-2 h-8 self-start" onClick={()=>handleDelete(service.id)}>
                                <HugeiconsIcon icon={Trash2} className="w-4 h-4" />
                            </Button>
                        </div>
                        

                        

                    </CardContent>
                </Card>
                )
            )}
            </>
            
        )
    
}