import { Button } from "@/components/ui/button";
import { BuyButton } from "@/components/buy-button";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { calculatePrice } from "@/lib/price";
import { ProductStatus, SaleBadge } from "@/components/product-info";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: { discounts: true },
    });

    if (!product) {
        return notFound();
    }

    const { finalPrice, originalPrice } = calculatePrice(product.price, product.discounts);

    return (
        <div className="container py-10 md:py-20">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="aspect-square relative overflow-hidden rounded-2xl border bg-muted/10">
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover object-center"
                    />
                    {originalPrice && <SaleBadge />}
                </div>
                <div className="flex flex-col space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">{product.title}</h1>
                        <div className="flex items-baseline gap-4 mt-2">
                            <p className="text-3xl font-bold text-primary">
                                {formatCurrency(finalPrice)}
                            </p>
                            {originalPrice && (
                                <p className="text-xl text-muted-foreground line-through">
                                    {formatCurrency(originalPrice)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-base text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                        <ProductStatus stock={product.stock} category={product.category} />
                    </div>

                    <div className="pt-6">
                        <BuyButton product={product} isAuthenticated={!!session?.user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
