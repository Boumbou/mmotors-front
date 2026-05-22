import {Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add, Edit, Trash2 } from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import DocTemplateForm from "./DocTemplateForm";
import useStore from "@/routes/auth/userStore";
import { useState } from "react";

export function DocTemplateList() {
    const user = useStore((state: any) => state.user);
    const [templates, setTemplates] = useState<{ id: number; name: string; type: string ;isActive: boolean ;updatedAt: string }[]>([]);

    const fetchTemplates = async () => {
        try {
            const response = await fetch("/api/documenttemplate", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
            });
            const data = await response.json();
            setTemplates(data);
        } catch (error) {
            throw new Error("Error fetching document templates: " + error);
        }
    }

    const handleDelete = async (id: number) => {
        if (!id) return;
        try {
            const response = await fetch(`/api/documenttemplate/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
            });

            if (response.ok) {
                fetchTemplates();
                toast.success("Modèle supprimé avec succès !");
            } else {
                toast.error("Erreur lors de la suppression du modèle.");
            }
        } catch (error) {
            console.error("Error deleting modèle:", error);
            toast.error("Erreur lors de la suppression du modèle.");
        }   
    }

    useState(() => {
        fetchTemplates();
    });
    
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
                    <DocTemplateForm  refreshTemplates={fetchTemplates} deleteTemplate={handleDelete} />
                </DialogContent>
            </Dialog>
            {templates.map((template) => (
                <Card key={template.id} className="w-full rounded-md border-none">
                    {/* <CardTitle className="mx-3 my-0 py-0 flex-">
                    </CardTitle> */}
                    <CardContent className="flex flex-row gap-3 justify-between py-0">
                        <div className="flex flex-col gap-0">
                            <p>
                                {template.name}
                            </p>
                            <p className="w-full text-sm font-light text-slate-600">
                                {template.type}
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
                                    <DialogTitle>Modèle </DialogTitle>
                                    <DocTemplateForm template={template} refreshTemplates={fetchTemplates} />
                                </DialogContent>
                            </Dialog>
                            <Button variant="destructive" size="sm" className="ml-2 h-8 self-start" onClick={() => handleDelete(template.id)}>
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