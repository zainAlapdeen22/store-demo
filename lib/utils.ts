import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("ar-IQ", {
        style: "currency",
        currency: "IQD",
        maximumFractionDigits: 0, // IQD typically doesn't use decimals
    }).format(amount);
}
