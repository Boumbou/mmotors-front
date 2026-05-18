import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Money, ValidationApprovalIcon, NewJobIcon, HotPriceIcon, CashIcon, Calendar, Save } from "@hugeicons/core-free-icons";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { listingTypeLabels, motorizationLabels, type VehicleType } from "@/types/VehicleType";
import { overheadType, type ServiceType } from "@/types/ServiceType";

export default function ApplicationCreation(
    { vehicle, services, totalOverhead, calculateOverhead, onCreateApplication }:
    { vehicle: VehicleType, services: any[], totalOverhead: number, calculateOverhead: (service: ServiceType) => number, onCreateApplication: () => void }
) {
    return (
        <Card className="w-full max-w-2xl p-6">
                        <CardHeader>
                            <CardTitle>
                                <h1 className="text-2xl">Nouveau dossier {listingTypeLabels[vehicle.listingType] === "Achat" ? "de vente" : "de location"}</h1>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* //recap of selected vehicle, services and total price, with a button to confirm application */}
                            <h2 className="text-lg font-semibold mb-5">Récapitulatif de votre demande</h2>
                            <h3 className="text-md font-medium my-5">Véhicule :</h3>
                            <Card className="w-full mb-5 bg-white">
                                <CardContent className="flex flex-row justify-between gap-2">
                                    <img src={vehicle.imageUrl || "/NoPicture.png"} alt={`${vehicle.brand} ${vehicle.model}`} className="w-20 h-20 rounded-lg object-cover" />
                                    <Separator orientation="vertical" className="mx-1 w-full" />
                                    <div className="flex flex-col justify-start gap-1 w-full text-gray-500">
                                        <p className="text-lg font-medium">{vehicle.brand} {vehicle.model} {motorizationLabels[vehicle.motorization]}</p>
                                        <p className="text-lg font-medium">{vehicle.mileage} km</p>
                                        <p className="text-lg font-medium">{vehicle.year}</p>
                                    </div>
                                    
                                    <Separator orientation="vertical" className="mx-1" />
                                    <HugeiconsIcon icon={Money} className="w-6 h-6 text-yellow-500" />
                                    <p className="text-lg max-w-40 w-20">{vehicle.listedAmount}€</p>
                                </CardContent>
                            </Card>
                            <h3 className="text-md font-medium my-5">Termes :</h3>
                            <Card className="w-full mb-5 bg-white">
                                <CardContent className="flex flex-row justify-start gap-2">
                                    <p className="text-lg w-basis-1/2">{listingTypeLabels[vehicle.listingType]}</p>
                                    <Separator orientation="vertical" className="mx-2" />
                                    <div className="flex flex-row items-start gap-2">
                                        <HugeiconsIcon icon={ValidationApprovalIcon} className="w-6 h-6 text-green-500" />
                                        <p className="text-lg">{vehicle.listingType === 0 ? "Achat immédiat" : `${vehicle.rentalTermMonths} mois`}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <h3 className="text-md font-medium my-5">Services sélectionnés :</h3>
                            <ul className="list-disc list-inside">
                                {services.map((service) => (
                                    <Card key={service.id} className="w-full mb-2 bg-gray-50">
                                        <CardContent className="flex flex-row justify-between gap-2">
                                            <HugeiconsIcon icon={NewJobIcon} className="w-6 h-6 text-blue-500" />
                                            <Separator orientation="vertical" className="mx-2" />
                                            <p className="text-lg w-full">{service.name}</p>
                                            {/* <Separator orientation="vertical" className="mx-2" /> */}
                                            <HugeiconsIcon icon={service.overheadType === overheadType.Percentage ? HotPriceIcon : Money} className="w-6 h-6 text-yellow-500" />
                                            <p className="text-lg self-end max-w-40 w-30">{calculateOverhead(service).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })}€</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </ul>
                            <Card className="w-full mt-5 bg-blue-50">
                                <CardContent className="flex flex-row justify-between gap-2">
                                    <HugeiconsIcon icon={vehicle.listingType === 0 ? CashIcon : Calendar} className="w-6 h-6 text-blue-500" />
                                    <Separator orientation="vertical" className="mx-2" />
                                    {vehicle.listingType === 0 ? (
                                        <p className="text-lg w-full">Prix total de l'achat</p>
                                    ) : (
                                        <p className="text-lg w-full">Mensualité</p>
                                    )}
                                    {/* <Separator orientation="vertical" className="mx-2" /> */}
                                    <HugeiconsIcon icon={Money} className="w-6 h-6 text-yellow-500" />
                                    <p className="text-lg max-w-25 min-w-20">{(vehicle.listedAmount + totalOverhead).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })}€</p>
                                </CardContent>
                                {
                                    vehicle.listingType === 1 && (
                                        <CardContent className="flex flex-row justify-between gap-2">
                                            <HugeiconsIcon icon={CashIcon} className="w-6 h-6 text-blue-500" />
                                            <Separator orientation="vertical" className="mx-2" />
                                            <p className="text-sm font-light w-full">Montant total</p>
                                            {/* <Separator orientation="vertical" className="mx-2" /> */}
                                            <p className="text-sm font-light max-w-25 min-w-25">{((vehicle.listedAmount + totalOverhead) * vehicle.rentalTermMonths!).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })}€</p>
                                        </CardContent>
                                    )
                                }
                            </Card>
                            <CardAction className="w-full mt-5">
                                <Button variant="default" className="w-full h-15 text-lg" onClick={onCreateApplication} >
                                    <HugeiconsIcon icon={Save} className="w-10 h-10 text-white" />
                                    Poursuivre ma demande
                                </Button>
                            </CardAction>
                        </CardContent>                
                    </Card>
    )
}