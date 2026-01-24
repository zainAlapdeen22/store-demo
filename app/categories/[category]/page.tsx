import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { getCategoryConfig } from "@/lib/category-config";

export default async function CategoryProductsPage({
    params
}: {
    params: Promise<{ category: string }>
}) {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);
    const session = await auth();
    const config = getCategoryConfig(decodedCategory);

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
        <div className="container py-10">
            <div className="mb-8">
                <Link href="/categories">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ChevronLeft className="h-4 w-4 ml-2" />
                        العودة للأقسام
                    </Button>
                </Link>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} text-white`}>
                        <config.icon className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{config.ar}</h1>
                        <p className="text-muted-foreground">
                            {products.length} {products.length === 1 ? "منتج" : "منتجات"} - {config.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} isAuthenticated={!!session?.user} />
                ))}
            </div>
        </div>
    );
}
