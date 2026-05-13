import InConstruction from "@/components/InConstruction";
import useStore from "@/routes/auth/userStore"
import type { User } from "@/types/UserType";
import { useNavigate } from "react-router";

export default function CustomerProfile() {
    const navigate = useNavigate();
    //fetch userid from userStore
    const user: User | null = useStore((state: any) => state.user)
    if (!user) {
        navigate("/auth/login");
        return null;
    }

    return (
        
        <div className="flex w-full in-h-svh p-6">
            <div className="flex w-full  flex-col gap-4 text-sm leading-loose">
                <div>
                    <h1 className="text-2xl font-md">Profile Client</h1>
                    <InConstruction />
                </div>
            </div>
        </div>
    )
}