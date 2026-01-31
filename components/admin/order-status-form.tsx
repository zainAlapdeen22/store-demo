"use client";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="sm" disabled={pending} className="hidden sm:flex">
            {pending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {pending ? "Updating..." : "Update Status"}
        </Button>
    );
}

export function OrderStatusForm({
    orderId,
    currentStatus,
    onStatusChange
}: {
    orderId: string,
    currentStatus: string,
    onStatusChange?: (newStatus: string) => void
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const statuses = [
        "PENDING_PAYMENT",
        "PAYMENT_VERIFIED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (onStatusChange) {
            onStatusChange(newStatus);
        }
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    const handleAction = async (formData: FormData) => {
        startTransition(async () => {
            await updateOrderStatus(formData);
            router.refresh();
        });
    };

    return (
        <form ref={formRef} action={handleAction} className="flex items-center gap-2">
            <input type="hidden" name="orderId" value={orderId} />
            <span className="text-xs font-bold text-muted-foreground hidden lg:inline">Update</span>
            <select
                name="status"
                value={currentStatus}
                onChange={handleChange}
                disabled={isPending}
                className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-50 min-w-[150px] cursor-pointer hover:border-primary transition-colors"
            >
                {statuses.map(status => (
                    <option key={status} value={status}>
                        {status.replace("_", " ")}
                    </option>
                ))}
            </select>
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        </form>
    );
}
