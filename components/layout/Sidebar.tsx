import { cn } from "@/lib/utils";
import { SidebarNav } from "./SidebarNav";

/**
 * Persistent desktop sidebar. Hidden below the `lg` breakpoint, where the
 * mobile drawer takes over. Sits beneath the fixed header.
 */
export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "hidden lg:flex lg:w-72 lg:shrink-0 lg:flex-col",
        "border-r border-sidebar-border bg-sidebar",
        "sticky top-16 h-[calc(100dvh-4rem)]",
        className,
      )}
    >
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        <SidebarNav />
      </div>
      <div className="border-t border-sidebar-border px-5 py-4">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          DHL ULD Academy
          <br />
          Unit Load Device training tool
        </p>
      </div>
    </aside>
  );
}
