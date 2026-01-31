import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { auth } from "@/auth";
import { CategoryHeader } from "@/components/category-header";

export default async function CategoryProductsPage({
    params
}: {
    params: Promise<{ category: string }>
}) {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);
    const session = await auth();

    // Fetch products for this category
    const products = await prisma.product.findMany({
        where: {
            category: decodedCategory,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (products.length === 0) {
        notFound();
    }

    return (
        <div className="container py-20 px-6 max-w-7xl mx-auto">
            <CategoryHeader categoryName={decodedCategory} productCount={products.length} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} isAuthenticated={!!session?.user} />
                ))}
            </div>
        </div>
    );
}

