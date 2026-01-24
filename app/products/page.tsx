
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string };
}) {
    const session = await auth();
    const { q, category } = searchParams;

    const where: any = {};

    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
        ];
    }

    if (category) {
        where.category = { equals: category, mode: 'insensitive' };
    }

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { discounts: true },
    });

    return (
        <main className="container py-12 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">
                {q ? `Search Results for "${q}"` : category ? `${category}` : "All Products"}
            </h1>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No products found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} isAuthenticated={!!session?.user} />
                    ))}
                </div>
            )}
        </main>
    );
}
