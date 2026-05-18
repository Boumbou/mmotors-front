import {Card, CardAction, CardContent, CardHeader, CardTitle} from "../../../components/ui/card";
import {HugeiconsIcon} from "@hugeicons/react";
import { Car, File01Icon, Money, ValidationApprovalIcon} from "@hugeicons/core-free-icons";
import {Separator} from "../../../components/ui/separator";
import {Button} from "../../../components/ui/button";
import type { VehicleType } from "@/types/VehicleType";
import type { ApplicationType } from "@/types/ApplicationType";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ApplicationManagement(
    { vehicle, application, totalOverhead, motorizationLabels }:
    { vehicle: VehicleType, application: ApplicationType, totalOverhead: number, motorizationLabels: any }
) {
    return (
        <>
                        <Card className="w-full max-w-2xl mt-5 bg-white">
                            <CardContent className="flex flex-col justify-start gap-5 px-5">
                                <div className="flex flex-row justify-start gap-5">
                                    <HugeiconsIcon icon={Car} className="w-10 h-10 text-gray-500" />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-lg font-medium">{vehicle.brand} {vehicle.model} {motorizationLabels[vehicle.motorization]}</p>
                                        <span className="text-md font-light">{vehicle.mileage} km</span>
                                        <span className="text-md font-light">{vehicle.year}</span>
                                        <span className="text-md font-light">Dossier créé le {new Date(application.createdAt).toLocaleDateString(new Intl.Locale("fr-FR"))}</span>

                                    </div>

                                </div>
                                <Separator orientation="horizontal" className="mx-2" />
                                <div className="flex flex-row items-start gap-2">
                                    <HugeiconsIcon icon={ValidationApprovalIcon} className="w-6 h-6 text-green-500" />
                                    <p className="text-md">{vehicle.listingType === 0 ? "Achat immédiat" : `Location ${vehicle.rentalTermMonths} mois`}</p>
                                </div>
                                <Separator orientation="horizontal" className="mx-2" />
                                <div className="flex flex-row items-start gap-2">
                                    <HugeiconsIcon icon={Money} className="w-6 h-6 text-yellow-500" />
                                    <p className="text-lg max-w-25 min-w-20">{(vehicle.listedAmount + totalOverhead).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })}€</p>
                                </div>
                            </CardContent>
                            <CardAction className="w-full items-center px-5">
                                <Badge variant="outline" className=" text-md p-5 bg-blue-100 border-blue-300">
                                    {application.status === 0 && "Brouillon"}
                                </Badge>
                            </CardAction>
                        </Card>
                        
                        <Card className="w-full max-w-2xl mt-5 bg-white">
                            <CardHeader>
                                <CardTitle>
                                    <h2 className="text-xl">Documents à fournir</h2>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col justify-start gap-5">
                                {application.documents.map((document: any) => (
                                    <div key={document.id} className="flex flex-row justify-between items-center gap-5">
                                        <p className="text-lg">{document.fileName}</p>
                                        {/* if document.url is not null, display a link to the document, otherwise display an upload button */}
                                        {document.url ? (
                                            <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                <span>
                                                    <HugeiconsIcon icon={File01Icon} className="w-6 h-6 text-blue-500" />
                                                </span>
                                                Voir le document
                                            </a>
                                        ) : (
                                            <Button variant="outline" className="text-sm" onClick={() => toast("Fonctionnalité d'upload à venir")}>Uploader le document</Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </>
    )
}