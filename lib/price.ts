export interface Discount {
    percentage?: number | null;
    amount?: number | null;
    startDate: Date;
    endDate: Date;
}

export function calculatePrice(price: number, discounts: Discount[] = []) {
    const now = new Date();
    const activeDiscount = discounts.find(
        (d) => now >= d.startDate && now <= d.endDate
    );

    if (!activeDiscount) {
        return { finalPrice: price, originalPrice: null, discount: null };
    }

    let finalPrice = price;
    if (activeDiscount.percentage) {
        finalPrice = price - (price * activeDiscount.percentage) / 100;
    } else if (activeDiscount.amount) {
        finalPrice = Math.max(0, price - activeDiscount.amount);
    }

    return {
        finalPrice,
        originalPrice: price,
        discount: activeDiscount,
    };
}
