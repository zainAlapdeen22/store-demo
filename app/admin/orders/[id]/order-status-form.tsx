"use client";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="sm" disabled={pending} className="hidden sm:flex">
            {pending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {pending ? "Updating..." : "Update Status"}
        </Button>
    );
}

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const formRef = useRef<HTMLFormElement>(null);
    const statuses = [
        "PENDING_PAYMENT",
        "PAYMENT_VERIFIED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
    ];

    const handleChange = () => {
        // Auto-submit form when status changes
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    return (
        <form ref={formRef} action={updateOrderStatus} className="flex items-center gap-4">
            <input type="hidden" name="orderId" value={orderId} />
            <select
                name="status"
                defaultValue={currentStatus}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[200px] cursor-pointer"
            >
                {statuses.map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
            <SubmitButton />
        </form>
    );
}


