"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { useState } from "react";
import { Check } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function BuyButton({ product, isAuthenticated }: { product: any, isAuthenticated: boolean }) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);
    const { dict } = useI18n();

    const handleBuy = () => {
        if (!isAuthenticated) {
            window.location.href = "/login";
            return;
        }

        addItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
            variant: "Default"
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="flex flex-col gap-2">
            <Button
                size="lg"
                className="w-full md:w-auto rounded-full px-8 text-lg"
                onClick={handleBuy}
                disabled={added}
            >
                {added ? <Check className="mr-2 h-4 w-4" /> : null}
                {added ? dict.addedToCart : dict.addToCart}
            </Button>
        </div>
    );
}
