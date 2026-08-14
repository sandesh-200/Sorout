import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "./portal";
import { companyLinks, resourceLinks } from "./nav-links";
import { LinkItem } from "./sheard";
import { XIcon, MenuIcon } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
        className="relative z-50"
      >
        <XIcon
          className={cn(
            "h-5 w-5 transition-transform duration-200",
            open ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />
        <MenuIcon
          className={cn(
            "absolute h-5 w-5 transition-transform duration-200",
            open ? "scale-0 opacity-0" : "scale-100 opacity-100"
          )}
        />
      </Button>

      {open && (
        <Portal className="fixed inset-x-0 top-14 bottom-0 z-50">
          <PortalBackdrop onClick={closeMenu} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div
            id="mobile-menu"
            className={cn(
              "relative z-10 h-full w-full overflow-y-auto bg-background p-6 shadow-2xl border-t border-border",
              "animate-in fade-in-0 zoom-in-95 duration-150 ease-out"
            )}
          >
            <div className="flex flex-col gap-y-6 pb-12">

              {/* Company Section */}
              <div className="flex flex-col gap-y-1 border-t border-border pt-4">
                <span className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Company
                </span>
                {companyLinks.map((link) => (
                  <LinkItem
                    key={`mobile-comp-${link.label}`}
                    onClick={closeMenu}
                    {...link}
                  />
                ))}
              </div>

              {/* Direct Links Section */}
              <div className="flex flex-col gap-y-1 border-t border-border pt-4">
                <span className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Links
                </span>
                <a
                  href="#pricing"
                  onClick={closeMenu}
                  className="rounded-lg p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Pricing
                </a>
                {resourceLinks.map((link) => (
                  <LinkItem
                    key={`mobile-res-${link.label}`}
                    onClick={closeMenu}
                    {...link}
                  />
                ))}
              </div>

              {/* Call-to-Action Buttons */}
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                <Button
                  className="w-full"
                  variant="outline"
                  asChild
                  onClick={closeMenu}
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button className="w-full" asChild onClick={closeMenu}>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}