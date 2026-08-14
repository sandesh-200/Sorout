import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Navbar } from "@/components/shared/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { candidateDashboardData } from "@/constants/candidateDashboard";
import { useLogout } from "@/hooks/useLogout";
import { Outlet } from "react-router-dom";

export default function CandidateLayout() {
  const handleLogout = useLogout();

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar
        groupLabel="Candidate Portal"
        items={candidateDashboardData.sidebarItems}
        user={candidateDashboardData.sidebarUser}
        onLogout={handleLogout}
      />
      <SidebarInset className="flex h-full flex-col overflow-hidden">
        <Navbar showSearch searchPlaceholder="Search sessions or updates..." />

        {/* Candidate routes render inside scrollable main container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}