import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Navbar } from "@/components/shared/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { data } from "@/constants/dashboard";
import { useLogout } from "@/hooks/useLogout";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const handleLogout = useLogout();

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar
        groupLabel="Platform Admin"
        items={data.sidebarItems}
        user={data.sidebarUser}
        onLogout={handleLogout}
      />
      <SidebarInset className="flex h-full flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}