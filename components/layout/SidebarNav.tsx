"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SidebarNavProps {
  /** Called after a link is clicked — used by the mobile drawer to close itself. */
  onNavigate?: () => void;
  className?: string;
}

/**
 * The list of primary nav links with active-route highlighting.
 * Shared between the persistent desktop sidebar and the mobile drawer.
 */
export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={cn("flex flex-col gap-1", className)}>
      {NAV_ITEMS.map((item) => {
        const active = isRouteActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
              "outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar",
              active
                ? "bg-sidebar-accent text-dhl-red"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            {/* Active indicator — a crisp red rail on the leading edge */}
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r-full bg-dhl-red transition-all",
                active ? "w-1 opacity-100" : "w-0 opacity-0",
              )}
            />
            <Icon
              className={cn(
                "size-5 shrink-0 transition-colors",
                active
                  ? "text-dhl-red"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
              aria-hidden
            />
            <span className="flex flex-col">
              <span className="leading-tight">{item.label}</span>
              <span className="text-[11px] font-normal leading-tight text-muted-foreground">
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
