import { prisma } from "@/lib/prisma";
import { CategoriesFullList } from "@/components/categories-full-list";

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
        <div className="container py-20 px-6 max-w-7xl mx-auto">
            <CategoriesFullList categories={categories} />
        </div>
    );
}

