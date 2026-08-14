import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface SidebarBrandProps {
  title?: string;
  logoSrc?: string;
}

export function SidebarBrand({
  title = "Sorout",
  logoSrc = "/images/logo.png",
}: SidebarBrandProps) {

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between gap-1">
        <SidebarMenuButton
          size="lg"
          className="pointer-events-none select-none group-data-[collapsible=icon]:w-auto"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/5 p-1 text-sidebar-primary-foreground shrink-0 overflow-hidden">
            <img
              src={logoSrc}
              alt={title}
              className="size-full object-contain"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold text-sidebar-foreground tracking-tight text-xl">
              {title}
            </span>
          </div>
        </SidebarMenuButton>

      </SidebarMenuItem>
    </SidebarMenu>
  );
}