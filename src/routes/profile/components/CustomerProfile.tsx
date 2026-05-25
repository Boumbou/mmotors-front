import { DeleteDialog } from "@/components/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useStore from "@/routes/auth/userStore"
import { ApplicationStatus, type ApplicationType } from "@/types/ApplicationType";
import type { User } from "@/types/UserType";
import { Trash2, Warning } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function CustomerProfile({ applications, changeSectionCallBack }: { applications: ApplicationType[], changeSectionCallBack: (section: string) => void }) {
    const user: User | null = useStore((state: any) => state.user)
    const navigate = useNavigate();
    const ongoingApplications = applications.filter(app => app.status === ApplicationStatus.Submitted).length;
    const draftApplications = applications.filter(app => app.status === ApplicationStatus.Draft).length;
    const onHoldApplications = applications.filter(app => app.status === ApplicationStatus.OnHold).length;
    const approvedApplications = applications.filter(app => app.status === ApplicationStatus.Approved).length;

    //fetch userid from userStore
    if (!user) {
        navigate("/auth/login");
        return null;
    }

    return (
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="flex w-full in-h-svh p-6">
                    <div className="flex w-full  flex-col gap-4 text-sm leading-loose">
                        <Card className="px-4">
                            <CardTitle className="text-lg pl-4">Mon profile</CardTitle>
                            <CardContent className="flex flex-col gap-3">
                                <p className="text-lg font-light"><span className="font-bold text-slate-500">Nom :</span> {user.name} {user.lastName}</p>
                                <p className="text-lg font-light"><span className="font-bold text-slate-500">Email :</span> {user.email}</p>
                                <p className="text-lg font-light"><span className="font-bold text-slate-500">Rôle :</span> Client depuis {new Date(user.created).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                        <Card className="px-4">
                            <CardTitle className="text-lg pl-4">Mes dossiers</CardTitle>
                            <CardContent className="flex flex-col gap-3">
                                {draftApplications === 0 ? (
                                    <p className="text-lg font-light">Vous n'avez aucun brouillon.</p>
                                ) : (
                                    <p className="text-lg font-light">Vous avez {draftApplications} brouillon(s).</p>
                                )}
                                {onHoldApplications === 0 ? (
                                    <p className="text-lg font-light">Vous n'avez aucun dossier en attente.</p>
                                ) : (
                                    <p className="text-lg font-light">Vous avez {onHoldApplications} dossier(s) en attente.</p>
                                )}
                                {ongoingApplications === 0 ? (
                                    <p className="text-lg font-light">Vous n'avez aucun dossier en cours.</p>
                                ) : (
                                    <p className="text-lg font-light">Vous avez {ongoingApplications} dossier(s) en cours.</p>
                                )}
                                {approvedApplications === 0 ? (
                                    <p className="text-lg font-light">Vous n'avez aucun dossier approuvé.</p>
                                ) : (
                                    <p className="text-lg font-light">Vous avez {approvedApplications} dossier(s) approuvé(s).</p>
                                )}
                                
                            </CardContent>
                            <CardAction  className="min-h-10 w-full">
                                <Button onClick={() => changeSectionCallBack("applications")}variant="outline" size="icon-lg" className="h-full w-full text-sm font-medium">Voir tous mes dossiers</Button>
                            </CardAction>
                        </Card>

                        <Separator orientation="horizontal" className="mt-5" />
                        <h2 className="text-lg inline-flex items-center justify-center text-red-500 font-light text-center "><span className="mr-2"><HugeiconsIcon icon={Warning} /></span> Zone dangereuse</h2>
                        
                        <DeleteDialog
                            header="Supprimer mon compte"
                            description="Pour supprimer votre compte, veuillez contacter notre support en cliquant sur le bouton ci-dessous. 
                            Notre équipe se chargera de traiter votre demande dans les plus brefs délais."
                            OnDeleteApplication={()=>window.location.href = "mailto:accountsupport@mmotors.com"}
                            >
                            <Badge variant="destructive"  className="w-full h-8 rounded-lg hover:bg-red-200" ><HugeiconsIcon icon={Trash2} />Supprimer mon compte</Badge>
                        </DeleteDialog>
                    </div>
            </div>
        </motion.div>
    )
}