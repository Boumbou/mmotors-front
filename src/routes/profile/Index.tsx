import useStore from "@/routes/auth/userStore"
import type { User } from "@/types/UserType";
import { useLocation, useNavigate } from "react-router";
import { sidebarData, type SideBarSectionType } from "@/types/SideBarSectionType";
import CustomerProfile from "./components/CustomerProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import type { ApplicationType } from "@/types/ApplicationType";
import CustomerApplicationList from "./components/CustomerApplicationList";
import Dashboard from "./components/Dashboard";
import VehicleManagementList from "./components/VehicleManagementList";
import checkIsStaff from "@/helpers/checkUserRole";
import type { PagedResult } from "@/types/PagedResult";
import { AdminSetting } from "./components/AdminSetting";

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    //fetch userid from userStore
    const user: User | null = useStore((state: any) => state.user)
    const sections: SideBarSectionType[] | undefined = user ? sidebarData[user.roles[0].toLowerCase()] : undefined;
    const [applications, setApplications] = useState<ApplicationType[]>([]);
    const [result, setResult] = useState<PagedResult | null>(null);
    const isStaff = checkIsStaff(user);
    const [selectedSection, setSelectedSection] = useState<string>(location.state?.section || (isStaff ? "dashboard" : "profile"));
    const [loading, setLoading] = useState<boolean>(true);

    if (!user) {
        navigate("/auth/login");
        return null;
    }

    const fetchUserApplications = async () => {
        //fetch user applications from backend
        const userApplications = await fetch("/api/applications",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })
        .then(response => response.json())
        .catch(error => {
            console.error("Error fetching user applications:", error);
            return [];
        });

        if (userApplications) {
            setApplications(userApplications.items);
            setResult(userApplications);
        }

        //setApplications(response.data);
    }

    useEffect(() => {
        setLoading(true);
        fetchUserApplications().finally(() => setLoading(false));
    }, []);


    const handleSectionChange = (section: string) => {
        setSelectedSection(section);
    }

    return (
        
        <>
            {loading && <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <p className="text-lg font-medium text-gray-700">Chargement...</p>
            </div>}
            {!loading &&(
                <Tabs defaultValue={isStaff ? "dashboard" : "profile"} value={selectedSection} className="self-center max-w-2xl w-full">
                    <TabsList className="bg-slate-200 p-2 rounded-md mb-4">
                        {sections?.map((section) => (
                            <TabsTrigger onClick={()=>handleSectionChange(section.value)} key={section.value} value={section.value} className="px-4 py-2 rounded-md data-[state=active]:bg-slate-300">
                                {section.icon}
                                {section.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="profile">
                            <CustomerProfile applications={applications} pagedResult={result!}  changeSectionCallBack={handleSectionChange} />
                    </TabsContent>
                    <TabsContent value="dashboard">
                        <Dashboard applications={applications} pagedResult={result!} />
                    </TabsContent>
                    <TabsContent value="applications">
                        <>
                            {/* {user.roles.includes("Staff") ?
                                <h1>Liste des dossiers en cours de traitement</h1>
                                : */}
                                <CustomerApplicationList applications={applications} pagedResult={result!} fetchNextPage={fetchUserApplications} />
                            {/* } */}
                        </>
                    </TabsContent>
                    <TabsContent value="vehicles">
                        <VehicleManagementList />
                    </TabsContent>
                    <TabsContent value="settings">
                        <AdminSetting />
                    </TabsContent>
                </Tabs>
            )}
        </>
    )
}