import { Link, Outlet } from "react-router";
import { Button } from "@/components/ui/button";

export default function AuthLayout() {
  return (
    <div className="flex w-full align-middle justify-center items-center min-h-svh bg-slate-200 p-6">
        <div>
            <Button variant="ghost" className="text-slate-500">
                <Link to="/">&lt;&lt; Retour à l'accueil</Link>
            </Button>
          <Outlet />
        </div>
    </div>
  )
}