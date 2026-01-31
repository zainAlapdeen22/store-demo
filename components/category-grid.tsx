"use client";

import Link from "next/link";
import { getCategoryConfig } from "@/lib/category-config";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";

interface CategoryGridProps {
    categoryMap: Record<string, number>;
    showAllLink?: boolean;
}

export function CategoryGrid({ categoryMap, showAllLink = true }: CategoryGridProps) {
    const { dict } = useI18n();

    const LAYOUT_ORDER = ['Electronics', 'Accessories', 'Home', 'Men', 'Women', 'Kids'];

    const categories = Object.entries(categoryMap)
        .sort((a, b) => {
            const indexA = LAYOUT_ORDER.indexOf(a[0]);
            const indexB = LAYOUT_ORDER.indexOf(b[0]);

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return b[1] - a[1];
        })
        .slice(0, 6);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{dict.categories}</h2>
                    <p className="text-muted-foreground mt-1">{dict.browsByCategory}</p>
                </div>
                {showAllLink && (
                    <Button asChild variant="outline" className="rounded-full">
                        <Link href="/categories">{dict.viewAll}</Link>
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map(([category, count]) => {
                    const config = getCategoryConfig(category);
                    const Icon = config.icon;
                    // @ts-ignore
                    const categoryData = dict.categories_list[config.titleKey] || dict.categories_list.default;

                    return (
                        <Link
                            key={category}
                            href={`/categories/${encodeURIComponent(category)}`}
                            className="group relative overflow-hidden rounded-2xl border bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-primary/5 hover:border-primary/20"
                        >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${config.gradient}`} />
                            <div className="p-8 flex flex-col items-center justify-center space-y-4 relative z-10">
                                <div className={`p-4 rounded-2xl bg-primary/5 group-hover:bg-transparent group-hover:scale-110 transition-all duration-500`}>
                                    <Icon className={`h-10 w-10 text-primary transition-colors`} />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-lg mb-1">{categoryData.name}</h3>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                        {count} {count === 1 ? (dict.items.endsWith('s') ? 'Item' : 'منتج') : dict.items}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
