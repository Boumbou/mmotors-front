import {Card, CardAction, CardContent, CardHeader, CardTitle} from "../../../components/ui/card";
import {HugeiconsIcon} from "@hugeicons/react";
import { Car, Car01Icon, CheckCircle, Close, File01Icon, Mail, Money, Pause, Send, Trash2, ValidationApprovalIcon} from "@hugeicons/core-free-icons";
import {Separator} from "../../../components/ui/separator";
import {Button} from "../../../components/ui/button";
import type { VehicleType } from "@/types/VehicleType";
import { ApplicationStatus, ApplicationStatusMap, type ApplicationType } from "@/types/ApplicationType";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import useStore from "@/routes/auth/userStore";
import { Link, useNavigate } from "react-router";
import { useState, type JSX } from "react";
import checkIsStaff from "@/helpers/checkUserRole";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDialog } from "@/components/DeleteDialog";
import type { User } from "@/types/UserType";

export default function ApplicationManagement(
    { vehicle, application, motorizationLabels }:
    { vehicle: VehicleType, application: ApplicationType, motorizationLabels: any }
) {

    const user: User = useStore((state: any) => state.user);
    const isStaff = checkIsStaff(user);
    const navigate= useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(ApplicationStatusMap[application.status]);
    const OnDeleteApplication = async () => {
        //call api
        await fetch(`/api/applications/${application.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        }).catch((error) => {
            toast.error("Une erreur est survenue lors de la suppression du dossier. Veuillez réessayer.");
            throw error;
         })
        
        toast.success("Dossier supprimé avec succès");
        setTimeout(() => {
            navigate(-1);
        }, 2000);
        
    }

    const DeleteApplicationButton = (): JSX.Element => (
        <Button variant="destructive" className="text-sm font-light" >
            <HugeiconsIcon icon={Trash2} className="w-5 h-5 mr-2" />
                Supprimer le dossier
        </Button>
    )

    const onSubmit = async () => {
        setLoading(true);
        await fetch(`/api/applications/${application.id}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        }).catch((error) => {
            toast.error("Une erreur est survenue lors de la soumission du dossier. Veuillez réessayer.");
            throw error;
        }).finally(() => {
            setLoading(false);
        });
        setStatus(ApplicationStatusMap[ApplicationStatus.Submitted]);
        toast.success("Dossier soumis avec succès");
    }

    const onHold = async () => {
        setLoading(true);
        await fetch(`/api/applications/${application.id}/hold`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        }).catch((error) => {
            toast.error(error.message || "Une erreur est survenue lors de la mise en attente du dossier. Veuillez réessayer.");
            throw error;
        }).finally(() => {
            setLoading(false);
        });
        setStatus(ApplicationStatusMap[ApplicationStatus.OnHold]);
        toast.success("Dossier mis en attente avec succès");
    }

    return (
        <>
            {/* Vehicle and conditions */}
            <Card className="w-full max-w-2xl mt-5 bg-white">
                <CardContent className="flex flex-col justify-start gap-5 px-5">
                    <div className="flex flex-row justify-start gap-5">
                        <HugeiconsIcon icon={Car} className="w-10 h-10 text-gray-500" />
                        <div className="flex flex-col w-full gap-1">
                            <p className="text-lg font-medium">{vehicle.brand} {vehicle.model} {motorizationLabels[vehicle.motorization]}</p>
                            <span className="text-md font-light">{vehicle.mileage} km</span>
                            <span className="text-md font-light">{vehicle.year}</span>
                            <span className="text-md font-light">Dossier créé le {new Date(application.createdAt).toLocaleDateString(new Intl.Locale("fr-FR"))}</span>

                        </div>
                        {
                            !isStaff && ["Brouillon","En attente"].includes(status.label) && (
                                <DeleteDialog
                                    header="Êtes-vous sûr de vouloir supprimer votre dossier ?"
                                    description="Cette action est irréversible et supprimera toutes les données associées à votre dossier."
                                    OnDeleteApplication={OnDeleteApplication}
                                >
                                    <DeleteApplicationButton />
                                </DeleteDialog>
                            )
                        }
                        
                        {
                            isStaff && !(["Brouillon","En attente"].includes(status.label)) && (
                                <DeleteDialog
                                    header="Êtes-vous sûr de vouloir supprimer ce dossier ?"
                                    description="Cette action est irréversible et supprimera toutes les données associées à ce dossier."
                                    OnDeleteApplication={OnDeleteApplication}
                                >
                                    <DeleteApplicationButton />
                                </DeleteDialog>
                            )
                        }    
                    </div>
                    <Separator orientation="horizontal" className="mx-2" />
                    <div className="flex flex-row items-start gap-2">
                        <HugeiconsIcon icon={ValidationApprovalIcon} className="w-6 h-6 text-green-500" />
                        <p className="text-md">{vehicle.listingType === 0 ? "Achat immédiat" : `Location ${vehicle.rentalTermMonths} mois`}</p>
                    </div>
                    <Separator orientation="horizontal" className="mx-2" />
                    <div className="flex flex-col items-start gap-2">
                        <p className="text-lg font-medium">Montant de base :</p>
                            <div className="flex flex-row items-start gap-2">
                                <HugeiconsIcon icon={Car01Icon} className="w-5 h-5 text-slate-500" />
                                <p className="text-md font-md text-gray-800"> {vehicle.listingType === 0 ? `${vehicle.listedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })} €` : `${vehicle.listedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })} €`}</p>
                            </div>
                    </div>
                    {application.applicationServices.length > 0 && (
                        <div className="flex flex-col items-start gap-2">
                            <p className="text-lg font-medium">Services sélectionnés :</p>
                            {application.applicationServices.map((service) => (
                                <div key={service.serviceId} className="flex flex-row items-start gap-2">
                                    <HugeiconsIcon icon={Money} className="w-5 h-5 text-slate-300" />
                                    <p className="text-md">service : {service.appliedOverheadType === 0 ? `${service.appliedOverheadValue*100} %` : `${service.appliedOverheadValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })}€`}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-row items-start gap-2">
                        <HugeiconsIcon icon={Money} className="w-6 h-6 text-yellow-500" />
                        <p className="text-lg max-w-25 min-w-20">{(application.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })}€</p>
                    </div>
                </CardContent>
                <CardAction className="w-full flex flex-wrap flex-row gap-5 items-center px-5">
                    <Badge variant="default" className={`text-md max-h-2 font-light p-4 text-${status.color}-800 bg-${status.color}-100 border-${status.color}-300`}>
                        {status.label}
                    </Badge>
                    {
                        isStaff  && (
                            <>
                                <Separator orientation="vertical" className="mx-2" />
                                <Button disabled={status.label != ApplicationStatusMap[ApplicationStatus.Submitted].label} variant="default" className="w-auto text-sm p-4 font-light bg-orange-200 text-orange-800" onClick={onHold}>
                                    <HugeiconsIcon icon={Pause} className="w-5 h-5 mr-2" />
                                    Mettre en attente
                                </Button>
                                <Button disabled={status.label != ApplicationStatusMap[ApplicationStatus.Submitted].label} variant="default" className="w-auto text-sm p-4 font-light bg-green-300 text-green-800" onClick={() => toast("Fonctionnalité de suppression à venir")}>
                                    <HugeiconsIcon icon={CheckCircle} className="w-5 h-5 mr-2" />
                                    Approuver
                                </Button>
                                <Button disabled={status.label != ApplicationStatusMap[ApplicationStatus.Submitted].label} variant="destructive" className="w-auto text-sm p-4 font-light bg-red-300 text-red-800" onClick={() => toast("Fonctionnalité de suppression à venir")}>
                                    <HugeiconsIcon icon={Close} className="w-5 h-5 mr-2" />
                                    Rejeter
                                </Button>
                            </>
                        )
                    }
                </CardAction>
            </Card>
            
            {/* Client details section */}
            <Card className="w-full max-w-2xl mt-5 bg-white">
                <CardHeader>
                    <CardTitle>
                        <h2 className="text-xl">Détails du client</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-start gap-5">
                    <div className="flex flex-row justify-between gap-5">
                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-medium">{application.customer.name} {application.customer.lastName}</p>
                            <Link to={`mailto:${application.customer.email}`} className="text-md font-light">
                                <HugeiconsIcon icon={Mail} className="w-5 h-5 mr-2 inline" /> 
                                {application.customer.email}
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Documents section */}
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
                                !isStaff ? (<Button variant="outline" className="text-sm" onClick={() => toast("Fonctionnalité d'upload à venir")}>Uploader le document</Button>)
                                : (<Badge variant="destructive" className="text-sm font-light p-2">Document manquant</Badge>)
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card> 
            
             {/* If user is not staff and application status is draft, display a button to submit the application */}
            {
                !isStaff && ["Brouillon","En attente"].includes(status.label) && (
                    // disabled={application.documents.some((doc: any) => !doc.url)}
                    !loading ? (<Button  variant="default" className="w-full max-w-2xl  h-10 text-sm mt-5" onClick={onSubmit}>
                        <HugeiconsIcon icon={Send} className="w-5 h-5 mr-2" />
                        Soumettre mon dossier
                    </Button>) :
                    <Skeleton className="w-full max-w-2xl h-10 mt-5" />
                )
            }
        </>
                
    )
}