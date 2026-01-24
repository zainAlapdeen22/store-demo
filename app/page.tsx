import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/hero-section";
import { ProductGridHeader } from "@/components/product-grid-header";
import { ProductCard } from "@/components/product-card";
import { auth } from "@/auth";
import { getCategoryConfig } from "@/lib/category-config";

export const dynamic = 'force-dynamic';


export default async function Home() {
    const session = await auth();

    // Optimize: Fetch only necessary products for the grid (e.g., latest 8)
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { discounts: true },
        take: 8, // Adjust as needed
    });

    // Optimize: Fetch category counts efficiently using groupBy
    const categoryCounts = await prisma.product.groupBy({
        by: ['category'],
        _count: {
            category: true,
        },
    });

    const categoryMap = categoryCounts.reduce((acc, curr) => {
        acc[curr.category] = curr._count.category;
        return acc;
    }, {} as Record<string, number>);


    return (
        <main className="min-h-screen bg-background">
            <HeroSection />


            <section className="container py-12 space-y-8">
                {/* Categories Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold">الأقسام</h2>
                            <p className="text-muted-foreground mt-1">تصفح المنتجات حسب القسم</p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/categories">عرض الكل</Link>
                        </Button>
                    </div>

                    {(() => {
                        const LAYOUT_ORDER = ['Electronics', 'Accessories', 'Home', 'Men', 'Women', 'Kids'];

                        const categories = Object.entries(categoryMap)
                            .sort((a, b) => {
                                const indexA = LAYOUT_ORDER.indexOf(a[0]);
                                const indexB = LAYOUT_ORDER.indexOf(b[0]);

                                // Both present in layout order
                                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                // Only A present
                                if (indexA !== -1) return -1;
                                // Only B present
                                if (indexB !== -1) return 1;
                                // Neither present, sort by count descending
                                return b[1] - a[1];
                            })
                            .slice(0, 6);


                        return (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {categories.map(([category, count]) => {
                                    const config = getCategoryConfig(category);
                                    const Icon = config.icon;

                                    return (
                                        <Link
                                            key={category}
                                            href={`/categories/${encodeURIComponent(category)}`}
                                            className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${config.gradient}`} />
                                            <div className="p-6 flex flex-col items-center justify-center space-y-3">
                                                <div className={`p-3 rounded-full bg-slate-50 group-hover:bg-transparent group-hover:scale-110 transition-all duration-300`}>
                                                    <Icon className={`h-8 w-8 text-slate-700 group-hover:text-primary transition-colors`} />
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="font-bold text-lg mb-1">{config.ar}</h3>
                                                    <p className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors">
                                                        {count} {count === 1 ? "منتج" : "منتجات"}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>

                <ProductGridHeader />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} isAuthenticated={!!session?.user} />
                    ))}
                </div>
            </section>
        </main>
    );
}
