"use client";

import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
    status: string;
    className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
    const getStyles = (s: string) => {
        switch (s) {
            case "PENDING_PAYMENT":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "PAYMENT_VERIFIED":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "PROCESSING":
                return "bg-amber-100 text-amber-800 border-amber-200";
            case "SHIPPED":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "DELIVERED":
                return "bg-green-100 text-green-800 border-green-200";
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <span
            className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors duration-200 whitespace-nowrap",
                getStyles(status),
                className
            )}
        >
            {status.replace("_", " ")}
        </span>
    );
}
