import { NavLink } from "react-router";
import { Button } from "./ui/button";
import useStore from '../routes/auth/userStore';
import type { User } from "@/types/UserType";

export default function NavBar() {
    const user : User | null = useStore((state: any) => state.user);
    const logout = useStore((state: any) => state.logout);

    return (
        <div className="flex p-10 items-center justify-between gap-10 flex-row h-10 w-full sticky top-0 bg-background border-b">
            <h2 className="flex font-bold" >MMOTORS</h2>
            <ul className="flex flex-row gap-5">
                <NavLink to="/catalogue?type=achats&pagenumber=1&pagesize=1" className={(isActive) => isActive ? "text-blue-500" : "text-black"}>Acheter</NavLink>
                <NavLink to="/catalogue?type=locations&pagenumber=1&pagesize=1" className={(isActive) => isActive ? "text-blue-500" : "text-black"}>Louer</NavLink>
                <NavLink to="/about" className={(isActive) => isActive ? "text-blue-500" : "text-black"}>A propos</NavLink>
            </ul>
            {user ? (
                <Button variant="default" size="sm" onClick={logout}>Se déconnecter</Button>
            ) : (
                <NavLink to="/auth/login">
                    <Button variant="default" size="sm">Se connecter</Button>
                </NavLink>
            )}
        </div>
    )
}