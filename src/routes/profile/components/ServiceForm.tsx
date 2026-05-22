import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Save, Trash2 } from "@hugeicons/core-free-icons";
import { Switch } from "@/components/ui/switch";
import type { ServiceType } from "@/types/ServiceType";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, type ChangeEvent } from "react";
import useStore from "@/routes/auth/userStore";
import { Badge } from "@/components/ui/badge";


export default function ServiceForm({service,refreshServices, deleteService}: {service?: ServiceType, refreshServices: () => void, deleteService?: (id: number) => void}) {
    const [serviceState, setServiceState] = useState<ServiceType|null>(service ||{name: "", description: "", overheadType: 0, overheadValue: 0, listingType: 0, isOptional: false, isActive: true} as ServiceType);
    const user = useStore((state: any) => state.user);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { value, name, type } = event.target;
        const evevalue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;
        
        setServiceState((prevState) => ({
            ...prevState,
            [name]: evevalue,
        } as ServiceType));
    
    }

    const validateForm = () => {
        if (!serviceState) return false;

        if (serviceState.name?.trim() === "") return false;
        if (serviceState.description?.trim() === "") return false;
        if (serviceState.overheadValue <= 0) return false;
        return true;
    }

    const mapToBackEndDto = (service: ServiceType) => {
        return {
            Id: service.id,
            Name: service.name,
            Description: service.description,
            OverheadType: service.overheadType,
            OverheadValue: service.overheadValue,
            ListingType: service.listingType,
            IsOptional: service.isOptional ? true : false,
            IsActive: service.isActive ? true : false
        }
    }

    const handleSave = async () => {
        if (!serviceState) return;
        try {
            const response = await fetch(`/api/services/${serviceState.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(mapToBackEndDto(serviceState)),
            });

            if (response.ok) {
                refreshServices();
                toast.success("Service mis à jour avec succès !");
            } else {
                toast.error("Erreur lors de la mise à jour du service.");
            }
        } catch (error) {
            console.error("Error updating service:", error);
            toast.error("Erreur lors de la mise à jour du service.");
        }   
    }

    const handleCreate = async () => {
        if (!serviceState) return;
        try {
            const response = await fetch(`/api/services`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(mapToBackEndDto(serviceState)),
            });

            if (response.ok) {
                refreshServices();
                toast.success("Service créé avec succès !");
            } else {
                toast.error("Erreur lors de la création du service.");
            }
        } catch (error) {
            console.error("Error creating service:", error);
            toast.error("Erreur lors de la création du service.");
        }   
    }

    

    return (

        serviceState &&

            <FieldGroup>
                <Field orientation="horizontal">
                    {/* check if form is valid before enabling the save button */}
                    <Button  variant="default" size="sm" className="h-8 bg-blue-500 self-start" onClick={serviceState.id ? handleSave : handleCreate} disabled={!validateForm()}>
                        <HugeiconsIcon icon={Save} className="w-4 h-4" />
                    </Button>
                    {!validateForm() && <Badge className="h-8 rounded-md bg-slate-100 text-slate-500"> ! Complétez les champs obligatoires pour activer le bouton de sauvegarde</Badge>}
                    {serviceState.id && deleteService && (
                        <Button variant="destructive" size="sm" className="h-8 self-start" onClick={() => deleteService(serviceState.id)} >
                            <HugeiconsIcon icon={Trash2} className="w-4 h-4" />
                        </Button>
                    )}
                </Field>
                <Field>
                    <FieldLabel>Service actif</FieldLabel>
                    <Switch  defaultChecked checked={serviceState.isActive} onCheckedChange={()=>handleInputChange({target: {checked: !serviceState.isActive, name: "isActive"}} as ChangeEvent<HTMLInputElement>)} />
                </Field>
                <Field>
                    <FieldLabel>Nom du service</FieldLabel>
                    <input required name="name" onChange={(e)=>handleInputChange(e)} value={serviceState.name} className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${serviceState.name === "" ? "border-2 border-red-300" : ""}`} />
                </Field>
                <Field>
                    <FieldLabel>Description</FieldLabel>
                    <textarea required name="description" onChange={(e)=>handleInputChange(e)} value={serviceState.description} className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${serviceState.description === "" ? "border-2 border-red-300" : ""}`} />
                </Field>
                <Field>
                    <FieldLabel>Type de listing</FieldLabel>
                    <Select 
                        required
                        value={String(serviceState.listingType)} 
                        defaultValue={String(serviceState.listingType)}
                        onValueChange={(e)=>handleInputChange({target: {value: e, name: "listingType"}} as ChangeEvent<HTMLSelectElement>)}
                        name="listingType"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue  />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Achats</SelectItem>
                            <SelectItem value="1">Location</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
                <Field>
                    <FieldLabel>Type de valeur</FieldLabel>
                    <Select 
                        required
                        onValueChange={(e)=>handleInputChange({target: {value: e, name: "overheadType"}} as ChangeEvent<HTMLSelectElement>)} 
                        value={String(serviceState.overheadType)} 
                        defaultValue={String(serviceState.overheadType)}
                        name="overheadType"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue  />
                        </SelectTrigger>
                        <SelectContent>

                        <SelectItem value="1">Montant</SelectItem>
                        <SelectItem value="0">Pourcentage</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
                <Field>
                    <FieldLabel>Valeur</FieldLabel>
                    <input 
                        required 
                        name="overheadValue" 
                        onChange={handleInputChange} 
                        type="number" 
                        step={serviceState.overheadType == 0 ? 0.01 : 1} 
                        min={0} 
                        max={serviceState.overheadType == 0 ? 1 : undefined} 
                        value={`${serviceState.overheadValue}`} 
                        className={`border-0 bg-slate-100 p-1 text-sm font-light rounded-md ${serviceState.overheadValue == 0 ? "border-2 border-red-300" : ""}`} />
                </Field>
                

                <Field>
                    <FieldLabel>Service optionnel</FieldLabel>
                    <Select 
                        value={String(serviceState.isOptional)} 
                        defaultValue={String(serviceState.isOptional)}
                        onValueChange={(e)=>handleInputChange({target: {value: e, name: "isOptional"}} as ChangeEvent<HTMLSelectElement>)}
                        name="isOptional"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue  />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Optionnel</SelectItem>
                            <SelectItem value="false">Obligatoire</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

            </FieldGroup>
    )
}