import { Link, Outlet } from "react-router";
import { Button } from "@/components/ui/button";

export default function AuthLayout() {
  return (
    <div className="flex mx-2 justify-center items-start min-h-svh bg-white pt-30">
        <div className="w-full">
            <Button variant="ghost" className="text-slate-500">
                <Link to="/">&lt;&lt; Retour à l'accueil</Link>
            </Button>
          <Outlet />
        </div>
    </div>
  )
}