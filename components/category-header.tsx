"use client";

import { useI18n } from "@/components/i18n-provider";
import { getCategoryConfig } from "@/lib/category-config";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CategoryHeaderProps {
    categoryName: string;
    productCount: number;
}

export function CategoryHeader({ categoryName, productCount }: CategoryHeaderProps) {
    const { dict, language, dir } = useI18n();
    const config = getCategoryConfig(categoryName);

    // @ts-ignore
    const categoryData = dict.categories_list[config.titleKey] || dict.categories_list.default;
    const BackIcon = dir === "rtl" ? ChevronRight : ChevronLeft;

    return (
        <div className="mb-12">
            <Link href="/categories">
                <Button variant="ghost" size="sm" className="mb-6 hover:bg-primary/5 -ms-2 h-10 px-4 rounded-full group">
                    <BackIcon className="h-4 w-4 mx-1 group-hover:-translate-x-1 transition-transform rtl:group-hover:translate-x-1" />
                    {language === "ar" ? "العودة للأقسام" : "Back to Categories"}
                </Button>
            </Link>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${config.gradient} shadow-lg shadow-primary/10 transition-transform hover:rotate-3`}>
                    <config.icon className="h-10 w-10 text-white" />
                </div>
                <div>
                    <h1 className="text-5xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {categoryData.name}
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                            {productCount} {productCount === 1 ? (language === "ar" ? "منتج" : "Item") : (language === "ar" ? "منتج" : "Items")}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <p className="text-muted-foreground font-medium">
                            {categoryData.desc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
