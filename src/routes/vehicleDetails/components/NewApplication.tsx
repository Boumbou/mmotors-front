
import { Folder01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useNavigate, useLocation } from "react-router"
import {listingTypeLabels} from "../../../types/VehicleType"
import { Info } from "@hugeicons/core-free-icons"
import useStore from "../../auth/userStore"
import type { ListingType } from "@/types/VehicleType"
import type { ServiceType } from "@/types/ServiceType"


export default function NewApplication( 
    { 
        listingType, 
        availableServices, 
        selectedServices, 
        onCheckboxChange,
        onInitiateApplication
    }: { 
        listingType: ListingType, 
        availableServices: ServiceType[], 
        selectedServices: number[], 
        onCheckboxChange: (serviceId: number) => void ,
        onInitiateApplication: () => void
    }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useStore((state: any) => state.user);



    return (
        <div className=" lg:basis-1/2 basis-full flex-col gap-10 p-8 align-stretch rounded-lg bg-white ">
                            <div className="flex flex-row justify-between mb-10">
                                <h2 className="md:text-2xl  text-lg font-medium">Soumettre un dossier</h2>
                                <HugeiconsIcon icon={Folder01Icon} className="w-8 h-8 text-slate-500" />
                            </div>
                            {listingTypeLabels[listingType] === "Location" ? (
                                // write a paragraph to explain the process of submitting an application in simple terms
                                <p className="text-slate-500 bg-slate-100 p-4 rounded-lg mb-4"> 
                                    <HugeiconsIcon icon={Info} className="w-6 h-6 inline-block mr-2 mb-3" />
                                    <em className="font-bold">Intéressé ?</em> <br /> 
                                    Pour soumettre un dossier de location, sélectionnez les services complémentaires souhaités, puis cliquez sur le bouton "Soumettre".
                                </p>
                            ) : 
                            (
                                // write a paragraph to explain the process of submitting an application in simple terms
                                <p className="text-slate-500 bg-slate-100 p-4 rounded-lg mb-4"> 
                                    <HugeiconsIcon icon={Info} className="w-6 h-6 inline-block mr-2 mb-3" />
                                    <em className="font-bold">Intéressé ?</em> <br /> 
                                    Pour soumettre un dossier d'achat, sélectionnez les services complémentaires souhaités et cliquez sur le bouton "Soumettre". 
                                </p>
                            )
                            }

                            {availableServices.length > 0 ? (
                                availableServices.map((service: ServiceType) => (
                                    <FieldGroup key={service.id} className="max-w-sm">
                                        <Field orientation="horizontal">
                                            <Checkbox 
                                                id={service.id.toString()} 
                                                name={service.name} 
                                                className="mr-2 font-lg" 
                                                defaultChecked={selectedServices.includes(service.id)} 
                                                onCheckedChange={()=> onCheckboxChange(service.id)} 
                                            />
                                            <FieldLabel  htmlFor={service.name} className="text-md" >{service.name}</FieldLabel>
                                        </Field>
                                    </FieldGroup>
                                ))
                            ) : (
                                <p>Aucun service disponible pour ce type d'annonce.</p>
                            )}
                            {user ?(
                                <Button className="w-full bg-black mt-20" onClick={onInitiateApplication}>Soumettre</Button>
                            ) : (
                                <>
                                    <p>Connectez vous pour soumettre un dossier.</p>
                                    <Button className="w-full bg-black mt-20" onClick={() => navigate("/auth/login", { state: { from: location.pathname } })}>Connectez-vous</Button>
                                </>
                            )}
                        </div>
    )
}