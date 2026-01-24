"use client";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/app/actions";

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const statuses = [
        "PENDING_PAYMENT",
        "PAYMENT_VERIFIED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
    ];

    return (
        <form action={updateOrderStatus} className="flex items-center gap-4">
            <input type="hidden" name="orderId" value={orderId} />
            <select
                name="status"
                defaultValue={currentStatus}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[200px]"
            >
                {statuses.map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
            <Button type="submit" size="sm">Update Status</Button>
        </form>
    );
}
