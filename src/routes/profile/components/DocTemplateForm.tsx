import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Save, Trash2 } from "@hugeicons/core-free-icons";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, type ChangeEvent } from "react";
import useStore from "@/routes/auth/userStore";
import { Badge } from "@/components/ui/badge";


export default function DocTemplateForm({template,refreshTemplates, deleteTemplate}: {template?: { id: number; name: string; type: number ;isActive: boolean ;updatedAt: string }, refreshTemplates: () => void, deleteTemplate?: (id: number) => void}) {
    const [templateState, setTemplateState] = useState<{ id: number; name: string; type: number ;isActive: boolean ;updatedAt: string }|null>(template ||{id: 0, name: "", type: 0, isActive: true, updatedAt: ""});
    const user = useStore((state: any) => state.user);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { value, name, type } = event.target;
        const evevalue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;
        
        setTemplateState((prevState) => ({
            ...prevState,
            [name]: evevalue,
        } as typeof templateState));
    
    }

    const validateForm = () => {
        if (!templateState) return false;

        if (templateState.name?.trim() === "") return false;
        if (!templateState.type) return false;
        if (templateState.isActive === undefined) return false;
        return true;
    }

    const mapToBackEndDto = (template: typeof templateState) => {
        if(templateState?.id) {
            return {
                Id: template?.id,
                Name: template?.name,
                IsActive: template?.isActive ? true : false,
                Type: parseInt(template?.type as unknown as string, 10)
            }
        } else {

            return {
                Name: template?.name,
                IsActive: template?.isActive,
                Type: parseInt(template?.type as unknown as string, 10)
            }        
        }
    }

    const handleSave = async () => {
        if (!templateState) return;
        const method = templateState.id ? "PUT" : "POST";
        const url = templateState.id ? `/api/documenttemplate/${templateState.id}` : "/api/documenttemplate";
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(mapToBackEndDto(templateState)),
            });

            if (response.ok) {
                refreshTemplates();
                toast.success("Modèle mis à jour avec succès !");
            } else {
                toast.error("Erreur lors de la mise à jour du modèle.");
            }
        } catch (error) {
            console.error("Error updating modèle:", error);
            toast.error("Erreur lors de la mise à jour du modèle.");
        }   
    }

    

    return (

        templateState &&
            <FieldGroup>
                <Field orientation="horizontal">
                    {/* check if form is valid before enabling the save button */}
                    <Button  variant="default" size="sm" className="h-8 bg-blue-500 self-start" onClick={handleSave} disabled={!validateForm()}>
                        <HugeiconsIcon icon={Save} className="w-4 h-4" />
                    </Button>
                    {!validateForm() && <Badge className="h-8 rounded-md bg-slate-100 text-slate-500"> ! Complétez les champs obligatoires pour activer le bouton de sauvegarde</Badge>}
                    {templateState.id && deleteTemplate && (
                        <Button variant="destructive" size="sm" className="h-8 self-start" onClick={() => deleteTemplate(templateState.id)} >
                            <HugeiconsIcon icon={Trash2} className="w-4 h-4" />
                        </Button>
                    )}
                </Field>
                <Field>
                    <FieldLabel>Modèle actif</FieldLabel>
                    <Switch  defaultChecked checked={templateState.isActive} onCheckedChange={()=>handleInputChange({target: {checked: !templateState.isActive, name: "isActive"}} as ChangeEvent<HTMLInputElement>)} />
                </Field>
                <Field>
                    <FieldLabel>Nom du modèle</FieldLabel>
                    <input required name="name" onChange={(e)=>handleInputChange(e)} value={templateState.name} className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${templateState.name === "" ? "border-2 border-red-300" : ""}`} />
                </Field>
                <Field>
                    <FieldLabel>Type de modèle</FieldLabel>
                    <Select 
                        required
                        value={String(templateState.type)} 
                        defaultValue={String(0)}
                        onValueChange={(e)=>handleInputChange({target: {value: e, name: "type"}} as ChangeEvent<HTMLSelectElement>)}
                        name="type"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue  />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Commun tout contrats</SelectItem>
                            <SelectItem value="1">Uniquement pour les ventes</SelectItem>
                            <SelectItem value="2">Uniquement pour les locations</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
            </FieldGroup>
    )
}