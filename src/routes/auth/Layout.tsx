import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex min-h-svh bg-slate-200 p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}