import {Card, CardAction, CardContent, CardHeader, CardTitle} from "../../../components/ui/card";
import {HugeiconsIcon} from "@hugeicons/react";
import { Car, Car01Icon, CheckCircle, Close, Download, Mail, Money, Pause, Send, Trash2, ValidationApprovalIcon} from "@hugeicons/core-free-icons";
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
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";

export default function ApplicationManagement(
    { vehicle, application, motorizationLabels }:
    { vehicle: VehicleType, application: ApplicationType, motorizationLabels: any }
) {

    const user: User = useStore((state: any) => state.user);
    const isStaff = checkIsStaff(user);
    const navigate= useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(ApplicationStatusMap[application.status]);
    const [rejectionReason, setRejectionReason] = useState<string>(application.rejectionReason);
    const [appDocuments, setAppDocuments] = useState(application.documents);


    const OnDeleteApplication = async () => {
        //call api
        await fetch(`/api/applications/${application.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
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
            <Badge variant="destructive" className="text-sm h-8 rounded-lg font-light hover:bg-red-200" >
                <HugeiconsIcon icon={Trash2} className="w-5 h-5" />
            </Badge>
    )

    const onSubmit = async () => {
        setLoading(true);
        await fetch(`/api/applications/${application.id}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
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
            },
            credentials: "include"
        }).catch((error) => {
            toast.error(error.message || "Une erreur est survenue lors de la mise en attente du dossier. Veuillez réessayer.");
            throw error;
        }).finally(() => {
            setLoading(false);
        });
        setStatus(ApplicationStatusMap[ApplicationStatus.OnHold]);
        toast.success("Dossier mis en attente avec succès");
    }

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>, documentId: number) => {
        const file = event.target.files?.[0];
        console.log("Selected file: ", file?.name);
        
        if (!file) return;
        // call api to upload the file for the document with id documentId
        const formData = new FormData();
        formData.append("document", file);
        formData.append("id", documentId.toString());
        setLoading(true);
        try{
            const response = await fetch(`/api/documents/upload`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            if (!response.ok) { 
                toast.error("Une erreur est survenue lors du téléchargement du document. Veuillez réessayer.");               
                throw new Error("Une erreur est survenue lors du téléchargement du document. Veuillez réessayer.");
            }


            console.log("response from upload api: ", response);
            //update document state
            setAppDocuments((prevDocuments: any) => prevDocuments.map((doc: any) => {
                if (doc.id === documentId) {
                    return { ...doc, url: URL.createObjectURL(file) };
                }
                return doc;
            }));
            console.log("Updated documents state: ", appDocuments);
            toast.success("Document téléchargé avec succès");
        } catch (error) {
            toast.error("Une erreur est survenue lors du téléchargement du document. Veuillez réessayer.");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const onDownloadDocument = (key: string) => {
        //call download api endpoint
        fetch(`/api/documents/download?key=${key}`, {
            method: "GET",
            credentials: "include"
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Une erreur est survenue lors du téléchargement du document. Veuillez réessayer.");
            }
            return response.blob();
        }).then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = key;
            document.body.appendChild(a);
            a.click();
            a.remove();
        }).catch((error) => {
            toast.error(error.message);
        });
    }

    const onDeleteDocument = (id: number) => {
        fetch(`/api/documents/${id}`, {
            method: "DELETE",
            credentials: "include"
        }).catch((error) => {
            toast.error("Nous n'avons pas pu supprimer le document. Veuillez réessayer plus tard.");
            throw error;
        });
        setAppDocuments((prevDocuments: any) => prevDocuments.map((doc: any) => {
            if (doc.id === id) {
                return { ...doc, url: null, key: null };
            }
            return doc;
        }));
        toast.success("Document supprimé avec succès");
    }

    const reviewApplication = async (decision: {ApplicationId: number, IsApproved: boolean, RejectionReason: string | null}) => {
        setLoading(true);
        await fetch(`/api/applications/${application.id}/review`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(decision)
        }).catch((error) => {
            toast.error(error.message || "Une erreur est survenue lors de la revue du dossier. Veuillez réessayer.");
            throw error;
        }).finally(() => {
            setLoading(false);
        });
        setStatus(ApplicationStatusMap[decision.IsApproved ? ApplicationStatus.Approved : ApplicationStatus.Rejected]);
        toast.success("Dossier revu avec succès");
    }

    const onApprove = async () => {
        setLoading(true);
        const decision = {
            ApplicationId : application.id,
            IsApproved : true,
            RejectionReason : null
        }

        reviewApplication(decision);
    }

    const onReject = async () => {
        setLoading(true);
        const decision = {
            ApplicationId : application.id,
            IsApproved : false,
            RejectionReason : rejectionReason
        }

        reviewApplication(decision);
    }

    const handleRejectionReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRejectionReason(event.target.value);
    }

    return (
        <>
            {/* Vehicle and conditions */}
            <Card className="w-full max-w-2xl mt-5 bg-white">
                <CardContent className="flex flex-col justify-start gap-5 px-5">

                    {/* header info */}
                    <div className="flex flex-row justify-start gap-5">
                        <HugeiconsIcon icon={Car} className="w-10 h-10 text-gray-500" />
                        <div className="flex flex-col w-full gap-1">
                            <p className="text-lg font-medium">{vehicle.brand} {vehicle.model} {motorizationLabels[vehicle.motorization]}</p>
                            <span className="text-md font-light">{vehicle.mileage} km</span>
                            <span className="text-md font-light">{vehicle.year}</span>
                            <span className="text-md font-light">Dossier créé le {new Date(application.createdAt).toLocaleDateString(new Intl.Locale("fr-FR"))}</span>

                        </div>

                        {/* delete area */}
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

                    {/* contract details */}
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

                {/* workflow actions */}
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
                                <Button disabled={status.label != ApplicationStatusMap[ApplicationStatus.Submitted].label} variant="default" className="w-auto text-sm p-4 font-light bg-green-300 text-green-800" onClick={onApprove}>
                                    <HugeiconsIcon icon={CheckCircle} className="w-5 h-5 mr-2" />
                                    Approuver
                                </Button>
                                <Dialog>
                                    <DialogTrigger disabled={status.label != ApplicationStatusMap[ApplicationStatus.Submitted].label} asChild>
                                        <Button variant="destructive"  className="w-auto text-sm p-4 font-light">
                                            <HugeiconsIcon icon={Close} className="w-5 h-5 mr-2" />
                                            Rejeter
                                        </Button>
                                    </DialogTrigger>
                                     {/* Dialog content to enter rejection reason */}
                                     <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <h2 className="text-lg font-medium">Rejeter le dossier ?</h2>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-5">
                                            <p className="text-md font-medium">Saisissez la raison du rejet :</p>
                                            <textarea disabled={status.label == ApplicationStatusMap[ApplicationStatus.Rejected].label} value={rejectionReason} onChange={handleRejectionReasonChange} placeholder="Entrez la raison du rejet ici..." className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300" />
                                            <Button disabled={!rejectionReason || status.label == ApplicationStatusMap[ApplicationStatus.Rejected].label} variant="destructive" className="w-auto text-sm p-4 font-light bg-red-300 text-red-800" onClick={onReject}>
                                                <HugeiconsIcon icon={Close} className="w-5 h-5 mr-2" />
                                                Rejeter
                                            </Button>
                                        </div>
                                     </DialogContent>
                                </Dialog>
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

            {/* result section */}

            {status.label === ApplicationStatusMap[ApplicationStatus.Rejected].label && (
                <Card className="w-full max-w-2xl mt-5 bg-red-100 border border-red-300">
                    <CardContent className="flex flex-col justify-start gap-5">
                        <div className="flex flex-row items-start gap-2">
                            <HugeiconsIcon icon={Close} className="w-6 h-6 text-red-500" />
                            <div className="flex flex-col gap-2">
                                <p className="text-lg font-medium">Dossier rejeté</p>
                                <p className="text-md font-light">Raison du rejet : {rejectionReason}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {status.label === ApplicationStatusMap[ApplicationStatus.Approved].label && (
                <Card className="w-full max-w-2xl mt-5 bg-green-100 border border-green-300">
                    <CardContent className="flex flex-col justify-start gap-5">
                        <div className="flex flex-row items-start gap-2">
                            🎉
                            <div className="flex flex-col gap-2">
                                <p className="text-lg font-medium">Dossier approuvé</p>
                                <p className="text-md font-light">Félicitations! Toutes les conditions ont été remplies. Nous vous contacterons très prochainement pour la suite</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Documents section */}
            <Card className="w-full max-w-2xl mt-5 bg-white">
                <CardHeader>
                    <CardTitle>
                        <h2 className="text-xl">Documents à fournir</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-start gap-5">
                    {appDocuments.map((document: any) => (
                        <div key={document.id} className="flex flex-row justify-between items-center gap-5">
                            <p className="text-lg">{document.fileName}</p>
                            {/* if document.url is not null, display a link to the document, otherwise display an upload button */}
                            {
                                document.url ? (
                                    <div className="flex flex-row gap-2">
                                        <Button variant="outline" className="w-auto text-sm p-4" onClick={() => onDownloadDocument(document.key)}>
                                                <HugeiconsIcon icon={Download} className="w-6 h-6 text-blue-500" />
                                        </Button>
                                        <Button variant="destructive" className="w-auto text-sm p-4" onClick={() => onDeleteDocument(document.id)}>
                                            <HugeiconsIcon icon={Trash2} className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ) : (
                                    !isStaff? 
                                        status.label === ApplicationStatusMap[ApplicationStatus.Draft].label ||
                                        status.label === ApplicationStatusMap[ApplicationStatus.OnHold].label ? 
                                        (
                                            <input
                                                type="file"
                                                id={`upload-${document.id}`}
                                                className="bg-slate-100 text-slate-500 text-sm rounded-md border border-slate-300 cursor-pointer file:bg-transparent file:border-0 file:text-sm file:font-medium hover:file:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:file:bg-transparent disabled:file:border-0 disabled:file:text-slate-300"
                                                onChange={(event) => onFileChange(event, document.id)}
                                                placeholder={`Charger votre ${document.fileName}`}
                                            />
                                        ):
                                        (<Badge variant="destructive" className="text-sm font-light p-2">Aucun document partagé</Badge>)
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