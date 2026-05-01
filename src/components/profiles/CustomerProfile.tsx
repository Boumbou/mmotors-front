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
        
            <div className="flex min-h-svh p-6">
                <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
                    <div>
                    <h1 className="font-medium">Profile Client</h1>
                    <p>Visible uniquement pour client {user.id}</p>
                    </div>
                </div>
            </div>
    )
}