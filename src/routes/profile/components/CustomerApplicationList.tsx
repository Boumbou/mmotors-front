import { Card } from "@/components/ui/card";
import { ApplicationStatusMap, type ApplicationType } from "@/types/ApplicationType";
import { Eye, Folder } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";

export default function CustomerApplicationList({ applications, numberOfApplications, fetchNextPage }: { applications: ApplicationType[], numberOfApplications: number, fetchNextPage: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <div className="flex flex-col gap-4">
            {
                applications.map((application: ApplicationType) => (
                    <Card key={application.id} className="p-4 flex items-center flex-row rounded-md border">
                        <HugeiconsIcon icon={Folder} className="w-12 h-12 text-slate-300" />
                        <div className="w-full">
                            <h3 className="text-lg font-medium">Dossier #{application.id}</h3>
                            <p className="text-sm text-slate-500">Statut : {ApplicationStatusMap[application.status]}</p>
                            <p className="text-sm text-slate-500">Date de création : {new Date(application.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Button 
                            size="icon-lg" 
                            variant="outline" 
                            className="ml-auto"
                            onClick={() => {
                                navigate(`/application/${application.id}`, { state: { origin: location.pathname, section: "applications" } });
                            }}
                        >
                            <HugeiconsIcon icon={Eye} className="w-5 h-5" />
                        </Button>
                    </Card>
                ))
            }
        </div>
    )
}