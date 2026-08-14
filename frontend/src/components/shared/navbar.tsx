// import React from "react";
// import { useLocation } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";

// interface NavbarProps {
//   title?: string;
//   showSearch?: boolean;
//   searchPlaceholder?: string;
//   onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   children?: React.ReactNode;
// }

// function getRouteTitle(pathname: string): string {
//   if (pathname.includes("/admin")) {
//     if (pathname.includes("/users")) return "User Management";
//     if (pathname.includes("/interviews")) return "Interviews";
//     if (pathname.includes("/candidates")) return "Candidates";
//     if (pathname.includes("/settings")) return "Platform Settings";
//     return "Admin Dashboard";
//   }

//   if (pathname.includes("/candidate")) {
//     if (pathname.includes("/interviews")) return "My Interviews";
//     if (pathname.includes("/results")) return "Evaluation Results";
//     if (pathname.includes("/practice")) return "Practice Session";
//     if (pathname.includes("/settings")) return "Account Settings";
//     return "Candidate Dashboard";
//   }

//   return "Dashboard";
// }

// export const Navbar: React.FC<NavbarProps> = ({
//   title,
//   showSearch = false,
//   searchPlaceholder = "Search sessions or questions...",
//   onSearchChange,
//   children,
// }) => {
//   const location = useLocation();
//   const pageTitle = title ?? getRouteTitle(location.pathname);

//   return (
//     <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width] ease-linear">
//       {/* Left Section: Navigation Toggle + Route Title */}
//       <div className="flex items-center gap-3 min-w-0">
//         <h1 className="text-xl font-medium text-foreground truncate tracking-tight">
//           {pageTitle}
//         </h1>
//       </div>

//       {/* Center Section: Optional Contextual Search */}
//       {showSearch && (
//         <div className="hidden sm:flex items-center w-full max-w-xs mx-4">
//           <div className="relative w-full">
//             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
//             <Input
//               type="search"
//               placeholder={searchPlaceholder}
//               onChange={onSearchChange}
//               className="h-8 w-full pl-8 pr-3 text-xs bg-muted/30 border-muted hover:bg-muted/50 focus-visible:bg-background transition-colors"
//             />
//           </div>
//         </div>
//       )}

//       {/* Right Section: Optional Contextual Actions */}
//       {children && (
//         <div className="flex items-center gap-2 shrink-0">{children}</div>
//       )}
//     </header>
//   );
// };


import React from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/components/shared/theme-provider"; // Adjust import path to match your project

interface NavbarProps {
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

function getRouteTitle(pathname: string): string {
  if (pathname.includes("/admin")) {
    if (pathname.includes("/users")) return "User Management";
    if (pathname.includes("/interviews")) return "Interviews";
    if (pathname.includes("/candidates")) return "Candidates";
    if (pathname.includes("/settings")) return "Platform Settings";
    return "Admin Dashboard";
  }

  if (pathname.includes("/candidate")) {
    if (pathname.includes("/interviews")) return "My Interviews";
    if (pathname.includes("/results")) return "Evaluation Results";
    if (pathname.includes("/practice")) return "Practice Session";
    if (pathname.includes("/settings")) return "Account Settings";
    return "Candidate Dashboard";
  }

  return "Dashboard";
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  showSearch = false,
  searchPlaceholder = "Search sessions or questions...",
  onSearchChange,
  children,
}) => {
  const location = useLocation();
  const pageTitle = title ?? getRouteTitle(location.pathname);
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width] ease-linear">
      {/* Left Section: Navigation Toggle + Route Title */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-xl font-medium text-foreground truncate tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Center Section: Optional Contextual Search */}
      {showSearch && (
        <div className="hidden sm:flex items-center w-full max-w-xs mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              onChange={onSearchChange}
              className="h-8 w-full pl-8 pr-3 text-xs bg-muted/30 border-muted hover:bg-muted/50 focus-visible:bg-background transition-colors"
            />
          </div>
        </div>
      )}

      {/* Right Section: Theme Toggle + Contextual Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {children}

        {/* Theme Toggle Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};