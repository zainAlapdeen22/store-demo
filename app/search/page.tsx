import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { SearchHeader } from "@/components/search-header";
import { ProductCard } from "@/components/product-card";
import { NoResults } from "@/components/no-results";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: {
        q: string;
    };
}) {
    const session = await auth();
    const query = searchParams.q || "";

    // Simple "smart" search: split by space and check if any word matches title or description
    const terms = query.split(" ").filter(t => t.length > 0);

    const products = await prisma.product.findMany({
        where: {
            OR: terms.length > 0 ? terms.map(term => ({
                OR: [
                    { title: { contains: term } }, // Case insensitive usually in SQLite/Postgres depending on collation
                    { description: { contains: term } },
                    { category: { contains: term } }
                ]
            })) : undefined
        },
        include: { discounts: true },
    });

    return (
        <div className="container py-10">
            <SearchHeader query={query} />
            {products.length === 0 ? (
                <NoResults />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} isAuthenticated={!!session?.user} />
                    ))}
                </div>
            )}
        </div>
    );
}
