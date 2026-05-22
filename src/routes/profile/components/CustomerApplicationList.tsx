import { Card } from "@/components/ui/card";
import { ApplicationStatusMap, type ApplicationType } from "@/types/ApplicationType";
import { Eye, Folder } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import MmotorsPagination from "@/components/pagination/MmotorsPagination";
import type { PagedResult } from "@/types/PagedResult";
import { motion } from "framer-motion";

export default function CustomerApplicationList({ applications, pagedResult, fetchNextPage }: { applications: ApplicationType[], pagedResult?: PagedResult | null, fetchNextPage: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoading = applications.length === 0 && pagedResult === null;

    //create a skeleton loader for the application list
    const ApplicationListSkeleton = ()=>{
        return (
            <>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="w-full bg-slate-200 h-20 rounded-md" />
                ))}
            </>
        );
    };
    
    return (
        <div className="flex flex-col gap-4">
            {
                isLoading ? 
                <ApplicationListSkeleton /> : 
                <>
                    {applications.map((application: ApplicationType) => (
                        <motion.div key={application.id} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            <Card className="p-4 flex items-center flex-row rounded-md border">
                                <HugeiconsIcon icon={Folder} className="w-12 h-12 text-slate-300" />
                                <div className="w-full">
                                    <h3 className="text-lg font-medium">#{application.id} - {application.vehicle.brand} {application.vehicle.model} {application.vehicle.year}</h3>
                                    <Badge variant="secondary" className={`text-sm text-${ApplicationStatusMap[application.status].color}-600 bg-${ApplicationStatusMap[application.status].color}-100`}>Statut : {ApplicationStatusMap[application.status].label}</Badge>
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
                        </motion.div>
                    ))}
                    <MmotorsPagination
                        totalPages={pagedResult ? pagedResult.totalPages : 0}
                        currentPage={pagedResult ? pagedResult.pageNumber : 1}
                        onPageChange={fetchNextPage}
                    />
                </>
            }
        </div>
    )
}