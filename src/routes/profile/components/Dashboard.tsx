import useStore from "@/routes/auth/userStore"
import type { User } from "@/types/UserType";
import {ChartPieDonutText} from "@/routes/profile/components/PieChart";
import { useNavigate } from "react-router";
import type { ApplicationType } from "@/types/ApplicationType";
import BarChartDefault from "@/routes/profile/components/BarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard(
    {applications, numberOfApplications}: 
    {
        applications: ApplicationType[], 
        numberOfApplications: number, 
    }
) {
    const navigate = useNavigate();
    //fetch userid from userStore
    const user: User | null = useStore((state: any) => state.user)
    if (!user) {
        navigate("/auth/login");
        return null;
    }

    return (
        <div className="flex min-h-svh w-full">
            <div className="flex min-w-0  w-full flex-col gap-4 text-sm leading-loose">
                <div>
                    <h1 className="font-medium">Tableau de bord</h1>
                    <p>Vous avez {numberOfApplications} dossiers en cours</p>
                    <div className="flex flex-row gap-4">
                            <ChartPieDonutText data={applications} title="Répartition des dossiers" />
                            <BarChartDefault data={applications} title="Nombre de dossiers par mois" />
                    </div>
                    <div className="mt-4">
                        <Card className="rounded-lg shadow-md p-4">
                            <CardHeader>
                                <CardTitle>Bienvenue sur votre tableau de bord</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* ajoute un super icon du genre tips du jour */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">💡</span>
                                    <p className="font-medium">Astuce du jour</p>
                                </div>
                                <p>Suivez l'évolution de vos dossiers et ne soyez jamais pris au dépourvu.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}