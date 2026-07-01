import {
  House,
  Boxes,
  Plane,
  ArrowLeftRight,
  GraduationCap,
  ClipboardCheck,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

/** Primary navigation for the ULD Academy. Shared by the desktop sidebar
 *  and the mobile drawer so the two never drift out of sync. */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: House,
    description: "Overview & getting started",
  },
  {
    label: "ULD Types",
    href: "/uld-types",
    icon: Boxes,
    description: "Container & pallet catalog",
  },
  {
    label: "Aircraft",
    href: "/aircraft",
    icon: Plane,
    description: "Cargo fleet profiles",
  },
  {
    label: "Compatibility",
    href: "/compatibility",
    icon: ArrowLeftRight,
    description: "ULD ↔ aircraft matrix",
  },
  {
    label: "Learn",
    href: "/learn",
    icon: GraduationCap,
    description: "Guided lessons",
  },
  {
    label: "Quiz",
    href: "/quiz",
    icon: ClipboardCheck,
    description: "Test your knowledge",
  },
  {
    label: "Standards",
    href: "/standards",
    icon: ScrollText,
    description: "IATA & ULD references",
  },
];
