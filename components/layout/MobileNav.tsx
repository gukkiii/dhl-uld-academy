"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DhlLogo } from "@/components/brand/DhlLogo";
import { SidebarNav } from "./SidebarNav";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Off-canvas navigation drawer for small screens. Slides in from the left,
 * dims the page behind it, and closes on backdrop click, Escape, or after
 * a nav link is followed. Hidden entirely at `lg` and up.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  // Close on Escape and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          {/* Drawer panel */}
          <motion.div
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex w-[84%] max-w-xs flex-col",
              "bg-sidebar shadow-xl",
            )}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.28 }}
          >
            <div className="flex h-16 items-center justify-between gap-2 bg-dhl-red px-4">
              <DhlLogo variant="onRed" height={24} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-md",
                  "text-white/90 transition-colors hover:bg-white/15",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
                )}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="h-1 w-full bg-dhl-yellow" aria-hidden />

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <SidebarNav onNavigate={onClose} />
            </div>
            <div className="border-t border-sidebar-border px-5 py-4">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                DHL ULD Academy · Unit Load Device training
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
