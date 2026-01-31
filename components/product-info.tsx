"use client";

import { useI18n } from "@/components/i18n-provider";
import { getCategoryConfig } from "@/lib/category-config";

export function ProductStatus({ stock, category }: { stock: number; category: string }) {
    const { dict } = useI18n();
    const config = getCategoryConfig(category);
    // @ts-ignore
    const categoryData = dict.categories_list[config.titleKey] || dict.categories_list.default;

    return (
        <div className="flex items-center gap-3 text-sm font-medium">
            <span className={`px-2 py-0.5 rounded-full ${stock > 0 ? "bg-green-100/50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-red-100/50 text-red-700 dark:bg-red-500/10 dark:text-red-400"}`}>
                {stock > 0 ? dict.inStock : dict.outOfStock}
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-muted-foreground uppercase tracking-widest text-[10px]">{categoryData.name}</span>
        </div>
    );
}

export function SaleBadge() {
    const { dict, dir } = useI18n();
    return (
        <div className={`absolute top-4 ${dir === "rtl" ? "left-4" : "right-4"} bg-destructive text-destructive-foreground text-sm font-black px-4 py-1 rounded-full shadow-xl shadow-destructive/20 animate-pulse`}>
            {dict.sale}
        </div>
    );
}

