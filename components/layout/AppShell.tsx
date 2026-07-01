"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

/**
 * Top-level application chrome: the persistent DHL header, the desktop sidebar,
 * the mobile drawer, and a responsive content area for page children.
 *
 * This is the single client boundary for the shell — it owns the open/close
 * state shared between the header's hamburger and the mobile drawer. Page
 * content rendered into {children} stays free to be Server Components.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-dhl-surface">
      <Header onOpenMenu={() => setMobileOpen(true)} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
