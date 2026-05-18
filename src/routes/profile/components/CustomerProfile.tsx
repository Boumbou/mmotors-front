import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useStore from "@/routes/auth/userStore"
import { type ApplicationType } from "@/types/ApplicationType";
import type { User } from "@/types/UserType";
import { Trash, Warning } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";

export default function CustomerProfile({ applications, numberOfApplications, changeSectionCallBack }: { applications: ApplicationType[], numberOfApplications: number, changeSectionCallBack: (section: string) => void }) {
    const user: User | null = useStore((state: any) => state.user)
    const navigate = useNavigate();

    //fetch userid from userStore
    if (!user) {
        navigate("/auth/login");
        return null;
    }

    return (
        
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
                        {numberOfApplications === 0 ? (
                            <p className="text-lg font-light">Vous n'avez aucun dossier en cours.</p>
                        ) : (
                            <p className="text-lg font-light">Vous avez {numberOfApplications} dossier(s) en cours.</p>
                        )}
                    </CardContent>
                    <CardAction  className="min-h-10 w-full">
                        <Button onClick={() => changeSectionCallBack("applications")}variant="outline" size="icon-lg" className="h-full w-full text-sm font-medium">Voir tous mes dossiers</Button>
                    </CardAction>
                </Card>

                <Separator orientation="horizontal" className="mt-5" />
                <h2 className="text-lg inline-flex items-center justify-center text-red-500 font-light text-center "><span className="mr-2"><HugeiconsIcon icon={Warning} /></span> Zone dangereuse</h2>
                <Button variant="destructive" size="lg" className="w-full" ><HugeiconsIcon icon={Trash} />Supprimer mon compte</Button>
            </div>
        </div>
    )
}