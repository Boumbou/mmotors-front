import NavBar from "@/components/NavBar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    //check if home page to set background color
    <div className={`flex min-h-svh ${window.location.pathname !== "/" ? "bg-slate-100" : ""} flex-col`}>

        <NavBar />
        <Outlet />
    </div>
  )
}