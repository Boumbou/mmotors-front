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
            <div className="flex min-w-0  w-full flex-col gap-6 text-sm leading-loose">
                    <h1 className="text-lg font-medium">Bonjour {user.name}</h1>
                    <p className="text-md">Vous avez {numberOfApplications} dossiers en cours</p>
                    <div className="flex flex-row gap-4">
                            <ChartPieDonutText data={applications} title="Répartition des dossiers" />
                            <BarChartDefault data={applications} title="Nombre de dossiers par mois" />
                    </div>
                    <div className="mt-4">
                        <Card className="rounded-lg bg-gray-100 shadow-md p-4">
                            <CardHeader>
                                <CardTitle>Bienvenue sur votre tableau de bord</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* ajoute un super icon du genre tips du jour */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">💡</span>
                                    <p className="font-medium">Contrôlez ici les tendances pour mieux gérer votre activité</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
            </div>
        </div>
    )
}