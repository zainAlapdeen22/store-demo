import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { HeroSection } from "@/components/hero-section";
import { ProductGridHeader } from "@/components/product-grid-header";
import { ProductCard } from "@/components/product-card";
import { CategoryGrid } from "@/components/category-grid";


export const dynamic = 'force-dynamic';

export default async function Home() {
    const session = await auth();

    // Optimize: Fetch only necessary products for the grid (e.g., latest 8)
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { discounts: true },
        take: 8,
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
        <main className="min-h-screen bg-background pb-20">
            <HeroSection />

            <section className="container py-20 space-y-20">
                <CategoryGrid categoryMap={categoryMap} />

                <div className="space-y-12">
                    <ProductGridHeader />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} isAuthenticated={!!session?.user} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

