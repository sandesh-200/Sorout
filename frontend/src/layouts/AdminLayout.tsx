import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { data } from "@/constants/dashbaord";
import { Outlet } from "react-router-dom"; // Import Outlet

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar groupLabel="Platform" items={data.sidebarItems} user={data.sidebarUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center transition-[width] ease-linear">
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Field>
                <Input id="input-button-group" placeholder="Type to search..." />
              </Field>
            </div>
          </div>
        </header>

        {/* The matching child page will dynamically mount right here */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet /> 
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}