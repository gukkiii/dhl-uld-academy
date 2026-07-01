"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Boxes, Plane, ClipboardCheck, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardsProps {
  uldCount: number;
  aircraftCount: number;
  quizCount: number;
}

/**
 * Three headline stats driven by the live data counts. Each card is a link into
 * the relevant section and animates in with a staggered entrance.
 */
export function StatCards({ uldCount, aircraftCount, quizCount }: StatCardsProps) {
  const reduce = useReducedMotion();

  const stats = [
    {
      icon: Boxes,
      value: uldCount,
      label: "ULD Types",
      hint: "Containers, pallets & reefers",
      href: "/uld-types",
    },
    {
      icon: Plane,
      value: aircraftCount,
      label: "Aircraft",
      hint: "Freighter fleet profiles",
      href: "/aircraft",
    },
    {
      icon: ClipboardCheck,
      value: quizCount,
      label: "Quiz Questions",
      hint: "Test your knowledge",
      href: "/quiz",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={stat.href} className="group block focus-visible:outline-none">
              <Card className="h-full transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-dhl-red">
                <CardContent className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex size-11 items-center justify-center rounded-lg bg-dhl-red/10 text-dhl-red">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <p className="mt-4 text-3xl font-bold tracking-tight tabular-nums text-dhl-ink">
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium text-dhl-ink">{stat.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{stat.hint}</p>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-dhl-red"
                    aria-hidden
                  />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
