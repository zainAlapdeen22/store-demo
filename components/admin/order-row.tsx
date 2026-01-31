"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import Link from "next/link";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions";
import { useRouter } from "next/navigation";

interface OrderRowProps {
    order: any;
}

export function OrderRow({ order }: OrderRowProps) {
    const [optimisticStatus, setOptimisticStatus] = useState(order.status);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleStatusChange = async (newStatus: string) => {
        // 1. Update UI immediately (Optimistic Update)
        setOptimisticStatus(newStatus);

        // 2. Wrap server action in transition
        startTransition(async () => {
            const formData = new FormData();
            formData.append("orderId", order.id);
            formData.append("status", newStatus);

            try {
                await updateOrderStatus(formData);
                router.refresh(); // Sync server state
            } catch (error) {
                // Rollback on error
                setOptimisticStatus(order.status);
                console.error("Failed to update status", error);
            }
        });
    };

    return (
        <TableRow className="group">
            <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-medium">{order.user.name || "Guest"}</span>
                    <span className="text-xs text-muted-foreground">{order.user.email}</span>
                </div>
            </TableCell>
            <TableCell>
                <OrderStatusBadge status={optimisticStatus} />
            </TableCell>
            <TableCell>{order.paymentPhoneNumber || "-"}</TableCell>
            <TableCell className="font-bold">{formatCurrency(order.total)}</TableCell>
            <TableCell>
                <div className="flex items-center gap-4">
                    <OrderStatusForm
                        orderId={order.id}
                        currentStatus={optimisticStatus}
                        onStatusChange={handleStatusChange}
                    />
                    <Button size="icon" variant="outline" className="h-8 w-8" asChild>
                        <Link href={`/admin/orders/${order.id}/invoice`} target="_blank">
                            <Printer className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
