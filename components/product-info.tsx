"use client";

import { useI18n } from "@/components/i18n-provider";

export function ProductStatus({ stock, category }: { stock: number; category: string }) {
    const { dict } = useI18n();
    return (
        <div className="flex items-center space-x-2 text-sm">
            <span className={stock > 0 ? "text-green-600" : "text-red-600"}>
                {stock > 0 ? dict.inStock : dict.outOfStock}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{category}</span>
        </div>
    );
}

export function SaleBadge() {
    const { dict } = useI18n();
    return (
        <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-lg font-bold px-4 py-2 rounded-full">
            {dict.sale}
        </div>
    );
}
