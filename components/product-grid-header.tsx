"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function ProductGridHeader() {
    const { dict, dir } = useI18n();
    const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

    return (
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">{dict.latestArrivals}</h2>
            <Link href="/search" className="text-sm font-medium text-primary hover:underline flex items-center">
                {dict.seeAll} <Arrow className="mx-1 h-4 w-4" />
            </Link>
        </div>
    );
}
