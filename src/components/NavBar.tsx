import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "./ui/button";
import useStore from '../routes/auth/userStore';
import type { User } from "@/types/UserType";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function NavBar() {
    const user : User | null = useStore((state: any) => state.user);
    const logout = useStore((state: any) => state.logout);
    const navigate = useNavigate();

    return (
        <div className="flex p-10 items-center justify-between gap-10 flex-row h-10 w-full sticky top-0 bg-background ">
            <Link to="/"><img src="/MMotorsLogo.png" alt="MMotors logo" className="h-8"/></Link>
            <ul className="flex flex-row gap-5">
                {/* <NavLink to="/catalogue?type=achats&pagenumber=1&pagesize=1" className={(isActive) => isActive ? "text-blue-500" : "text-black"}>Acheter</NavLink>
                <NavLink to="/catalogue?type=locations&pagenumber=1&pagesize=1" className={(isActive) => isActive ? "text-blue-500" : "text-black"}>Louer</NavLink>
                <NavLink to="/about" className={(isActive) => isActive ? "text-blue-500" : "text-black"}>A propos</NavLink> */}
            </ul>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="default" className="h-10 w-10 rounded-full bg-slate-500" size="lg">{String(user.name).toUpperCase().substring(0, 1)}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>

                        <DropdownMenuItem variant="default" onClick={() => navigate("/profile")}>
                            Mon profil
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={logout}>
                            Se déconnecter
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <NavLink to="/auth/login">
                    <Button variant="ghost" size="lg"> Se connecter</Button>
                </NavLink>
            )}
        </div>
    )
}