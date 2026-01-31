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

export function isValidIraqiPhone(phone: string) {
    // Basic Iraqi mobile number validation:
    // 07XXXXXXXX (11 digits)
    // +9647XXXXXXXX (13 digits)
    const localFormat = /^07[3-9]\d{8}$/;
    const internationalFormat = /^\+9647[3-9]\d{8}$/;

    // Remote spaces or dashes for checking
    const cleanPhone = phone.replace(/\s|-/g, "");

    return localFormat.test(cleanPhone) || internationalFormat.test(cleanPhone);
}

