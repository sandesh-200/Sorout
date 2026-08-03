import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { candidateDashboardData } from "@/constants/candidateDashboard";
import { Outlet } from "react-router-dom";

export default function CandidateLayout() {
  return (
    <SidebarProvider>
      <AppSidebar groupLabel="Candidate Portal" items={candidateDashboardData.sidebarItems} user={candidateDashboardData.sidebarUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center transition-[width] ease-linear">
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Field>
                <Input id="candidate-search" placeholder="Search sessions or updates..." />
              </Field>
            </div>
          </div>
        </header>

        {/* Candidate content dynamically mounts here */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}