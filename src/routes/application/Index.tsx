import InConstruction from "@/components/InConstruction";
import useStore from "../auth/userStore";
import { Button } from "@/components/ui/button";

export default function Application() {
    const user = useStore((state: any) => state.user);

    if (!user) {
            return (
                <div className="flex flex-col items-center justify-center mt-20 gap-5">
                    <h1 className="text-2xl font-bold">Accès refusé</h1>
                    <p className="text-slate-500">Vous devez être connecté pour accéder à cette page.</p>
                    <Button className="bg-black" onClick={() => window.location.href = "/auth/login"}>Se connecter</Button>
                </div>
            )
        }
        return (
            <div>
                <h1>Application</h1>
                <InConstruction />
            </div>
        )
    
}