// components/sidebar/SidebarCollapser.tsx
import * as React from "react";
import { ChevronLeftIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SidebarCollapser({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { toggleSidebar, state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
                "absolute -right-3 top-5 z-30 flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-xs transition-transform hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className
            )}
            {...props}
        >
            <ChevronLeftIcon
                className={cn(
                    "size-3.5 transition-transform duration-200",
                    isCollapsed && "rotate-180"
                )}
            />
        </button>
    );
}