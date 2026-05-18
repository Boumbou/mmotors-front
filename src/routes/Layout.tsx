import NavBar from "@/components/NavBar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    //check if home page to set background color
    <div className={`flex min-h-svh ${window.location.pathname !== "/" ? "bg-slate-100" : ""} flex-col`}>
        <NavBar />
        <div className="flex flex-col gap-5 md:mx-30 mx-5 md:justify-start justify-center my-10">
          <Outlet />
        </div>
    </div>
  )
}