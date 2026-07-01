"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { DhlLogo } from "@/components/brand/DhlLogo";

interface HeaderProps {
  /** Opens the mobile navigation drawer. */
  onOpenMenu: () => void;
  className?: string;
}

/**
 * Full-width DHL red header bar. Carries the wordmark + product title and,
 * on small screens, the hamburger that toggles the mobile drawer.
 */
export function Header({ onOpenMenu, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16 w-full bg-dhl-red text-white shadow-sm",
        className,
      )}
    >
      {/* Thin yellow rule along the bottom — DHL signature detail */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-dhl-yellow" aria-hidden />

      <div className="flex h-full items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-md lg:hidden",
            "text-white/90 transition-colors hover:bg-white/15",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
          )}
        >
          <Menu className="size-6" aria-hidden />
        </button>

        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-md py-1 pr-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
          )}
        >
          <DhlLogo variant="onRed" height={26} />
          <span className="hidden h-7 w-px bg-white/35 sm:block" aria-hidden />
          <span className="hidden text-base font-semibold tracking-tight sm:block">
            ULD Academy
          </span>
        </Link>

        <span className="ml-auto hidden items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white/90 md:inline-flex">
          <span className="size-1.5 rounded-full bg-dhl-yellow" aria-hidden />
          Air Cargo Training
        </span>
      </div>
    </header>
  );
}
