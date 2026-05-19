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

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    //fetch userid from userStore
    const user: User | null = useStore((state: any) => state.user)
    const sections: SideBarSectionType[] | undefined = user ? sidebarData[user.roles[0].toLowerCase()] : undefined;
    const [selectedSection, setSelectedSection] = useState<string>(location.state?.section || "profile");
    const [applications, setApplications] = useState<ApplicationType[]>([]);
    const [numberOfApplications, setNumberOfApplications] = useState(0);
    
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
            setNumberOfApplications(userApplications.totalCount);
        }

        //setApplications(response.data);
    }

    useEffect(() => {
        fetchUserApplications();
    }, []);


    const handleSectionChange = (section: string) => {
        setSelectedSection(section);
    }

    return (
        <>
            <Tabs defaultValue="profile" value={selectedSection} className="self-center max-w-2xl w-full">
                <TabsList className="bg-slate-200 p-2 rounded-md mb-4">
                    {sections?.map((section) => (
                        <TabsTrigger onClick={()=>handleSectionChange(section.value)} key={section.value} value={section.value} className="px-4 py-2 rounded-md data-[state=active]:bg-slate-300">
                            {section.icon}
                            {section.title}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="profile">
                        <CustomerProfile applications={applications} numberOfApplications={numberOfApplications}  changeSectionCallBack={handleSectionChange} />
                </TabsContent>
                <TabsContent value="dashboard">
                    <Dashboard applications={applications} numberOfApplications={numberOfApplications} />
                </TabsContent>
                <TabsContent value="applications">
                    <>
                        {/* {user.roles.includes("Staff") ?
                            <h1>Liste des dossiers en cours de traitement</h1>
                            : */}
                            <CustomerApplicationList applications={applications} numberOfApplications={numberOfApplications} fetchNextPage={fetchUserApplications} />
                        {/* } */}
                    </>
                </TabsContent>
                <TabsContent value="vehicles">
                    <VehicleManagementList />
                </TabsContent>
            </Tabs>
        </>
    )
}