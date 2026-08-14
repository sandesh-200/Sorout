import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface NavItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

export interface GenericNavMainProps {
  label?: string;
  items: NavItem[];
}

/**
 * Checks if a route is currently active.
 * Handles exact matching for root paths and prefix matching for subroutes.
 */
function isRouteActive(currentPath: string, itemUrl: string): boolean {
  const normalize = (path: string) => path.replace(/\/+$/, "") || "/";
  const cleanCurrent = normalize(currentPath);
  const cleanItem = normalize(itemUrl);

  if (cleanItem === "/") {
    return cleanCurrent === "/";
  }

  return cleanCurrent === cleanItem || cleanCurrent.startsWith(`${cleanItem}/`);
}

export function GenericNavMain({ label, items }: GenericNavMainProps) {
  const location = useLocation();

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isRouteActive(location.pathname, item.url);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
                className="transition-colors hover:bg-sidebar-accent/60 active:bg-sidebar-accent"
              >
                <Link
                  to={item.url}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.icon && (
                    <span className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-sidebar-foreground group-data-[active=true]:text-sidebar-accent-foreground">
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}