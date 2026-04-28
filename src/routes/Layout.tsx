import NavBar from "@/components/NavBar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex min-h-svh bg-slate-100 flex-col">

        <NavBar />
        <Outlet />
    </div>
  )
}