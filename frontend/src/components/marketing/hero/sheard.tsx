// import { cn } from "@/lib/utils";
// import type React from "react";

// export type LinkItemType = {
// 	label: string;
// 	href: string;
// 	icon: React.ReactNode;
// 	description?: string;
// };

// export function LinkItem({
// 	label,
// 	description,
// 	icon,
// 	className,
// 	href,
// 	...props
// }: React.ComponentProps<"a"> & LinkItemType) {
// 	return (
// 		<a
// 			className={cn("flex items-center gap-x-2", className)}
// 			href={href}
// 			{...props}
// 		>
// 			<div
// 				className={cn(
// 					"flex aspect-square size-12 items-center justify-center rounded-md border bg-card text-sm shadow-sm",
// 					"[&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='size-'])]:text-foreground"
// 				)}
// 			>
// 				{icon}
// 			</div>
// 			<div className="flex flex-col items-start justify-center">
// 				<span className="font-medium">{label}</span>
// 				<span className="line-clamp-2 text-muted-foreground text-xs">
// 					{description}
// 				</span>
// 			</div>
// 		</a>
// 	);
// }



import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { LinkItemType } from "./nav-links";

interface LinkItemProps extends LinkItemType {
  className?: string;
  onClick?: () => void;
}

export function LinkItem({
  label,
  description,
  icon,
  className,
  href,
  onClick,
}: LinkItemProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/60 focus:bg-accent focus:outline-none",
        className
      )}
    >
      <div
        className={cn(
          "flex aspect-square size-9 shrink-0 items-center justify-center rounded-md border bg-card text-foreground shadow-xs transition-colors group-hover:bg-background",
          "[&_svg]:size-4"
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col items-start justify-center min-w-0">
        <span className="text-sm font-medium leading-none text-foreground group-hover:text-accent-foreground">
          {label}
        </span>
        {description && (
          <span className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </div>
    </Link>
  );
}