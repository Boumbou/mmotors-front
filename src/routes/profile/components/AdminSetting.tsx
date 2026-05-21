import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ServiceType } from "@/types/ServiceType";
import { Accordion } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit, Save, Trash2 } from "@hugeicons/core-free-icons";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function AdminSetting() {
    const [services, setServices] = useState<ServiceType[]>([]);

    const fetchServices = async () => {
        try {
            const response = await fetch("/api/services", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    }

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <Accordion type="multiple" defaultValue={["services"]}>
            <AccordionItem value="services" >
                <AccordionTrigger >Gérer les services</AccordionTrigger>
                <AccordionContent className="h-fit flex flex-col gap-4">
                        {services.map((service) => (
                                <Card key={service.id} className="w-full rounded-md border">
                                    <CardTitle className="mx-3">
                                        <h4>
                                            {service.name}
                                        </h4>
                                    </CardTitle>
                                    <CardContent className="flex flex-row gap-3">

                                        <p className="w-full text-sm font-light text-slate-600">
                                            {service.description}
                                        </p>
                                        <Dialog >
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-8 self-start">
                                                    <HugeiconsIcon icon={Edit} className="w-4 h-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="md:min-w-2xl  min-w-90%">
                                                <DialogTitle>Service </DialogTitle>
                                                <FieldGroup>
                                                    <Field orientation="horizontal">
                                                        <Button variant="default" size="sm" className="h-8 bg-blue-500 self-start" onClick={()=>toast.warning("Cette fonctionnalité arrive bientôt !")}>
                                                            <HugeiconsIcon icon={Save} className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="destructive" size="sm" className="h-8 self-start" onClick={()=>toast.warning("Cette fonctionnalité arrive bientôt !")} >
                                                            <HugeiconsIcon icon={Trash2} className="w-4 h-4" />
                                                        </Button>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Service actif</FieldLabel>
                                                        <Switch  />
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Nom du service</FieldLabel>
                                                        <input value={service.name} readOnly className="border-0 bg-slate-100 p-1 text-sm font-light rounded-md" />
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Description</FieldLabel>
                                                        <textarea value={service.description} readOnly className="border-0 bg-slate-100 p-1 text-sm font-light rounded-md" />
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Type de valeur</FieldLabel>
                                                        <Select>
                                                            <SelectTrigger className="w-full">
                                                               <SelectValue  defaultValue={String(service.overheadType)}/>
                                                            </SelectTrigger>
                                                            <SelectContent>

                                                            <SelectItem value="0">Montant</SelectItem>
                                                            <SelectItem value="1">Pourcentage</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Valeur</FieldLabel>
                                                        <input value={`${service.overheadValue}`} readOnly className="border-0 bg-slate-100 p-1 text-sm font-light rounded-md" />
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Type de listing</FieldLabel>
                                                        <Select>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue  defaultValue={String(service.listingType)}/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="0">Achats</SelectItem>
                                                                <SelectItem value="1">Location</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel>Service optionnel</FieldLabel>
                                                        <Select>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue  defaultValue={String(service.isOptional)}/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="0">Optionnel</SelectItem>
                                                                <SelectItem value="1">Obligatoire</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>

                                                </FieldGroup>
                                            </DialogContent>
                                        </Dialog>
                                        

                                        
                                        <Button variant="destructive" size="sm" className="ml-2 h-8 self-start" onClick={()=>toast.warning("Cette fonctionnalité arrive bientôt !")}>
                                            <HugeiconsIcon icon={Trash2} className="w-4 h-4" />
                                        </Button>

                                    </CardContent>
                                </Card>
                            )
                        )}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="users">
                <AccordionTrigger >Gérer les utilisateurs</AccordionTrigger>
                <AccordionContent >
                    <p>Section en construction...</p>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="templates">
                <AccordionTrigger >Gérer les types de documents</AccordionTrigger>
                <AccordionContent >
                    <p>Section en construction...</p>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    )
}