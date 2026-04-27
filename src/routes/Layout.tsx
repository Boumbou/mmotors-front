import { Outlet } from "react-router";

export default function Layout() {
  return (
    <> 
        <div className="flex pl-4 items-center flex-row h-15 w-full position-sticky top-0 bg-background border-b">
            <h3 className="flex" >MMOTORS</h3>
        </div>
        <Outlet />
    </>
  )
}