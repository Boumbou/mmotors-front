import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ServiceType } from "@/types/ServiceType";
import { Accordion } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { ServicesList } from "./ServicesList";
import { DocTemplateList } from "./DocTemplateList";
import {motion} from "framer-motion";

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            >
            <Accordion type="multiple" defaultValue={["services"]}>
                <AccordionItem value="services" >
                    <AccordionTrigger >Gérer les services</AccordionTrigger>
                    <AccordionContent className="h-fit flex flex-col gap-4 bg-slate-200 rounded-md p-4 mb-4">
                            <ServicesList services={services} refreshServices={fetchServices} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="templates">
                    <AccordionTrigger >Gérer les types de documents</AccordionTrigger>
                    <AccordionContent className="h-fit flex flex-col gap-4 bg-slate-200 rounded-md p-4 mb-4">
                        <DocTemplateList  />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="users">
                    <AccordionTrigger >Gérer les utilisateurs</AccordionTrigger>
                    <AccordionContent className="h-fit flex flex-col gap-4 bg-slate-200 rounded-md p-4 mb-4">
                        <p>Section en construction...</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </motion.div>
    )
}