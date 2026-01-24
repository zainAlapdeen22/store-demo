import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { getCategoryConfig } from "@/lib/category-config";

export default async function CategoriesPage() {
    // Get all products and extract unique categories
    const products = await prisma.product.findMany({
        select: {
            category: true,
        },
    });

    // Count products per category
    const categoryCount = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);

    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">الأقسام</h1>
                <p className="text-muted-foreground">تصفح جميع المنتجات حسب القسم</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(([category, count]) => {
                    const config = getCategoryConfig(category);
                    const Icon = config.icon;

                    return (
                        <Link key={category} href={`/categories/${encodeURIComponent(category)}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-none shadow-sm overflow-hidden group">
                                <CardHeader className="relative p-0 h-40">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full text-white">
                                            <Icon className="h-10 w-10" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-2xl mb-2">{config.ar}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{config.description}</p>
                                        </div>
                                        <div className="bg-muted px-3 py-1 rounded-full text-sm font-bold">
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
                <div className="text-center py-20">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-xl text-muted-foreground">لا توجد أقسام متاحة حالياً</p>
                </div>
            )}
        </div>
    );
}
