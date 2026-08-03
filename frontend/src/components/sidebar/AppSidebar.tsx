// import * as React from "react"

// import { NavMain } from "@/components/sidebar/SidebarMain"
// import { NavUser } from "@/components/sidebar/SidebarUser"
// import { SidebarBrand } from "@/components/sidebar/SidebarBranc"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
// } from "@/components/ui/sidebar"
// import { data } from "@/constants/dashbaord"



// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <SidebarBrand/>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.sidebarItems} />

//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.sidebarUser} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   )
// }



import * as React from "react";
import { GenericNavMain } from "@/components/sidebar/SidebarMain";
import { NavUser } from "@/components/sidebar/SidebarUser";
import { SidebarBrand } from "@/components/sidebar/SidebarBranc";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  groupLabel: string;
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function AppSidebar({ groupLabel, items, user, ...props }: SidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <GenericNavMain label={groupLabel} items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}