// AppSidebar.tsx
import * as React from "react";
import { GenericNavMain, type NavItem } from "@/components/sidebar/SidebarMain";
import { NavUser } from "@/components/sidebar/SidebarUser";
import { SidebarBrand } from "@/components/sidebar/SidebarBrand";
import { SidebarCollapser } from "@/components/sidebar/SidebarCollapser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  groupLabel?: string;
  items: NavItem[];
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  brandTitle?: string;
  logoSrc?: string;
  onLogout?: () => void;
  onUpgrade?: () => void;
  onBilling?: () => void;
}

export function AppSidebar({
  groupLabel,
  items,
  user,
  brandTitle = "Sorout",
  logoSrc = "/images/logo.png",
  onLogout,
  onUpgrade,
  onBilling,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="relative z-20" {...props}>
      {/* Floating collapser button attached to sidebar border */}
      <SidebarCollapser />

      <SidebarHeader>
        <SidebarBrand title={brandTitle} logoSrc={logoSrc} />
      </SidebarHeader>

      <SidebarContent>
        <GenericNavMain label={groupLabel} items={items} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={user}
          onLogout={onLogout}
          onUpgrade={onUpgrade}
          onBilling={onBilling}
        />
      </SidebarFooter>
    </Sidebar>
  );
}