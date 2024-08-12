import { Outlet } from "react-router-dom";

import SuperAdminHeader from "@/components/SuperAdminHeader";

export default function SuperAdminTemplate() {
    return (
        <div className="text-gray-50 bg-neutral-950 p-2">
            <SuperAdminHeader/>
            <div className="mt-2 border border-slate-800 bg-neutral-900 px-4 md:px-6 min-h-screen">
                <Outlet />
            </div>
        </div>
    )
}