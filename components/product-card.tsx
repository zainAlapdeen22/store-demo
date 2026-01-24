"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { BuyButton } from "@/components/buy-button";
import { useI18n } from "@/components/i18n-provider";
import { calculatePrice } from "@/lib/price";

interface ProductCardProps {
    product: any; // Using any for simplicity, but should be typed properly
    isAuthenticated: boolean;
}

export function ProductCard({ product, isAuthenticated }: ProductCardProps) {
    const { dict } = useI18n();
    const { finalPrice, originalPrice } = calculatePrice(product.price, product.discounts);

    return (
        <Link href={`/products/${product.id}`} className="group relative rounded-xl bg-card border transition-all hover:shadow-lg overflow-hidden">
            <div className="aspect-square overflow-hidden bg-muted/20 relative">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted/40">
                        <svg className="w-16 h-16 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                {originalPrice && (
                    <div className="absolute top-2 end-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                        {dict.sale}
                    </div>
                )}
            </div>
            <div className="p-4 space-y-2">
                <h3 className="font-semibold leading-none tracking-tight">{product.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                        <span className="font-medium">{formatCurrency(finalPrice)}</span>
                        {originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">{formatCurrency(originalPrice)}</span>
                        )}
                    </div>
                    <BuyButton product={product} isAuthenticated={isAuthenticated} />
                </div>
            </div>
        </Link>
    );
}
