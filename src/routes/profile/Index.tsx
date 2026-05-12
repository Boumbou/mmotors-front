import useStore from "@/routes/auth/userStore"
import type { User } from "@/types/UserType";
import { useNavigate } from "react-router";
import ProfileLayout from "./Layout";
import { sidebarData, type SideBarSectionType } from "@/types/SideBarSectionType";
import StaffProfile from "../../components/profiles/StaffProfile";
import CustomerProfile from "../../components/profiles/CustomerProfile";

export default function Profile() {
    const navigate = useNavigate();
    //fetch userid from userStore
    const user: User | null = useStore((state: any) => state.user)
    const sections: SideBarSectionType | undefined = sidebarData.navMain.find(section => section.type.toLowerCase() === user?.role[0].toLowerCase())
    if (!user) {
        navigate("/auth/login");
        return null;
    }

    return (
        <ProfileLayout 
            sections={sections}
        >
            {user.role.includes("Staff") ? <StaffProfile /> : <CustomerProfile />}
        </ProfileLayout>
    )
}