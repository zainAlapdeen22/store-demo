"use client";

import Link from "next/link";
import { getCategoryConfig } from "@/lib/category-config";
import { useI18n } from "@/components/i18n-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface CategoriesFullListProps {
    categories: [string, number][];
}

export function CategoriesFullList({ categories }: CategoriesFullListProps) {
    const { dict } = useI18n();

    return (
        <div className="space-y-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{dict.categories}</h1>
                <p className="text-muted-foreground text-lg">{dict.browsByCategory}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map(([category, count]) => {
                    const config = getCategoryConfig(category);
                    const Icon = config.icon;
                    // @ts-ignore
                    const categoryData = dict.categories_list[config.titleKey] || dict.categories_list.default;

                    return (
                        <Link key={category} href={`/categories/${encodeURIComponent(category)}`}>
                            <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer h-full border-none shadow-sm overflow-hidden group hover:-translate-y-2">
                                <CardHeader className="relative p-0 h-48">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-md p-6 rounded-full text-white group-hover:scale-110 transition-transform duration-500">
                                            <Icon className="h-12 w-12" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 bg-card">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <CardTitle className="text-3xl font-bold">{categoryData.name}</CardTitle>
                                            <p className="text-muted-foreground leading-relaxed">{categoryData.desc}</p>
                                        </div>
                                        <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-black">
                                            {count}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-32 glass rounded-3xl">
                    <Package className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
                    <p className="text-2xl text-muted-foreground">{dict.noResults}</p>
                </div>
            )}
        </div>
    );
}
